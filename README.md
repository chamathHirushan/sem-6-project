# SEWA.LK - CSE Sem-6 professional portfolio project

Hybrid setup: run uvicorn and the Vite frontend on the host, and Postgres in Docker on port **5433**.

## Local hybrid

### 1. Start Postgres only

From the `sem-6-project` folder:

```powershell
docker compose up -d db
```

Wait until `sewalk-db` is healthy (`docker compose ps`).

If tables look stale after a schema change, reset the volume once:

```powershell
docker compose down -v
docker compose up -d db
```

### 2. Backend

Navigate to `backend`, create or activate the venv, then install:

```powershell
pip install -r requirements.txt
```

Create `backend/.env` with at least:

```
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres-pw@localhost:5433/sewalk
```

Start the API:

```powershell
uvicorn main:app --reload
```

`/chat` returns 503 until Azure packages are installed. Jobs, auth, and user APIs do not need Azure.

### 3. Frontend

Navigate to `frontend`, then:

```powershell
npm install
```

Create `frontend/.env` with:

```
VITE_BACKEND_URL=http://localhost:8000
```

Start the app:

```powershell
npm run dev
```

## Full Docker

Builds frontend and backend containers as well. The backend talks to Postgres at `db:5432` on the compose network.

```powershell
docker compose up -d
```
