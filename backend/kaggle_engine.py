import os
import json
import logging
import requests
import zipfile
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class KaggleEngine:
    def __init__(self, username: Optional[str] = None, key: Optional[str] = None, api_token: Optional[str] = None):
        self.username = username or os.environ.get("KAGGLE_USERNAME")
        self.key = key or os.environ.get("KAGGLE_KEY")
        self.api_token = api_token or os.environ.get("KAGGLE_API_TOKEN")
        self._api = None
        self._init_api()

    def update_credentials(self, username: Optional[str] = None, key: Optional[str] = None, api_token: Optional[str] = None) -> bool:
        if api_token:
            self.api_token = api_token
            os.environ["KAGGLE_API_TOKEN"] = api_token
            # Write to ~/.kaggle/access_token
            try:
                kaggle_dir = os.path.expanduser("~/.kaggle")
                os.makedirs(kaggle_dir, exist_ok=True)
                token_file = os.path.join(kaggle_dir, "access_token")
                with open(token_file, "w") as f:
                    f.write(api_token.strip())
                os.chmod(token_file, 0o600)
            except Exception as e:
                logger.warning(f"Could not save access_token file: {e}")

        if username and key:
            self.username = username
            self.key = key
            os.environ["KAGGLE_USERNAME"] = username
            os.environ["KAGGLE_KEY"] = key

        return self._init_api()

    def _init_api(self) -> bool:
        if self.api_token:
            os.environ["KAGGLE_API_TOKEN"] = self.api_token

        if self.username and self.key:
            os.environ["KAGGLE_USERNAME"] = self.username
            os.environ["KAGGLE_KEY"] = self.key

        try:
            from kaggle.api.kaggle_api_extended import KaggleApi
            api = KaggleApi()
            api.authenticate()
            self._api = api
            logger.info("Kaggle API successfully authenticated.")
            return True
        except (Exception, SystemExit) as e:
            logger.warning(f"Kaggle API authentication failed: {e}")
            self._api = None
            return False

    def is_authenticated(self) -> bool:
        return self._api is not None

    @staticmethod
    def _parse_tags(tags_raw) -> List[str]:
        clean_tags = []
        if not tags_raw:
            return clean_tags
        for t in tags_raw:
            if isinstance(t, str):
                clean_tags.append(t)
            elif isinstance(t, dict):
                name = t.get("name") or t.get("ref")
                if name and isinstance(name, str):
                    clean_tags.append(name)
            elif hasattr(t, "name") and getattr(t, "name"):
                clean_tags.append(str(getattr(t, "name")))
            elif hasattr(t, "ref") and getattr(t, "ref"):
                clean_tags.append(str(getattr(t, "ref")))
        return clean_tags[:5]

    def search_datasets(self, query: str, max_results: int = 10, sort_by: str = "hottest") -> List[Dict[str, Any]]:
        """Search Kaggle datasets using API or public web endpoint fallback."""
        query = query.strip()
        results = []

        if self._api:
            try:
                datasets = self._api.dataset_list(search=query, sort_by=sort_by, page=1)
                for d in datasets[:max_results]:
                    results.append({
                        "ref": f"{d.ref}",
                        "title": getattr(d, "title", d.ref),
                        "owner": getattr(d, "ownerName", d.ref.split("/")[0]),
                        "size": getattr(d, "size", "N/A"),
                        "human_size": str(getattr(d, "size", "N/A")),
                        "vote_count": getattr(d, "voteCount", 0),
                        "usability_rating": getattr(d, "usabilityRating", 0.0),
                        "last_updated": str(getattr(d, "lastUpdated", "")),
                        "url": f"https://www.kaggle.com/datasets/{d.ref}",
                        "tags": self._parse_tags(getattr(d, "tags", [])),
                        "description": getattr(d, "description", "")
                    })
                if results:
                    return results
            except Exception as e:
                logger.error(f"Kaggle API dataset_list error: {e}")

        # Fallback to Kaggle public API endpoint if API client is not authenticated or fails
        try:
            url = f"https://www.kaggle.com/api/v1/datasets/list?search={requests.utils.quote(query)}&pageSize={max_results}"
            headers = {"User-Agent": "Mozilla/5.0"}
            if self.username and self.key:
                resp = requests.get(url, auth=(self.username, self.key), headers=headers, timeout=10)
            else:
                resp = requests.get(url, headers=headers, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                for item in data:
                    ref = item.get("ref", "")
                    if not ref and "ownerUrl" in item and "urlName" in item:
                        ref = f"{item['ownerUrl']}/{item['urlName']}"
                    results.append({
                        "ref": ref or item.get("title", ""),
                        "title": item.get("title", ref),
                        "owner": item.get("ownerName", item.get("ownerRef", "")),
                        "size": item.get("totalBytes", "N/A"),
                        "human_size": self._format_bytes(item.get("totalBytes")),
                        "vote_count": item.get("voteCount", 0),
                        "usability_rating": item.get("usabilityRating", 0.0),
                        "last_updated": item.get("lastUpdated", ""),
                        "url": item.get("url", f"https://www.kaggle.com/datasets/{ref}"),
                        "tags": self._parse_tags(item.get("tags", [])),
                        "description": item.get("description", "")
                    })
        except Exception as e:
            logger.error(f"Fallback Kaggle search error: {e}")

        return results

    def get_dataset_details(self, dataset_ref: str) -> Dict[str, Any]:
        """Fetch detailed information about a single dataset."""
        dataset_ref = dataset_ref.strip()
        details = {
            "ref": dataset_ref,
            "url": f"https://www.kaggle.com/datasets/{dataset_ref}",
            "files": []
        }

        if self._api:
            try:
                parts = dataset_ref.split("/")
                if len(parts) == 2:
                    owner, slug = parts
                    files = self._api.dataset_list_files(dataset_ref)
                    file_list = []
                    for f in getattr(files, "files", []):
                        file_list.append({
                            "name": str(f.name),
                            "size": getattr(f, "totalBytes", getattr(f, "size", 0)),
                            "human_size": self._format_bytes(getattr(f, "totalBytes", None))
                        })
                    details["files"] = file_list
            except Exception as e:
                logger.error(f"Error fetching dataset files for {dataset_ref}: {e}")

        return details

    def download_and_extract(self, dataset_ref: str, target_dir: str) -> Dict[str, Any]:
        """Download and extract a Kaggle dataset to target_dir."""
        dataset_ref = dataset_ref.strip()
        os.makedirs(target_dir, exist_ok=True)

        if not self._api:
            # Check if authenticated or try auth
            if not self._init_api():
                return {
                    "success": False,
                    "error": "Kaggle API credentials required to download. Please set KAGGLE_USERNAME and KAGGLE_KEY in settings.",
                    "ref": dataset_ref
                }

        try:
            logger.info(f"Downloading {dataset_ref} to {target_dir}...")
            self._api.dataset_download_files(dataset_ref, path=target_dir, unzip=True)
            
            # Find all extracted files
            extracted_files = []
            for root, _, filenames in os.walk(target_dir):
                for f in filenames:
                    rel_path = os.path.relpath(os.path.join(root, f), target_dir)
                    full_path = os.path.join(root, f)
                    extracted_files.append({
                        "name": rel_path,
                        "full_path": full_path,
                        "size": os.path.getsize(full_path),
                        "human_size": self._format_bytes(os.path.getsize(full_path)),
                        "ext": os.path.splitext(f)[1].lower()
                    })

            return {
                "success": True,
                "ref": dataset_ref,
                "target_dir": target_dir,
                "files": extracted_files,
                "message": f"Successfully downloaded and extracted {len(extracted_files)} file(s)."
            }
        except Exception as e:
            logger.error(f"Download failed for {dataset_ref}: {e}")
            return {
                "success": False,
                "ref": dataset_ref,
                "error": str(e)
            }

    @staticmethod
    def _format_bytes(size: Optional[int]) -> str:
        if size is None or size == "N/A" or not isinstance(size, (int, float)):
            return "Unknown"
        if size < 1024:
            return f"{size} B"
        elif size < 1024 * 1024:
            return f"{size / 1024:.1f} KB"
        elif size < 1024 * 1024 * 1024:
            return f"{size / (1024 * 1024):.1f} MB"
        else:
            return f"{size / (1024 * 1024 * 1024):.1f} GB"
