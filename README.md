<div align="center">

# 🌌 DatasetGPT — Autonomous AI Data Laboratory & Workspace

**A futuristic, production-grade AI Data Workspace powered by Ashna AI, Kaggle Engine, and UCI Machine Learning Repository.**

[![Python](https://img.shields.io/badge/Python-3.13+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Security Audited](https://img.shields.io/badge/Security-Hardened_🛡️-10B981?style=for-the-badge)](docs/SECURITY.md)
[![License](https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge)](LICENSE)

<br />

[Features](#-key-features) • [Architecture](#-system-architecture) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Security Policy](#-security-hardening) • [License](#-license)

</div>

---

## 💡 Overview

**DatasetGPT** is a unified AI-powered data platform designed for data scientists, machine learning engineers, and researchers. It seamlessly connects to **Kaggle** and the **UCI Machine Learning Repository** to automate dataset discovery, downloading, unzipping, tabular exploratory data analysis (EDA), data visualization, and AI baseline model recommendation.

The user interface features a **desktop-first 3-column glassmorphism workspace shell** with purple ambient lighting, command search palette (`⌘K`), quick action pills, automated discovery cards, interactive charts, and instant ZIP archiving.

---

## ⚡ Key Features

| Feature | Description |
| :--- | :--- |
| 🔍 **Multi-Hub Dataset Search** | Simultaneously queries Kaggle Datasets API and UCI Machine Learning Repository (`archive.ics.uci.edu`). |
| 🤖 **Ashna AI Data Co-pilot** | Natural language queries, automatic fallback keyword extraction, baseline ML script generation, and structured tables. |
| 📊 **Tabular EDA Profiler** | Interactive data profiler drawer displaying row counts, column datatypes, null percentage distributions, and summary stats. |
| 🎨 **Futuristic UI Shell** | Deep navy plum glassmorphism theme (`#080A12`), active pill switches, analytics cards, and AI discovery panels. |
| 📦 **All-in-One ZIP Archiving** | Download individual dataset folders or zip all workspace datasets into a single archive (`DatasetGPT_All_Extracted_Datasets.zip`). |
| ⌘ **Command Search Palette** | Global hotkey modal (`Cmd+K` or `Ctrl+K`) for fast command execution and dataset navigation. |
| 🛡️ **Enterprise Security** | Built-in Path Jail protection against Directory Traversal, Starlette Security Headers, IP Rate Limiting, and masked API keys. |

---

## 🏗️ System Architecture

```text
DatasetGPT Workspace
├── 🧠 Backend (FastAPI + Python 3.13)
│   ├── main.py                --> REST API Server, Rate Limiter, Security Headers, Static File Router
│   ├── agent_engine.py        --> Ashna AI Neural Core Agent & Intent Processor
│   ├── kaggle_engine.py       --> Kaggle Datasets Extraction & Download Engine
│   ├── uci_engine.py          --> UCI Machine Learning Repository Scraper & Extractor
│   └── data_profiler.py       --> Tabular EDA Data Profiler & Summary Statistics Engine
│
└── 🎨 Frontend (React 18 + Vite + Tailwind CSS)
    ├── src/App.jsx            --> 3-Column Desktop Application Shell & State Orchestrator
    ├── src/components/
    │   ├── TopBar.jsx         --> Floating Navigation, Breadcrumbs & Cmd+K Trigger
    │   ├── Sidebar.jsx        --> Workspace Navigation Tabs & Recent Chat History
    │   ├── EmptyState.jsx     --> Main Dashboard Overview, Greetings & Insights
    │   ├── RecentDatasets.jsx --> Dataset Cards with Glowing Status Indicators (● Ready, ● Analyzing)
    │   ├── AnalyticsCards.jsx --> Metric Cards (Rows, Columns, Null %, Insights Count)
    │   ├── AIInsightsPanel.jsx--> Pattern Discoveries & Automated Insight Cards
    │   ├── VisualizationArea.jsx --> Interactive Data Chart Workspace (Line, Bar, Pie, Table)
    │   ├── MessageInput.jsx   --> AI Command Center Input Composer & Quick Action Glass Pills
    │   ├── ChatMessage.jsx    --> Glassmorphic Markdown Table Renderer & Code Copy Buttons
    │   ├── FileExplorer.jsx   --> Extracted Datasets Tree & ZIP Download Buttons
    │   ├── DataPreviewer.jsx  --> Tabular Data Profile Modal Drawer
    │   └── CommandSearch.jsx  --> Cmd+K Palette Modal
    └── src/index.css          --> Custom Glassmorphism CSS Tokens & Radial Mesh Gradients
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.9 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/manish8171/DatasetGPT.git
cd DatasetGPT
```

### 2. Frontend Installation & Build
```bash
# Install node dependencies
npm install

# Build production bundle
npm run build
```

### 3. Backend Setup
```bash
# Create Python virtual environment
python3 -m venv backend/venv

# Activate virtual environment (Linux/macOS)
source backend/venv/bin/activate

# Install Python requirements
pip install -r backend/requirements.txt
```

### 4. Set Environment Variables
Copy `.env.example` to `.env` or set in your environment:
```bash
export PORT=3000
export ASHNA_API_KEY="your_ashna_api_key"
export KAGGLE_API_TOKEN="your_kaggle_api_token"
```

### 5. Launch Application
```bash
export PYTHONPATH=.
python3 backend/main.py
```
Open your browser and navigate to **`http://localhost:3000`**.

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | System health check and API status. |
| `/api/chat` | `POST` | Primary AI Chat co-pilot endpoint powering Ashna AI queries. |
| `/api/datasets/search` | `GET` | Search datasets across Kaggle and UCI ML Repository. |
| `/api/datasets/download` | `POST` | Download & extract dataset by reference ID. |
| `/api/datasets/files` | `GET` | List all extracted dataset files in workspace. |
| `/api/datasets/preview` | `POST` | Profile CSV file schema and return row/col stats. |
| `/api/datasets/download-file` | `GET` | Secure single file download endpoint. |
| `/api/datasets/download-folder-zip` | `GET` | Zip and download specific dataset folder. |
| `/api/datasets/download-all-zip` | `GET` | Zip and download all workspace datasets in one archive. |
| `/api/settings/status` | `GET` | Masked API credentials status. |
| `/api/settings/keys` | `POST` | Dynamic API keys update endpoint. |

---

## 🛡️ Security Hardening

DatasetGPT includes production security controls:

> [!IMPORTANT]
> - **Path Jail Check**: Prevents Directory Traversal attacks (`../../etc/passwd`) using strict `os.path.commonpath` verification.
> - **Security Headers**: Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and `Content-Security-Policy`.
> - **IP Rate Limiting**: Sliding window middleware restricting max requests to prevent API abuse.
> - **Secret Masking**: No hardcoded production API tokens in source code; status API masks credentials.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

<div align="center">
  <sub>Built with ❤️ by Manish • Powered by Ashna AI, Kaggle & UCI ML Repository</sub>
</div>

<!-- Log update 4 on 2026-08-03T14:29:00 -->

<!-- Log update 17 on 2026-08-04T23:38:00 -->

<!-- Log update 26 on 2026-08-06T10:04:00 -->

<!-- Log update 39 on 2026-08-07T21:36:00 -->

<!-- Log update 40 on 2026-08-07T23:14:00 -->

<!-- Log update 61 on 2026-08-10T21:28:00 -->

<!-- Log update 79 on 2026-08-13T21:19:00 -->

<!-- Log update 81 on 2026-08-14T11:07:00 -->

<!-- Log update 87 on 2026-08-15T11:09:00 -->

<!-- Log update 88 on 2026-08-15T12:44:00 -->

<!-- Log update 106 on 2026-08-18T08:56:00 -->

<!-- Log update 143 on 2026-08-23T14:49:00 -->

<!-- Log update 145 on 2026-08-24T09:47:00 -->

<!-- Log update 169 on 2026-08-27T12:29:00 -->

<!-- Log update 183 on 2026-08-29T15:08:00 -->

<!-- Log update 190 on 2026-08-30T19:25:00 -->

<!-- Log update 192 on 2026-08-30T22:33:00 -->

<!-- Log update 197 on 2026-08-31T14:18:00 -->

<!-- Log update 204 on 2026-09-01T17:57:00 -->

<!-- Log update 208 on 2026-09-02T09:38:00 -->

<!-- Log update 211 on 2026-09-02T15:15:00 -->

<!-- Build sync 3 on 2026-07-25T10:58:00 -->

<!-- Build sync 16 on 2026-07-26T18:31:00 -->

<!-- Build sync 37 on 2026-07-29T13:13:00 -->

<!-- Build sync 41 on 2026-07-30T10:34:00 -->

<!-- Build sync 42 on 2026-07-30T12:36:00 -->

<!-- Build sync 54 on 2026-08-01T09:49:00 -->

<!-- Build sync 55 on 2026-08-01T09:18:00 -->

<!-- Build sync 57 on 2026-08-01T12:48:00 -->

<!-- Build sync 77 on 2026-08-04T08:07:00 -->

<!-- Build sync 108 on 2026-08-08T12:57:00 -->

<!-- Build sync 113 on 2026-08-09T11:47:00 -->

<!-- Build sync 119 on 2026-08-10T09:12:00 -->

<!-- Build sync 129 on 2026-08-11T10:02:00 -->

<!-- Build sync 149 on 2026-08-14T10:43:00 -->

<!-- Build sync 154 on 2026-08-14T16:01:00 -->

<!-- Build sync 158 on 2026-08-15T12:06:00 -->

<!-- Build sync 169 on 2026-08-16T17:17:00 -->

<!-- Build sync 181 on 2026-08-18T13:22:00 -->

<!-- Build sync 186 on 2026-08-19T10:09:00 -->

<!-- Build sync 200 on 2026-08-20T15:10:00 -->

<!-- Build sync 211 on 2026-08-21T15:21:00 -->

<!-- Build sync 217 on 2026-08-22T12:03:00 -->

<!-- Build sync 224 on 2026-08-23T13:05:00 -->

<!-- Build sync 244 on 2026-08-26T08:49:00 -->

<!-- Build sync 253 on 2026-08-27T09:16:00 -->

<!-- Build sync 262 on 2026-08-28T09:32:00 -->

<!-- Build sync 265 on 2026-08-28T11:35:00 -->

<!-- Build sync 272 on 2026-08-29T13:44:00 -->

<!-- Build sync 273 on 2026-08-29T14:57:00 -->

<!-- Build sync 278 on 2026-08-30T10:26:00 -->

<!-- Build sync 291 on 2026-09-01T10:49:00 -->

<!-- Build sync 294 on 2026-09-01T12:47:00 -->

<!-- Activity log 15 on 2025-09-05T08:58:12 -->

<!-- Activity log 27 on 2025-09-09T12:49:26 -->

<!-- Activity log 33 on 2025-09-11T09:52:20 -->

<!-- Activity log 42 on 2025-09-12T14:23:09 -->

<!-- Activity log 44 on 2025-09-13T09:12:38 -->

<!-- Activity log 50 on 2025-09-16T12:54:05 -->

<!-- Activity log 53 on 2025-09-23T08:24:57 -->

<!-- Activity log 66 on 2025-09-30T08:05:31 -->

<!-- Activity log 74 on 2025-10-01T15:50:18 -->

<!-- Activity log 76 on 2025-10-02T09:20:01 -->

<!-- Activity log 91 on 2025-10-09T13:28:29 -->

<!-- Activity log 95 on 2025-10-10T10:26:21 -->

<!-- Activity log 138 on 2025-10-23T12:39:28 -->

<!-- Activity log 160 on 2025-10-28T11:05:12 -->

<!-- Activity log 164 on 2025-10-30T10:20:56 -->

<!-- Activity log 173 on 2025-10-31T12:06:22 -->

<!-- Activity log 177 on 2025-10-31T15:18:04 -->

<!-- Activity log 186 on 2025-11-03T09:29:07 -->

<!-- Activity log 188 on 2025-11-05T09:03:48 -->

<!-- Activity log 192 on 2025-11-05T14:04:51 -->

<!-- Activity log 201 on 2025-11-11T09:00:59 -->

<!-- Activity log 205 on 2025-11-12T12:25:54 -->

<!-- Activity log 209 on 2025-11-14T09:33:51 -->

<!-- Activity log 210 on 2025-11-14T09:53:21 -->

<!-- Activity log 212 on 2025-11-14T11:43:13 -->

<!-- Activity log 216 on 2025-11-15T10:14:10 -->

<!-- Activity log 225 on 2025-11-16T14:39:01 -->

<!-- Activity log 234 on 2025-11-20T13:32:04 -->

<!-- Activity log 261 on 2025-12-02T09:05:05 -->

<!-- Activity log 266 on 2025-12-04T09:37:23 -->

<!-- Activity log 279 on 2025-12-05T14:49:38 -->

<!-- Activity log 287 on 2025-12-09T11:13:10 -->

<!-- Activity log 291 on 2025-12-09T14:38:12 -->

<!-- Activity log 301 on 2025-12-12T11:47:05 -->

<!-- Activity log 305 on 2025-12-13T09:34:00 -->

<!-- Activity log 309 on 2025-12-15T10:36:36 -->

<!-- Activity log 310 on 2025-12-15T10:07:00 -->

<!-- Activity log 317 on 2025-12-17T11:49:43 -->

<!-- Activity log 318 on 2025-12-17T13:42:50 -->

<!-- Activity log 320 on 2025-12-19T09:42:24 -->

<!-- Activity log 364 on 2026-01-13T10:42:41 -->

<!-- Activity log 379 on 2026-01-16T13:54:28 -->

<!-- Activity log 386 on 2026-01-17T09:40:34 -->

<!-- Activity log 389 on 2026-01-19T08:06:06 -->

<!-- Activity log 399 on 2026-01-24T08:53:21 -->

<!-- Activity log 403 on 2026-01-24T12:22:17 -->

<!-- Activity log 416 on 2026-01-29T09:59:34 -->

<!-- Activity log 422 on 2026-02-02T10:45:01 -->

<!-- Activity log 427 on 2026-02-02T15:57:21 -->

<!-- Activity log 428 on 2026-02-02T17:20:55 -->

<!-- Activity log 439 on 2026-02-06T10:03:10 -->

<!-- Activity log 447 on 2026-02-11T08:16:21 -->

<!-- Activity log 457 on 2026-02-12T09:57:49 -->

<!-- Activity log 471 on 2026-02-18T09:46:26 -->

<!-- Activity log 486 on 2026-02-21T14:54:09 -->

<!-- Activity log 502 on 2026-02-27T09:23:36 -->

<!-- Activity log 505 on 2026-02-28T09:06:19 -->

<!-- Activity log 507 on 2026-03-01T10:39:56 -->

<!-- Activity log 527 on 2026-03-08T15:27:08 -->

<!-- Activity log 561 on 2026-03-19T11:48:55 -->

<!-- Activity log 567 on 2026-03-19T17:17:20 -->

<!-- Activity log 572 on 2026-03-21T09:51:19 -->

<!-- Activity log 579 on 2026-03-21T17:23:32 -->

<!-- Activity log 613 on 2026-04-07T11:23:44 -->

<!-- Activity log 624 on 2026-04-09T17:35:41 -->

<!-- Activity log 625 on 2026-04-10T08:06:00 -->

<!-- Activity log 631 on 2026-04-12T11:43:32 -->

<!-- Activity log 635 on 2026-04-12T16:18:08 -->

<!-- Activity log 648 on 2026-04-14T09:52:22 -->

<!-- Activity log 659 on 2026-04-17T08:57:49 -->

<!-- Activity log 670 on 2026-04-18T09:57:56 -->

<!-- Activity log 673 on 2026-04-20T09:53:18 -->

<!-- Activity log 678 on 2026-04-21T12:57:27 -->

<!-- Activity log 689 on 2026-04-28T13:58:21 -->

<!-- Activity log 690 on 2026-04-28T14:38:53 -->

<!-- Activity log 693 on 2026-04-28T17:36:33 -->

<!-- Activity log 698 on 2026-05-02T09:42:53 -->

<!-- Activity log 711 on 2026-05-07T09:36:12 -->

<!-- Activity log 712 on 2026-05-09T08:04:47 -->

<!-- Activity log 740 on 2026-05-21T09:13:08 -->

<!-- Activity log 756 on 2026-06-04T10:32:50 -->

<!-- Activity log 758 on 2026-06-04T11:42:49 -->

<!-- Activity log 760 on 2026-06-05T09:40:06 -->

<!-- Activity log 770 on 2026-06-09T10:18:49 -->

<!-- Activity log 782 on 2026-06-11T12:38:10 -->

<!-- Activity log 792 on 2026-06-16T09:20:29 -->

<!-- Activity log 793 on 2026-06-16T10:12:18 -->

<!-- Activity log 797 on 2026-06-16T14:21:58 -->

<!-- Activity log 800 on 2026-06-16T17:26:58 -->

<!-- Activity log 808 on 2026-06-18T11:17:42 -->

<!-- Activity log 814 on 2026-06-21T08:10:32 -->

<!-- Activity log 816 on 2026-06-21T10:32:25 -->

<!-- Activity log 817 on 2026-06-21T12:01:35 -->

<!-- Activity log 818 on 2026-06-21T13:57:29 -->

<!-- Activity log 829 on 2026-06-26T09:47:30 -->

<!-- Activity log 849 on 2026-07-06T13:22:46 -->

<!-- Activity log 854 on 2026-07-10T11:56:50 -->

<!-- Activity log 855 on 2026-07-11T08:32:33 -->

<!-- Activity log 870 on 2026-07-18T09:36:45 -->

<!-- Activity log 877 on 2026-07-18T16:07:49 -->

<!-- Activity log 881 on 2026-07-19T09:43:34 -->

<!-- Activity log 882 on 2026-07-19T11:46:44 -->

<!-- Activity log 883 on 2026-07-19T12:00:43 -->

<!-- Activity log 891 on 2026-07-20T09:07:25 -->

<!-- Activity log 892 on 2026-07-20T10:23:27 -->

<!-- Activity log 895 on 2026-07-21T10:42:02 -->

<!-- Activity log 897 on 2026-07-22T09:56:31 -->

<!-- Activity log 900 on 2026-07-23T09:43:25 -->

<!-- Activity log 905 on 2026-07-23T14:34:40 -->

<!-- Activity log 910 on 2026-07-24T08:30:59 -->

<!-- Activity log 926 on 2026-07-30T12:09:11 -->

<!-- Activity log 928 on 2026-07-30T14:11:07 -->

<!-- Activity log 951 on 2026-08-05T09:12:35 -->

<!-- Activity log 953 on 2026-08-05T10:06:24 -->

<!-- Activity log 960 on 2026-08-11T08:41:09 -->

<!-- Activity log 970 on 2026-08-14T09:30:22 -->

<!-- Activity log 974 on 2026-08-17T08:48:18 -->

<!-- Activity log 990 on 2026-08-21T09:49:50 -->

<!-- Activity log 991 on 2026-08-21T10:17:41 -->

<!-- Activity log 996 on 2026-08-21T16:52:50 -->

<!-- Activity log 1012 on 2026-08-28T08:16:45 -->

<!-- Activity log 1021 on 2026-08-31T09:09:09 -->

<!-- Activity log 1024 on 2026-08-31T12:54:13 -->

<!-- Activity log 1028 on 2026-08-31T16:25:06 -->

<!-- Activity log 1031 on 2026-09-02T09:48:12 -->
