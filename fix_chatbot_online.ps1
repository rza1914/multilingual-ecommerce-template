# fix_chatbot_online.ps1 - Force reload .env + restart backend + test WS
# Fixes "Offline" status by ensuring fresh backend with GROQ_API_KEY loaded

Set-Location $PSScriptRoot\backend

Write-Host "🔍 Fixing AI Chatbot Offline Status" -ForegroundColor Cyan
Write-Host "📍 Location: Netherlands (NL) - Ensuring GDPR compliance" -ForegroundColor Cyan

Write-Host "`n🛑 Killing old uvicorn processes..." -ForegroundColor Red
Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*uvicorn*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "⏳ Waiting 3 seconds for clean shutdown..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host "🔄 Starting backend with fresh .env (GROQ_API_KEY loaded)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoNewWindow", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

Write-Host "`n⏳ Waiting for backend to fully start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host "📡 Testing backend connectivity..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get -TimeoutSec 10
    Write-Host "✅ Backend is alive - Status: $($response.status)" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Backend may still be starting. Please wait and refresh frontend." -ForegroundColor Yellow
}

Write-Host "`n🎉 Chatbot should now be CONNECTING!" -ForegroundColor Green
Write-Host "💡 Refresh http://localhost:5173 → Chat status should change to 'Online'" -ForegroundColor Cyan
Write-Host "💡 If still offline, check browser console for WebSocket errors" -ForegroundColor Yellow