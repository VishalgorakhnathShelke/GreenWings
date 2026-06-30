# GreenWings FastAPI Backend

The GreenWings API now runs as a FastAPI application with SQLAlchemy ORM models and Pydantic request validation.

## Setup

From the project root:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -e .
```

Dependencies are managed from `pyproject.toml`.

## Run Backend

```powershell
npm run api
```

The backend runs at:

```text
http://127.0.0.1:8787
```

Health check:

```powershell
Invoke-RestMethod http://127.0.0.1:8787/api/health
```

## Main Files

- `server/app/main.py` - FastAPI routes
- `server/app/models.py` - SQLAlchemy ORM models
- `server/app/schemas.py` - Pydantic validation schemas
- `server/app/database.py` - database engine/session
- `server/app/config.py` - TOML/env configuration
- `server/run_api.py` - Uvicorn startup script

## Database

Development uses SQLite:

```text
database/greenwings.db
```

For another database, set:

```text
DATABASE_URL=postgresql+psycopg://user:password@host:5432/database
```

Install the PostgreSQL driver only when needed:

```powershell
.\.venv\Scripts\python -m pip install -e ".[postgres]"
```
