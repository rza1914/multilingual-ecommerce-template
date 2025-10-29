@echo off
echo ============================================
echo Database Schema Fix - Complete Recreation
echo ============================================
echo.
echo This will DELETE your current database
echo and create a new one with correct schema.
echo.
echo ⚠️  WARNING: All data will be lost!
echo.
pause

cd /d "%~dp0"

echo.
echo Step 1: Stopping any running processes...
echo (Please make sure backend is stopped with Ctrl+C)
echo.
pause

echo.
echo Step 2: Deleting old database files...
echo.
if exist ecommerce.db (
    del ecommerce.db
    echo ✅ Deleted ecommerce.db
)
if exist ecommerce.db-shm (
    del ecommerce.db-shm
    echo ✅ Deleted ecommerce.db-shm
)
if exist ecommerce.db-wal (
    del ecommerce.db-wal
    echo ✅ Deleted ecommerce.db-wal
)

echo.
echo Step 3: Creating new database with correct schema...
echo.
python recreate_database.py

echo.
echo ============================================
echo ✅ DONE!
echo ============================================
echo.
echo Next steps:
echo 1. Start backend: python -m uvicorn app.main:app --reload
echo 2. Start frontend: npm run dev (in frontend folder)
echo 3. Visit: http://localhost:5173
echo.
echo Login with:
echo   Email: admin@test.com
echo   Password: admin123
echo.
echo ============================================
pause
