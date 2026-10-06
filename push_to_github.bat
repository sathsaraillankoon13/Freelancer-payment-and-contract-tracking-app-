@echo off
title Push Invoice and Payment Tracking Branch
echo ===================================================
echo   Pushing to Branch: Invoice-and-Payment-Tracking
echo   Repo: https://github.com/sathsaraillankoon13/Freelancer-payment-and-contract-tracking-app-.git
echo ===================================================
echo.
cd /d "%~dp0"

echo Running git push origin Invoice-and-Payment-Tracking...
git push -u origin Invoice-and-Payment-Tracking

echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Successfully pushed to Invoice-and-Payment-Tracking branch!
) else (
    echo [ERROR] Push failed. If prompted for GitHub login, please sign in via Brave browser.
)
echo.
pause
