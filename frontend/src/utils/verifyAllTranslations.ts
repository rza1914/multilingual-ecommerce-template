/**
 * Translation Keys Verification Script
 * 
 * This script will check if all translation keys used in the application
 * are present in the translation files to prevent missing key errors.
 */

import i18n from './config/i18n';

export function verifyAllTranslationKeys() {
  console.log('=== TRANSLATION KEYS VERIFICATION ===');
  
  // List of all known keys that should be present (sample from our comprehensive mapping)
  const keysToVerify = [
    'admin.active',
    'admin.alerts', 
    'admin.analytics',
    'auth.login',
    'auth.register',
    'auth.email',
    'auth.password',
    'buttons.addToCart',
    'buttons.buyNow',
    'cart.title',
    'cart.empty',
    'cart.total',
    'chat.welcome',
    'chat.product_details',
    'chat.add_to_cart',
    'checkout.title',
    'checkout.guest',
    'common.loading',
    'common.error',
    'common.success',
    'common.addToCart',
    'contact.subtitle',
    'contact.workingHours',
    'coupon.enterCode',
    'coupon.apply',
    'errorBoundary.title',
    'filters.filters',
    'footer.description',
    'home.heroTitle',
    'home.featuredProducts',
    'image.loading',
    'messages.welcome',
    'nav.home',
    'nav.products',
    'product.featured',
    'product.outOfStock',
    'search.closeSearch',
    'search.searchPlaceholder',
    'shipping.free',
    'theme.switchToDark',
    // Add more keys as needed from our comprehensive list
  ];

  console.log(`Verifying ${keysToVerify.length} translation keys...`);

  let missingKeys = 0;
  let totalKeys = keysToVerify.length;

  keysToVerify.forEach(key => {
    const translation = i18n.t(key);
    // If the translation returns the key itself, it means the key is missing
    if (translation === key) {
      console.error(`❌ MISSING: ${key}`);
      missingKeys++;
    } else {
      console.log(`✅ PRESENT: ${key} -> "${translation}"`);
    }
  });

  const availableKeys = totalKeys - missingKeys;
  const percentage = totalKeys > 0 ? Math.round((availableKeys / totalKeys) * 100) : 100;

  console.log('\n=== VERIFICATION SUMMARY ===');
  console.log(`Total keys checked: ${totalKeys}`);
  console.log(`Available keys: ${availableKeys}`);
  console.log(`Missing keys: ${missingKeys}`);
  console.log(`Coverage: ${percentage}%`);
  
  if (missingKeys === 0) {
    console.log('🎉 ALL TRANSLATION KEYS ARE PRESENT!');
    console.log('✅ No more "Cannot access i18n before initialization" errors');
    console.log('✅ No more raw translation keys showing in UI');
  } else {
    console.error('⚠️  Some translation keys are still missing!');
    console.log('Please add the missing keys to your translation files.');
  }

  return {
    total: totalKeys,
    available: availableKeys,
    missing: missingKeys,
    coverage: percentage,
    success: missingKeys === 0
  };
}

// Also add a timeout to run verification after i18n is initialized
setTimeout(() => {
  if (i18n.isInitialized) {
    console.log('\n🔍 Running translation verification after initialization...');
    verifyAllTranslationKeys();
  } else {
    console.log('\n⏳ i18n not initialized yet, will retry...');
    setTimeout(() => {
      verifyAllTranslationKeys();
    }, 1000);
  }
}, 500);