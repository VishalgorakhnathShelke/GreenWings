@echo off
setlocal
cd /d "%~dp0"

set "TARGET=http://127.0.0.1:5173"
set "CLOUDFLARED="

where cloudflared >nul 2>nul
if %errorlevel% equ 0 set "CLOUDFLARED=cloudflared"

if not defined CLOUDFLARED if exist "%~dp0cloudflared.exe" set "CLOUDFLARED=%~dp0cloudflared.exe"
if not defined CLOUDFLARED if exist "%~dp0cloudflared-windows-amd64.exe" set "CLOUDFLARED=%~dp0cloudflared-windows-amd64.exe"
if not defined CLOUDFLARED if exist "%USERPROFILE%\Downloads\cloudflared.exe" set "CLOUDFLARED=%USERPROFILE%\Downloads\cloudflared.exe"
if not defined CLOUDFLARED if exist "%USERPROFILE%\Downloads\cloudflared-windows-amd64.exe" set "CLOUDFLARED=%USERPROFILE%\Downloads\cloudflared-windows-amd64.exe"

if not defined CLOUDFLARED (
  echo Cloudflared was not found.
  echo.
  echo Put cloudflared.exe or cloudflared-windows-amd64.exe in one of these places:
  echo - This project folder: %~dp0
  echo - Downloads folder: %USERPROFILE%\Downloads
  echo - Or add cloudflared to PATH
  echo.
  pause
  exit /b 1
)

echo Starting Cloudflare Tunnel for %TARGET%
echo.
echo Keep this window open while users are testing.
echo Copy the https://*.trycloudflare.com URL from below and share it.
echo Press Ctrl+C to stop the tunnel.
echo.
"%CLOUDFLARED%" tunnel --url %TARGET%

endlocal
