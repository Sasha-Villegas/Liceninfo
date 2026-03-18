@echo off
echo ==========================================
echo   Liceninfo - Push a GitHub
echo ==========================================
echo.

cd /d "%~dp0"

echo Configurando Git...
git config --global credential.helper manager
git config --global http.sslBackend schannel

echo.
echo Pusheando a GitHub...
git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo ==========================================
    echo   EXITO! Proyecto subido a GitHub
    echo   https://github.com/Sasha-Villegas/Liceninfo
    echo ==========================================
) else (
    echo ERROR: No se pudo pushear. Asegurate de estar logueado en GitHub.
)
echo.
pause
