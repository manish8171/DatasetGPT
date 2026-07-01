import os
import json
import logging
from typing import Dict, Any, List, Optional
import pandas as pd

logger = logging.getLogger(__name__)

class DataProfiler:
    @staticmethod
    def profile_file(file_path: str, max_rows: int = 100) -> Dict[str, Any]:
        """Reads a data file and returns structured profile metadata + sample preview."""
        if not os.path.exists(file_path):
            return {"error": f"File not found: {file_path}"}

        filename = os.path.basename(file_path)
        ext = os.path.splitext(filename)[1].lower()
        size_bytes = os.path.getsize(file_path)

        profile = {
            "filename": filename,
            "ext": ext,
            "size_bytes": size_bytes,
            "file_path": file_path,
            "rows": 0,
            "columns_count": 0,
            "columns": [],
            "sample_data": [],
            "summary_stats": {},
            "missing_values": {}
        }

        try:
            df = None
            if ext in [".csv", ".txt", ".tsv"]:
                sep = "\t" if ext == ".tsv" else ","
                try:
                    df = pd.read_csv(file_path, sep=sep, nrows=1000, encoding="utf-8")
                except UnicodeDecodeError:
                    df = pd.read_csv(file_path, sep=sep, nrows=1000, encoding="latin1")
            elif ext == ".json":
                try:
                    df = pd.read_json(file_path)
                except Exception:
                    # Try json lines
                    df = pd.read_json(file_path, lines=True)
            elif ext == ".parquet":
                df = pd.read_parquet(file_path)
            elif ext in [".xlsx", ".xls"]:
                df = pd.read_excel(file_path, nrows=1000)

            if df is not None:
                # Fill NaN for clean JSON serialization
                df_clean = df.where(pd.notnull(df), None)
                
                profile["rows"] = len(df)
                profile["columns_count"] = len(df.columns)
                
                # Column metadata
                col_info = []
                missing_values = {}
                for col in df.columns:
                    col_str = str(col)
                    dtype_str = str(df[col].dtype)
                    null_count = int(df[col].isnull().sum())
                    col_info.append({
                        "name": col_str,
                        "dtype": dtype_str,
                        "null_count": null_count,
                        "null_percentage": round((null_count / len(df)) * 100, 2) if len(df) > 0 else 0
                    })
                    missing_values[col_str] = null_count

                profile["columns"] = col_info
                profile["missing_values"] = missing_values

                # First max_rows rows as sample dictionary list
                sample_df = df_clean.head(max_rows)
                profile["sample_data"] = sample_df.to_dict(orient="records")

                # Numeric column summary statistics
                num_df = df.select_dtypes(include=["number"])
                if not num_df.empty:
                    stats = {}
                    describe_df = num_df.describe()
                    for col in describe_df.columns:
                        stats[str(col)] = {
                            "min": float(describe_df[col].get("min", 0)) if pd.notnull(describe_df[col].get("min")) else None,
                            "max": float(describe_df[col].get("max", 0)) if pd.notnull(describe_df[col].get("max")) else None,
                            "mean": float(describe_df[col].get("mean", 0)) if pd.notnull(describe_df[col].get("mean")) else None,
                            "std": float(describe_df[col].get("std", 0)) if pd.notnull(describe_df[col].get("std")) else None,
                        }
                    profile["summary_stats"] = stats

        except Exception as e:
            logger.error(f"Error profiling {file_path}: {e}")
            profile["error"] = str(e)

        return profile
