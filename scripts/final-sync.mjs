/**
 * Final Comprehensive i18n Translation Sync Script
 * 
 * This script ensures ALL required keys are present in all translation files
 * by using the component requirements as the source of truth.
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
    secureCheckout: { fa: 'پرداخت امن', en: 'Secure Checkout', ar: 'الدفع الآمن' },
    guest: { fa: 'میهمان', en: 'Guest', ar: 'زائر' },
    free: { fa: 'رایگان', en: 'Free', ar: 'مجاناً' },
    steps: {
      shipping: { fa: 'ارسال', en: 'Shipping', ar: 'الشحن' },
      delivery: { fa: 'تحویل', en: 'Delivery', ar: 'التوصيل' },
      payment: { fa: 'پرداخت', en: 'Payment', ar: 'الدفع' },
      review: { fa: 'بررسی', en: 'Review', ar: 'المراجعة' }
    }
  },
  blog: {
    title: { fa: 'وبلاگ', en: 'Blog', ar: 'المدونة' },
    subtitle: { fa: 'زیرنویس', en: 'Subtitle', ar: 'العنوان الفرعي' },
    post1_title: { fa: 'عنوان پست 1', en: 'Post 1 Title', ar: 'عنوان المقالة 1' },
    post1_excerpt: { fa: 'چکیده پست 1', en: 'Post 1 Excerpt', ar: 'مقدمة المقالة 1' },
    post2_title: { fa: 'عنوان پست 2', en: 'Post 2 Title', ar: 'عنوان المقالة 2' },
    post2_excerpt: { fa: 'چکیده پست 2', en: 'Post 2 Excerpt', ar: 'مقدمة المقالة 2' },
    post3_title: { fa: 'عنوان پست 3', en: 'Post 3 Title', ar: 'عنوان المقالة 3' },
    post3_excerpt: { fa: 'چکیده پست 3', en: 'Post 3 Excerpt', ar: 'مقدمة المقالة 3' },
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
    subtitle: { fa: 'زیرنویس', en: 'Subtitle', ar: 'العنوان الفرعي' },
    whyJoinUs: { fa: 'چرا به ما بپیوندید', en: 'Why Join Us', ar: 'لماذا تنضم إلينا' },
    content: { fa: 'محتوا', en: 'Content', ar: 'المحتوى' },
    collaborative: { fa: 'همکاری', en: 'Collaborative', ar: 'التعاون' },
    collaborative_desc: { fa: 'توضیحات همکاری', en: 'Collaborative Description', ar: 'وصف التعاون' },
    growth: { fa: 'رشد', en: 'Growth', ar: 'النمو' },
    growth_desc: { fa: 'توضیحات رشد', en: 'Growth Description', ar: 'وصف النمو' },
    benefits: { fa: 'مزایا', en: 'Benefits', ar: 'المزايا' },
    benefits_desc: { fa: 'توضیحات مزایا', en: 'Benefits Description', ar: 'وصف المزايا' },
    openPositions: { fa: 'موقعیت‌های شغلی', en: 'Open Positions', ar: 'الوظائف المتاحة' },
    applyNow: { fa: 'درخواست همکاری', en: 'Apply Now', ar: 'قدم الآن' },
    jobDescription: { fa: 'شرح شغل', en: 'Job Description', ar: 'وصف الوظيفة' },
    requirements: { fa: 'نیازمندی‌ها', en: 'Requirements', ar: 'المتطلبات' },
    location: { fa: 'محل کار', en: 'Location', ar: 'الموقع' },
    department: { fa: 'بخش', en: 'Department', ar: 'القسم' },
    employmentType: { fa: 'نوع استخدام', en: 'Employment Type', ar: 'نوع التوظيف' },
    noOpenings: { fa: 'موقعیتی موجود نیست', en: 'No Openings', ar: 'لا توجد وظائف شاغرة' }
  }
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

// Add missing keys based on component requirements
function addMissingKeysFromComponents(translations) {
  let changes = { fa: 0, en: 0, ar: 0 };
  
  // Go through each component's required keys
  for (const [component, requiredKeys] of Object.entries(COMPONENT_REQUIRED_KEYS)) {
    for (const key of requiredKeys) {
      for (const lang of ['fa', 'en', 'ar']) {
        if (getNestedValue(translations[lang], key) === undefined) {
          // Try to get translation from our predefined mappings
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
          
          let translation = `[${key}]`; // Default fallback
          if (current && current[lang]) {
            translation = current[lang];
          } else {
            // Try to get from another language as fallback
            for (const sourceLang of ['ar', 'en', 'fa']) {
              if (sourceLang === lang) continue;
              const value = getNestedValue(translations[sourceLang], key);
              if (value && typeof value === 'string') {
                translation = value;
                break;
              }
            }
          }
          
          setNestedValue(translations[lang], key, translation);
          changes[lang]++;
          console.log(`   ✅ Added to ${lang}: ${key} = "${translation}"`);
        }
      }
    }
  }
  
  return changes;
}

// Validate final result
function validateResult(translations) {
  console.log('\n🔍 Validating final result...');
  
  let allValid = true;
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
        allValid = false;
      } else {
        console.log(`   ✅ ${lang}: All keys present`);
      }
    }
  }
  
  console.log(`\n📊 Total issues: ${totalIssues}`);
  return allValid;
}

// Main execution
function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        🔧 FINAL COMPREHENSIVE I18N TRANSLATION SYNC');
  console.log('='.repeat(70));
  
  // Step 1: Load files
  console.log('\n📂 Loading translation files...');
  const translations = loadTranslations();
  
  // Step 2: Add missing keys based on component requirements
  console.log('\n🔍 Adding missing keys based on component requirements...');
  const changes = addMissingKeysFromComponents(translations);
  
  console.log(`\n📊 Changes made:`);
  console.log(`   fa.json: +${changes.fa} keys`);
  console.log(`   en.json: +${changes.en} keys`);
  console.log(`   ar.json: +${changes.ar} keys`);
  
  // Step 3: Save files
  console.log('\n💾 Saving updated files...');
  saveTranslations(translations);
  
  // Step 4: Validate
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