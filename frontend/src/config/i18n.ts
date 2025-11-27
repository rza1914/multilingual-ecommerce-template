import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../data/en.json';
import ar from '../data/ar.json';
import fa from '../data/fa.json';

// Flatten the translation structure to merge 'translation' namespace with main keys
const flattenTranslations = (obj: any, prefix = ''): any => {
  let result: any = {};

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      if (key === 'translation') {
        // If it's the 'translation' key, merge its content directly
        Object.assign(result, flattenTranslations(obj[key]));
      } else {
        // Otherwise, continue nesting
        Object.assign(result, flattenTranslations(obj[key], `${prefix}${key}.`));
      }
    } else {
      result[`${prefix}${key}`] = obj[key];
    }
  }

  return result;
};

const resources = {
  en: { translation: flattenTranslations(en) },
  ar: { translation: flattenTranslations(ar) },
  fa: { translation: flattenTranslations(fa) },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('language') || 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Update HTML dir and lang attributes when language changes
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' || lng === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
  localStorage.setItem('language', lng);
});

// Set initial direction
const currentLang = i18n.language;
const initialDir = currentLang === 'ar' || currentLang === 'fa' ? 'rtl' : 'ltr';
document.documentElement.dir = initialDir;
document.documentElement.lang = currentLang;

export default i18n;
