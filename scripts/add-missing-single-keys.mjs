/**
 * Add Missing Single Keys
 * 
 * Run: node scripts/add-missing-single-keys.mjs
 */

import fs from 'fs';

const CONFIG = {
  files: {
    fa: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json',
    en: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json',
    ar: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json'
  }
};

// Single keys that need to be added directly to root
const SINGLE_KEYS = {
  'Loading products...': {
    fa: 'در حال بارگذاری محصولات...',
    en: 'Loading products...',
    ar: 'جاري تحميل المنتجات...'
  },
  'No description available.': {
    fa: 'توضیحاتی موجود نیست.',
    en: 'No description available.',
    ar: 'لا يوجد وصف متاح.'
  }
};

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        📝 ADDING MISSING SINGLE KEYS');
  console.log('='.repeat(70));
  
  for (const [lang, filePath] of Object.entries(CONFIG.files)) {
    console.log(`\n📂 Processing ${lang}.json...`);
    
    let rawContent = fs.readFileSync(filePath, 'utf8');
    // Remove BOM if present
    if (rawContent.charCodeAt(0) === 0xFEFF) {
      rawContent = rawContent.slice(1);
    }
    const translations = JSON.parse(rawContent);
    
    // Handle Arabic file structure (nested under "translation" key)
    let actualTranslations = translations;
    let isArabic = false;
    if (lang === 'ar') {
      actualTranslations = translations.translation;
      isArabic = true;
    }
    
    // Add single keys
    for (const [key, values] of Object.entries(SINGLE_KEYS)) {
      if (actualTranslations[key] === undefined) {
        actualTranslations[key] = values[lang];
        console.log(`   ✅ Added: ${key}`);
      } else {
        console.log(`   ℹ️  Already exists: ${key}`);
      }
    }
    
    // Save updated translations
    let contentToSave = translations;
    if (isArabic) {
      contentToSave = { translation: actualTranslations };
    }
    
    fs.writeFileSync(filePath, JSON.stringify(contentToSave, null, 2), 'utf8');
    console.log(`   💾 Saved ${filePath}`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('        ✅ MISSING SINGLE KEYS ADDED');
  console.log('='.repeat(70) + '\n');
}

main();