#!/bin/bash

# Multilingual E-Commerce Template - Cleanup Script
# این اسکریپت فایل‌های اضافی و موقت را پاک می‌کند

set -e

echo "🧹 شروع پاک‌سازی فایل‌های اضافی..."

# رنگ‌ها برای output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# تابع برای نمایش پیام‌ها
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# تابع برای حذف فایل/دایرکتوری
safe_remove() {
    if [ -e "$1" ]; then
        rm -rf "$1"
        log_info "حذف شد: $1"
        return 0
    else
        log_warning "یافت نشد: $1"
        return 1
    fi
}

# 1. پاک‌سازی node_modules (فقط اگر flag --deep پاس شده باشد)
if [ "$1" == "--deep" ]; then
    log_info "حذف node_modules (Deep Cleanup)..."
    safe_remove "frontend/node_modules"
else
    log_warning "برای حذف node_modules از --deep استفاده کنید"
fi

# 2. پاک‌سازی __pycache__ و .pyc فایل‌ها
log_info "حذف __pycache__ و .pyc فایل‌ها..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true
find . -type f -name "*.pyo" -delete 2>/dev/null || true
find . -type f -name "*.pyd" -delete 2>/dev/null || true

# 3. پاک‌سازی .env.local و test environment files
log_info "حذف فایل‌های محیطی تست..."
safe_remove ".env.local"
safe_remove ".env.test"
safe_remove "backend/.env.test"
safe_remove "frontend/.env.test"

# 4. پاک‌سازی build و dist فولدرها
log_info "حذف build و dist فولدرها..."
safe_remove "frontend/dist"
safe_remove "frontend/build"
safe_remove "backend/dist"
safe_remove "backend/build"

# 5. پاک‌سازی .DS_Store (Mac)
log_info "حذف .DS_Store فایل‌ها..."
find . -name ".DS_Store" -delete 2>/dev/null || true

# 6. پاک‌سازی فایل‌های مارک‌داون اضافی
log_info "حذف فایل‌های مارک‌داون اضافی..."
safe_remove "ADMIN_FIXES_APPLIED.md"
safe_remove "ADMIN_FIX_COMPLETE.md"
safe_remove "AUTH_FIX_COMPLETE.md"
safe_remove "AUTOCOMPLETE_FIX.md"
safe_remove "AUTOCOMPLETE_FIX_COMPLETE.md"
safe_remove "BACKEND_API_DIAGNOSIS.md"
safe_remove "BACKEND_DIAGNOSIS_GUIDE.md"
safe_remove "CODE_CHANGES.md"
safe_remove "COMPLETE_FIX_GUIDE.md"
safe_remove "COMPLETE_FIX_SUMMARY.md"
safe_remove "CORS_FIX.md"
safe_remove "CORS_TEST_FA.md"
safe_remove "CRITICAL_FIXES_COMPLETE.md"
safe_remove "DIAGNOSTIC_TOOLS_README.md"
safe_remove "FIXES_SUMMARY.md"
safe_remove "FIXES_VERIFICATION.md"
safe_remove "GITHUB_CLI_GUIDE.md"
safe_remove "HOW_TO_START_SERVERS.md"
safe_remove "LOGIN_FIX.md"
safe_remove "ORDER_TOTAL_FIX.md"
safe_remove "QUICK_START.md"
safe_remove "RESTART_BACKEND_NOW.md"
safe_remove "START_HERE_DIAGNOSIS.md"
safe_remove "STOCK_FIX_SUMMARY.md"
safe_remove "diagnose_admin.md"

