/**
 * Add Missing Translations - Batch 1
 * Sections: admin (81 keys) + checkout (64 keys)
 * 
 * Run: node scripts/add-translations-batch1.mjs
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
  admin: {
    actions: {
      fa: 'عملیات',
      en: 'Actions',
      ar: 'الإجراءات'
    },
    activeCheckbox: {
      fa: 'فعال',
      en: 'Active',
      ar: 'نشط'
    },
    addFirstProduct: {
      fa: 'اولین محصول را اضافه کنید',
      en: 'Add your first product',
      ar: 'أضف منتجك الأول'
    },
    addProduct: {
      fa: 'افزودن محصول',
      en: 'Add Product',
      ar: 'إضافة منتج'
    },
    allOrders: {
      fa: 'همه سفارشات',
      en: 'All Orders',
      ar: 'جميع الطلبات'
    },
    categoryBeauty: {
      fa: 'زیبایی',
      en: 'Beauty',
      ar: 'الجمال'
    },
    categoryBooks: {
      fa: 'کتاب',
      en: 'Books',
      ar: 'الكتب'
    },
    categoryClothing: {
      fa: 'پوشاک',
      en: 'Clothing',
      ar: 'الملابس'
    },
    categoryElectronics: {
      fa: 'الکترونیک',
      en: 'Electronics',
      ar: 'الإلكترونيات'
    },
    categoryFood: {
      fa: 'غذا',
      en: 'Food',
      ar: 'الطعام'
    },
    categoryHome: {
      fa: 'خانه',
      en: 'Home',
      ar: 'المنزل'
    },
    categoryLabel: {
      fa: 'دسته‌بندی',
      en: 'Category',
      ar: 'الفئة'
    },
    categorySports: {
      fa: 'ورزشی',
      en: 'Sports',
      ar: 'الرياضة'
    },
    categoryToys: {
      fa: 'اسباب‌بازی',
      en: 'Toys',
      ar: 'الألعاب'
    },
    clearButton: {
      fa: 'پاک کردن',
      en: 'Clear',
      ar: 'مسح'
    },
    createButton: {
      fa: 'ایجاد',
      en: 'Create',
      ar: 'إنشاء'
    },
    createProduct: {
      fa: 'ایجاد محصول',
      en: 'Create Product',
      ar: 'إنشاء منتج'
    },
    customer: {
      fa: 'مشتری',
      en: 'Customer',
      ar: 'العميل'
    },
    customerLabel: {
      fa: 'مشتری',
      en: 'Customer',
      ar: 'العميل'
    },
    date: {
      fa: 'تاریخ',
      en: 'Date',
      ar: 'التاريخ'
    },
    deleteOrder: {
      fa: 'حذف سفارش',
      en: 'Delete Order',
      ar: 'حذف الطلب'
    },
    deleteOrderError: {
      fa: 'خطا در حذف سفارش',
      en: 'Error deleting order',
      ar: 'خطأ في حذف الطلب'
    },
    deleteProductError: {
      fa: 'خطا در حذف محصول',
      en: 'Error deleting product',
      ar: 'خطأ في حذف المنتج'
    },
    discountPriceLabel: {
      fa: 'قیمت با تخفیف',
      en: 'Discount Price',
      ar: 'سعر الخصم'
    },
    editProduct: {
      fa: 'ویرایش محصول',
      en: 'Edit Product',
      ar: 'تعديل المنتج'
    },
    failedToLoad: {
      fa: 'خطا در بارگذاری',
      en: 'Failed to load',
      ar: 'فشل في التحميل'
    },
    featuredCheckbox: {
      fa: 'ویژه',
      en: 'Featured',
      ar: 'مميز'
    },
    imageURLLabel: {
      fa: 'آدرس تصویر',
      en: 'Image URL',
      ar: 'رابط الصورة'
    },
    imageURLPlaceholder: {
      fa: 'آدرس تصویر را وارد کنید',
      en: 'Enter image URL',
      ar: 'أدخل رابط الصورة'
    },
    items: {
      fa: 'آیتم',
      en: 'items',
      ar: 'عناصر'
    },
    last7Days: {
      fa: '۷ روز گذشته',
      en: 'Last 7 days',
      ar: 'آخر 7 أيام'
    },
    loadingDashboard: {
      fa: 'در حال بارگذاری داشبورد...',
      en: 'Loading dashboard...',
      ar: 'جاري تحميل لوحة التحكم...'
    },
    loadingOrders: {
      fa: 'در حال بارگذاری سفارشات...',
      en: 'Loading orders...',
      ar: 'جاري تحميل الطلبات...'
    },
    loadingProducts: {
      fa: 'در حال بارگذاری محصولات...',
      en: 'Loading products...',
      ar: 'جاري تحميل المنتجات...'
    },
    manageOrders: {
      fa: 'مدیریت سفارشات',
      en: 'Manage Orders',
      ar: 'إدارة الطلبات'
    },
    manageOrdersDesc: {
      fa: 'مشاهده و مدیریت سفارشات مشتریان',
      en: 'View and manage customer orders',
      ar: 'عرض وإدارة طلبات العملاء'
    },
    manageProducts: {
      fa: 'مدیریت محصولات',
      en: 'Manage Products',
      ar: 'إدارة المنتجات'
    },
    manageProductsDesc: {
      fa: 'افزودن، ویرایش و حذف محصولات',
      en: 'Add, edit and delete products',
      ar: 'إضافة وتعديل وحذف المنتجات'
    },
    newStatus: {
      fa: 'وضعیت جدید',
      en: 'New Status',
      ar: 'الحالة الجديدة'
    },
    noOrdersFound: {
      fa: 'سفارشی یافت نشد',
      en: 'No orders found',
      ar: 'لم يتم العثور على طلبات'
    },
    noOrdersPlaced: {
      fa: 'هنوز سفارشی ثبت نشده',
      en: 'No orders placed yet',
      ar: 'لم يتم تقديم أي طلبات بعد'
    },
    noOrdersYet: {
      fa: 'هنوز سفارشی وجود ندارد',
      en: 'No orders yet',
      ar: 'لا توجد طلبات بعد'
    },
    noProductsFound: {
      fa: 'محصولی یافت نشد',
      en: 'No products found',
      ar: 'لم يتم العثور على منتجات'
    },
    noRevenueData: {
      fa: 'داده درآمدی موجود نیست',
      en: 'No revenue data available',
      ar: 'لا تتوفر بيانات الإيرادات'
    },
    orderID: {
      fa: 'شناسه سفارش',
      en: 'Order ID',
      ar: 'رقم الطلب'
    },
    orderLabel: {
      fa: 'سفارش',
      en: 'Order',
      ar: 'الطلب'
    },
    orderManagement: {
      fa: 'مدیریت سفارشات',
      en: 'Order Management',
      ar: 'إدارة الطلبات'
    },
    orderManagementDesc: {
      fa: 'پیگیری و مدیریت سفارشات',
      en: 'Track and manage orders',
      ar: 'تتبع وإدارة الطلبات'
    },
    ordersByStatus: {
      fa: 'سفارشات بر اساس وضعیت',
      en: 'Orders by Status',
      ar: 'الطلبات حسب الحالة'
    },
    priceLabel: {
      fa: 'قیمت',
      en: 'Price',
      ar: 'السعر'
    },
    productDescLabel: {
      fa: 'توضیحات محصول',
      en: 'Product Description',
      ar: 'وصف المنتج'
    },
    productDescPlaceholder: {
      fa: 'توضیحات محصول را وارد کنید',
      en: 'Enter product description',
      ar: 'أدخل وصف المنتج'
    },
    productManagement: {
      fa: 'مدیریت محصولات',
      en: 'Product Management',
      ar: 'إدارة المنتجات'
    },
    productManagementDesc: {
      fa: 'مدیریت کاتالوگ محصولات',
      en: 'Manage product catalog',
      ar: 'إدارة كتالوج المنتجات'
    },
    productTitleLabel: {
      fa: 'عنوان محصول',
      en: 'Product Title',
      ar: 'عنوان المنتج'
    },
    productTitlePlaceholder: {
      fa: 'عنوان محصول را وارد کنید',
      en: 'Enter product title',
      ar: 'أدخل عنوان المنتج'
    },
    recentOrders: {
      fa: 'سفارشات اخیر',
      en: 'Recent Orders',
      ar: 'الطلبات الأخيرة'
    },
    retry: {
      fa: 'تلاش مجدد',
      en: 'Retry',
      ar: 'إعادة المحاولة'
    },
    revenueOverview: {
      fa: 'نمای کلی درآمد',
      en: 'Revenue Overview',
      ar: 'نظرة عامة على الإيرادات'
    },
    saveProductError: {
      fa: 'خطا در ذخیره محصول',
      en: 'Error saving product',
      ar: 'خطأ في حفظ المنتج'
    },
    saving: {
      fa: 'در حال ذخیره...',
      en: 'Saving...',
      ar: 'جاري الحفظ...'
    },
    searchButton: {
      fa: 'جستجو',
      en: 'Search',
      ar: 'بحث'
    },
    searchProductsPlaceholder: {
      fa: 'جستجوی محصولات...',
      en: 'Search products...',
      ar: 'البحث عن منتجات...'
    },
    selectCategory: {
      fa: 'انتخاب دسته‌بندی',
      en: 'Select Category',
      ar: 'اختر الفئة'
    },
    status: {
      fa: 'وضعیت',
      en: 'Status',
      ar: 'الحالة'
    },
    tagsLabel: {
      fa: 'برچسب‌ها',
      en: 'Tags',
      ar: 'الوسوم'
    },
    tagsPlaceholder: {
      fa: 'برچسب‌ها را با کاما جدا کنید',
      en: 'Separate tags with commas',
      ar: 'افصل الوسوم بفواصل'
    },
    total: {
      fa: 'مجموع',
      en: 'Total',
      ar: 'المجموع'
    },
    totalOrders: {
      fa: 'کل سفارشات',
      en: 'Total Orders',
      ar: 'إجمالي الطلبات'
    },
    totalProducts: {
      fa: 'کل محصولات',
      en: 'Total Products',
      ar: 'إجمالي المنتجات'
    },
    totalRevenue: {
      fa: 'کل درآمد',
      en: 'Total Revenue',
      ar: 'إجمالي الإيرادات'
    },
    totalUsers: {
      fa: 'کل کاربران',
      en: 'Total Users',
      ar: 'إجمالي المستخدمين'
    },
    tryDifferentSearch: {
      fa: 'عبارت دیگری را جستجو کنید',
      en: 'Try a different search term',
      ar: 'جرب مصطلح بحث مختلف'
    },
    updateButton: {
      fa: 'به‌روزرسانی',
      en: 'Update',
      ar: 'تحديث'
    },
    updateOrderStatus: {
      fa: 'به‌روزرسانی وضعیت سفارش',
      en: 'Update Order Status',
      ar: 'تحديث حالة الطلب'
    },
    updateStatus: {
      fa: 'به‌روزرسانی وضعیت',
      en: 'Update Status',
      ar: 'تحديث الحالة'
    },
    updateStatusError: {
      fa: 'خطا در به‌روزرسانی وضعیت',
      en: 'Error updating status',
      ar: 'خطأ في تحديث الحالة'
    },
    updating: {
      fa: 'در حال به‌روزرسانی...',
      en: 'Updating...',
      ar: 'جاري التحديث...'
    },
    viewAll: {
      fa: 'مشاهده همه',
      en: 'View All',
      ar: 'عرض الكل'
    },
    viewDetails: {
      fa: 'مشاهده جزئیات',
      en: 'View Details',
      ar: 'عرض التفاصيل'
    },
    welcomeMessage: {
      fa: 'به پنل مدیریت خوش آمدید',
      en: 'Welcome to Admin Panel',
      ar: 'مرحباً بك في لوحة الإدارة'
    }
  },
  checkout: {
    acceptTermsAlert: {
      fa: 'لطفاً شرایط و قوانین را بپذیرید',
      en: 'Please accept the terms and conditions',
      ar: 'يرجى قبول الشروط والأحكام'
    },
    addressPlaceholder: {
      fa: 'آدرس خود را وارد کنید',
      en: 'Enter your address',
      ar: 'أدخل عنوانك'
    },
    addressRequired: {
      fa: 'آدرس الزامی است',
      en: 'Address is required',
      ar: 'العنوان مطلوب'
    },
    agreeToTerms: {
      fa: 'با شرایط و قوانین موافقم',
      en: 'I agree to the terms and conditions',
      ar: 'أوافق على الشروط والأحكام'
    },
    and: {
      fa: 'و',
      en: 'and',
      ar: 'و'
    },
    backToCart: {
      fa: 'بازگشت به سبد خرید',
      en: 'Back to Cart',
      ar: 'العودة إلى السلة'
    },
    browseProducts: {
      fa: 'مشاهده محصولات',
      en: 'Browse Products',
      ar: 'تصفح المنتجات'
    },
    cardDetails: {
      fa: 'اطلاعات کارت',
      en: 'Card Details',
      ar: 'تفاصيل البطاقة'
    },
    cardNumber: {
      fa: 'شماره کارت',
      en: 'Card Number',
      ar: 'رقم البطاقة'
    },
    cardNumberPlaceholder: {
      fa: 'شماره کارت را وارد کنید',
      en: 'Enter card number',
      ar: 'أدخل رقم البطاقة'
    },
    cardholderName: {
      fa: 'نام دارنده کارت',
      en: 'Cardholder Name',
      ar: 'اسم حامل البطاقة'
    },
    cardholderNamePlaceholder: {
      fa: 'نام روی کارت',
      en: 'Name on card',
      ar: 'الاسم على البطاقة'
    },
    cashOnDelivery: {
      fa: 'پرداخت در محل',
      en: 'Cash on Delivery',
      ar: 'الدفع عند الاستلام'
    },
    changeMethod: {
      fa: 'تغییر روش',
      en: 'Change Method',
      ar: 'تغيير الطريقة'
    },
    changePayment: {
      fa: 'تغییر روش پرداخت',
      en: 'Change Payment',
      ar: 'تغيير الدفع'
    },
    choosePaymentMethod: {
      fa: 'روش پرداخت را انتخاب کنید',
      en: 'Choose payment method',
      ar: 'اختر طريقة الدفع'
    },
    chooseShippingMethod: {
      fa: 'روش ارسال را انتخاب کنید',
      en: 'Choose shipping method',
      ar: 'اختر طريقة الشحن'
    },
    cityPlaceholder: {
      fa: 'شهر خود را وارد کنید',
      en: 'Enter your city',
      ar: 'أدخل مدينتك'
    },
    cityRequired: {
      fa: 'شهر الزامی است',
      en: 'City is required',
      ar: 'المدينة مطلوبة'
    },
    codDescription: {
      fa: 'پرداخت هنگام تحویل سفارش',
      en: 'Pay when you receive your order',
      ar: 'ادفع عند استلام طلبك'
    },
    codTitle: {
      fa: 'پرداخت در محل',
      en: 'Cash on Delivery',
      ar: 'الدفع عند الاستلام'
    },
    continue: {
      fa: 'ادامه',
      en: 'Continue',
      ar: 'متابعة'
    },
    'countries.au': {
      fa: 'استرالیا',
      en: 'Australia',
      ar: 'أستراليا'
    },
    'countries.ca': {
      fa: 'کانادا',
      en: 'Canada',
      ar: 'كندا'
    },
    'countries.uk': {
      fa: 'انگلستان',
      en: 'United Kingdom',
      ar: 'المملكة المتحدة'
    },
    'countries.us': {
      fa: 'ایالات متحده',
      en: 'United States',
      ar: 'الولايات المتحدة'
    },
    creditDebitCard: {
      fa: 'کارت اعتباری/بانکی',
      en: 'Credit/Debit Card',
      ar: 'بطاقة ائتمان/خصم'
    },
    cvv: {
      fa: 'CVV',
      en: 'CVV',
      ar: 'CVV'
    },
    cvvPlaceholder: {
      fa: 'کد CVV',
      en: 'CVV code',
      ar: 'رمز CVV'
    },
    editAddress: {
      fa: 'ویرایش آدرس',
      en: 'Edit Address',
      ar: 'تعديل العنوان'
    },
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
    emptyCartMessage: {
      fa: 'سبد خرید شما خالی است',
      en: 'Your cart is empty',
      ar: 'سلة التسوق فارغة'
    },
    emptyCartTitle: {
      fa: 'سبد خرید خالی',
      en: 'Empty Cart',
      ar: 'السلة فارغة'
    },
    expiryDate: {
      fa: 'تاریخ انقضا',
      en: 'Expiry Date',
      ar: 'تاريخ الانتهاء'
    },
    expiryDatePlaceholder: {
      fa: 'MM/YY',
      en: 'MM/YY',
      ar: 'MM/YY'
    },
    expressShipping: {
      fa: 'ارسال سریع',
      en: 'Express Shipping',
      ar: 'الشحن السريع'
    },
    expressShippingDays: {
      fa: '۲-۳ روز کاری',
      en: '2-3 business days',
      ar: '2-3 أيام عمل'
    },
    fullNamePlaceholder: {
      fa: 'نام کامل خود را وارد کنید',
      en: 'Enter your full name',
      ar: 'أدخل اسمك الكامل'
    },
    fullNameRequired: {
      fa: 'نام کامل الزامی است',
      en: 'Full name is required',
      ar: 'الاسم الكامل مطلوب'
    },
    nextDayDelivery: {
      fa: 'تحویل روز بعد',
      en: 'Next Day Delivery',
      ar: 'التوصيل في اليوم التالي'
    },
    nextDayDeliveryDesc: {
      fa: 'تحویل در روز کاری بعدی',
      en: 'Delivery on next business day',
      ar: 'التوصيل في يوم العمل التالي'
    },
    orderErrorMessage: {
      fa: 'خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.',
      en: 'Error placing order. Please try again.',
      ar: 'خطأ في تقديم الطلب. يرجى المحاولة مرة أخرى.'
    },
    orderItems: {
      fa: 'اقلام سفارش',
      en: 'Order Items',
      ar: 'عناصر الطلب'
    },
    payInCash: {
      fa: 'پرداخت نقدی',
      en: 'Pay in Cash',
      ar: 'الدفع نقداً'
    },
    phonePlaceholder: {
      fa: 'شماره تلفن خود را وارد کنید',
      en: 'Enter your phone number',
      ar: 'أدخل رقم هاتفك'
    },
    phoneRequired: {
      fa: 'شماره تلفن الزامی است',
      en: 'Phone number is required',
      ar: 'رقم الهاتف مطلوب'
    },
    placingOrder: {
      fa: 'در حال ثبت سفارش...',
      en: 'Placing order...',
      ar: 'جاري تقديم الطلب...'
    },
    previous: {
      fa: 'قبلی',
      en: 'Previous',
      ar: 'السابق'
    },
    privacyPolicy: {
      fa: 'سیاست حریم خصوصی',
      en: 'Privacy Policy',
      ar: 'سياسة الخصوصية'
    },
    quantity: {
      fa: 'تعداد',
      en: 'Quantity',
      ar: 'الكمية'
    },
    required: {
      fa: 'الزامی',
      en: 'Required',
      ar: 'مطلوب'
    },
    reviewOrder: {
      fa: 'بررسی سفارش',
      en: 'Review Order',
      ar: 'مراجعة الطلب'
    },
    reviewOrderMessage: {
      fa: 'لطفاً سفارش خود را قبل از تأیید بررسی کنید',
      en: 'Please review your order before confirming',
      ar: 'يرجى مراجعة طلبك قبل التأكيد'
    },
    saveAddress: {
      fa: 'ذخیره آدرس',
      en: 'Save Address',
      ar: 'حفظ العنوان'
    },
    securePaymentInfo: {
      fa: 'پرداخت امن با رمزنگاری SSL',
      en: 'Secure payment with SSL encryption',
      ar: 'دفع آمن بتشفير SSL'
    },
    standardShipping: {
      fa: 'ارسال معمولی',
      en: 'Standard Shipping',
      ar: 'الشحن العادي'
    },
    standardShippingDays: {
      fa: '۵-۷ روز کاری',
      en: '5-7 business days',
      ar: '5-7 أيام عمل'
    },
    statePlaceholder: {
      fa: 'استان خود را وارد کنید',
      en: 'Enter your state',
      ar: 'أدخل ولايتك'
    },
    stateRequired: {
      fa: 'استان الزامی است',
      en: 'State is required',
      ar: 'الولاية مطلوبة'
    },
    termsAndConditions: {
      fa: 'شرایط و قوانین',
      en: 'Terms and Conditions',
      ar: 'الشروط والأحكام'
    },
    zipPlaceholder: {
      fa: 'کد پستی خود را وارد کنید',
      en: 'Enter your ZIP code',
      ar: 'أدخل الرمز البريدي'
    },
    zipRequired: {
      fa: 'کد پستی الزامی است',
      en: 'ZIP code is required',
      ar: 'الرمز البريدي مطلوب'
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
    const fullPath = key.includes('.') ? `${section}.${key}` : `${section}.${key}`;
    const pathParts = fullPath.split('.');
    
    // Check if key already exists
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
  console.log('        📝 ADDING TRANSLATIONS - BATCH 1');
  console.log('        Sections: admin (81 keys) + checkout (64 keys)');
  console.log('='.repeat(70));
  
  const results = { fa: 0, en: 0, ar: 0 };
  
  for (const [lang, filePath] of Object.entries(CONFIG.files)) {
    console.log(`\n📂 Processing ${lang}.json...`);
    
    // Load existing translations
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
    
    // Add translations for each section
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
  console.log('        📊 BATCH 1 SUMMARY');
  console.log('='.repeat(70));
  console.log(`\n   fa.json: +${results.fa} keys`);
  console.log(`   en.json: +${results.en} keys`);
  console.log(`   ar.json: +${results.ar} keys`);
  console.log('\n   ✅ Batch 1 complete!');
  console.log('='.repeat(70) + '\n');
}

main();