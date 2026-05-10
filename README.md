# POS System

## First Run (Team Setup)

### Prerequisites
- Python 3.10+ installed
- Node.js 18+ installed
- MySQL server running locally

### 1) Backend Setup

Run in PowerShell from repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python app.py or flask run
```

Notes:
- Update `backend/.env` if your MySQL username/password/host differs.
- Configure mail keys in `backend/.env` for Forgot Password:
  - `MAIL_SERVER`
  - `MAIL_PORT`
  - `MAIL_USE_TLS`
  - `MAIL_USERNAME`
  - `MAIL_PASSWORD`
  - `MAIL_DEFAULT_SENDER`
- On startup, backend now auto:
  - creates the database if missing
  - creates tables
  - runs `auto_seed.py` only when DB is empty and `backup.json` exists

### 2) Frontend Setup

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

### 3) Quick Verify
- Backend should run on `http://127.0.0.1:5000`
- Frontend should run on `http://localhost:5173`
- Login screen should load
- Product list should appear in POS/Inventory if seed data is present

