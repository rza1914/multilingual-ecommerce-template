# final_websocket_fix.ps1 - بدون خطای Select-String
Set-Location "$PSScriptRoot\backend"

$initFile = "app/api/v1/__init__.py"
$wsImport = "from . import websocket_endpoints"
$wsInclude = "api_router.include_router(websocket_endpoints.router)"

# چک کردن وجود خط با روش امن
$importExists = (Get-Content $initFile -Raw) -match ([regex]::Escape($wsImport))
$includeExists = (Get-Content $initFile -Raw) -match ([regex]::Escape($wsInclude))

if (-not $importExists) {
    Add-Content $initFile "`n$wsImport"
    Write-Host "وارد شد: $wsImport" -ForegroundColor Green
} else {
    Write-Host "قبلاً وارد شده بود" -ForegroundColor Cyan
}

if (-not $includeExists) {
    Add-Content $initFile "`n$wsInclude"
    Write-Host "روتر ثبت شد: $wsInclude" -ForegroundColor Green
} else {
    Write-Host "روتر قبلاً ثبت شده بود" -ForegroundColor Cyan
}

# ری‌استارت
Write-Host "خاموش کردن uvicorn..." -ForegroundColor Red
Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*uvicorn*" } | Stop-Process -Force
Start-Sleep -Seconds 3

Write-Host "راه‌اندازی بک‌اند..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

Write-Host "`nرفرش کن  چت‌بات Online میشه!" -ForegroundColor Green
