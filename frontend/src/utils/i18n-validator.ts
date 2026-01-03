/**
 * i18n Validation Utilities
 * 
 * Development-time utilities for validating translation usage and detecting
 * missing keys before they cause runtime issues.
 * 
 * These functions are intended for development and testing only.
 * They should not be used in production code paths.
 */

import i18n from '../config/i18n';

/**
 * Recursively extract all keys from a nested object using dot notation
 * 
 * @param obj - Object to extract keys from
 * @param prefix - Current key prefix for recursion
 * @returns Array of all dot-notation keys
 * 
 * @example
 * extractAllKeys({ a: { b: 'x', c: 'y' } })
 * // Returns: ['a.b', 'a.c']
 */
export const extractAllKeys = (
  obj: Record<string, unknown>,
  prefix = ''
): string[] => {
  const keys: string[] = [];
  
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      // Leaf node - this is a translation string
      keys.push(fullKey);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Nested object - recurse
      keys.push(...extractAllKeys(value as Record<string, unknown>, fullKey));
    }
    // Skip arrays and null values
  }
  
  return keys;
};

/**
 * Validate that all keys used in code exist in translations
 * 
 * @param usedKeys - Array of translation keys used in components
 * @returns Object with valid keys, missing keys, and validation status
 * 
 * @example
 * validateTranslationKeys(['auth.login', 'auth.nonexistent'])
 * // Returns: { valid: ['auth.login'], missing: ['auth.nonexistent'], isValid: false }
 */
export const validateTranslationKeys = (
  usedKeys: string[]
): {
  valid: string[];
  missing: string[];
  isValid: boolean;
} => {
  const valid: string[] = [];
  const missing: string[] = [];
  
  for (const key of usedKeys) {
    if (i18n.exists(key)) {
      valid.push(key);
    } else {
      missing.push(key);
    }
  }
  
  return {
    valid,
    missing,
    isValid: missing.length === 0
  };
};

/**
 * Get translation coverage statistics
 * 
 * @param translationObj - The translation object (e.g., imported from fa.json)
 * @returns Statistics about the translation file
 */
export const getTranslationStats = (
  translationObj: Record<string, unknown>
): {
  totalKeys: number;
  maxDepth: number;
  keysByDepth: Record<number, number>;
} => {
  const allKeys = extractAllKeys(translationObj);
  const keysByDepth: Record<number, number> = {};
  let maxDepth = 0;
  
  for (const key of allKeys) {
    const depth = key.split('.').length;
    maxDepth = Math.max(maxDepth, depth);
    keysByDepth[depth] = (keysByDepth[depth] || 0) + 1;
  }
  
  return {
    totalKeys: allKeys.length,
    maxDepth,
    keysByDepth
  };
};

/**
 * Log missing translation warnings in development
 * Call this in your App component during development
 * 
 * @param componentName - Name of the component for logging context
 * @param usedKeys - Keys used in the component
 */
export const logMissingTranslations = (
  componentName: string,
  usedKeys: string[]
): void => {
  // Only run in development
  if (import.meta.env.PROD) return;
  
  const { missing } = validateTranslationKeys(usedKeys);
  
  if (missing.length > 0) {
    console.warn(
      `[i18n] Missing translations in ${componentName}:`,
      missing
    );
  }
};

/**
 * Development hook to validate translations on component mount
 * 
 * Usage in component:
 * ```typescript
 * useEffect(() => {
 *   if (import.meta.env.DEV) {
 *     validateComponentTranslations('LoginForm', [
 *       'auth.login.title',
 *       'auth.login.submit'
 *     ]);
 *   }
 * }, []);
 * ```
 */
export const validateComponentTranslations = (
  componentName: string,
  keys: string[]
): boolean => {
  const result = validateTranslationKeys(keys);
  
  if (!result.isValid) {
    console.error(
      `[i18n Validation Failed] Component: ${componentName}\n` +
      `Missing keys (${result.missing.length}):\n` +
      result.missing.map(k => `  - ${k}`).join('\n')
    );
  }
  
  return result.isValid;
};