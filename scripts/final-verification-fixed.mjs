/**
 * Final Verification Script - FIXED
 * Confirms all 290 missing keys have been added
 * 
 * Run: node scripts/final-verification-fixed.mjs
 */

import fs from 'fs';

const CONFIG = {
  files: {
    fa: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json',
    en: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json',
    ar: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json'
  }
};

// All 290 keys that should now exist
const ALL_REQUIRED_KEYS = [
  // Admin (81)
  'admin.actions', 'admin.activeCheckbox', 'admin.addFirstProduct', 'admin.addProduct',
  'admin.allOrders', 'admin.categoryBeauty', 'admin.categoryBooks', 'admin.categoryClothing',
  'admin.categoryElectronics', 'admin.categoryFood', 'admin.categoryHome', 'admin.categoryLabel',
  'admin.categorySports', 'admin.categoryToys', 'admin.clearButton', 'admin.createButton',
  'admin.createProduct', 'admin.customer', 'admin.customerLabel', 'admin.date',
  'admin.deleteOrder', 'admin.deleteOrderError', 'admin.deleteProductError', 'admin.discountPriceLabel',
  'admin.editProduct', 'admin.failedToLoad', 'admin.featuredCheckbox', 'admin.imageURLLabel',
  'admin.imageURLPlaceholder', 'admin.items', 'admin.last7Days', 'admin.loadingDashboard',
  'admin.loadingOrders', 'admin.loadingProducts', 'admin.manageOrders', 'admin.manageOrdersDesc',
  'admin.manageProducts', 'admin.manageProductsDesc', 'admin.newStatus', 'admin.noOrdersFound',
  'admin.noOrdersPlaced', 'admin.noOrdersYet', 'admin.noProductsFound', 'admin.noRevenueData',
  'admin.orderID', 'admin.orderLabel', 'admin.orderManagement', 'admin.orderManagementDesc',
  'admin.ordersByStatus', 'admin.priceLabel', 'admin.productDescLabel', 'admin.productDescPlaceholder',
  'admin.productManagement', 'admin.productManagementDesc', 'admin.productTitleLabel',
  'admin.productTitlePlaceholder', 'admin.recentOrders', 'admin.retry', 'admin.revenueOverview',
  'admin.saveProductError', 'admin.saving', 'admin.searchButton', 'admin.searchProductsPlaceholder',
  'admin.selectCategory', 'admin.status', 'admin.tagsLabel', 'admin.tagsPlaceholder',
  'admin.total', 'admin.totalOrders', 'admin.totalProducts', 'admin.totalRevenue',
  'admin.totalUsers', 'admin.tryDifferentSearch', 'admin.updateButton', 'admin.updateOrderStatus',
  'admin.updateStatus', 'admin.updateStatusError', 'admin.updating', 'admin.viewAll',
  'admin.viewDetails', 'admin.welcomeMessage',
  
  // Checkout (64)
  'checkout.acceptTermsAlert', 'checkout.addressPlaceholder', 'checkout.addressRequired',
  'checkout.agreeToTerms', 'checkout.and', 'checkout.backToCart', 'checkout.browseProducts',
  'checkout.cardDetails', 'checkout.cardNumber', 'checkout.cardNumberPlaceholder',
  'checkout.cardholderName', 'checkout.cardholderNamePlaceholder', 'checkout.cashOnDelivery',
  'checkout.changeMethod', 'checkout.changePayment', 'checkout.choosePaymentMethod',
  'checkout.chooseShippingMethod', 'checkout.cityPlaceholder', 'checkout.cityRequired',
  'checkout.codDescription', 'checkout.codTitle', 'checkout.continue',
  'checkout.countries.au', 'checkout.countries.ca', 'checkout.countries.uk', 'checkout.countries.us',
  'checkout.creditDebitCard', 'checkout.cvv', 'checkout.cvvPlaceholder', 'checkout.editAddress',
  'checkout.emailInvalid', 'checkout.emailPlaceholder', 'checkout.emailRequired',
  'checkout.emptyCartMessage', 'checkout.emptyCartTitle', 'checkout.expiryDate',
  'checkout.expiryDatePlaceholder', 'checkout.expressShipping', 'checkout.expressShippingDays',
  'checkout.fullNamePlaceholder', 'checkout.fullNameRequired', 'checkout.nextDayDelivery',
  'checkout.nextDayDeliveryDesc', 'checkout.orderErrorMessage', 'checkout.orderItems',
  'checkout.payInCash', 'checkout.phonePlaceholder', 'checkout.phoneRequired',
  'checkout.placingOrder', 'checkout.previous', 'checkout.privacyPolicy', 'checkout.quantity',
  'checkout.required', 'checkout.reviewOrder', 'checkout.reviewOrderMessage', 'checkout.saveAddress',
  'checkout.securePaymentInfo', 'checkout.standardShipping', 'checkout.standardShippingDays',
  'checkout.statePlaceholder', 'checkout.stateRequired', 'checkout.termsAndConditions',
  'checkout.zipPlaceholder', 'checkout.zipRequired',
  
  // Order (59)
  'order.allOrders', 'order.backToOrders', 'order.cancelFailed', 'order.cancelOrder',
  'order.cancelOrderConfirm', 'order.cancelOrderMessage', 'order.cancelled', 'order.cancelling',
  'order.cashOnDelivery', 'order.confirmed', 'order.continueShopping', 'order.creditDebitCard',
  'order.date', 'order.delivered', 'order.deliveryMethod', 'order.discount', 'order.each',
  'order.emailConfirmation', 'order.expressShipping', 'order.goHome', 'order.items',
  'order.keepOrder', 'order.loadingDetails', 'order.loadingOrders', 'order.myOrders',
  'order.nextDayDelivery', 'order.noOrdersYet', 'order.noOrdersYetMessage', 'order.notFound',
  'order.notFoundMessage', 'order.notFoundTitle', 'order.orderCancelled', 'order.orderCancelledMessage',
  'order.orderConfirmed', 'order.orderDetails', 'order.orderItems', 'order.orderNumber',
  'order.orderNumberLabel', 'order.orderStatus', 'order.orderSummary', 'order.paymentMethod',
  'order.pending', 'order.placedOn', 'order.processing', 'order.quantity', 'order.receivedMessage',
  'order.shipped', 'order.shipping', 'order.shippingAddress', 'order.standardShipping',
  'order.startShopping', 'order.subtotal', 'order.tax', 'order.thankYou', 'order.total',
  'order.trackAndManage', 'order.viewAllOrders', 'order.viewDetails', 'order.yesCancel',
  
  // Profile (38)
  'profile.cancel', 'profile.cannotBeChanged', 'profile.change', 'profile.changePassword',
  'profile.changePasswordError', 'profile.changePasswordHint', 'profile.confirmNewPassword',
  'profile.currentPassword', 'profile.delivered', 'profile.edit', 'profile.emailAddress',
  'profile.fillAllPasswordFields', 'profile.fullName', 'profile.goHome', 'profile.joined',
  'profile.loadingProfile', 'profile.newPassword', 'profile.notFound', 'profile.notSet',
  'profile.orderStatistics', 'profile.passwordChanged', 'profile.passwordMinLength',
  'profile.passwordsDoNotMatch', 'profile.pending', 'profile.personalInfo', 'profile.phoneNumber',
  'profile.phonePlaceholder', 'profile.profileUpdated', 'profile.save', 'profile.saving',
  'profile.subtitle', 'profile.title', 'profile.totalOrders', 'profile.totalSpent',
  'profile.updatePassword', 'profile.updateProfileError', 'profile.user', 'profile.viewAllOrders',
  
  // Products (12)
  'products.clearAllFilters', 'products.clearFilters', 'products.errorTitle', 'products.filtered',
  'products.loadError', 'products.noProductsAvailable', 'products.noProductsAvailableMessage',
  'products.noProductsFound', 'products.noProductsFoundMessage', 'products.subtitle',
  'products.title', 'products.tryAgain',
  
  // Contact (10)
  'contact.emailInvalid', 'contact.emailPlaceholder', 'contact.emailRequired',
  'contact.getDirections', 'contact.messageMinLength', 'contact.messagePlaceholder',
  'contact.messageRequired', 'contact.messageSent', 'contact.subjectPlaceholder',
  'contact.subjectRequired',
  
  // ProductDetailPage (9)
  'productDetailPage.addToCart', 'productDetailPage.availability', 'productDetailPage.backToProducts',
  'productDetailPage.errorLoading', 'productDetailPage.inStock', 'productDetailPage.productNotFound',
  'productDetailPage.quantity', 'productDetailPage.sku', 'productDetailPage.uncategorized',
  
  // Auth (4)
  'auth.login.title', 'auth.logout', 'auth.logoutSuccess', 'auth.validation.required',
  
  // Common (4 + 1)
  'common.cancel', 'common.delete', 'common.edit', 'common.pageNotFound', 'common.buttons.save',
  
  // Product (2)
  'product.addToCart', 'product.inStock',
  
  // Nav (1)
  'nav.orders'
];

