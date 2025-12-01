import i18n from '../config/i18n';

/**
 * Verify that translation keys are properly loaded
 */
export const verifyTranslationKeys = () => {
  console.log('=== TRANSLATION KEY AUDIT ===');
  console.log('Loaded languages:', i18n.languages);
  console.log('Current language:', i18n.language);
  
  // Test the problematic key
  const testKey = 'search.closeSearch';
  console.log('Test missing key:', i18n.t(testKey));
  console.log('Key exists?:', i18n.exists(testKey));
  
  // Check if resource bundles are loaded
  console.log('en.json content (first 2 keys):', {
    home: i18n.getResourceBundle('en', 'translation')?.home || 'Not found',
    search: i18n.getResourceBundle('en', 'translation')?.search || 'Not found'
  });
  
  console.log('fa.json content (first 2 keys):', {
    home: i18n.getResourceBundle('fa', 'translation')?.home || 'Not found',
    search: i18n.getResourceBundle('fa', 'translation')?.search || 'Not found'
  });
  
  // Test a few other keys
  console.log('Other test keys:');
  console.log('search.searchPlaceholder (en):', i18n.t('search.searchPlaceholder'));
  console.log('nav.home (en):', i18n.t('nav.home'));
  console.log('common.loading (en):', i18n.t('common.loading'));
  
  console.log('=== TRANSLATION VERIFICATION COMPLETE ===');
};

// Run verification after initialization
i18n.on('initialized', () => {
  setTimeout(verifyTranslationKeys, 100); // Delay to ensure all resources are loaded
});