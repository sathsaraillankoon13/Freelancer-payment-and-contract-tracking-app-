@echo off
title ISAACIFY CRM Manager - Android
echo ===================================================
echo   Launching ISAACIFY CRM on Android Emulator
echo ===================================================
echo.
cd /d "%~dp0"

adb reverse tcp:8081 tcp:8081 >nul 2>&1
call npx.cmd expo start --android
pause
