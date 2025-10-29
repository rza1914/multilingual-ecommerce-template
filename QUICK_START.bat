@echo off
color 0A
cls
echo.
echo ========================================================================
echo                    MULTILINGUAL E-COMMERCE TEMPLATE
echo ========================================================================
echo.
echo                    🔧 FIX AND START LAUNCHER 🔧
echo.
echo ========================================================================
echo.
echo This script will:
echo   [1] Stop any running servers
echo   [2] Fix database (fresh start)
echo   [3] Start Backend Server - Port 8000
echo   [4] Start Frontend Server - Port 5173
echo.
echo ========================================================================
echo.

REM ===================================
REM Kill existing processes
REM ===================================
echo [1/4] Stopping existing servers...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul
echo       [✓] Servers stopped

REM ===================================
REM Fix Database
REM ===================================
echo.
echo [2/4] Fixing database...
cd backend
del ecommerce.db 2>nul
python recreate_database.py
if errorlevel 1 (
    echo       [✗] Database creation failed!
    pause
    exit /b 1
)
echo       [✓] Database fixed
cd ..

REM ===================================
REM Start Backend
REM ===================================
echo.
echo [3/4] Starting Backend Server...
start "🔵 Backend Server - Port 8000" cmd /k "color 0B && cd backend && echo. && echo ======================================== && echo      Backend Server Starting... && echo ======================================== && echo. && python -m uvicorn app.main:app --reload"
timeout /t 5 /nobreak > nul
echo       [✓] Backend started

REM ===================================
REM Start Frontend
REM ===================================
echo.
echo [4/4] Starting Frontend Server...
start "🟢 Frontend Server - Port 5173" cmd /k "color 0A && cd frontend && echo. && echo ======================================== && echo     Frontend Server Starting... && echo ======================================== && echo. && npm run dev"
timeout /t 3 /nobreak > nul
echo       [✓] Frontend started

REM ===================================
REM Success Message
REM ===================================
cls
echo.
echo ========================================================================
echo                           ✅ ALL DONE!
echo ========================================================================
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo.
echo ========================================================================
echo.
echo 🔑 Login Credentials:
echo    Email:    admin@test.com
echo    Password: admin123
echo.
echo ========================================================================
echo.
echo 📦 Sample Products:
echo    - Premium Laptop    ($1299.99)
echo    - Wireless Headphones ($199.99)
echo    - Smart Watch       ($299.99)
echo.
echo ========================================================================
echo.
echo ⚠️  IMPORTANT - Clear Browser Cache:
echo.
echo    Open browser console (F12) and run:
echo    localStorage.clear(); location.reload();
echo.
echo ========================================================================
echo.
echo 💡 Tips:
echo    - Press Ctrl+C in server windows to stop them
echo    - Backend health: http://localhost:8000/health
echo    - Products should NOT show "Out of Stock"
echo    - If cart doesn't work, clear browser cache!
echo.
echo ========================================================================
echo.
echo   Press any key to close this window...
echo   (Servers will keep running in background windows)
echo.
pause > nul