@echo off
echo ============================================
echo Checking Users in Database
echo ============================================
echo.

cd /d "%~dp0"
python check_users.py

echo.
echo ============================================
echo Creating/Verifying Admin User
echo ============================================
echo.

python create_or_verify_admin.py

echo.
echo ============================================
echo Testing Authentication Flow
echo ============================================
echo.
echo Make sure server is running before testing!
echo Press any key to run auth test...
pause > nul

python test_auth_flow.py

echo.
echo ============================================
pause
