# final_websocket_fix.ps1 - بدون نیاز به .venv
Set-Location "$PSScriptRoot\backend"

$initFile = "app/api/v1/__init__.py"
$wsImport = "from . import websocket_endpoints"
$wsInclude = "api_router.include_router(websocket_endpoints.router)"

$importExists = (Get-Content $initFile -Raw) -match ([regex]::Escape($wsImport))
$includeExists = (Get-Content $initFile -Raw) -match ([regex]::Escape($wsInclude))

if (-not $importExists) { Add-Content $initFile "`n$wsImport"; Write-Host "وارد شد" -ForegroundColor Green }
if (-not $includeExists) { Add-Content $initFile "`n$wsInclude"; Write-Host "روتر ثبت شد" -ForegroundColor Green }

# ری‌استارت بدون .venv (از python جهانی استفاده کن)
Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*uvicorn*" } | Stop-Process -Force
Start-Sleep 3

Write-Host "راه‌اندازی بک‌اند (بدون .venv)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

Write-Host "`nرفرش کن  چت‌بات Online میشه!" -ForegroundColor Green
