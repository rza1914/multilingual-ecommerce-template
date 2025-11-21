# fix_i18n_import.ps1 - Create missing nl.json + ensure data dir
# Fixes build error: Failed to resolve import "../data/nl.json" from "src/config/i18n.ts"

Set-Location $PSScriptRoot\frontend

Write-Host "🔍 Fixing i18n import issue for Dutch locale" -ForegroundColor Cyan
Write-Host "📍 Location: Netherlands (NL) - Dutch locale critical" -ForegroundColor Cyan

Write-Host "`n📁 Checking data directory..." -ForegroundColor Cyan
if (-not (Test-Path "data")) {
    Write-Host "🔄 Creating data directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "data" -Force | Out-Null
    Write-Host "✅ data directory created." -ForegroundColor Green
} else {
    Write-Host "✅ data directory exists." -ForegroundColor Green
}

Write-Host "`n🌐 Creating data/nl.json..." -ForegroundColor Yellow
$nlJsonContent = @"
{
  "translation": {
    "common": {
      "loading": "Laden...",
      "error": "Fout",
      "retry": "Opnieuw proberen"
    },
    "home": {
      "title": "Welkom bij onze winkel",
      "featured": "Uitgelichte producten",
      "allProducts": "Alle producten"
    },
    "product": {
      "price": "Prijs",
      "discount": "Korting",
      "inStock": "Op voorraad",
      "outOfStock": "Uitverkocht",
      "addToCart": "Toevoegen aan winkelwagen"
    },
    "cart": {
      "title": "Winkelwagen",
      "empty": "Je winkelwagen is leeg",
      "total": "Totaal",
      "checkout": "Afrekenen"
    },
    "nav": {
      "home": "Home",
      "products": "Producten",
      "cart": "Winkelwagen",
      "language": "Taal"
    }
  }
}
"@

Set-Content -Path "data/nl.json" -Value $nlJsonContent -Encoding utf8
Write-Host "✅ data/nl.json created with Dutch translations." -ForegroundColor Green

Write-Host "`n🔧 Adding JSON module declaration..." -ForegroundColor Cyan
if (-not (Test-Path "src\types")) {
    New-Item -ItemType Directory -Path "src\types" -Force | Out-Null
}
$declarationContent = @"
declare module "*.json" {
  const value: any;
  export default value;
}
"@
Set-Content -Path "src\types\json.d.ts" -Value $declarationContent -Encoding utf8
Write-Host "✅ JSON module declaration added." -ForegroundColor Green

Write-Host "`n✅ i18n import issue fixed!" -ForegroundColor Green
Write-Host "💡 Restart Vite with: npm run dev" -ForegroundColor Yellow
Write-Host "💡 The frontend will now compile without build errors" -ForegroundColor Yellow
Write-Host "💡 Dutch UI will be available when language is set to 'nl'" -ForegroundColor Yellow