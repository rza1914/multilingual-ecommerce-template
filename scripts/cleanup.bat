@echo off
REM Multilingual E-Commerce Template - Cleanup Script (Windows)
REM این اسکریپت فایل‌های اضافی و موقت را پاک می‌کند

setlocal enabledelayedexpansion

echo 🧹 شروع پاک‌سازی فایل‌های اضافی...
echo.

REM 1. پاک‌سازی __pycache__ و .pyc فایل‌ها
echo [INFO] حذف __pycache__ و .pyc فایل‌ها...
for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d" 2>nul
del /s /q *.pyc 2>nul
del /s /q *.pyo 2>nul
del /s /q *.pyd 2>nul

REM 2. پاک‌سازی .env.local و test environment files
echo [INFO] حذف فایل‌های محیطی تست...
if exist ".env.local" del /q ".env.local"
if exist ".env.test" del /q ".env.test"
if exist "backend\.env.test" del /q "backend\.env.test"
if exist "frontend\.env.test" del /q "frontend\.env.test"

REM 3. پاک‌سازی build و dist فولدرها
echo [INFO] حذف build و dist فولدرها...
if exist "frontend\dist" rd /s /q "frontend\dist"
if exist "frontend\build" rd /s /q "frontend\build"
if exist "backend\dist" rd /s /q "backend\dist"
if exist "backend\build" rd /s /q "backend\build"

REM 4. پاک‌سازی فایل‌های مارک‌داون اضافی
echo [INFO] حذف فایل‌های مارک‌داون اضافی...
if exist "ADMIN_FIXES_APPLIED.md" del /q "ADMIN_FIXES_APPLIED.md"
if exist "ADMIN_FIX_COMPLETE.md" del /q "ADMIN_FIX_COMPLETE.md"
if exist "AUTH_FIX_COMPLETE.md" del /q "AUTH_FIX_COMPLETE.md"
if exist "AUTOCOMPLETE_FIX.md" del /q "AUTOCOMPLETE_FIX.md"
if exist "AUTOCOMPLETE_FIX_COMPLETE.md" del /q "AUTOCOMPLETE_FIX_COMPLETE.md"
if exist "BACKEND_API_DIAGNOSIS.md" del /q "BACKEND_API_DIAGNOSIS.md"
if exist "BACKEND_DIAGNOSIS_GUIDE.md" del /q "BACKEND_DIAGNOSIS_GUIDE.md"
if exist "CODE_CHANGES.md" del /q "CODE_CHANGES.md"
if exist "COMPLETE_FIX_GUIDE.md" del /q "COMPLETE_FIX_GUIDE.md"
if exist "COMPLETE_FIX_SUMMARY.md" del /q "COMPLETE_FIX_SUMMARY.md"
if exist "CORS_FIX.md" del /q "CORS_FIX.md"
if exist "CORS_TEST_FA.md" del /q "CORS_TEST_FA.md"
if exist "CRITICAL_FIXES_COMPLETE.md" del /q "CRITICAL_FIXES_COMPLETE.md"
if exist "DIAGNOSTIC_TOOLS_README.md" del /q "DIAGNOSTIC_TOOLS_README.md"
if exist "FIXES_SUMMARY.md" del /q "FIXES_SUMMARY.md"
if exist "FIXES_VERIFICATION.md" del /q "FIXES_VERIFICATION.md"
if exist "GITHUB_CLI_GUIDE.md" del /q "GITHUB_CLI_GUIDE.md"
if exist "HOW_TO_START_SERVERS.md" del /q "HOW_TO_START_SERVERS.md"
if exist "LOGIN_FIX.md" del /q "LOGIN_FIX.md"
if exist "ORDER_TOTAL_FIX.md" del /q "ORDER_TOTAL_FIX.md"
if exist "QUICK_START.md" del /q "QUICK_START.md"
if exist "RESTART_BACKEND_NOW.md" del /q "RESTART_BACKEND_NOW.md"
if exist "START_HERE_DIAGNOSIS.md" del /q "START_HERE_DIAGNOSIS.md"
if exist "STOCK_FIX_SUMMARY.md" del /q "STOCK_FIX_SUMMARY.md"
if exist "diagnose_admin.md" del /q "diagnose_admin.md"

