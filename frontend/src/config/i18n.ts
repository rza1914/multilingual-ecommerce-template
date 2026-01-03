/**
 * i18n Configuration
 * 
 * This module initializes i18next for React applications with proper
 * support for nested translation keys using dot notation.
 * 
 * ARCHITECTURE DECISION (2026-01-03):
 * We use i18next's native nested key support instead of custom flattening.
 * The previous flattenTranslations function was causing ~370 missing keys
 * by incorrectly processing deeply nested objects.
 * 
 * @see ARCHITECTURE_DECISION.md for full context
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly
// i18next handles nested structure natively - no flattening needed
import enTranslations from '../data/en.json';
import arTranslations from '../data/ar.json';
import faTranslations from '../data/fa.json';

/**
 * Supported languages configuration
 */
const SUPPORTED_LANGUAGES = ['en', 'fa', 'ar'] as const;
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Default language for the application
 */
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * i18next configuration options
 * 
 * Key settings for nested key support:
 * - keySeparator: '.' enables t('auth.validation.required') syntax
 * - returnObjects: true allows accessing full translation objects
 * - returnEmptyString: false returns key name for missing translations
 */
const i18nConfig = {
  // Language settings
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  load: 'languageOnly',
  
  // Resources - pass nested JSON directly without flattening
  resources: {
    en: {
      translation: enTranslations
    },
    fa: {
      translation: faTranslations
    },
    ar: {
      translation: arTranslations
    }
  },
  
  // Namespace configuration
  defaultNS: 'translation',
  ns: ['translation'],
  
  // Key separator for nested access: t('auth.validation.required')
  keySeparator: '.',
  
  // Namespace separator for multi-namespace: t('common:buttons.save')
  nsSeparator: ':',
  
  // Return the key path for missing translations (helpful for debugging)
  returnEmptyString: false,
  
  // Allow t() to return objects for accessing nested translation groups
  returnObjects: true,
  
  // Interpolation settings
  interpolation: {
    // React already escapes values, no need for double escaping
    escapeValue: false,
    
    // Format for interpolated values
    formatSeparator: ','
  },
  
  // React-specific settings
  react: {
    // Use Suspense for async loading (set to false if not using Suspense)
    useSuspense: false,
    
    // Bind i18n store to trigger re-renders on language change
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    
    // Trans component settings
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span']
  },
  
  // Detection settings (if using LanguageDetector)
  detection: {
    // Order of language detection
    order: ['localStorage', 'navigator', 'htmlTag'],
    
    // Cache user language preference
    caches: ['localStorage'],
    
    // localStorage key for language preference
    lookupLocalStorage: 'i18nextLng'
  },
  
  // Debug mode - enable in development for missing key warnings
  debug: import.meta.env.DEV,
  
  // Missing key handling
  saveMissing: false, // Don't save missing keys automatically
  missingKeyHandler: (lng, ns, key) => {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing translation key: ${lng}:${ns}:${key}`);
    }
  }
};

/**
 * Initialize i18next with React integration
 * 
 * The initialization chain:
 * 1. LanguageDetector - detects user's preferred language
 * 2. initReactI18next - integrates with React's context system
 * 3. init() - applies our configuration
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig);

// Update HTML dir and lang attributes when language changes
i18n.on('languageChanged', (lng) => {
  // Extract the base language code (strip region part)
  const langCode = lng.split('-')[0].split('_')[0];
  const dir = langCode === 'ar' || langCode === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
  localStorage.setItem('language', lng);
});

// Set initial direction based on current language
const currentLangCode = i18n.language.split('-')[0];
const initialDir = currentLangCode === 'ar' || currentLangCode === 'fa' ? 'rtl' : 'ltr';
document.documentElement.dir = initialDir;
document.documentElement.lang = i18n.language;

/**
 * Helper function to change language programmatically
 * @param lang - Language code to switch to
 */
export const changeLanguage = async (lang: SupportedLanguage): Promise<void> => {
  await i18n.changeLanguage(lang);
  
  // Update document direction for RTL languages
  document.documentElement.dir = lang === 'ar' || lang === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

/**
 * Get current active language
 */
export const getCurrentLanguage = (): string => {
  return i18n.language || DEFAULT_LANGUAGE;
};

/**
 * Check if a translation key exists
 * Useful for conditional rendering based on translation availability
 * 
 * @param key - Translation key to check (e.g., 'auth.validation.required')
 */
export const translationExists = (key: string): boolean => {
  return i18n.exists(key);
};

/**
 * Get all keys under a namespace path (for debugging)
 * 
 * @param path - Namespace path (e.g., 'auth.validation')
 */
export const getTranslationKeys = (path: string): string[] => {
  const obj = i18n.t(path, { returnObjects: true });
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj);
  }
  return [];
};

export default i18n;