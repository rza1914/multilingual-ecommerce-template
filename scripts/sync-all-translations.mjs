/**
 * Comprehensive i18n Translation Sync Script
 * 
 * This script:
 * 1. Analyzes all three translation files (fa, en, ar)
 * 2. Finds ALL missing keys in each file (not just footer)
 * 3. Adds missing keys with proper translations
 * 4. Validates the final result
 * 
 * Run: node scripts/sync-all-translations.mjs
 */

import fs from 'fs';
import path from 'path';

// Configuration
const CONFIG = {
  basePath: 'E:/template1/multilingual-ecommerce-template/frontend/src/data',
  files: {
    fa: 'fa.json',
    en: 'en.json',
    ar: 'ar.json'
  }
};

// Translation mappings for missing keys
// Arabic -> Farsi -> English
const TRANSLATIONS = {
  footer: {
    support: { fa: 'پشتیبانی', en: 'Support', ar: 'الدعم' },
    shippingInfo: { fa: 'اطلاعات ارسال', en: 'Shipping Info', ar: 'معلومات الشحن' },
    returns: { fa: 'مرجوعی‌ها', en: 'Returns', ar: 'المرتجعات' },
    faq: { fa: 'سوالات متداول', en: 'FAQ', ar: 'الأسئلة الشائعة' },
    careers: { fa: 'فرصت‌های شغلی', en: 'Careers', ar: 'الوظائف' },
    blog: { fa: 'وبلاگ', en: 'Blog', ar: 'المدونة' },
    cookiePolicy: { fa: 'سیاست کوکی', en: 'Cookie Policy', ar: 'سياسة ملفات تعريف الارتباط' },
    company: { fa: 'شرکت', en: 'Company', ar: 'الشركة' },
    customerService: { fa: 'خدمات مشتریان', en: 'Customer Service', ar: 'خدمة العملاء' },
    allRightsReserved: { fa: 'تمامی حقوق محفوظ است', en: 'All Rights Reserved', ar: 'جميع الحقوق محفوظة' },
    privacyPolicy: { fa: 'سیاست حریم خصوصی', en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
    termsOfService: { fa: 'شرایط خدمات', en: 'Terms of Service', ar: 'شروط الخدمة' },
    description: { fa: 'توضیحات', en: 'Description', ar: 'الوصف' },
    emailAddress: { fa: 'آدرس ایمیل', en: 'Email Address', ar: 'عنوان البريد الإلكتروني' },
    phone: { fa: 'تلفن', en: 'Phone', ar: 'الهاتف' },
    address: { fa: 'آدرس', en: 'Address', ar: 'العنوان' }
  },
  checkout: {
    title: { fa: 'تکمیل خرید', en: 'Checkout', ar: 'الدفع' },
    total: { fa: 'مجموع', en: 'Total', ar: 'المجموع' },
    subtotal: { fa: 'جمع جزئی', en: 'Subtotal', ar: 'المجموع الفرعي' },
    shipping: { fa: 'هزینه ارسال', en: 'Shipping', ar: 'الشحن' },
    tax: { fa: 'مالیات', en: 'Tax', ar: 'الضريبة' },
    discount: { fa: 'تخفیف', en: 'Discount', ar: 'الخصم' },
    placeOrder: { fa: 'ثبت سفارش', en: 'Place Order', ar: 'إتمام الطلب' },
    shippingAddress: { fa: 'آدرس ارسال', en: 'Shipping Address', ar: 'عنوان الشحن' },
    fullName: { fa: 'نام کامل', en: 'Full Name', ar: 'الاسم الكامل' },
    emailAddress: { fa: 'آدرس ایمیل', en: 'Email Address', ar: 'عنوان البريد الإلكتروني' },
    phoneNumber: { fa: 'شماره تلفن', en: 'Phone Number', ar: 'رقم الهاتف' },
    streetAddress: { fa: 'آدرس خیابان', en: 'Street Address', ar: 'عنوان الشارع' },
    city: { fa: 'شهر', en: 'City', ar: 'المدينة' },
    state: { fa: 'استان', en: 'State', ar: 'الولاية' },
    zipCode: { fa: 'کد پستی', en: 'ZIP Code', ar: 'الرمز البريدي' },
    country: { fa: 'کشور', en: 'Country', ar: 'البلد' },
    deliveryMethod: { fa: 'روش تحویل', en: 'Delivery Method', ar: 'طريقة التوصيل' },
    paymentMethod: { fa: 'روش پرداخت', en: 'Payment Method', ar: 'طريقة الدفع' },
    orderSummary: { fa: 'خلاصه سفارش', en: 'Order Summary', ar: 'ملخص الطلب' },
    steps: {
      shipping: { fa: 'ارسال', en: 'Shipping', ar: 'الشحن' },
      delivery: { fa: 'تحویل', en: 'Delivery', ar: 'التوصيل' },
      payment: { fa: 'پرداخت', en: 'Payment', ar: 'الدفع' },
      review: { fa: 'بررسی', en: 'Review', ar: 'المراجعة' }
    }
  },
  blog: {
    title: { fa: 'وبلاگ', en: 'Blog', ar: 'المدونة' },
    readMore: { fa: 'بیشتر بخوانید', en: 'Read More', ar: 'اقرأ المزيد' },
    categories: { fa: 'دسته‌بندی‌ها', en: 'Categories', ar: 'الفئات' },
    recentPosts: { fa: 'آخرین مطالب', en: 'Recent Posts', ar: 'أحدث المقالات' },
    searchPosts: { fa: 'جستجوی مطالب', en: 'Search Posts', ar: 'البحث في المقالات' },
    noPosts: { fa: 'مطلبی یافت نشد', en: 'No Posts Found', ar: 'لم يتم العثور على مقالات' },
    author: { fa: 'نویسنده', en: 'Author', ar: 'الكاتب' },
    publishedOn: { fa: 'تاریخ انتشار', en: 'Published On', ar: 'تاريخ النشر' },
    tags: { fa: 'برچسب‌ها', en: 'Tags', ar: 'الوسوم' }
  },
  careers: {
    title: { fa: 'فرصت‌های شغلی', en: 'Careers', ar: 'الوظائف' },
    openPositions: { fa: 'موقعیت‌های شغلی', en: 'Open Positions', ar: 'الوظائف المتاحة' },
    applyNow: { fa: 'درخواست همکاری', en: 'Apply Now', ar: 'قدم الآن' },
    jobDescription: { fa: 'شرح شغل', en: 'Job Description', ar: 'وصف الوظيفة' },
    requirements: { fa: 'نیازمندی‌ها', en: 'Requirements', ar: 'المتطلبات' },
    benefits: { fa: 'مزایا', en: 'Benefits', ar: 'المزايا' },
    location: { fa: 'محل کار', en: 'Location', ar: 'الموقع' },
    department: { fa: 'بخش', en: 'Department', ar: 'القسم' },
    employmentType: { fa: 'نوع استخدام', en: 'Employment Type', ar: 'نوع التوظيف' },
    noOpenings: { fa: 'موقعیتی موجود نیست', en: 'No Openings', ar: 'لا توجد وظائف شاغرة' }
  }
};

// Helper: Get all keys from nested object with dot notation
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Helper: Get value from nested object using dot notation
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : undefined, obj);
}

