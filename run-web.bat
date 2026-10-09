@echo off
title ISAACIFY CRM Manager - Web
echo ===================================================
echo   Launching ISAACIFY CRM in Web Browser
echo ===================================================
echo.
cd /d "%~dp0"

call npx.cmd expo start --web
pause
