@echo off
echo ============================================
echo Fix Out of Stock Issue - Product Migration
echo ============================================
echo.

cd /d "%~dp0"

echo Step 1: Running Migration...
echo.
python migrate_products.py

echo.
echo ============================================
echo Step 2: Checking Products...
echo ============================================
echo.
python check_products.py

echo.
echo ============================================
echo Step 3: Fixing Any Issues...
echo ============================================
echo.
python fix_products.py

echo.
echo ============================================
echo ✅ ALL DONE!
echo ============================================
echo.
echo Next steps:
echo 1. Restart backend server (Ctrl+C then run again)
echo 2. Refresh frontend (Ctrl+Shift+R)
echo 3. Test cart - should not show "Out of Stock"
echo.
echo ============================================
pause