// Single keys that are at the root level
const SINGLE_KEYS = [
  'Add to Cart', 'Error', 'Featured Products', 'Loading products...', 'No description available.'
];

function getNestedValue(obj, path) {
  // If the path doesn't contain dots, it's a root-level key
  if (!path.includes('.')) {
    return obj[path];
  }
  
  // Otherwise, it's a nested key
  return path.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : undefined, obj);
}

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        🔍 FINAL VERIFICATION - ALL 290 KEYS (FIXED)');
  console.log('='.repeat(70));
  
  let allPassed = true;
  
  for (const [lang, filePath] of Object.entries(CONFIG.files)) {
    console.log(`\n📂 Checking ${lang}.json...`);
    
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
    
    const missing = [];
    
    // Check nested keys
    for (const key of ALL_REQUIRED_KEYS) {
      const value = getNestedValue(actualTranslations, key);
      if (value === undefined) {
        missing.push(key);
      }
    }
    
    // Check single keys
    for (const key of SINGLE_KEYS) {
      const value = actualTranslations[key];
      if (value === undefined) {
        missing.push(key);
      }
    }
    
    if (missing.length === 0) {
      console.log(`   ✅ All ${ALL_REQUIRED_KEYS.length + SINGLE_KEYS.length} keys present!`);
    } else {
      console.log(`   ❌ Missing ${missing.length} keys:`);
      missing.forEach(k => console.log(`      - ${k}`));
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(70));
  if (allPassed) {
    console.log('        🎉 VERIFICATION PASSED - ALL TRANSLATIONS COMPLETE!');
    console.log('        ');
    console.log('        ✅ 290 keys verified in fa.json');
    console.log('        ✅ 290 keys verified in en.json');
    console.log('        ✅ 290 keys verified in ar.json');
  } else {
    console.log('        ⚠️  VERIFICATION FAILED - Some keys still missing');
  }
  console.log('='.repeat(70) + '\n');
}

main();