REM 5. پاک‌سازی فایل‌های backend اضافی
echo [INFO] حذف فایل‌های تست و دیاگنوستیک backend...
if exist "backend\AUTHENTICATION_GUIDE.md" del /q "backend\AUTHENTICATION_GUIDE.md"
if exist "backend\CORS_500_FIX.md" del /q "backend\CORS_500_FIX.md"
if exist "backend\DATABASE_SCHEMA_FIX.md" del /q "backend\DATABASE_SCHEMA_FIX.md"
if exist "backend\FIX_401_ERROR.md" del /q "backend\FIX_401_ERROR.md"
if exist "backend\OUT_OF_STOCK_FIX.md" del /q "backend\OUT_OF_STOCK_FIX.md"
if exist "backend\README_401_FIX.md" del /q "backend\README_401_FIX.md"
if exist "backend\START_HERE.md" del /q "backend\START_HERE.md"
if exist "backend\check_products.py" del /q "backend\check_products.py"
if exist "backend\check_users.py" del /q "backend\check_users.py"
if exist "backend\create_or_verify_admin.py" del /q "backend\create_or_verify_admin.py"
if exist "backend\diagnose_auth.py" del /q "backend\diagnose_auth.py"
if exist "backend\diagnose_cors_500.py" del /q "backend\diagnose_cors_500.py"
if exist "backend\fix_database_schema.py" del /q "backend\fix_database_schema.py"
if exist "backend\fix_order_model.py" del /q "backend\fix_order_model.py"
if exist "backend\fix_out_of_stock.py" del /q "backend\fix_out_of_stock.py"
if exist "backend\fix_products.py" del /q "backend\fix_products.py"
if exist "backend\migrate_products.py" del /q "backend\migrate_products.py"
if exist "backend\recreate_database.py" del /q "backend\recreate_database.py"
if exist "backend\test_admin_fixed.py" del /q "backend\test_admin_fixed.py"
if exist "backend\test_auth.html" del /q "backend\test_auth.html"
if exist "backend\test_auth_debug.py" del /q "backend\test_auth_debug.py"
if exist "backend\test_auth_endpoints.py" del /q "backend\test_auth_endpoints.py"
if exist "backend\test_auth_flow.py" del /q "backend\test_auth_flow.py"
if exist "backend\test_cors.py" del /q "backend\test_cors.py"
if exist "backend\test_cors_detailed.py" del /q "backend\test_cors_detailed.py"
if exist "backend\test_critical_fixes.py" del /q "backend\test_critical_fixes.py"

REM 6. پاک‌سازی فایل‌های .bat
echo [INFO] حذف فایل‌های batch...
if exist "diagnose-all.bat" del /q "diagnose-all.bat"
if exist "diagnose-backend.bat" del /q "diagnose-backend.bat"
if exist "restart-backend-fixed.bat" del /q "restart-backend-fixed.bat"
if exist "start-all.bat" del /q "start-all.bat"
if exist "start-backend.bat" del /q "start-backend.bat"
if exist "start-backend-verbose.bat" del /q "start-backend-verbose.bat"
if exist "start-frontend.bat" del /q "start-frontend.bat"
if exist "test-cors.bat" del /q "test-cors.bat"
if exist "backend\diagnose_auth.bat" del /q "backend\diagnose_auth.bat"
if exist "backend\fix_database_schema.bat" del /q "backend\fix_database_schema.bat"
if exist "backend\fix_out_of_stock.bat" del /q "backend\fix_out_of_stock.bat"
if exist "backend\run_all_tests.bat" del /q "backend\run_all_tests.bat"
if exist "QUICK_START.bat" del /q "QUICK_START.bat"

REM 7. پاک‌سازی فایل‌های دیاگنوستیک دیگر
echo [INFO] حذف فایل‌های دیاگنوستیک...
if exist "test-backend.html" del /q "test-backend.html"
if exist "test-backend-direct.py" del /q "test-backend-direct.py"
if exist "verify-backend-config.py" del /q "verify-backend-config.py"
if exist "verify-frontend-config.py" del /q "verify-frontend-config.py"
if exist "QUICK_REFERENCE.txt" del /q "QUICK_REFERENCE.txt"

REM 8. پاک‌سازی فایل‌های frontend اضافی
echo [INFO] حذف فایل‌های frontend اضافی...
if exist "frontend\NAN_FIX_COMPLETE.md" del /q "frontend\NAN_FIX_COMPLETE.md"
del /s /q "frontend\src\*_FIXED.tsx" 2>nul
del /s /q "frontend\src\*_NEW.tsx" 2>nul
del /s /q "frontend\src\*_BACKUP.tsx" 2>nul
del /s /q "frontend\src\*.backup" 2>nul

REM 9. پاک‌سازی coverage reports
echo [INFO] حذف coverage reports...
if exist "backend\htmlcov" rd /s /q "backend\htmlcov"
if exist "backend\.coverage" del /q "backend\.coverage"
if exist "backend\coverage.xml" del /q "backend\coverage.xml"
if exist "frontend\coverage" rd /s /q "frontend\coverage"

REM 10. پاک‌سازی pytest cache
echo [INFO] حذف pytest cache...
for /d /r . %%d in (.pytest_cache) do @if exist "%%d" rd /s /q "%%d" 2>nul

REM 11. پاک‌سازی mypy cache
echo [INFO] حذف mypy cache...
for /d /r . %%d in (.mypy_cache) do @if exist "%%d" rd /s /q "%%d" 2>nul

REM 12. پاک‌سازی log files
echo [INFO] حذف log files...
del /s /q *.log 2>nul

echo.
echo ✅ پاک‌سازی با موفقیت انجام شد!
echo.
echo 📌 نکات:
echo    - برای حذف node_modules: scripts\cleanup-deep.bat
echo    - برای نصب مجدد dependencies:
echo      cd frontend ^&^& npm install
echo      cd backend ^&^& pip install -r requirements.txt
echo.
pause
