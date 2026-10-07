@echo off
title Push Contract and Scope Management Branch
echo ====================================================================
echo   Pushing to Branch: Contract-and-Scope-Management
echo   Repo: https://github.com/sathsaraillankoon13/Freelancer-payment-and-contract-tracking-app-.git
echo ====================================================================
echo.
cd /d "%~dp0"

echo Running git push origin Contract-and-Scope-Management...
git push -u origin Contract-and-Scope-Management

echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Successfully pushed to Contract-and-Scope-Management branch!
) else (
    echo [ERROR] Push failed. If prompted for GitHub login, please sign in via Brave browser.
)
echo.
pause
