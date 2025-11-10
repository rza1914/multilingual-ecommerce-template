@echo off
REM Startup script for iShop E-commerce Platform with proper CORS configuration

echo Starting iShop E-commerce Platform...

REM Check if we're in the backend directory
if not exist "app\main.py" (
    echo Error: app/main.py not found. Please run this script from the backend directory.
    exit /b 1
)

REM Check if .env file exists, if not create from example
if not exist ".env" (
    echo Creating .env file from example...
    copy .env.example .env
    echo Please update the .env file with your specific configuration before continuing.
    echo At minimum, set a proper SECRET_KEY value.
    exit /b 1
)

REM Start the application
echo Starting the FastAPI application...
echo Application will be available at http://localhost:8000
echo CORS is configured for:
if "%ENVIRONMENT%"=="production" (
    echo   - Production origins from ALLOWED_ORIGINS variable
) else (
    echo   - Development: http://localhost:5173 (Vite default)
    echo   - Development: http://localhost:3000 (Create React App default)
    echo   - Production: https://ishooop.org
    echo   - Production: https://www.ishooop.org
)

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload