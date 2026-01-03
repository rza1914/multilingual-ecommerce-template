/**
 * Add Missing Translations - Batch 2
 * Sections: order (59 keys) + profile (38 keys)
 * 
 * Run: node scripts/add-translations-batch2.mjs
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
  order: {
    allOrders: {
      fa: 'همه سفارشات',
      en: 'All Orders',
      ar: 'جميع الطلبات'
    },
    backToOrders: {
      fa: 'بازگشت به سفارشات',
      en: 'Back to Orders',
      ar: 'العودة إلى الطلبات'
    },
    cancelFailed: {
      fa: 'لغو سفارش ناموفق بود',
      en: 'Failed to cancel order',
      ar: 'فشل إلغاء الطلب'
    },
    cancelOrder: {
      fa: 'لغو سفارش',
      en: 'Cancel Order',
      ar: 'إلغاء الطلب'
    },
    cancelOrderConfirm: {
      fa: 'تأیید لغو سفارش',
      en: 'Confirm Cancel Order',
      ar: 'تأكيد إلغاء الطلب'
    },
    cancelOrderMessage: {
      fa: 'آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟',
      en: 'Are you sure you want to cancel this order?',
      ar: 'هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟'
    },
    cancelled: {
      fa: 'لغو شده',
      en: 'Cancelled',
      ar: 'ملغى'
    },
    cancelling: {
      fa: 'در حال لغو...',
      en: 'Cancelling...',
      ar: 'جاري الإلغاء...'
    },
    cashOnDelivery: {
      fa: 'پرداخت در محل',
      en: 'Cash on Delivery',
      ar: 'الدفع عند الاستلام'
    },
    confirmed: {
      fa: 'تأیید شده',
      en: 'Confirmed',
      ar: 'مؤكد'
    },
    continueShopping: {
      fa: 'ادامه خرید',
      en: 'Continue Shopping',
      ar: 'متابعة التسوق'
    },
    creditDebitCard: {
      fa: 'کارت اعتباری/بانکی',
      en: 'Credit/Debit Card',
      ar: 'بطاقة ائتمان/خصم'
    },
    date: {
      fa: 'تاریخ',
      en: 'Date',
      ar: 'التاريخ'
    },
    delivered: {
      fa: 'تحویل داده شده',
      en: 'Delivered',
      ar: 'تم التوصيل'
    },
    deliveryMethod: {
      fa: 'روش تحویل',
      en: 'Delivery Method',
      ar: 'طريقة التوصيل'
    },
    discount: {
      fa: 'تخفیف',
      en: 'Discount',
      ar: 'الخصم'
    },
    each: {
      fa: 'هر کدام',
      en: 'each',
      ar: 'لكل واحد'
    },
    emailConfirmation: {
      fa: 'تأییدیه به ایمیل شما ارسال شد',
      en: 'Confirmation email has been sent',
      ar: 'تم إرسال رسالة تأكيد بالبريد الإلكتروني'
    },
    expressShipping: {
      fa: 'ارسال سریع',
      en: 'Express Shipping',
      ar: 'الشحن السريع'
    },
    goHome: {
      fa: 'بازگشت به صفحه اصلی',
      en: 'Go Home',
      ar: 'العودة للصفحة الرئيسية'
    },
    items: {
      fa: 'آیتم',
      en: 'items',
      ar: 'عناصر'
    },
    keepOrder: {
      fa: 'نگه داشتن سفارش',
      en: 'Keep Order',
      ar: 'الاحتفاظ بالطلب'
    },
    loadingDetails: {
      fa: 'در حال بارگذاری جزئیات...',
      en: 'Loading details...',
      ar: 'جاري تحميل التفاصيل...'
    },
    loadingOrders: {
      fa: 'در حال بارگذاری سفارشات...',
      en: 'Loading orders...',
      ar: 'جاري تحميل الطلبات...'
    },
    myOrders: {
      fa: 'سفارشات من',
      en: 'My Orders',
      ar: 'طلباتي'
    },
    nextDayDelivery: {
      fa: 'تحویل روز بعد',
      en: 'Next Day Delivery',
      ar: 'التوصيل في اليوم التالي'
    },
    noOrdersYet: {
      fa: 'هنوز سفارشی ثبت نکرده‌اید',
      en: 'You have no orders yet',
      ar: 'ليس لديك طلبات بعد'
    },
    noOrdersYetMessage: {
      fa: 'وقتی خرید کنید، سفارشات شما اینجا نمایش داده می‌شوند',
      en: 'When you make a purchase, your orders will appear here',
      ar: 'عندما تقوم بالشراء، ستظهر طلباتك هنا'
    },
    notFound: {
      fa: 'سفارش یافت نشد',
      en: 'Order not found',
      ar: 'الطلب غير موجود'
    },
    notFoundMessage: {
      fa: 'سفارش مورد نظر یافت نشد',
      en: 'The order you are looking for was not found',
      ar: 'لم يتم العثور على الطلب الذي تبحث عنه'
    },
    notFoundTitle: {
      fa: 'سفارش یافت نشد',
      en: 'Order Not Found',
      ar: 'الطلب غير موجود'
    },
    orderCancelled: {
      fa: 'سفارش لغو شد',
      en: 'Order Cancelled',
      ar: 'تم إلغاء الطلب'
    },
    orderCancelledMessage: {
      fa: 'سفارش شما با موفقیت لغو شد',
      en: 'Your order has been successfully cancelled',
      ar: 'تم إلغاء طلبك بنجاح'
    },
    orderConfirmed: {
      fa: 'سفارش تأیید شد',
      en: 'Order Confirmed',
      ar: 'تم تأكيد الطلب'
    },
    orderDetails: {
      fa: 'جزئیات سفارش',
      en: 'Order Details',
      ar: 'تفاصيل الطلب'
    },
    orderItems: {
      fa: 'اقلام سفارش',
      en: 'Order Items',
      ar: 'عناصر الطلب'
    },
    orderNumber: {
      fa: 'شماره سفارش',
      en: 'Order Number',
      ar: 'رقم الطلب'
    },
    orderNumberLabel: {
      fa: 'شماره سفارش:',
      en: 'Order Number:',
      ar: 'رقم الطلب:'
    },
    orderStatus: {
      fa: 'وضعیت سفارش',
      en: 'Order Status',
      ar: 'حالة الطلب'
    },
    orderSummary: {
      fa: 'خلاصه سفارش',
      en: 'Order Summary',
      ar: 'ملخص الطلب'
    },
    paymentMethod: {
      fa: 'روش پرداخت',
      en: 'Payment Method',
      ar: 'طريقة الدفع'
    },
    pending: {
      fa: 'در انتظار',
      en: 'Pending',
      ar: 'قيد الانتظار'
    },
    placedOn: {
      fa: 'ثبت شده در',
      en: 'Placed on',
      ar: 'تم الطلب في'
    },
    processing: {
      fa: 'در حال پردازش',
      en: 'Processing',
      ar: 'قيد المعالجة'
    },
    quantity: {
      fa: 'تعداد',
      en: 'Quantity',
      ar: 'الكمية'
    },
    receivedMessage: {
      fa: 'سفارش شما دریافت شد',
      en: 'Your order has been received',
      ar: 'تم استلام طلبك'
    },
    shipped: {
      fa: 'ارسال شده',
      en: 'Shipped',
      ar: 'تم الشحن'
    },
    shipping: {
      fa: 'هزینه ارسال',
      en: 'Shipping',
      ar: 'الشحن'
    },
    shippingAddress: {
      fa: 'آدرس ارسال',
      en: 'Shipping Address',
      ar: 'عنوان الشحن'
    },
    standardShipping: {
      fa: 'ارسال معمولی',
      en: 'Standard Shipping',
      ar: 'الشحن العادي'
    },
    startShopping: {
      fa: 'شروع خرید',
      en: 'Start Shopping',
      ar: 'ابدأ التسوق'
    },
    subtotal: {
      fa: 'جمع جزئی',
      en: 'Subtotal',
      ar: 'المجموع الفرعي'
    },
    tax: {
      fa: 'مالیات',
      en: 'Tax',
      ar: 'الضريبة'
    },
    thankYou: {
      fa: 'با تشکر از خرید شما!',
      en: 'Thank you for your order!',
      ar: 'شكراً لطلبك!'
    },
    total: {
      fa: 'مجموع',
      en: 'Total',
      ar: 'المجموع'
    },
    trackAndManage: {
      fa: 'پیگیری و مدیریت سفارشات',
      en: 'Track and manage your orders',
      ar: 'تتبع وإدارة طلباتك'
    },
    viewAllOrders: {
      fa: 'مشاهده همه سفارشات',
      en: 'View All Orders',
      ar: 'عرض جميع الطلبات'
    },
    viewDetails: {
      fa: 'مشاهده جزئیات',
      en: 'View Details',
      ar: 'عرض التفاصيل'
    },
    yesCancel: {
      fa: 'بله، لغو کن',
      en: 'Yes, Cancel',
      ar: 'نعم، إلغاء'
    }
  },
  profile: {
    cancel: {
      fa: 'انصراف',
      en: 'Cancel',
      ar: 'إلغاء'
    },
    cannotBeChanged: {
      fa: 'قابل تغییر نیست',
      en: 'Cannot be changed',
      ar: 'لا يمكن تغييره'
    },
    change: {
      fa: 'تغییر',
      en: 'Change',
      ar: 'تغيير'
    },
    changePassword: {
      fa: 'تغییر رمز عبور',
      en: 'Change Password',
      ar: 'تغيير كلمة المرور'
    },
    changePasswordError: {
      fa: 'خطا در تغییر رمز عبور',
      en: 'Error changing password',
      ar: 'خطأ في تغيير كلمة المرور'
    },
    changePasswordHint: {
      fa: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
      en: 'Password must be at least 8 characters',
      ar: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل'
    },
    confirmNewPassword: {
      fa: 'تأیید رمز عبور جدید',
      en: 'Confirm New Password',
      ar: 'تأكيد كلمة المرور الجديدة'
    },
    currentPassword: {
      fa: 'رمز عبور فعلی',
      en: 'Current Password',
      ar: 'كلمة المرور الحالية'
    },
    delivered: {
      fa: 'تحویل داده شده',
      en: 'Delivered',
      ar: 'تم التوصيل'
    },
    edit: {
      fa: 'ویرایش',
      en: 'Edit',
      ar: 'تعديل'
    },
    emailAddress: {
      fa: 'آدرس ایمیل',
      en: 'Email Address',
      ar: 'عنوان البريد الإلكتروني'
    },
    fillAllPasswordFields: {
      fa: 'لطفاً همه فیلدهای رمز عبور را پر کنید',
      en: 'Please fill all password fields',
      ar: 'يرجى ملء جميع حقول كلمة المرور'
    },
    fullName: {
      fa: 'نام کامل',
      en: 'Full Name',
      ar: 'الاسم الكامل'
    },
    goHome: {
      fa: 'بازگشت به صفحه اصلی',
      en: 'Go Home',
      ar: 'العودة للصفحة الرئيسية'
    },
    joined: {
      fa: 'تاریخ عضویت',
      en: 'Joined',
      ar: 'تاريخ الانضمام'
    },
    loadingProfile: {
      fa: 'در حال بارگذاری پروفایل...',
      en: 'Loading profile...',
      ar: 'جاري تحميل الملف الشخصي...'
    },
    newPassword: {
      fa: 'رمز عبور جدید',
      en: 'New Password',
      ar: 'كلمة المرور الجديدة'
    },
    notFound: {
      fa: 'پروفایل یافت نشد',
      en: 'Profile not found',
      ar: 'الملف الشخصي غير موجود'
    },
    notSet: {
      fa: 'تنظیم نشده',
      en: 'Not set',
      ar: 'غير محدد'
    },
    orderStatistics: {
      fa: 'آمار سفارشات',
      en: 'Order Statistics',
      ar: 'إحصائيات الطلبات'
    },
    passwordChanged: {
      fa: 'رمز عبور با موفقیت تغییر کرد',
      en: 'Password changed successfully',
      ar: 'تم تغيير كلمة المرور بنجاح'
    },
    passwordMinLength: {
      fa: 'رمز عبور باید حداقل ۸ کاراکتر باشد',
      en: 'Password must be at least 8 characters',
      ar: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل'
    },
    passwordsDoNotMatch: {
      fa: 'رمزهای عبور مطابقت ندارند',
      en: 'Passwords do not match',
      ar: 'كلمات المرور غير متطابقة'
    },
    pending: {
      fa: 'در انتظار',
      en: 'Pending',
      ar: 'قيد الانتظار'
    },
    personalInfo: {
      fa: 'اطلاعات شخصی',
      en: 'Personal Information',
      ar: 'المعلومات الشخصية'
    },
    phoneNumber: {
      fa: 'شماره تلفن',
      en: 'Phone Number',
      ar: 'رقم الهاتف'
    },
    phonePlaceholder: {
      fa: 'شماره تلفن خود را وارد کنید',
      en: 'Enter your phone number',
      ar: 'أدخل رقم هاتفك'
    },
    profileUpdated: {
      fa: 'پروفایل با موفقیت به‌روزرسانی شد',
      en: 'Profile updated successfully',
      ar: 'تم تحديث الملف الشخصي بنجاح'
    },
    save: {
      fa: 'ذخیره',
      en: 'Save',
      ar: 'حفظ'
    },
    saving: {
      fa: 'در حال ذخیره...',
      en: 'Saving...',
      ar: 'جاري الحفظ...'
    },
    subtitle: {
      fa: 'مدیریت اطلاعات حساب کاربری',
      en: 'Manage your account information',
      ar: 'إدارة معلومات حسابك'
    },
    title: {
      fa: 'پروفایل کاربری',
      en: 'User Profile',
      ar: 'الملف الشخصي'
    },
    totalOrders: {
      fa: 'کل سفارشات',
      en: 'Total Orders',
      ar: 'إجمالي الطلبات'
    },
    totalSpent: {
      fa: 'مجموع خرید',
      en: 'Total Spent',
      ar: 'إجمالي الإنفاق'
    },
    updatePassword: {
      fa: 'به‌روزرسانی رمز عبور',
      en: 'Update Password',
      ar: 'تحديث كلمة المرور'
    },
    updateProfileError: {
      fa: 'خطا در به‌روزرسانی پروفایل',
      en: 'Error updating profile',
      ar: 'خطأ في تحديث الملف الشخصي'
    },
    user: {
      fa: 'کاربر',
      en: 'User',
      ar: 'المستخدم'
    },
    viewAllOrders: {
      fa: 'مشاهده همه سفارشات',
      en: 'View All Orders',
      ar: 'عرض جميع الطلبات'
    }
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
    const fullPath = `${section}.${key}`;
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

// ============================================
// MAIN EXECUTION
// ============================================

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        📝 ADDING TRANSLATIONS - BATCH 2');
  console.log('        Sections: order (59 keys) + profile (38 keys)');
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
    
    for (const [section, keys] of Object.entries(TRANSLATIONS)) {
      const added = addTranslations(actualTranslations, section, keys, lang);
      results[lang] += added;
      if (added > 0) {
        console.log(`   ✅ ${section}: Added ${added} keys`);
      }
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
  console.log('        📊 BATCH 2 SUMMARY');
  console.log('='.repeat(70));
  console.log(`\n   fa.json: +${results.fa} keys`);
  console.log(`   en.json: +${results.en} keys`);
  console.log(`   ar.json: +${results.ar} keys`);
  console.log('\n   ✅ Batch 2 complete!');
  console.log('='.repeat(70) + '\n');
}

main();