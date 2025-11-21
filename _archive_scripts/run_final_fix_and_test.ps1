# run_final_fix_and_test.ps1 - اجرای فیکس نهایی + تست کامل
Set-Location $PSScriptRoot

Write-Host "اجرای فیکس نهایی Qwen Coder..." -ForegroundColor Red

# اجرای اسکریپت اصلی (اگر وجود داره)
if (Test-Path "final_websocket_fix.ps1") {
    & ".\final_websocket_fix.ps1"
} else {
    Write-Host "فایل final_websocket_fix.ps1 پیدا نشد! اول اون رو ایجاد کن." -ForegroundColor Yellow
}

Write-Host "`nصبر  ثانیه برای پایداری WebSocket..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "`nتست سلامت بک‌اند:" -ForegroundColor Green
try {
    $health = Invoke-RestMethod "http://localhost:8000/health" -TimeoutSec 10
    Write-Host "   بک‌اند زنده است: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   خطا در اتصال به /health" -ForegroundColor Red
}

Write-Host "`nتست WebSocket (در مرورگر کنسول بزن):" -ForegroundColor Cyan
Write-Host "   let ws = new WebSocket('ws://localhost:8000/ws/chat/1?token=dummy');"
Write-Host "   ws.onopen = () => console.log('اتصال موفق!');"

Write-Host "`nفرانت‌اند رو رفرش کن  چت‌بات باید Online بشه" -ForegroundColor Green
