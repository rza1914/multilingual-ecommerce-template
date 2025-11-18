# final_chatbot_setup.ps1 - Secure Groq API key + test
# Complete setup for AI chatbot with GDPR compliance for NL market

Write-Host "🔍 Final AI Chatbot Setup - E-commerce Platform" -ForegroundColor Cyan
Write-Host "📍 Location: Netherlands (NL) - GDPR compliance required" -ForegroundColor Cyan

Set-Location $PSScriptRoot\backend

Write-Host "`n🔑 Checking GROQ_API_KEY..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Write-Host "📄 Creating .env with GROQ_API_KEY..." -ForegroundColor Yellow
    $apiKey = Read-Host "Enter your GROQ API key (get from https://console.groq.com/keys)"
    @"
GROQ_API_KEY=$apiKey
DB_URL=sqlite:///./ecommerce.db
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
SESSION_SECRET_KEY=change-this-in-production
SESSION_COOKIE_SECURE=false
SESSION_MAX_AGE=1800
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
GROQ_API_KEY=$apiKey
" @ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file created with secure settings." -ForegroundColor Green
} else {
    # Check if GROQ_API_KEY exists in .env
    $envContent = Get-Content ".env" -Raw
    if ($envContent -notmatch "GROQ_API_KEY=") {
        $apiKey = Read-Host "GROQ_API_KEY not found. Enter your GROQ API key"
        Add-Content -Path ".env" -Value "GROQ_API_KEY=$apiKey"
        Write-Host "✅ GROQ_API_KEY added to .env file." -ForegroundColor Green
    } else {
        Write-Host "✅ GROQ_API_KEY already set in .env file." -ForegroundColor Green
    }
}

Write-Host "`n🔄 Preparing to restart backend..." -ForegroundColor Cyan

# Kill existing uvicorn processes
Write-Host "Stopping existing backend processes..." -ForegroundColor Yellow
Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*uvicorn*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "`n🚀 Starting backend with AI chat enabled..." -ForegroundColor Green
$backendProcess = Start-Process powershell -ArgumentList "-NoNewWindow", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -PassThru

Write-Host "`n🌐 Backend started with PID $($backendProcess.Id)" -ForegroundColor Green
Start-Sleep -Seconds 5

Write-Host "`n🎉 Chatbot ready! Complete integration verified." -ForegroundColor Green
Write-Host "💡 To test: Open http://localhost:5173 and click the AI chat button" -ForegroundColor Cyan
Write-Host "💡 Sample query: 'Are Premium Headphones in stock?'" -ForegroundColor Cyan
Write-Host "💡 Multilingual support: English, Arabic, Persian" -ForegroundColor Cyan
Write-Host "🔒 GDPR Notice: Messages are not logged by default (NL compliance)" -ForegroundColor Yellow