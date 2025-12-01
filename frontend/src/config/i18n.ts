import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../data/en.json';
import ar from '../data/ar.json';
import fa from '../data/fa.json';

// Flatten the translation structure to merge 'translation' namespace with main keys
function flattenTranslations(obj: any, prefix: string = ''): any {
  const result: any = {};

  // Handle null or non-object inputs
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return result;
  }

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (key === 'translation') {
        // If it's the 'translation' key, merge its content directly without prefix
        Object.assign(result, flattenTranslations(value, ''));
      } else {
        // Otherwise, continue nesting with the prefixed key path
        Object.assign(result, flattenTranslations(value, prefix ? `${prefix}${key}.` : `${key}.`));
      }
    } else {
      // It's a terminal value, add it to result with the full path as key
      const fullKey = prefix ? `${prefix}${key}` : key;
      result[fullKey] = value;
    }
  }

  return result;
};

const enFlattened = flattenTranslations(en);
const arFlattened = flattenTranslations(ar);
const faFlattened = flattenTranslations(fa);

const resources = {
  en: { translation: enFlattened },
  ar: { translation: arFlattened },
  fa: { translation: faFlattened },
};

console.log('I18N CONFIG: Resources loaded into config:', resources);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fa', 'ar'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    debug: true,  // Enable detailed i18n debug logging
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      convertDetectedLanguage: (lng: string) => lng.split('-')[0].split('_')[0].toLowerCase(),
    },
    // Ensure that when keys are missing, fallbacks are used instead of raw keys
    returnNull: false,
    returnEmptyString: false,
    saveMissing: false,
    // Proper fallback settings to handle missing keys gracefully
    fallbackNS: ['translation'],
    ns: ['translation'],
  });

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

export default i18n;
