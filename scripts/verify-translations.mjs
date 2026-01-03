/**
 * Translation Verification Script
 * 
 * Verifies that all components can find their required translation keys
 * in all three language files.
 * 
 * Run: node scripts/verify-translations.mjs
 */

import fs from 'fs';
import path from 'path';

const CONFIG = {
  basePath: 'E:/template1/multilingual-ecommerce-template/frontend/src/data',
  files: { fa: 'fa.json', en: 'en.json', ar: 'ar.json' }
};

// Keys that components expect to find
const COMPONENT_REQUIRED_KEYS = {
  Footer: [
    'footer.description',
    'footer.emailAddress',
    'footer.phone',
    'footer.address',
    'footer.privacyPolicy',
    'footer.termsOfService',
    'footer.company',
    'footer.customerService',
    'footer.allRightsReserved',
    'footer.careers',
    'footer.blog',
    'footer.support',
    'footer.shippingInfo',
    'footer.returns',
    'footer.faq',
    'footer.cookiePolicy'
  ],
  Checkout: [
    'checkout.title',
    'checkout.total',
    'checkout.subtotal',
    'checkout.shipping',
    'checkout.tax',
    'checkout.placeOrder',
    'checkout.shippingAddress',
    'checkout.fullName',
    'checkout.emailAddress',
    'checkout.phoneNumber',
    'checkout.streetAddress',
    'checkout.city',
    'checkout.state',
    'checkout.zipCode',
    'checkout.country',
    'checkout.deliveryMethod',
    'checkout.paymentMethod',
    'checkout.orderSummary',
    'checkout.steps.shipping',
    'checkout.steps.delivery',
    'checkout.steps.payment',
    'checkout.steps.review'
  ],
  Blog: [
    'blog.title',
    'blog.readMore',
    'blog.categories',
    'blog.recentPosts',
    'blog.author',
    'blog.publishedOn'
  ],
  Careers: [
    'careers.title',
    'careers.openPositions',
    'careers.applyNow',
    'careers.jobDescription',
    'careers.requirements',
    'careers.location'
  ]
};

function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : undefined, obj);
}

function verifyTranslations() {
  console.log('\n' + '='.repeat(70));
  console.log('        🔍 TRANSLATION VERIFICATION REPORT');
  console.log('='.repeat(70));
  
  // Load translations
  const translations = {};
  for (const [lang, filename] of Object.entries(CONFIG.files)) {
    const filePath = path.join(CONFIG.basePath, filename);
    let rawContent = fs.readFileSync(filePath, 'utf8');
    // Remove BOM if present
    if (rawContent.charCodeAt(0) === 0xFEFF) {
      rawContent = rawContent.slice(1);
    }
    translations[lang] = JSON.parse(rawContent);
    
    // Handle Arabic file structure (nested under "translation" key)
    if (filename === 'ar.json') {
      translations[lang] = translations[lang].translation;
    }
  }
  
  let totalIssues = 0;
  
  // Check each component
  for (const [component, requiredKeys] of Object.entries(COMPONENT_REQUIRED_KEYS)) {
    console.log(`\n📦 ${component} Component:`);
    console.log(`   Required keys: ${requiredKeys.length}`);
    
    for (const lang of ['fa', 'en', 'ar']) {
      const missing = [];
      for (const key of requiredKeys) {
        const value = getNestedValue(translations[lang], key);
        if (value === undefined) {
          missing.push(key);
        }
      }
      
      if (missing.length > 0) {
        console.log(`   ❌ ${lang}: Missing ${missing.length} keys`);
        missing.forEach(k => console.log(`      - ${k}`));
        totalIssues += missing.length;
      } else {
        console.log(`   ✅ ${lang}: All keys present`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(70));
  if (totalIssues === 0) {
    console.log('        ✅ ALL COMPONENTS VERIFIED - NO MISSING KEYS');
  } else {
    console.log(`        ❌ VERIFICATION FAILED - ${totalIssues} MISSING KEYS`);
  }
  console.log('='.repeat(70) + '\n');
  
  return totalIssues === 0;
}

verifyTranslations();