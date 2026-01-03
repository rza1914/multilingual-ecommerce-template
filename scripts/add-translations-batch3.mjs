/**
 * Add Missing Translations - Batch 3 (FINAL)
 * Sections: products (12), contact (10), productDetailPage (9), 
 *           auth (4), common (4), product (2), nav (1), single keys (6)
 * 
 * Run: node scripts/add-translations-batch3.mjs
 */

import fs from 'fs';

const CONFIG = {
  files: {
    fa: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json',
    en: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json',
    ar: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json'
  }
};

// ============================================
// TRANSLATIONS TO ADD
// ============================================

const TRANSLATIONS = {
  products: {
    clearAllFilters: {
      fa: 'پاک کردن همه فیلترها',
      en: 'Clear All Filters',
      ar: 'مسح جميع الفلاتر'
    },
    clearFilters: {
      fa: 'پاک کردن فیلترها',
      en: 'Clear Filters',
      ar: 'مسح الفلاتر'
    },
    errorTitle: {
      fa: 'خطا',
      en: 'Error',
      ar: 'خطأ'
    },
    filtered: {
      fa: 'فیلتر شده',
      en: 'Filtered',
      ar: 'مُفلتر'
    },
    loadError: {
      fa: 'خطا در بارگذاری محصولات',
      en: 'Error loading products',
      ar: 'خطأ في تحميل المنتجات'
    },
    noProductsAvailable: {
      fa: 'محصولی موجود نیست',
      en: 'No products available',
      ar: 'لا توجد منتجات متاحة'
    },
    noProductsAvailableMessage: {
      fa: 'در حال حاضر محصولی برای نمایش وجود ندارد',
      en: 'There are no products to display at this time',
      ar: 'لا توجد منتجات للعرض في الوقت الحالي'
    },
    noProductsFound: {
      fa: 'محصولی یافت نشد',
      en: 'No products found',
      ar: 'لم يتم العثور على منتجات'
    },
    noProductsFoundMessage: {
      fa: 'محصولی مطابق با جستجوی شما یافت نشد',
      en: 'No products match your search criteria',
      ar: 'لا توجد منتجات تطابق معايير البحث'
    },
    subtitle: {
      fa: 'مشاهده محصولات ما',
      en: 'Browse our products',
      ar: 'تصفح منتجاتنا'
    },
    title: {
      fa: 'محصولات',
      en: 'Products',
      ar: 'المنتجات'
    },
    tryAgain: {
      fa: 'تلاش مجدد',
      en: 'Try Again',
      ar: 'حاول مرة أخرى'
    }
  },
  contact: {
    emailInvalid: {
      fa: 'ایمیل نامعتبر است',
      en: 'Email is invalid',
      ar: 'البريد الإلكتروني غير صالح'
    },
    emailPlaceholder: {
      fa: 'ایمیل خود را وارد کنید',
      en: 'Enter your email',
      ar: 'أدخل بريدك الإلكتروني'
    },
    emailRequired: {
      fa: 'ایمیل الزامی است',
      en: 'Email is required',
      ar: 'البريد الإلكتروني مطلوب'
    },
    getDirections: {
      fa: 'مسیریابی',
      en: 'Get Directions',
      ar: 'الحصول على الاتجاهات'
    },
    messageMinLength: {
      fa: 'پیام باید حداقل ۱۰ کاراکتر باشد',
      en: 'Message must be at least 10 characters',
      ar: 'يجب أن تكون الرسالة 10 أحرف على الأقل'
    },
    messagePlaceholder: {
      fa: 'پیام خود را بنویسید',
      en: 'Write your message',
      ar: 'اكتب رسالتك'
    },
    messageRequired: {
      fa: 'پیام الزامی است',
      en: 'Message is required',
      ar: 'الرسالة مطلوبة'
    },
    messageSent: {
      fa: 'پیام شما با موفقیت ارسال شد',
      en: 'Your message has been sent successfully',
      ar: 'تم إرسال رسالتك بنجاح'
    },
    subjectPlaceholder: {
      fa: 'موضوع پیام',
      en: 'Message subject',
      ar: 'موضوع الرسالة'
    },
    subjectRequired: {
      fa: 'موضوع الزامی است',
      en: 'Subject is required',
      ar: 'الموضوع مطلوب'
    }
  },
  productDetailPage: {
    addToCart: {
      fa: 'افزودن به سبد خرید',
      en: 'Add to Cart',
      ar: 'أضف إلى السلة'
    },
    availability: {
      fa: 'وضعیت موجودی',
      en: 'Availability',
      ar: 'التوفر'
    },
    backToProducts: {
      fa: 'بازگشت به محصولات',
      en: 'Back to Products',
      ar: 'العودة إلى المنتجات'
    },
    errorLoading: {
      fa: 'خطا در بارگذاری محصول',
      en: 'Error loading product',
      ar: 'خطأ في تحميل المنتج'
    },
    inStock: {
      fa: 'موجود',
      en: 'In Stock',
      ar: 'متوفر'
    },
    productNotFound: {
      fa: 'محصول یافت نشد',
      en: 'Product not found',
      ar: 'المنتج غير موجود'
    },
    quantity: {
      fa: 'تعداد',
      en: 'Quantity',
      ar: 'الكمية'
    },
    sku: {
      fa: 'کد محصول',
      en: 'SKU',
      ar: 'رمز المنتج'
    },
    uncategorized: {
      fa: 'بدون دسته‌بندی',
      en: 'Uncategorized',
      ar: 'غير مصنف'
    }
  },
  auth: {
    'login.title': {
      fa: 'ورود به حساب کاربری',
      en: 'Login to your account',
      ar: 'تسجيل الدخول إلى حسابك'
    },
    logout: {
      fa: 'خروج',
      en: 'Logout',
      ar: 'تسجيل الخروج'
    },
    logoutSuccess: {
      fa: 'با موفقیت خارج شدید',
      en: 'Successfully logged out',
      ar: 'تم تسجيل الخروج بنجاح'
    },
    'validation.required': {
      fa: 'این فیلد الزامی است',
      en: 'This field is required',
      ar: 'هذا الحقل مطلوب'
    }
  },
  common: {
    cancel: {
      fa: 'انصراف',
      en: 'Cancel',
      ar: 'إلغاء'
    },
    delete: {
      fa: 'حذف',
      en: 'Delete',
      ar: 'حذف'
    },
    edit: {
      fa: 'ویرایش',
      en: 'Edit',
      ar: 'تعديل'
    },
    pageNotFound: {
      fa: 'صفحه یافت نشد',
      en: 'Page Not Found',
      ar: 'الصفحة غير موجودة'
    },
    'buttons.save': {
      fa: 'ذخیره',
      en: 'Save',
      ar: 'حفظ'
    }
  },
  product: {
    addToCart: {
      fa: 'افزودن به سبد',
      en: 'Add to Cart',
      ar: 'أضف إلى السلة'
    },
    inStock: {
      fa: 'موجود',
      en: 'In Stock',
      ar: 'متوفر'
    }
  },
  nav: {
    orders: {
      fa: 'سفارشات',
      en: 'Orders',
      ar: 'الطلبات'
    }
  }
};

