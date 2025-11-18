# fix_chatbot_echo.ps1 - Enable existing chat backend
# The backend is already implemented, just needs to be registered

Set-Location $PSScriptRoot\backend

Write-Host "🔍 Enabling chat router in backend..." -ForegroundColor Cyan
Write-Host "📍 Location: Netherlands (NL) - GDPR and privacy considerations" -ForegroundColor Cyan

Write-Host "`n📄 Updating api/v1/__init__.py to register chat router..." -ForegroundColor Yellow

# Read the current content
$initContent = Get-Content "app/api/v1/__init__.py" -Raw

# Uncomment the chat router line
$updatedContent = $initContent -replace '# api_router\.include_router\(chat\.router, prefix="/chat", tags=\["chat"\]\)  # Commented out', 'api_router.include_router(chat.router, prefix="/chat", tags=["chat"])'

# Also uncomment the import for chat (if needed)
$updatedContent = $updatedContent -replace '# from \. import chat, smart_search, cart, demo  # Commented out for demo simplification', 'from . import chat, smart_search, cart, demo'

# Check if the import line wasn't changed (meaning it was different), try another pattern
if ($updatedContent -eq $initContent) {
    $updatedContent = $initContent -replace 'from \. import auth, users, products, orders, admin, seed  # Commenting out AI modules temporarily', 'from . import auth, users, products, orders, admin, seed, chat, smart_search, cart, demo'
}

# Write the updated content back
Set-Content "app/api/v1/__init__.py" $updatedContent -Encoding utf8

Write-Host "✅ Chat router enabled in backend." -ForegroundColor Green
Write-Host "⚠️  You will need a GROQ_API_KEY in your .env file for full AI functionality." -ForegroundColor Yellow
Write-Host "⚠️  For NL compliance, ensure proper privacy controls for chat data." -ForegroundColor Yellow
Write-Host "💡 Restart backend: uvicorn app.main:app --reload" -ForegroundColor Yellow