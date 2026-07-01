import os
import json
import logging
import requests
from typing import Dict, Any, List, Optional
from backend.kaggle_engine import KaggleEngine
from backend.uci_engine import UCIEngine
from backend.data_profiler import DataProfiler

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are DatasetHUB AI, an expert Data Science Assistant powered by Ashna AI specializing in multi-source datasets (Kaggle & UCI Machine Learning Repository).
Your primary goals are to help users:
1. Search and discover high-quality datasets from Kaggle and UCI Machine Learning Repository (archive.ics.uci.edu).
2. Inspect dataset details, usability ratings, vote counts, file types, and source repositories.
3. Guide dataset downloading, unzipping, and automated exploratory data analysis (EDA).
4. Provide data science recommendations on suitable machine learning algorithms, baseline models, and data preprocessing steps.

When users ask for datasets, summarize findings concisely, highlight key metrics, and encourage exploring the interactive dataset cards below.
Always be friendly, precise, and formatted in clean Markdown.
"""

class AgentEngine:
    def __init__(self, kaggle_engine: KaggleEngine, api_key: Optional[str] = None, uci_engine: Optional[UCIEngine] = None):
        self.kaggle_engine = kaggle_engine
        self.uci_engine = uci_engine or UCIEngine()
        self.api_key = api_key or os.environ.get("ASHNA_API_KEY", "")
        self.base_url = "https://api.ashna.ai/v1/api/chat/completions"
        self.model_name = "ashnaai"

    def update_api_key(self, api_key: str):
        self.api_key = api_key
        os.environ["ASHNA_API_KEY"] = api_key

    def _extract_fallback_keywords(self, query: str) -> List[str]:
        import re
        q = re.sub(r'[^\w\s]', ' ', query.lower())
        stop_phrases = [
            "real time", "realtime", "system", "prediction", "predicting", 
            "project", "classification", "regression", "model", "algorithm",
            "dataset for", "datasets for", "analysis", "deep learning", "machine learning",
            "search dataset for topic"
        ]
        cleaned = q
        for sp in stop_phrases:
            cleaned = cleaned.replace(sp, " ")
        cleaned_words = [w for w in cleaned.split() if len(w) > 2]
        candidates = []
        if cleaned_words:
            candidates.append(" ".join(cleaned_words))
        if len(cleaned_words) >= 2:
            candidates.append(" ".join(cleaned_words[:2]))
        for w in cleaned_words:
            if w not in ["data", "code", "file", "csv", "topic"]:
                candidates.append(w)
        seen = set()
        res = []
        for c in candidates:
            if c not in seen and len(c.strip()) > 2:
                seen.add(c)
                res.append(c)
        return res

    def process_chat(self, user_message: str, chat_history: Optional[List[Dict[str, str]]] = None, downloads_dir: str = "./downloads") -> Dict[str, Any]:
        """Process user message using Ashna AI model, searching Kaggle & UCI ML Repository."""
        msg_lower = user_message.lower().strip()
        actions_taken = []
        datasets_found = []
        downloaded_result = None
        preview_data = None

        import re
        ref_match = re.search(r'([a-zA-Z0-9\-_]+/[a-zA-Z0-9\-_]+)', user_message)
        uci_match = re.search(r'uci/(\d+)', user_message.lower())

        is_download_intent = any(w in msg_lower for w in ["download", "extract", "fetch", "get dataset", "pull"])
        is_preview_intent = any(w in msg_lower for w in ["preview", "inspect", "show csv", "sample", "view table"])
        is_search_intent = any(w in msg_lower for w in ["find", "search", "show me", "dataset for", "datasets", "list", "recommend"]) or not (is_download_intent or is_preview_intent)

        # Handle UCI Dataset Download Intent
        if is_download_intent and uci_match:
            uci_id = int(uci_match.group(1))
            actions_taken.append(f"📥 Downloading UCI dataset ID `{uci_id}` from archive.ics.uci.edu...")
            res = self.uci_engine.download_dataset(uci_id)
            downloaded_result = res
            if res.get("success"):
                actions_taken.append(f"✅ Extracted UCI dataset files to `./downloads/` workspace.")
                if res.get("download_path"):
                    actions_taken.append(f"📊 Auto-profiling UCI dataset `{os.path.basename(res['download_path'])}`...")
                    preview_data = DataProfiler.profile_file(res["download_path"])

        # Handle Kaggle Dataset Download Intent
        elif is_download_intent and ref_match:
            dataset_ref = ref_match.group(1)
            actions_taken.append(f"📥 Downloading dataset `{dataset_ref}` from Kaggle...")
            target_path = os.path.join(downloads_dir, dataset_ref.replace("/", "_"))
            res = self.kaggle_engine.download_and_extract(dataset_ref, target_path)
            downloaded_result = res
            if res.get("success"):
                actions_taken.append(f"✅ Extracted {len(res.get('files', []))} files to `./downloads/{dataset_ref.replace('/', '_')}`")
                csv_files = [f for f in res.get("files", []) if f.get("ext") == ".csv"]
                if csv_files:
                    first_csv = csv_files[0]["full_path"]
                    actions_taken.append(f"📊 Auto-profiling `{csv_files[0]['name']}`...")
                    preview_data = DataProfiler.profile_file(first_csv)

        # Handle Search Intent across both Kaggle & UCI
        elif is_search_intent or (not downloaded_result and not is_preview_intent):
            clean_query = user_message
            for prefix in ["find me", "search for", "get me", "show me", "look for", "dataset for", "datasets about", "download", "search dataset for topic"]:
                if clean_query.lower().startswith(prefix):
                    clean_query = clean_query[len(prefix):].strip()
            
            clean_query = clean_query.strip("'\"`")
            
            actions_taken.append(f"🔍 Searching Kaggle & UCI ML Repository for `{clean_query}`...")
            kaggle_results = self.kaggle_engine.search_datasets(clean_query, max_results=4)
            uci_results = self.uci_engine.search_datasets(clean_query, limit=3)

            # Mark sources
            for d in kaggle_results:
                d["source"] = "kaggle"

            datasets_found = kaggle_results + uci_results
            
            if datasets_found:
                actions_taken.append(f"✨ Found {len(datasets_found)} matching dataset(s) across Kaggle & UCI Repository.")
            else:
                fallback_terms = self._extract_fallback_keywords(clean_query)
                for fterm in fallback_terms:
                    if fterm and fterm.lower() != clean_query.lower():
                        k_relatable = self.kaggle_engine.search_datasets(fterm, max_results=4)
                        u_relatable = self.uci_engine.search_datasets(fterm, limit=3)
                        for d in k_relatable:
                            d["source"] = "kaggle"
                        relatable_results = k_relatable + u_relatable
                        if relatable_results:
                            datasets_found = relatable_results
                            actions_taken.append(f"💡 No exact match for full phrase. Showing {len(relatable_results)} most relatable dataset(s) for `{fterm}`...")
                            break
                if not datasets_found:
                    actions_taken.append("⚠️ No direct or relatable match found on Kaggle API or UCI Machine Learning Repository.")

        # 2. Generate LLM Response with Ashna AI API
        reply_text = ""
        if self.api_key:
            try:
                prompt = f"""User Question: {user_message}

