import { API_CONFIG } from './api.config';

/**
 * Get the base API URL
 * @returns The base API URL
 */
export const getApiUrl = (): string => {
  // Extract base URL by removing '/api/v1' from the end if present
  const baseUrl = API_CONFIG.BASE_URL;
  return baseUrl.replace(/\/api\/v1$/, '');
};

/**
 * Get the full API URL for a specific endpoint
 * @param endpoint - The API endpoint path
 * @returns The full API URL
 */
export const getFullApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};