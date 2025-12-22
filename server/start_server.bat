@echo off
echo Starting FoodForAll Server...
cd /d "%~dp0"
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo dependencies checked.
echo.
echo Running server with Node...
node index.js
pause
