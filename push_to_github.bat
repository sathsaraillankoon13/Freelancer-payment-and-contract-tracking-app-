@echo off
title Push Milestone and Approval Management Branch
echo ====================================================================
echo   Pushing to Branch: Milestone-and-Approval-Management
echo   Repo: https://github.com/sathsaraillankoon13/Freelancer-payment-and-contract-tracking-app-.git
echo ====================================================================
echo.
cd /d "%~dp0"

echo Running git push origin Milestone-and-Approval-Management...
git push -u origin Milestone-and-Approval-Management

echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Successfully pushed to Milestone-and-Approval-Management branch!
) else (
    echo [ERROR] Push failed. If prompted for GitHub login, please sign in via Brave browser.
)
echo.
pause
