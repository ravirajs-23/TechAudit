@echo off
echo 🚀 Starting Tech Audit Questionnaire Builder Demo...
echo ==================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

echo 🎯 Starting the development server...
echo 🌐 The application will open at: http://localhost:3000
echo 🚀 Click 'Load Demo Data' to see a pre-built example
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm start

pause

