/**
 * Environment Configuration Checker
 * Utility to validate and debug environment variable loading
 */

interface EnvCheckResult {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  config: Record<string, string | undefined>;
}

/**
 * Check if all required environment variables are loaded
 * @returns Validation result with issues and warnings
 */
export const checkEnvironment = (): EnvCheckResult => {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  // Required environment variables
  const required = {
    VITE_API_URL: import.meta.env.VITE_API_URL,
  };
  
  // Optional environment variables
  const optional = {
    VITE_DEBUG: import.meta.env.VITE_DEBUG,
    VITE_WS_URL: import.meta.env.VITE_WS_URL,
  };
  
  // Check required variables
  Object.entries(required).forEach(([key, value]) => {
    if (!value) {
      issues.push(`❌ ${key} is not defined`);
    }
  });
  
  // Check optional variables
  Object.entries(optional).forEach(([key, value]) => {
    if (!value) {
      warnings.push(`⚠️  ${key} is not defined (optional)`);
    }
  });
  
  const result: EnvCheckResult = {
    isValid: issues.length === 0,
    issues,
    warnings,
    config: { ...required, ...optional },
  };
  
  return result;
};

/**
 * Log environment check results to console
 */
export const logEnvironmentCheck = (): void => {
  const result = checkEnvironment();
  
  console.group('🔍 Environment Configuration Check');
  console.log('Mode:', import.meta.env.MODE);
  console.log('Development:', import.meta.env.DEV);
  console.log('Production:', import.meta.env.PROD);
  console.log('');
  
  if (result.issues.length > 0) {
    console.group('❌ Issues (Must Fix)');
    result.issues.forEach(issue => console.error(issue));
    console.groupEnd();
  }
  
  if (result.warnings.length > 0) {
    console.group('⚠️  Warnings');
    result.warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }
  
  if (result.isValid) {
    console.log('✅ All required environment variables are configured');
  }
  
  console.group('📋 Current Configuration');
  Object.entries(result.config).forEach(([key, value]) => {
    console.log(`${key}:`, value || '(not set)');
  });
  console.groupEnd();
  
  console.groupEnd();
};

// Auto-run check in development mode
if (import.meta.env.DEV) {
  logEnvironmentCheck();
}

export default checkEnvironment;