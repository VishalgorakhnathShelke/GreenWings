# GreenWings Project Cleanup Plan

## 1. Current Project Problems Found

- Root folder contains generated/runtime artifacts: Cloudflare tunnel logs, local tunnel config, downloaded test image folders, and one-off repair scripts.
- Backend folder contains generated Python cache folders and an older generated trash folder.
- `database/sps` is large and contains CSVs, generated/source images, and helper files. It looks messy, but it is still referenced by active upload scripts, so it must not be moved blindly.
- Runtime SQLite databases exist in `database/`. These are ignored by Git and should remain in place unless backend/database configuration is updated intentionally.
- `.gitignore` already ignores many generated files, but log handling is not explicit enough for a tracked `logs/.gitkeep` pattern.
- `.env.example` is present and safe, but it is missing a few environment variable names used by current backend/image scripts.

## 2. Proposed Folder Structure

Keep the working project structure conservative:

```text
greenwings-react/
  src/                         React frontend source
  public/                      Public static assets
  server/                      FastAPI/backend and backend scripts
  database/                    Runtime DB, SQL exports, SPS source data, backups
  prisma/                      Prisma schema
  docs/                        Technical documentation and ER docs
  logs/                        Runtime logs only
  archive/
    trash-review/              Files needing human review before removal
    old-backups/               Old backups
    duplicate-files/           Duplicates
    generated-files/           Generated/cache/test artifacts
    debug-files/               Debug and one-off repair scripts
```

## 3. Files Likely To Move

- Root log files:
  - `cloudflare-client.err.log`
  - `cloudflare-client.log`
  - `cloudflare-share-20260620-185916.err.log`
- Generated test image folders:
  - `test_mango/`
  - `test_totapuri/`
- Generated Python cache folders:
  - `server/__pycache__/`
  - `server/app/__pycache__/`
  - `database/sps/__pycache__/`
- Previous generated trash folder:
  - `server/_trash_generated_files_20260629-231206/`
- One-off debug/repair scripts that are not referenced by package scripts or imports:
  - `extract.py`
  - `migrate.py`

## 4. Files Likely To Archive

- `extract.py` into `archive/debug-files/` because it contains a local machine-specific recovery path and writes directly into `database/sps/main.py`.
- `migrate.py` into `archive/debug-files/` because it is a one-off rewrite helper for `server/scripts/sync_crop_variety_images.py`.
- `test_mango/` and `test_totapuri/` into `archive/generated-files/`.
- Existing generated trash/log/cache folders into `archive/generated-files/` or `logs/`.

## 5. Files That Must Stay Where They Are

- `.git/` must not be touched.
- Root config/build files: `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `index.html`, `pyproject.toml`.
- `.env` must not be moved, printed, staged, or committed.
- `.env.example` should stay at root.
- Runtime database files under `database/` should stay because backend and scripts use `database/greenwings.db`.
- `database/sps/` should stay because active scripts reference `database/sps/General photos`, `database/sps/main_crops`, `database/sps/photos`, and `database/sps/Success stories farmers`.
- `server/app/`, `server/migrations/`, `server/scripts/`, `server/import_seed.py`, `server/run_api.py`, and `server/server.py` should stay because they are active backend/backend-adjacent files.

## 6. Environment/Config Files Found

- `.env` exists. It must not be printed or staged.
- `.env.example` exists and should be updated only with safe placeholders.
- `.gitignore` exists and should be updated for `logs/.gitkeep` and archive folders.
- `config.yml` exists at root and appears to be a local Cloudflare tunnel helper file. It is ignored and should not be moved unless the user confirms it is no longer needed.
- `cloudflared-windows-amd64.exe` exists at root and is ignored. It should remain because it may be used for client preview tunnels.

## 7. Database/Backend Risks

- Moving `database/greenwings.db` would break default backend configuration.
- Moving `database/sps` would break R2 upload scripts.
- Moving backend scripts without updating `package.json`, docs, and imports could break maintenance commands.
- `server/server.py` and `server/app/main.py` both exist; this cleanup should not merge or refactor backend implementations unless required.

## 8. Validation Commands To Run

- `git status --short --branch`
- `npm run build`
- `npm run lint`
- `python -m compileall server`

If validation commands reveal pre-existing source issues, document them in `PROJECT_CLEANUP_REPORT.md` instead of making unrelated rewrites.