Actions executed by agent:
{json.dumps(actions_taken, indent=2)}

Search Results from Kaggle & UCI ML Repository (archive.ics.uci.edu):
{json.dumps(datasets_found, indent=2)}

Downloaded Dataset info (if any):
{json.dumps(downloaded_result, indent=2) if downloaded_result else "None"}

Provide a concise, helpful Markdown response summarizing the findings, recommending the top dataset(s) (noting whether from Kaggle or UCI Repository archive.ics.uci.edu), mentioning key metrics, and guiding next steps.
"""
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": self.model_name,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ]
                }

                resp = requests.post(self.base_url, headers=headers, json=payload, timeout=20)
                if resp.status_code == 200:
                    resp_json = resp.json()
                    reply_text = resp_json["choices"][0]["message"]["content"]
                else:
                    logger.warning(f"Ashna AI API HTTP {resp.status_code}: {resp.text}")
                    reply_text = self._fallback_response(user_message, datasets_found, downloaded_result, actions_taken)
            except Exception as e:
                logger.error(f"Ashna AI generation error: {e}")
                reply_text = self._fallback_response(user_message, datasets_found, downloaded_result, actions_taken)
        else:
            reply_text = self._fallback_response(user_message, datasets_found, downloaded_result, actions_taken)

        return {
            "reply": reply_text,
            "actions": actions_taken,
            "datasets": datasets_found,
            "download_result": downloaded_result,
            "preview_data": preview_data
        }

    def _fallback_response(self, user_message: str, datasets: List[Dict[str, Any]], download_res: Optional[Dict[str, Any]], actions: List[str]) -> str:
        """Construct structured markdown response when API key is missing or fails."""
        lines = []
        if download_res:
            if download_res.get("success"):
                lines.append(f"### 🎉 Dataset Successfully Downloaded!\n")
                lines.append(f"Dataset has been extracted into your `./downloads/` workspace folder.\n")
                if download_res.get("files"):
                    lines.append(f"**Extracted Files:**")
                    for f in download_res.get("files", [])[:5]:
                        if isinstance(f, dict):
                            lines.append(f"- 📄 `{f['name']}` ({f['human_size']})")
                        else:
                            lines.append(f"- 📄 `{f}`")
                lines.append("\n👉 You can now view the **Dataset Preview** drawer to inspect rows and columns interactively!")
            else:
                lines.append(f"### ⚠️ Download Failed")
                lines.append(f"Reason: {download_res.get('error', 'Unknown error')}")
        elif datasets:
            lines.append(f"Found **{len(datasets)} matching dataset(s)** across Kaggle & UCI Machine Learning Repository.\n")
            lines.append("Explore the dataset cards below for usability ratings, vote counts, and source badges, or click **Extract Dataset** to download instantly.")
        else:
            lines.append("DatasetHUB AI helps you search, download, and extract datasets from Kaggle and UCI Machine Learning Repository (archive.ics.uci.edu).")
            lines.append("\n**Try asking:**")
            lines.append("- *\"Find machine learning datasets for heart disease from UCI\"*")
            lines.append("- *\"Search for financial datasets on Kaggle\"*")
            lines.append("- *\"Download uci/45-heart-disease\"*")

        return "\n".join(lines)
