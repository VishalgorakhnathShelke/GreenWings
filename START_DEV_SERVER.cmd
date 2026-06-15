@echo off
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel% equ 0 (
  set "PYTHON=python"
) else (
  where py >nul 2>nul
  if %errorlevel% neq 0 (
    echo Python 3 is required but was not found.
    exit /b 1
  )
  set "PYTHON=py -3"
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js and npm are required but were not found.
  exit /b 1
)

if not exist "database\greenwings.db" %PYTHON% server\import_seed.py
start "GreenWings API" /min %PYTHON% server\server.py
timeout /t 2 /nobreak >nul
npm run dev -- --host 127.0.0.1 --port 5173
endlocal
