/**
 * TypeScript declarations for i18n translation keys
 * 
 * This file provides type safety for translation keys used with useTranslation hook.
 * It enables autocomplete and compile-time validation of translation keys.
 * 
 * Usage:
 * ```typescript
 * const { t } = useTranslation();
 * t('auth.login.title'); // TypeScript will validate this key exists
 * ```
 * 
 * To regenerate types from fa.json, consider using:
 * - i18next-typescript or
 * - Custom script to extract keys from JSON
 */

import 'i18next';

// Import the translation JSON to extract its type
import faTranslations from '../data/fa.json';

/**
 * Utility type to extract all possible dot-notation keys from a nested object
 * 
 * Example:
 * { auth: { login: 'x' } } => 'auth' | 'auth.login'
 */
type RecursiveKeyOf<TObj extends Record<string, unknown>> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, unknown>
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & string];

/**
 * All valid translation keys derived from fa.json structure
 */
export type TranslationKeys = RecursiveKeyOf<typeof faTranslations>;

/**
 * Extend i18next module with our custom types
 * This enables type checking for t() function calls
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    // Default namespace
    defaultNS: 'translation';
    
    // Resources type - matches our fa.json structure
    resources: {
      translation: typeof faTranslations;
    };
  }
}

/**
 * Type-safe translation function signature
 * Can be used for custom hooks or utilities
 */
export type TypedTFunction = (
  key: TranslationKeys,
  options?: Record<string, unknown>
) => string;

/**
 * Language codes supported by the application
 */
export type SupportedLanguage = 'fa' | 'en' | 'ar';

/**
 * Translation namespace type
 */
export type TranslationNamespace = 'translation';