@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo Svens Kochbuch - Bilder weboptimiert als .png erzeugen
echo Quelle: images_large
echo Ziel:   images
echo.

if not exist "images_large" (
  echo FEHLER: Ordner images_large wurde nicht gefunden.
  echo Bitte diese BAT direkt im Projektordner svens-kochbuch ablegen und starten.
  pause
  exit /b 1
)

python --version >nul 2>&1
if errorlevel 1 (
  echo FEHLER: Python wurde nicht gefunden.
  echo Bitte Python installieren oder im Terminal pruefen: python --version
  pause
  exit /b 1
)

python -c "import PIL" >nul 2>&1
if errorlevel 1 (
  echo Pillow fehlt. Installation wird gestartet...
  python -m pip install pillow
)

python resize_images_web_png.py

echo.
pause
