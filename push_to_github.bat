@echo off
title Push Client and Project Management Branch
echo ====================================================================
echo   Pushing to Branch: Client-and-Project-Management
echo   Repo: https://github.com/sathsaraillankoon13/Freelancer-payment-and-contract-tracking-app-.git
echo ====================================================================
echo.
cd /d "%~dp0"

echo Running git push origin Client-and-Project-Management...
git push -u origin Client-and-Project-Management

echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Successfully pushed to Client-and-Project-Management branch!
) else (
    echo [ERROR] Push failed. If prompted for GitHub login, please sign in via Brave browser.
)
echo.
pause
