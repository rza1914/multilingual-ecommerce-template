# fix_remove_dutch.ps1 - Remove Dutch (nl) from i18n to fix build
# User explicitly does not want Dutch language despite being in NL

Set-Location $PSScriptRoot\frontend

Write-Host "🔍 Removing Dutch (nl) from i18n configuration" -ForegroundColor Cyan
Write-Host "📍 User in NL but explicitly opted out of Dutch language" -ForegroundColor Cyan

Write-Host "`n📂 Backing up i18n.ts..." -ForegroundColor Cyan
Copy-Item "src/config/i18n.ts" "src/config/i18n.ts.bak" -Force
Write-Host "✅ Backup created: src/config/i18n.ts.bak" -ForegroundColor Green

Write-Host "`n🔄 Removing nl.json import and reference..." -ForegroundColor Yellow

# Read the current content
$i18nContent = Get-Content "src/config/i18n.ts" -Raw

# Remove the import statement for nl
$i18nContent = $i18nContent -replace "import nl from '\.\./data/nl\.json';?\r?\n?", ""

# Remove the nl entry from resources
$i18nContent = $i18nContent -replace ",?\s*nl:\s*\{[^}]*\}(,?)\s*", "`$1"

# Ensure no trailing commas
$i18nContent = $i18nContent -replace ",(\s*[}\]])", "`$1"

# Write the updated content back
Set-Content "src/config/i18n.ts" $i18nContent -Encoding utf8

Write-Host "✅ Dutch import and resource removed from i18n configuration." -ForegroundColor Green

Write-Host "`n🗑️  Removing data/nl.json if exists..." -ForegroundColor Cyan
if (Test-Path "data/nl.json") {
    Remove-Item "data/nl.json" -Force
    Write-Host "✅ data/nl.json deleted." -ForegroundColor Green
} else {
    Write-Host "✅ data/nl.json not found (already removed)." -ForegroundColor Green
}

Write-Host "`n✅ Dutch (nl) removal complete!" -ForegroundColor Green
Write-Host "💡 Restart Vite with: npm run dev" -ForegroundColor Yellow
Write-Host "💡 Frontend will now run with English as default (user preference)" -ForegroundColor Yellow