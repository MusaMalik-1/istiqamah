@echo off
echo ========================================================
echo   Building Istiqamah Windows Installer and Portable App
echo ========================================================
echo.
call npm run dist
echo.
echo ========================================================
echo   Build finished! Look inside the "dist" folder:
echo   1. "Istiqamah Setup 1.0.0.exe" (Standard Windows Installer)
echo   2. "Istiqamah 1.0.0.exe" (Portable standalone app)
echo ========================================================
pause
