import os
import requests
import pandas as pd
from typing import List, Dict, Any, Optional
from ucimlrepo import fetch_ucirepo

# Curated UCI Machine Learning Repository Datasets Catalog
UCI_CATALOG = [
    {
        "id": 45,
        "ref": "uci/45-heart-disease",
        "title": "Heart Disease (UCI ML Repository)",
        "owner": "UCI Machine Learning Repository",
        "human_size": "12.4 KB",
        "vote_count": 1240,
        "usability_rating": 1.0,
        "url": "https://archive.ics.uci.edu/dataset/45/heart+disease",
        "tags": ["healthcare", "classification", "uci-ml-repository", "heart"],
        "description": "Attributes including age, sex, chest pain type, resting blood pressure, serum cholesterol, and target heart disease diagnosis.",
        "source": "uci"
    },
    {
        "id": 53,
        "ref": "uci/53-iris",
        "title": "Iris Species (UCI ML Repository)",
        "owner": "UCI Machine Learning Repository",
        "human_size": "4.5 KB",
        "vote_count": 2890,
        "usability_rating": 1.0,
        "url": "https://archive.ics.uci.edu/dataset/53/iris",
        "tags": ["classification", "botany", "uci-ml-repository", "benchmark"],
        "description": "Classic 150-sample dataset containing sepal length, sepal width, petal length, petal width for 3 Iris species.",
        "source": "uci"
    },
    {
        "id": 17,
        "ref": "uci/17-breast-cancer-wisconsin",
        "title": "Breast Cancer Wisconsin Diagnostic (UCI)",
        "owner": "UCI Machine Learning Repository",
        "human_size": "124 KB",
        "vote_count": 1850,
        "usability_rating": 1.0,
        "url": "https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic",
        "tags": ["healthcare", "cancer", "uci-ml-repository", "classification"],
        "description": "Features computed from a digitized image of a fine needle aspirate (FNA) of a breast mass.",
        "source": "uci"
    },
    {
        "id": 2,
        "ref": "uci/2-adult-census-income",
        "title": "Adult Census Income (UCI ML Repository)",
        "owner": "UCI Machine Learning Repository",
        "human_size": "3.8 MB",
        "vote_count": 1420,
        "usability_rating": 0.95,
        "url": "https://archive.ics.uci.edu/dataset/2/adult",
        "tags": ["demographics", "income", "uci-ml-repository", "census"],
        "description": "Predict whether income exceeds $50K/yr based on census data (48,842 instances, 14 attributes).",
        "source": "uci"
    },
    {
        "id": 109,
        "ref": "uci/109-wine-quality",
        "title": "Wine Quality (UCI ML Repository)",
        "owner": "UCI Machine Learning Repository",
        "human_size": "260 KB",
        "vote_count": 980,
        "usability_rating": 0.95,
        "url": "https://archive.ics.uci.edu/dataset/109/wine",
        "tags": ["chemistry", "regression", "uci-ml-repository", "wine"],
        "description": "Physicochemical properties of red & white wine variants and quality ratings.",
        "source": "uci"
    },
    {
        "id": 222,
        "ref": "uci/222-bank-marketing",
        "title": "Bank Marketing (UCI ML Repository)",
        "owner": "UCI Machine Learning Repository",
        "human_size": "5.2 MB",
        "vote_count": 1150,
        "usability_rating": 0.95,
        "url": "https://archive.ics.uci.edu/dataset/222/bank+marketing",
        "tags": ["finance", "marketing", "uci-ml-repository", "classification"],
        "description": "Direct marketing campaigns (phone calls) of a Portuguese banking institution.",
        "source": "uci"
    },
    {
        "id": 275,
        "ref": "uci/275-bike-sharing",
        "title": "Bike Sharing Dataset (UCI ML Repository)",
        "owner": "UCI Machine Learning Repository",
        "human_size": "2.4 MB",
        "vote_count": 890,
        "usability_rating": 0.95,
        "url": "https://archive.ics.uci.edu/dataset/275/bike+sharing+dataset",
        "tags": ["time-series", "regression", "uci-ml-repository", "transportation"],
        "description": "Counts of rental bikes logged hourly and daily in Capital Bikeshare system with weather features.",
        "source": "uci"
    }
]

class UCIEngine:
    def __init__(self, download_dir: str = "./downloads"):
        self.download_dir = os.path.abspath(download_dir)
        os.makedirs(self.download_dir, exist_ok=True)

    def search_datasets(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search UCI catalog for matching keywords."""
        q_lower = query.lower()
        results = []
        for ds in UCI_CATALOG:
            # Check match in title, description, or tags
            title_match = any(w in ds["title"].lower() for w in q_lower.split())
            desc_match = any(w in ds["description"].lower() for w in q_lower.split())
            tag_match = any(w in " ".join(ds["tags"]).lower() for w in q_lower.split())

            if title_match or desc_match or tag_match:
                results.append(ds)

        if not results:
            # Fallback to top general UCI datasets
            results = UCI_CATALOG[:limit]

        return results[:limit]

    def download_dataset(self, uci_id: int) -> Dict[str, Any]:
        """Download dataset from UCI ML Repository using ucimlrepo."""
        try:
            repo_data = fetch_ucirepo(id=uci_id)
            ds_name = repo_data.metadata.name.lower().replace(" ", "_")
            out_folder = os.path.join(self.download_dir, f"uci_{uci_id}_{ds_name}")
            os.makedirs(out_folder, exist_ok=True)

            # Combine features and targets into a single DataFrame if available
            X = repo_data.data.features
            y = repo_data.data.targets

            df = X.copy()
            if y is not None:
                for col in y.columns:
                    df[col] = y[col]

            csv_path = os.path.join(out_folder, f"{ds_name}.csv")
            df.to_csv(csv_path, index=False)

            return {
                "success": True,
                "message": f"Successfully extracted UCI dataset '{repo_data.metadata.name}' ({len(df)} rows, {len(df.columns)} cols).",
                "folder": out_folder,
                "download_path": csv_path,
                "files": [f"{ds_name}.csv"],
                "source": "uci"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to fetch UCI dataset ID {uci_id}: {str(e)}"
            }
