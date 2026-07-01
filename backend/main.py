import os
import json
import time
import zipfile
import tempfile
from collections import defaultdict
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, field_validator
from typing import List, Optional

from backend.kaggle_engine import KaggleEngine
from backend.uci_engine import UCIEngine
from backend.agent_engine import AgentEngine as AshnaAIAgent
from backend.data_profiler import DataProfiler

app = FastAPI(title="DatasetGPT AI API", docs_url=None, redoc_url=None)

# ----------------------------------------------------
# 1. SECURITY & RATE LIMITING MIDDLEWARE
# ----------------------------------------------------
IP_REQUEST_LOGS = defaultdict(list)
RATE_LIMIT_WINDOW = 60  # seconds
MAX_REQUESTS_PER_WINDOW = 120

@app.middleware("http")
async def rate_limit_and_security_headers_middleware(request: Request, call_next):
    # Rate Limiting
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    IP_REQUEST_LOGS[client_ip] = [t for t in IP_REQUEST_LOGS[client_ip] if now - t < RATE_LIMIT_WINDOW]

    if len(IP_REQUEST_LOGS[client_ip]) >= MAX_REQUESTS_PER_WINDOW:
        return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded. Please wait a minute."})

    IP_REQUEST_LOGS[client_ip].append(now)

    # Call downstream endpoint
    response = await call_next(request)

    # Security Headers Enforcement
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:;"
    
    return response

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# 2. PATH JAIL & INPUT SANITIZATION UTILITIES
# ----------------------------------------------------
def is_safe_path(target_path: str, allowed_dir: str = "./downloads") -> bool:
    """Enforce Path Jail check against Path Traversal (e.g. ../../etc/passwd)."""
    base = os.path.abspath(allowed_dir)
    target = os.path.abspath(target_path)
    return os.path.commonpath([base, target]) == base

# ----------------------------------------------------
# 3. REQUEST MODELS & VALIDATORS
# ----------------------------------------------------
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []
    model: Optional[str] = "ashnaai"
    search_enabled: Optional[bool] = True
    reasoning_enabled: Optional[bool] = False

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Message cannot be empty.")
        if len(v) > 4000:
            raise ValueError("Message exceeds maximum allowed length of 4000 characters.")
        return v

class ProfileRequest(BaseModel):
    file_path: str
    max_rows: Optional[int] = 100

class KeysRequest(BaseModel):
    ashna_api_key: Optional[str] = None
    kaggle_api_token: Optional[str] = None

# ----------------------------------------------------
# 4. API ENDPOINTS
# ----------------------------------------------------
@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "DatasetGPT AI API"}

@app.get("/api/settings/status")
def get_settings_status():
    ashna_key = os.environ.get("ASHNA_API_KEY", "")
    kaggle_token = os.environ.get("KAGGLE_API_TOKEN", "")
    return {
        "ashna_key_set": bool(ashna_key),
        "ashna_key_masked": f"{ashna_key[:4]}...{ashna_key[-4:]}" if len(ashna_key) > 8 else ("Set" if ashna_key else "Not Set"),
        "kaggle_token_set": bool(kaggle_token),
        "kaggle_token_masked": f"{kaggle_token[:4]}...{kaggle_token[-4:]}" if len(kaggle_token) > 8 else ("Set" if kaggle_token else "Not Set"),
    }

@app.post("/api/settings/keys")
def set_api_keys(req: KeysRequest):
    if req.ashna_api_key is not None:
        os.environ["ASHNA_API_KEY"] = req.ashna_api_key.strip()
    if req.kaggle_api_token is not None:
        os.environ["KAGGLE_API_TOKEN"] = req.kaggle_api_token.strip()
    return {"message": "API keys updated successfully."}

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    ashna_key = os.environ.get("ASHNA_API_KEY", "")
    kaggle_token = os.environ.get("KAGGLE_API_TOKEN", "")

    k_engine = KaggleEngine(api_token=kaggle_token)
    u_engine = UCIEngine()
    agent = AshnaAIAgent(kaggle_engine=k_engine, api_key=ashna_key, uci_engine=u_engine)

    result = agent.process_chat(
        user_message=req.message,
        chat_history=req.history
    )
    return result

@app.get("/api/datasets/search")
def search_datasets(q: str = Query(...)):
    q_clean = q.strip()
    if not q_clean:
        return {"query": "", "datasets": []}
    
    k_engine = KaggleEngine()
    u_engine = UCIEngine()
    
    k_results = k_engine.search_datasets(q_clean, max_results=5)
    u_results = u_engine.search_datasets(q_clean, max_results=5)
    
    return {"query": q_clean, "datasets": k_results + u_results}

