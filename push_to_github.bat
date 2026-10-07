@echo off
title Push Common Core to main branch
echo ====================================================================
echo   Pushing Common Application Core (Login, Home, Account, Shell)
echo   Branch: main
echo   Repo:   https://github.com/sathsaraillankoon13/Freelancer-payment-and-contract-tracking-app-.git
echo ====================================================================
echo.
cd /d "%~dp0"

echo Running git push origin main...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Successfully pushed Common Core to main branch!
) else (
    echo [ERROR] Push failed. If prompted for GitHub login, please sign in via Brave browser.
)
echo.
pause
