# Frontend Launch and i18n Verification Checklist

## Pre-Launch Verification
- [ ] Backend is running on http://0.0.0.0:8000
- [ ] Database (ecommerce.db) is accessible with seeded products
- [ ] Node.js and npm are installed and accessible
- [ ] Python environment is active with backend running

## Launch Verification
- [ ] Run `launch_and_fix_frontend.ps1` script
- [ ] npm install completes without errors (if needed)
- [ ] .env.development is properly configured with VITE_API_URL=http://localhost:8000
- [ ] Dutch translation file (nl.json) exists in src/data/
- [ ] i18n configuration includes Dutch language
- [ ] Vite configuration includes proxy for API requests

## UI Verification
- [ ] Frontend starts successfully on http://localhost:5173
- [ ] Homepage loads without errors
- [ ] Network tab shows successful API calls to /api/v1/products/
- [ ] Product cards display with images and information
- [ ] No CORS errors in browser console

## i18n Verification
- [ ] Language switcher is available on the site
- [ ] Switching to Dutch changes UI text appropriately
- [ ] Dutch translations are properly loaded from nl.json
- [ ] RTL languages (Arabic, Farsi) handle text direction correctly
- [ ] Date and number formatting is locale-appropriate

## API Integration Verification
- [ ] Products are loaded from backend API (not mock data)
- [ ] Product details page works correctly
- [ ] Search functionality works with API
- [ ] Cart functionality works with API
- [ ] Authentication flows work with API

## Dutch Locale Specific
- [ ] Dutch translations are grammatically correct
- [ ] Dutch date/time formats are used
- [ ] Dutch currency formatting is applied
- [ ] Dutch legal terms are used (e.g., privacy policy, terms)
- [ ] GDPR compliance elements are present

## NL Market Specific
- [ ] Shipping information is relevant to NL/EEA
- [ ] Payment methods popular in NL are available
- [ ] Contact information is appropriate for NL market
- [ ] Customer service options are localized
- [ ] Return policy is NL/EU compliant

## Post-Launch Verification
- [ ] All console errors resolved
- [ ] Performance is acceptable
- [ ] All interactive elements work
- [ ] Forms submit correctly
- [ ] Error boundaries handle failures gracefully
- [ ] Loading states are displayed appropriately
- [ ] Responsive design works on all screen sizes

## Issues to Report
If any of these verifications fail, document:
1. The specific error or issue
2. Browser and version
3. System environment details
4. Any error messages or console logs