@app.post("/api/datasets/download")
def download_dataset(dataset_ref: str = Query(...)):
    ref_clean = dataset_ref.strip()
    if ref_clean.startswith("uci/"):
        u_engine = UCIEngine()
        result = u_engine.download_and_extract(ref_clean)
    else:
        k_engine = KaggleEngine()
        result = k_engine.download_and_extract(ref_clean)
        
    return result

@app.get("/api/datasets/files")
def list_extracted_files():
    downloads_dir = os.path.abspath("./downloads")
    datasets = []
    if os.path.exists(downloads_dir):
        for folder_name in os.listdir(downloads_dir):
            folder_path = os.path.join(downloads_dir, folder_name)
            if os.path.isdir(folder_path):
                files = []
                total_size = 0
                for root, dirs, filenames in os.walk(folder_path):
                    for f in filenames:
                        fp = os.path.join(root, f)
                        rel_p = os.path.relpath(fp, folder_path)
                        sz = os.path.getsize(fp)
                        total_size += sz
                        files.append({
                            "name": rel_p,
                            "full_path": fp,
                            "size": sz,
                            "human_size": KaggleEngine._format_bytes(sz),
                            "ext": os.path.splitext(f)[1].lower()
                        })
                datasets.append({
                    "folder_name": folder_name,
                    "dataset_ref": folder_name.replace("_", "/", 1) if "_" in folder_name else folder_name,
                    "folder_path": folder_path,
                    "file_count": len(files),
                    "total_size": total_size,
                    "human_total_size": KaggleEngine._format_bytes(total_size),
                    "files": files
                })
    return {"datasets": datasets}

@app.post("/api/datasets/preview")
def preview_file(req: ProfileRequest):
    # Security: Path Jail Check against directory traversal
    if not is_safe_path(req.file_path, allowed_dir="./downloads"):
        raise HTTPException(status_code=403, detail="Access denied: Invalid file path.")

    if not os.path.exists(req.file_path):
        raise HTTPException(status_code=404, detail="File not found.")
        
    profile = DataProfiler.profile_file(req.file_path, max_rows=req.max_rows or 100)
    return profile

@app.get("/api/datasets/download-file")
def download_extracted_file(file_path: str = Query(...)):
    # Security: Path Jail Check against directory traversal
    if not is_safe_path(file_path, allowed_dir="./downloads"):
        raise HTTPException(status_code=403, detail="Access denied: Invalid file path.")

    abs_path = os.path.abspath(file_path)
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=404, detail="File not found.")

    filename = os.path.basename(abs_path)
    return FileResponse(abs_path, filename=filename, media_type="application/octet-stream")

@app.get("/api/datasets/download-folder-zip")
def download_folder_zip(folder_name: str = Query(...)):
    # Security: Sanitize folder name against directory traversal
    safe_folder_name = os.path.basename(folder_name.strip())
    downloads_dir = os.path.abspath("./downloads")
    target_folder = os.path.join(downloads_dir, safe_folder_name)

    if not is_safe_path(target_folder, allowed_dir="./downloads"):
        raise HTTPException(status_code=403, detail="Access denied: Invalid folder path.")

    if not os.path.exists(target_folder) or not os.path.isdir(target_folder):
        raise HTTPException(status_code=404, detail="Dataset folder not found.")
    
    zip_path = os.path.join(downloads_dir, f"{safe_folder_name}.zip")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(target_folder):
            for file in files:
                if file.endswith(".zip"):
                    continue
                abs_file = os.path.join(root, file)
                rel_file = os.path.relpath(abs_file, target_folder)
                zipf.write(abs_file, rel_file)
    
    return FileResponse(zip_path, filename=f"{safe_folder_name}.zip", media_type="application/zip")

@app.get("/api/datasets/download-all-zip")
def download_all_zip():
    downloads_dir = os.path.abspath("./downloads")
    os.makedirs(downloads_dir, exist_ok=True)
    zip_path = os.path.join(downloads_dir, "DatasetGPT_All_Extracted_Datasets.zip")
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(downloads_dir):
            for file in files:
                if file.endswith(".zip"):
                    continue
                abs_file = os.path.join(root, file)
                rel_file = os.path.relpath(abs_file, downloads_dir)
                zipf.write(abs_file, rel_file)
                
    return FileResponse(zip_path, filename="DatasetGPT_All_Extracted_Datasets.zip", media_type="application/zip")

# Mount frontend dist static files if exists
FRONTEND_DIST = os.path.abspath("./dist")
if os.path.exists(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 3000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
