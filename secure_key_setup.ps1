# secure_key_setup.ps1 - Securely save GROQ API key + restart
# IMPORTANT: If you exposed a real key, revoke it immediately: https://console.groq.com/keys

Set-Location $PSScriptRoot\backend

Write-Host "🔍 SECURITY ALERT: GROQ API key processing" -ForegroundColor Red
Write-Host "🔒 Never share API keys in plain text (even in encrypted chats)" -ForegroundColor Red
Write-Host "📝 Key must be stored in backend/.env only" -ForegroundColor Yellow

# Backup existing .env
if (Test-Path ".env") {
    Copy-Item ".env" ".env.bak" -Force
    Write-Host "✅ .env backed up to .env.bak" -ForegroundColor Green
}

# Prompt for key securely
Write-Host "`n🔐 Enter your GROQ API key (input will be hidden):" -ForegroundColor Yellow
$key = ""
while ($key.Length -eq 0) {
    $key = Read-Host -AsSecureString "GROQ_API_KEY" | ConvertFrom-SecureString -AsPlainText
    if ($key.Length -eq 0) {
        Write-Host "⚠️  Key cannot be empty. Please enter a valid API key." -ForegroundColor Red
    }
}

# Validate key format
if ($key -notmatch "^gsk_.*") {
    Write-Host "⚠️  Key does not appear to be in GROQ format (should start with 'gsk_')" -ForegroundColor Red
    $proceed = Read-Host "Proceed anyway? (y/N)"
    if ($proceed -ne 'y' -and $proceed -ne 'Y') {
        Write-Host "Aborting setup. Please get a valid GROQ API key from https://console.groq.com/keys" -ForegroundColor Red
        return
    }
}

# Write key to .env
$envContent = "GROQ_API_KEY=$key`n"
Add-Content -Path ".env" -Value $envContent -Encoding utf8

Write-Host "✅ GROQ_API_KEY saved to backend/.env" -ForegroundColor Green

# Ensure .gitignore
$gitignore = "backend/.gitignore"
if (-not (Test-Path $gitignore)) {
    $ignoreContent = @(
        ".env",
        ".env.bak",
        "*.pyc",
        "__pycache__/",
        "venv/",
        "node_modules/"
    ) -join "`n"
    $ignoreContent | Out-File -FilePath $gitignore -Encoding utf8
    Write-Host "✅ .gitignore created with secure entries" -ForegroundColor Green
} 
else {
    $gitignoreContent = Get-Content $gitignore -Raw
    if ($gitignoreContent -notmatch "\.env") {
        Add-Content $gitignore "`n.env"
        Write-Host "✅ .env added to existing .gitignore" -ForegroundColor Green
    }
}

# Restart backend to load the new API key
Write-Host "`n🔄 Restarting backend to apply new API key..." -ForegroundColor Cyan
try {
    $processes = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*uvicorn*" }
    if ($processes) {
        $processes | Stop-Process -Force
        Write-Host "✅ Stopped existing backend processes" -ForegroundColor Green
    }
    Start-Sleep -Seconds 2
    Start-Process powershell -ArgumentList "-NoNewWindow", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    Write-Host "✅ Backend restarted with new API key" -ForegroundColor Green
} 
catch {
    Write-Host "⚠️  Could not restart backend automatically. Please restart manually." -ForegroundColor Yellow
}

Write-Host "`n🎉 AI CHATBOT NOW CONFIGURED!" -ForegroundColor Green
Write-Host "💡 Open http://localhost:5173 → AI Chat will connect to backend" -ForegroundColor Cyan
Write-Host "🔒 IMPORTANT: Revoke any exposed keys from https://console.groq.com/keys" -ForegroundColor Red
Write-Host "🔒 IMPORTANT: Never share API keys in plain text again" -ForegroundColor Red