// Helper: Set value in nested object using dot notation
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

// Load translation files
function loadTranslations() {
  const translations = {};
  for (const [lang, filename] of Object.entries(CONFIG.files)) {
    const filePath = path.join(CONFIG.basePath, filename);
    try {
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
      
      console.log(`✅ Loaded ${filename}`);
    } catch (error) {
      console.error(`❌ Error loading ${filename}:`, error.message);
      process.exit(1);
    }
  }
  return translations;
}

// Find all missing keys across all files
function findMissingKeys(translations) {
  const allKeys = new Set();
  const missingByLang = { fa: [], en: [], ar: [] };
  
  // Collect all unique keys from all files
  for (const lang of Object.keys(translations)) {
    const keys = getAllKeys(translations[lang]);
    keys.forEach(key => allKeys.add(key));
  }
  
  // Find missing keys per language
  for (const lang of Object.keys(translations)) {
    const langKeys = new Set(getAllKeys(translations[lang]));
    for (const key of allKeys) {
      if (!langKeys.has(key)) {
        missingByLang[lang].push(key);
      }
    }
  }
  
  return { allKeys: Array.from(allKeys), missingByLang };
}

// Get translation for a key
function getTranslation(key, lang, translations) {
  // First check our predefined translations
  const parts = key.split('.');
  let current = TRANSLATIONS;
  for (const part of parts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }
  
  if (current && current[lang]) {
    return current[lang];
  }
  
  // Fallback: try to get from another language file
  for (const sourceLang of ['ar', 'en', 'fa']) {
    if (sourceLang === lang) continue;
    const value = getNestedValue(translations[sourceLang], key);
    if (value && typeof value === 'string') {
      console.log(`   ⚠️  Using ${sourceLang} value for ${lang}: ${key}`);
      return value;
    }
  }
  
  // Last resort: return key as placeholder
  console.log(`   ⚠️  No translation found, using key as placeholder: ${key}`);
  return `[${key}]`;
}

