@echo off
echo Starting ISAACIFY Mobile Development Server...
cd /d "%~dp0"
call npx.cmd expo start -c
pause
