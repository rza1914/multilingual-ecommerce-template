# launch_and_fix_frontend.ps1 - Robust frontend starter
# Created on: 2025-11-16 19:50 CET
# Purpose: Launch frontend with error handling and Dutch translation support

Write-Host "🔍 Launching and fixing frontend for iShop E-commerce Platform" -ForegroundColor Cyan
Write-Host "📍 Location: Netherlands (NL) - GDPR and Dutch locale required" -ForegroundColor Cyan

# Change to the frontend directory
Set-Location $PSScriptRoot\frontend

Write-Host "`n📦 Checking node_modules..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "🔄 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed! Please check Node.js and npm installation." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed successfully." -ForegroundColor Green
} else {
    Write-Host "✅ node_modules exists." -ForegroundColor Green
}

Write-Host "`n⚙️  Checking .env.development..." -ForegroundColor Cyan
if (-not (Test-Path ".env.development")) {
    Write-Host "🔄 Creating .env.development..." -ForegroundColor Yellow
    @"
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_WS_PORT=8000
VITE_WS_PATH=/ws/inventory
VITE_JWT_TOKEN_LIFETIME=30
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_CHAT=true
VITE_DEBUG_MODE=true
" @ | Out-File -FilePath .env.development -Encoding utf8
    Write-Host "✅ .env.development created with required variables." -ForegroundColor Green
} else {
    Write-Host "✅ .env.development exists." -ForegroundColor Green
    
    # Verify VITE_API_URL is set correctly
    $envContent = Get-Content .env.development -Raw
    if ($envContent -notmatch "VITE_API_URL=http://localhost:8000") {
        Write-Host "⚠️  VITE_API_URL not properly set in .env.development" -ForegroundColor Yellow
        Write-Host "🔄 Updating VITE_API_URL..." -ForegroundColor Yellow
        $envContent = $envContent -replace "VITE_API_URL=.*", "VITE_API_URL=http://localhost:8000"
        Set-Content -Path .env.development -Value $envContent -Encoding utf8
        Write-Host "✅ VITE_API_URL updated." -ForegroundColor Green
    }
}