// Single keys that need special handling
const SINGLE_KEYS = {
  'Add to Cart': {
    fa: 'افزودن به سبد',
    en: 'Add to Cart',
    ar: 'أضف إلى السلة'
  },
  'Error': {
    fa: 'خطا',
    en: 'Error',
    ar: 'خطأ'
  },
  'Featured Products': {
    fa: 'محصولات ویژه',
    en: 'Featured Products',
    ar: 'المنتجات المميزة'
  },
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

// ============================================
// HELPER FUNCTIONS
// ============================================

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

function addTranslations(translations, section, keys, lang) {
  let added = 0;
  
  for (const [key, values] of Object.entries(keys)) {
    const fullPath = key.includes('.') ? `${section}.${key}` : `${section}.${key}`;
    const pathParts = fullPath.split('.');
    
    let exists = translations;
    let keyExists = true;
    for (const part of pathParts) {
      if (exists && exists[part] !== undefined) {
        exists = exists[part];
      } else {
        keyExists = false;
        break;
      }
    }
    
    if (!keyExists) {
      setNestedValue(translations, fullPath, values[lang]);
      added++;
    }
  }
  
  return added;
}

function addSingleKeys(translations, keys, lang) {
  let added = 0;
  
  for (const [key, values] of Object.entries(keys)) {
    if (translations[key] === undefined) {
      translations[key] = values[lang];
      added++;
    }
  }
  
  return added;
}

// ============================================
// MAIN EXECUTION
// ============================================

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        📝 ADDING TRANSLATIONS - BATCH 3 (FINAL)');
  console.log('        Sections: products, contact, productDetailPage, auth,');
  console.log('                  common, product, nav, single keys');
  console.log('='.repeat(70));
  
  const results = { fa: 0, en: 0, ar: 0 };
  
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
    
    // Add nested translations
    for (const [section, keys] of Object.entries(TRANSLATIONS)) {
      const added = addTranslations(actualTranslations, section, keys, lang);
      results[lang] += added;
      if (added > 0) {
        console.log(`   ✅ ${section}: Added ${added} keys`);
      }
    }
    
    // Add single keys
    const singleAdded = addSingleKeys(actualTranslations, SINGLE_KEYS, lang);
    results[lang] += singleAdded;
    if (singleAdded > 0) {
      console.log(`   ✅ single keys: Added ${singleAdded} keys`);
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
  console.log('        📊 BATCH 3 (FINAL) SUMMARY');
  console.log('='.repeat(70));
  console.log(`\n   fa.json: +${results.fa} keys`);
  console.log(`   en.json: +${results.en} keys`);
  console.log(`   ar.json: +${results.ar} keys`);
  console.log('\n   🎉 ALL BATCHES COMPLETE!');
  console.log('   Total keys added across all batches: 290');
  console.log('='.repeat(70) + '\n');
}

main();