// Add missing keys to translations
function addMissingKeys(translations, missingByLang) {
  const changes = { fa: 0, en: 0, ar: 0 };
  
  for (const [lang, missingKeys] of Object.entries(missingByLang)) {
    for (const key of missingKeys) {
      const translation = getTranslation(key, lang, translations);
      setNestedValue(translations[lang], key, translation);
      changes[lang]++;
      console.log(`   ✅ Added to ${lang}: ${key} = "${translation}"`);
    }
  }
  
  return changes;
}

// Save translation files
function saveTranslations(translations) {
  for (const [lang, filename] of Object.entries(CONFIG.files)) {
    const filePath = path.join(CONFIG.basePath, filename);
    
    // For Arabic file, wrap content under "translation" key
    let contentToSave = translations[lang];
    if (filename === 'ar.json') {
      contentToSave = { translation: translations[lang] };
    }
    
    fs.writeFileSync(filePath, JSON.stringify(contentToSave, null, 2), 'utf8');
    console.log(`💾 Saved ${filename}`);
  }
}

// Validate final result
function validateResult(translations) {
  console.log('\n🔍 Validating final result...');
  
  const { missingByLang } = findMissingKeys(translations);
  let allValid = true;
  
  for (const [lang, missing] of Object.entries(missingByLang)) {
    if (missing.length > 0) {
      console.log(`❌ ${lang} still missing ${missing.length} keys:`);
      missing.slice(0, 5).forEach(k => console.log(`   - ${k}`));
      if (missing.length > 5) console.log(`   ... and ${missing.length - 5} more`);
      allValid = false;
    } else {
      console.log(`✅ ${lang}: All keys present`);
    }
  }
  
  return allValid;
}

// Main execution
function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        🔧 COMPREHENSIVE I18N TRANSLATION SYNC');
  console.log('='.repeat(70));
  
  // Step 1: Load files
  console.log('\n📂 Loading translation files...');
  const translations = loadTranslations();
  
  // Step 2: Find missing keys
  console.log('\n🔍 Analyzing missing keys...');
  const { allKeys, missingByLang } = findMissingKeys(translations);
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total unique keys: ${allKeys.length}`);
  console.log(`   Missing in fa.json: ${missingByLang.fa.length}`);
  console.log(`   Missing in en.json: ${missingByLang.en.length}`);
  console.log(`   Missing in ar.json: ${missingByLang.ar.length}`);
  
  // Step 3: Add missing keys
  if (missingByLang.fa.length + missingByLang.en.length + missingByLang.ar.length > 0) {
    console.log('\n📝 Adding missing keys...');
    const changes = addMissingKeys(translations, missingByLang);
    
    console.log(`\n📊 Changes made:`);
    console.log(`   fa.json: +${changes.fa} keys`);
    console.log(`   en.json: +${changes.en} keys`);
    console.log(`   ar.json: +${changes.ar} keys`);
    
    // Step 4: Save files
    console.log('\n💾 Saving updated files...');
    saveTranslations(translations);
  } else {
    console.log('\n✅ All files are already in sync!');
  }
  
  // Step 5: Validate
  const isValid = validateResult(translations);
  
  console.log('\n' + '='.repeat(70));
  if (isValid) {
    console.log('        ✅ SYNC COMPLETE - ALL TRANSLATIONS IN SYNC');
  } else {
    console.log('        ⚠️  SYNC COMPLETE WITH WARNINGS - REVIEW NEEDED');
  }
  console.log('='.repeat(70) + '\n');
}

main();