Write-Host "`n🌐 Checking for Dutch translation file..." -ForegroundColor Cyan
$nlJsonPath = "src\data\nl.json"
if (-not (Test-Path $nlJsonPath)) {
    Write-Host "🌍 Dutch translation file (nl.json) missing!" -ForegroundColor Yellow
    Write-Host "🔄 Creating Dutch translation template..." -ForegroundColor Yellow
    
    # Create the src/data directory if it doesn't exist
    if (-not (Test-Path "src\data")) {
        New-Item -ItemType Directory -Path "src\data" -Force | Out-Null
    }
    
    # Basic Dutch translation template
    $nlJsonContent = @"
{
  "common": {
    "home": "Home",
    "about": "Over",
    "products": "Producten",
    "cart": "Winkelwagen",
    "checkout": "Afrekenen",
    "login": "Inloggen",
    "register": "Registreren",
    "logout": "Uitloggen",
    "search": "Zoeken",
    "searchPlaceholder": "Zoek producten...",
    "price": "Prijs",
    "add_to_cart": "Toevoegen aan winkelwagen",
    "view_cart": "Bekijk winkelwagen",
    "continue_shopping": "Verder winkelen",
    "total": "Totaal",
    "quantity": "Aantal",
    "remove": "Verwijderen",
    "update": "Bijwerken",
    "empty_cart": "Uw winkelwagen is leeg",
    "no_products_found": "Geen producten gevonden",
    "loading": "Laden...",
    "error": "Fout",
    "success": "Succes",
    "save": "Opslaan",
    "cancel": "Annuleren",
    "edit": "Bewerken",
    "delete": "Verwijderen",
    "confirm": "Bevestigen",
    "back": "Terug",
    "next": "Volgende",
    "previous": "Vorige"
  },
  "home": {
    "badge": "Nieuwe Collectie",
    "heroTitle": "Welkom bij onze webshop",
    "heroSubtitle": "Ontdek onze unieke producten met een perfecte mix van kwaliteit en stijl",
    "exploreCollection": "Verken Collectie",
    "learnMore": "Meer Informatie",
    "happyCustomers": "Tevreden Klanten",
    "premiumProducts": "Premium Producten",
    "averageRating": "Gemiddelde Beoordeling",
    "freeShipping": "Gratis Verzending",
    "freeShippingDesc": "Gratis verzending bij bestellingen boven €50",
    "securePayment": "Veilige Betaling",
    "securePaymentDesc": "Uw betalingsgegevens zijn veilig bij ons",
    "premiumQuality": "Premium Kwaliteit",
    "premiumQualityDesc": "Alleen de beste materialen en producten",
    "featuredProducts": "Uitgelichte Producten",
    "featuredProductsSubtitle": "Ontdek onze populairste producten",
    "noFeaturedProducts": "Geen uitgelichte producten beschikbaar",
    "viewAll": "Bekijk Alles",
    "ctaTitle": "Klaar om te winkelen?",
    "ctaSubtitle": "Start uw winkelervaring vandaag nog",
    "ctaButton": "Winkel Nu"
  },
  "products": {
    "title": "Onze Producten",
    "sortBy": "Sorteren op",
    "filterBy": "Filteren op",
    "showAll": "Toon Alles",
    "resetFilters": "Filters Resetten",
    "results": "Resultaten",
    "noResults": "Geen resultaten gevonden",
    "priceRange": "Prijsbereik",
    "min": "Min",
    "max": "Max",
    "category": "Categorie",
    "allCategories": "Alle Categorieën",
    "featured": "Uitgelicht",
    "new": "Nieuw",
    "bestSelling": "Bestverkoper",
    "onSale": "Aanbieding",
    "outOfStock": "Niet op voorraad",
    "addToCartSuccess": "Product toegevoegd aan winkelwagen",
    "viewDetails": "Bekijk Details"
  },
  "cart": {
    "title": "Uw Winkelwagen",
    "itemsCount": "{{count}} item(s)",
    "subtotal": "Subtotaal",
    "tax": "Belasting",
    "shipping": "Verzending",
    "total": "Totaal",
    "proceedToCheckout": "Doorgaan naar afrekenen",
    "continueShopping": "Terug naar winkelen",
    "emptyMessage": "Uw winkelwagen is leeg. Begin met winkelen!",
    "updateCart": "Winkelwagen bijwerken",
    "removeItem": "Verwijderen",
    "itemRemoved": "Item verwijderd",
    "cartUpdated": "Winkelwagen bijgewerkt"
  },
  "checkout": {
    "title": "Afrekenen",
    "billingAddress": "Factuuradres",
    "shippingAddress": "Verzendadres",
    "sameAsBilling": "Gelijk aan factuuradres",
    "firstName": "Voornaam",
    "lastName": "Achternaam",
    "email": "E-mailadres",
    "phone": "Telefoonnummer",
    "address": "Adres",
    "city": "Plaats",
    "postalCode": "Postcode",
    "country": "Land",
    "paymentMethod": "Betalingsmethode",
    "placeOrder": "Bestelling plaatsen",
    "orderSummary": "Besteloverzicht",
    "paymentSuccess": "Betaling geslaagd!",
    "orderConfirmed": "Uw bestelling is bevestigd.",
    "orderNumber": "Bestelnummer: {{orderNumber}}"
  },
  "auth": {
    "loginTitle": "Inloggen bij uw account",
    "registerTitle": "Maak een account aan",
    "email": "E-mailadres",
    "password": "Wachtwoord",
    "confirmPassword": "Bevestig wachtwoord",
    "forgotPassword": "Wachtwoord vergeten?",
    "rememberMe": "Onthoud mij",
    "noAccount": "Nog geen account?",
    "haveAccount": "Heeft u al een account?",
    "signup": "Aanmelden",
    "signin": "Inloggen",
    "loginSuccess": "Succesvol ingelogd!",
    "registerSuccess": "Succesvol geregistreerd! U kunt nu inloggen.",
    "logoutSuccess": "Succesvol uitgelogd.",
    "invalidCredentials": "Ongeldige inloggegevens.",
    "passwordMismatch": "Wachtwoorden komen niet overeen.",
    "emailRequired": "E-mailadres is vereist.",
    "passwordRequired": "Wachtwoord is vereist.",
    "minPasswordLength": "Wachtwoord moet minimaal {{minLength}} tekens bevatten.",
    "profile": "Profiel",
    "myAccount": "Mijn Account",
    "updateProfile": "Profiel bijwerken",
    "currentPassword": "Huidig wachtwoord",
    "newPassword": "Nieuw wachtwoord",
    "confirmNewPassword": "Bevestig nieuw wachtwoord"
  },
  "footer": {
    "about": "Over Ons",
    "contact": "Contact",
    "privacy": "Privacybeleid",
    "terms": "Algemene Voorwaarden",
    "help": "Hulp",
    "faq": "Veelgestelde Vragen",
    "shipping": "Verzendinformatie",
    "returns": "Retourinformatie",
    "copyright": "© {{year}} iShop E-commerce Platform. Alle rechten voorbehouden."
  },
  "contact": {
    "title": "Neem Contact Op",
    "subtitle": "Heeft u vragen? Laat het ons weten!",
    "name": "Naam",
    "subject": "Onderwerp",
    "message": "Bericht",
    "sendMessage": "Verstuur Bericht",
    "contactInfo": "Contactinformatie",
    "phone": "Telefoon",
    "email": "E-mail",
    "address": "Adres",
    "hours": "Openingstijden",
    "followUs": "Volg Ons",
    "formSent": "Formulier succesvol verzonden!",
    "formError": "Fout bij verzenden van formulier. Probeer het alstublieft opnieuw."
  },
  "notFound": {
    "title": "Pagina Niet Gevonden",
    "subtitle": "De pagina die u zoekt bestaat niet.",
    "backHome": "Terug naar Home"
  },
  "errors": {
    "networkError": "Netwerkfout: Kan geen verbinding maken met de server.",
    "serverError": "Serverfout: Er is iets fout gegaan aan onze kant.",
    "invalidRequest": "Ongeldig verzoek: De aanvraag is niet correct.",
    "accessDenied": "Toegang geweigerd: U heeft geen toestemming voor deze actie.",
    "notFound": "Niet gevonden: De aangevraagde resource bestaat niet.",
    "timeout": "Time-out: De aanvraag duurde te lang.",
    "unknownError": "Onbekende fout: Er is iets onverwachts gebeurd."
  },
  "search": {
    "title": "Zoekresultaten",
    "noResults": "Geen resultaten gevonden voor '{{query}}'",
    "resultsFor": "Zoekresultaten voor '{{query}}'",
    "tryDifferent": "Probeer een andere zoekterm."
  },
  "admin": {
    "dashboard": "Dashboard",
    "products": "Producten",
    "orders": "Bestellingen",
    "customers": "Klanten",
    "analytics": "Analytics",
    "settings": "Instellingen",
    "addProduct": "Product Toevoegen",
    "editProduct": "Product Bewerken",
    "manageOrders": "Bestellingen Beheren",
    "viewReports": "Rapporten Bekijken"
  },
  "validation": {
    "required": "{{field}} is vereist",
    "email": "Voer een geldig e-mailadres in",
    "minLength": "{{field}} moet minimaal {{min}} tekens bevatten",
    "maxLength": "{{field}} mag maximaal {{max}} tekens bevatten",
    "minValue": "{{field}} moet minimaal {{min}} zijn",
    "maxValue": "{{field}} mag maximaal {{max}} zijn",
    "pattern": "{{field}} heeft een ongeldig formaat",
    "passwordMismatch": "Wachtwoorden komen niet overeen",
    "notFound": "{{field}} niet gevonden",
    "alreadyExists": "{{field}} bestaat al",
    "invalid": "{{field}} is ongeldig"
  },
  "date": {
    "today": "Vandaag",
    "yesterday": "Gisteren",
    "thisWeek": "Deze Week",
    "thisMonth": "Deze Maand",
    "thisYear": "Dit Jaar",
    "january": "Januari",
    "february": "Februari",
    "march": "Maart",
    "april": "April",
    "may": "Mei",
    "june": "Juni",
    "july": "Juli",
    "august": "Augustus",
    "september": "September",
    "october": "Oktober",
    "november": "November",
    "december": "December",
    "monday": "Maandag",
    "tuesday": "Dinsdag",
    "wednesday": "Woensdag",
    "thursday": "Donderdag",
    "friday": "Vrijdag",
    "saturday": "Zaterdag",
    "sunday": "Zondag"
  }
}
"@

    Set-Content -Path $nlJsonPath -Value $nlJsonContent -Encoding utf8
    Write-Host "✅ Dutch translation template created." -ForegroundColor Green
    Write-Host "📋 Note: You may need to update the Dutch translations with professional translations." -ForegroundColor Yellow
} else {
    Write-Host "✅ Dutch translation file (nl.json) exists." -ForegroundColor Green
}

