# GreenWings Project Structure

This repository contains the GreenWings React frontend, Python/FastAPI backend work, local SQLite database assets, product/catalog data, R2 image tooling, and project documentation.

## Root

- `package.json`, `package-lock.json`: frontend scripts and Node dependency lockfile. Keep at root.
- `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `index.html`: frontend build/tooling configuration. Keep at root.
- `pyproject.toml`: Python backend/tooling metadata. Keep at root.
- `.env`: real local secrets. Do not commit, print, or move.
- `.env.example`: safe placeholder environment variable reference.
- `.gitignore`: ignore rules for secrets, logs, build output, generated files, local databases, and archives.
- `START_DEV_SERVER.cmd`: local Windows launcher for the legacy/simple server and Vite frontend.

## Frontend

- `src/pages/`: route-level React pages.
- `src/components/`: reusable UI components, grouped by feature.
- `src/components/admin/`: admin management screens.
- `src/components/products/`: product/catalog UI components.
- `src/components/layout/`: global layout components.
- `src/components/modals/`: login/member/admin modal flows.
- `src/components/shared/`: shared design-system components.
- `src/data/`: frontend static data, translations, types, and catalog fallback content.
- `src/data/catalog/`: product/category fallback catalog content.
- `src/services/`: frontend API clients and API-facing utilities.
- `src/stores/`: client state stores.
- `src/hooks/`: React hooks.
- `src/assets/`: assets imported and bundled by Vite.
- `public/`: static assets that need direct public URLs.

## Backend

- `server/app/`: FastAPI application modules.
  - `main.py`: API routes.
  - `models.py`: ORM models.
  - `schemas.py`: Pydantic schemas.
  - `database.py`: database session/engine setup.
  - `config.py`: environment/settings loading.
  - `legacy.py`: compatibility helpers for existing SQLite-backed data.
- `server/run_api.py`: FastAPI/uvicorn startup entrypoint used by `npm run api`.
- `server/server.py`: legacy/simple Python API server retained for compatibility.
- `server/import_seed.py`: SQLite seed/import script used by `npm run db:import` and the Windows launcher.
- `server/migrations/`: database migration/normalization scripts.
- `server/scripts/`: operational scripts for R2 uploads, image syncing, database checks, and content maintenance.

## Database

- `database/greenwings.db`: local runtime SQLite database. It is intentionally ignored by Git.
- `database/backups/`: database backups.
- `database/media-cache/`: local generated image cache. Ignored by Git.
- `database/sps/`: source CSVs and image assets used by upload/sync scripts. Do not move without updating scripts.
- `database/*.sql`, `database/*.csv`, `database/*.png`: SQL exports, seed material, ER artifacts, and supporting data.
- `prisma/schema.prisma`: Prisma schema retained for database compatibility/tooling.

## Scripts

Active backend and maintenance scripts live under:

- `server/scripts/`
- `server/migrations/`

Large data/image upload scripts intentionally reference `database/sps`. Keep paths project-root relative.

Archived one-off scripts live under:

- `archive/debug-files/`

## Logs

Runtime logs belong in:

- `logs/`

`logs/.gitkeep` is tracked so the folder exists, but log contents are ignored.

## Archive

Archive folders are for reversible cleanup only. Nothing here was permanently deleted.

- `archive/trash-review/`: files that need manual review before removal.
- `archive/generated-files/`: generated cache/test/trash artifacts.
- `archive/debug-files/`: debug and one-off repair scripts.
- `archive/duplicate-files/`: duplicate files if found later.
- `archive/old-backups/`: old backup files if found later.

## Environment Rules

- Real `.env` files must stay local and must not be committed.
- `.env.example` should include safe placeholder keys only.
- Use project-root relative paths for database, logs, and scripts.
- Do not hardcode user-specific absolute paths in maintained code.
