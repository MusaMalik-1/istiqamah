@echo off
echo =============================================================================
echo Istiqamah - Publish Release to GitHub for Automatic In-App Updates
echo =============================================================================
for /f "tokens=*" %%i in ('gh auth token') do set GH_TOKEN=%%i
npm run release
echo.
echo Release published successfully! Any user running Istiqamah will auto-update.
pause
