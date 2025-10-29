@echo off
REM Cleanup script - پاک کردن تمام فایل‌های اضافی

echo 🧹 تمیز کردن فایل‌های اضافی...

REM فایل‌های diagnostic و fix رو پاک کن
del /q ADMIN_FIXES_APPLIED.md
del /q ADMIN_FIX_COMPLETE.md
del /q AUTOCOMPLETE_FIX_COMPLETE.md
del /q AUTH_FIX_COMPLETE.md
del /q BACKEND_API_DIAGNOSIS.md
del /q BACKEND_DIAGNOSIS_GUIDE.md
del /q CODE_CHANGES.md
del /q COMPLETE_FIX_GUIDE.md
del /q COMPLETE_FIX_SUMMARY.md
del /q CORS_FIX.md
del /q CORS_TEST_FA.md
del /q CRITICAL_FIXES_COMPLETE.md
del /q diagnose_admin.md
del /q DIAGNOSTIC_TOOLS_README.md
del /q GITHUB_CLI_GUIDE.md
del /q HOW_TO_START_SERVERS.md
del /q LOGIN_FIX.md
del /q ORDER_TOTAL_FIX.md
del /q QUICK_START.md
del /q RESTART_BACKEND_NOW.md
del /q START_HERE_DIAGNOSIS.md
del /q STOCK_FIX_SUMMARY.md

REM .bat فایل‌های اضافی رو پاک کن
del /q diagnose-all.bat
del /q start-backend-fixed.bat
del /q start-frontend.bat
del /q restart-backend-fixed.bat
del /q test-cors.bat

REM Python test فایل‌ها رو پاک کن
del /q test-backend-direct.py
del /q verify-frontend-config.py
del /q verify-backend-config.py

echo ✅ تمیز‌کاری تمام شد!
echo.
echo 📁 فایل‌های باقی‌مانده:
echo   ✅ start-all.bat
echo   ✅ README.md
echo   ✅ COMPLETE_PROJECT_DOCUMENTATION.md
echo   ✅ FEATURES_CHECKLIST.md
echo   ✅ QUICK_REFERENCE.md
echo   ✅ README_QUICK_START.md
echo   ✅ frontend/
echo   ✅ backend/
echo   ✅ scripts/
echo   ✅ .github/
echo.
echo حالا می‌تونی کامیت کنی:
echo   git add .
echo   git commit -m "docs: clean up and finalize project"
echo   git push origin main
pause