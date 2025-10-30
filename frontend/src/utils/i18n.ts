import i18n from '../config/i18n';

export interface ProductTranslations {
  title_en?: string;
  title_ar?: string;
  title_fa?: string;
  description_en?: string;
  description_ar?: string;
  description_fa?: string;
}

/**
 * Get localized product title based on current language
 */
export const getLocalizedTitle = (product: ProductTranslations, fallback = ''): string => {
  const lang = i18n.language || 'en';
  
  switch (lang) {
    case 'ar':
      return product.title_ar || product.title_en || fallback;
    case 'fa':
      return product.title_fa || product.title_en || fallback;
    default:
      return product.title_en || fallback;
  }
};

/**
 * Get localized product description based on current language
 */
export const getLocalizedDescription = (product: ProductTranslations, fallback = ''): string => {
  const lang = i18n.language || 'en';
  
  switch (lang) {
    case 'ar':
      return product.description_ar || product.description_en || fallback;
    case 'fa':
      return product.description_fa || product.description_en || fallback;
    default:
      return product.description_en || fallback;
  }
};

/**
 * Format currency based on language
 */
export const formatCurrency = (amount: number): string => {
  const lang = i18n.language || 'en';
  
  switch (lang) {
    case 'ar':
      return `${amount.toFixed(2)} ر.س`; // Saudi Riyal
    case 'fa':
      return `${amount.toLocaleString('fa-IR')} تومان`; // Iranian Toman
    default:
      return `$${amount.toFixed(2)}`; // US Dollar
  }
};

/**
 * Format numbers based on language
 */
export const formatNumber = (num: number): string => {
  const lang = i18n.language || 'en';
  
  switch (lang) {
    case 'ar':
      return num.toLocaleString('ar-SA');
    case 'fa':
      return num.toLocaleString('fa-IR');
    default:
      return num.toLocaleString('en-US');
  }
};

/**
 * Check if current language is RTL
 */
export const isRTL = (): boolean => {
  const lang = i18n.language || 'en';
  return lang === 'ar' || lang === 'fa';
};