# Update the i18n configuration to include Dutch
Write-Host "`n🔧 Updating i18n configuration to include Dutch..." -ForegroundColor Cyan
$i18nConfigPath = "src\config\i18n.ts"
if (Test-Path $i18nConfigPath) {
    $i18nContent = Get-Content $i18nConfigPath -Raw
    
    # Check if Dutch is already included
    if ($i18nContent -notmatch "'nl'") {
        Write-Host "🔄 Adding Dutch to i18n configuration..." -ForegroundColor Yellow
        # Add Dutch import
        $i18nContent = $i18nContent -replace "^import en from '\.\./data/en\.json';", "import en from '../data/en.json';`nimport nl from '../data/nl.json';"
        
        # Add Dutch to resources
        $i18nContent = $i18nContent -replace "en: \{ translation: en \}", "en: { translation: en },`n  nl: { translation: nl }"
        
        # Update fallback language if needed
        $i18nContent = $i18nContent -replace "fallbackLng: 'en'", "fallbackLng: 'en'"
        
        Set-Content -Path $i18nConfigPath -Value $i18nContent -Encoding utf8
        Write-Host "✅ Dutch added to i18n configuration." -ForegroundColor Green
    } else {
        Write-Host "✅ Dutch already included in i18n configuration." -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  i18n configuration file not found at $i18nConfigPath" -ForegroundColor Red
}

Write-Host "`n🌐 Checking Vite configuration for proxy..." -ForegroundColor Cyan
$viteConfigPath = "vite.config.ts"
if (Test-Path $viteConfigPath) {
    $viteConfig = Get-Content $viteConfigPath -Raw
    if ($viteConfig -notmatch "proxy") {
        Write-Host "🔄 Adding proxy to Vite configuration to fix potential CORS issues..." -ForegroundColor Yellow
        
        # Add proxy configuration to the server object
        $proxyConfig = @"
    server: {
      host: true,
      strictPort: false,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: 'ws://localhost:8000',
          changeOrigin: true,
          secure: false,
          ws: true,
        }
      },
"@
        
        # Replace the server configuration part
        $viteConfig = $viteConfig -replace "server: \{([^}]*(\n\s*)?)+\},", $proxyConfig
        if ($viteConfig -notmatch "proxy") {
            # If the server block wasn't replaced, we need to insert it
            $viteConfig = $viteConfig -replace "host: true,\s+strictPort: false,", "host: true,
      strictPort: false,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: 'ws://localhost:8000',
          changeOrigin: true,
          secure: false,
          ws: true,
        }
      },"
        }
        
        Set-Content -Path $viteConfigPath -Value $viteConfig -Encoding utf8
        Write-Host "✅ Proxy added to Vite configuration." -ForegroundColor Green
    } else {
        Write-Host "✅ Proxy already configured in Vite configuration." -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Vite configuration file not found at $viteConfigPath" -ForegroundColor Yellow
}

Write-Host "`n🚀 Starting Vite dev server..." -ForegroundColor Green
Write-Host "💡 Frontend will be available at http://localhost:5173" -ForegroundColor Yellow
Write-Host "💡 If you see CORS errors, the proxy configuration will handle them" -ForegroundColor Yellow

npm run dev