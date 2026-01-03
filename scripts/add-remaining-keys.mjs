/**
 * Add remaining missing keys to translation files
 * 
 * Run: node scripts/add-remaining-keys.mjs
 */

import fs from 'fs';

const CONFIG = {
  files: {
    fa: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json',
    en: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json',
    ar: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json'
  }
};

// Missing keys to add
const MISSING_KEYS = {
  'No description available.': {
    fa: 'توضیحاتی موجود نیست.',
    en: 'No description available.',
    ar: 'لا يوجد وصف متاح.'
  },
  'Loading products...': {
    fa: 'در حال بارگذاری محصولات...',
    en: 'Loading products...',
    ar: 'جاري تحميل المنتجات...'
  }
};

// Also add the common:buttons.save key as a regular nested key
const NAMESPACE_KEY = {
  common: {
    buttons: {
      save: {
        fa: 'ذخیره',
        en: 'Save',
        ar: 'حفظ'
      }
    }
  }
};

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  
  current[lastKey] = value;
}

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        🛠️  ADDING REMAINING MISSING KEYS');
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
    if (lang === 'ar') {
      actualTranslations = translations.translation;
    }
    
    // Add single keys
    for (const [key, values] of Object.entries(MISSING_KEYS)) {
      if (actualTranslations[key] === undefined) {
        actualTranslations[key] = values[lang];
        console.log(`   ✅ Added: ${key}`);
      } else {
        console.log(`   ℹ️  Already exists: ${key}`);
      }
    }
    
    // Add namespace key (common.buttons.save)
    if (!actualTranslations.common?.buttons?.save) {
      if (!actualTranslations.common) actualTranslations.common = {};
      if (!actualTranslations.common.buttons) actualTranslations.common.buttons = {};
      actualTranslations.common.buttons.save = NAMESPACE_KEY.common.buttons.save[lang];
      console.log(`   ✅ Added: common.buttons.save`);
    } else {
      console.log(`   ℹ️  Already exists: common.buttons.save`);
    }
    
    // Save updated translations
    let contentToSave = translations;
    if (lang === 'ar') {
      contentToSave = { translation: actualTranslations };
    }
    
    fs.writeFileSync(filePath, JSON.stringify(contentToSave, null, 2), 'utf8');
    console.log(`   💾 Saved ${filePath}`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('        ✅ REMAINING KEYS ADDED');
  console.log('='.repeat(70) + '\n');
}

main();