# 7. پاک‌سازی فایل‌های backend اضافی
log_info "حذف فایل‌های تست و دیاگنوستیک backend..."
safe_remove "backend/AUTHENTICATION_GUIDE.md"
safe_remove "backend/CORS_500_FIX.md"
safe_remove "backend/DATABASE_SCHEMA_FIX.md"
safe_remove "backend/FIX_401_ERROR.md"
safe_remove "backend/OUT_OF_STOCK_FIX.md"
safe_remove "backend/README_401_FIX.md"
safe_remove "backend/START_HERE.md"
safe_remove "backend/check_products.py"
safe_remove "backend/check_users.py"
safe_remove "backend/create_or_verify_admin.py"
safe_remove "backend/diagnose_auth.py"
safe_remove "backend/diagnose_cors_500.py"
safe_remove "backend/fix_database_schema.py"
safe_remove "backend/fix_order_model.py"
safe_remove "backend/fix_out_of_stock.py"
safe_remove "backend/fix_products.py"
safe_remove "backend/migrate_products.py"
safe_remove "backend/recreate_database.py"
safe_remove "backend/test_admin_fixed.py"
safe_remove "backend/test_auth.html"
safe_remove "backend/test_auth_debug.py"
safe_remove "backend/test_auth_endpoints.py"
safe_remove "backend/test_auth_flow.py"
safe_remove "backend/test_cors.py"
safe_remove "backend/test_cors_detailed.py"
safe_remove "backend/test_critical_fixes.py"

# 8. پاک‌سازی فایل‌های .bat
log_info "حذف فایل‌های batch..."
safe_remove "diagnose-all.bat"
safe_remove "diagnose-backend.bat"
safe_remove "restart-backend-fixed.bat"
safe_remove "start-all.bat"
safe_remove "start-backend.bat"
safe_remove "start-backend-verbose.bat"
safe_remove "start-frontend.bat"
safe_remove "test-cors.bat"
safe_remove "backend/diagnose_auth.bat"
safe_remove "backend/fix_database_schema.bat"
safe_remove "backend/fix_out_of_stock.bat"
safe_remove "backend/run_all_tests.bat"
safe_remove "QUICK_START.bat"

# 9. پاک‌سازی فایل‌های دیاگنوستیک دیگر
log_info "حذف فایل‌های دیاگنوستیک..."
safe_remove "test-backend.html"
safe_remove "test-backend-direct.py"
safe_remove "verify-backend-config.py"
safe_remove "verify-frontend-config.py"
safe_remove "QUICK_REFERENCE.txt"

# 10. پاک‌سازی فایل‌های frontend اضافی
log_info "حذف فایل‌های frontend اضافی..."
safe_remove "frontend/NAN_FIX_COMPLETE.md"
# حذف فایل‌های backup مشکوک
find frontend/src -name "*_FIXED.tsx" -delete 2>/dev/null || true
find frontend/src -name "*_NEW.tsx" -delete 2>/dev/null || true
find frontend/src -name "*_BACKUP.tsx" -delete 2>/dev/null || true
find frontend/src -name "*.backup" -delete 2>/dev/null || true

# 11. پاک‌سازی coverage reports
log_info "حذف coverage reports..."
safe_remove "backend/htmlcov"
safe_remove "backend/.coverage"
safe_remove "backend/coverage.xml"
safe_remove "frontend/coverage"

# 12. پاک‌سازی pytest cache
log_info "حذف pytest cache..."
find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true

# 13. پاک‌سازی mypy cache
log_info "حذف mypy cache..."
find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true

# 14. پاک‌سازی log files
log_info "حذف log files..."
find . -type f -name "*.log" -delete 2>/dev/null || true

# 15. پاک‌سازی database files (با تایید)
if [ "$1" == "--deep" ] || [ "$2" == "--deep" ]; then
    read -p "آیا می‌خواهید database files را هم حذف کنید؟ (y/N): " confirm
    if [ "$confirm" == "y" ] || [ "$confirm" == "Y" ]; then
        log_warning "حذف database files..."
        safe_remove "backend/ecommerce.db"
        safe_remove "backend/multilingual_ecommerce.db"
        safe_remove "backend/*.db"
    else
        log_info "Database files حفظ شدند"
    fi
fi

echo ""
log_info "✅ پاک‌سازی با موفقیت انجام شد!"
echo ""
echo "📌 نکات:"
echo "   - برای حذف node_modules: ./scripts/cleanup.sh --deep"
echo "   - برای نصب مجدد dependencies:"
echo "     cd frontend && npm install"
echo "     cd backend && pip install -r requirements.txt"
echo ""
