import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../data/en.json';
import ar from '../data/ar.json';
import fa from '../data/fa.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  fa: { translation: fa },
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
