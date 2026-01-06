/**
 * API Service
 * Centralized HTTP client with automatic URL building and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';

/**
 * Build full API URL from endpoint
 * Wrapper around API_CONFIG.buildUrl for consistency
 */
export const buildApiUrl = (endpoint: string): string => {
  return API_CONFIG.buildUrl(endpoint);
};

/**
 * Create configured axios instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add auth token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request in debug mode
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log('[API Request]', {
          method: config.method?.toUpperCase(),
          url: config.url,
          fullUrl: config.baseURL + config.url,
        });
      }
      
      return config;
    },
    (error) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle errors
  client.interceptors.response.use(
    (response) => {
      // Log successful response in debug mode
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log('[API Response]', {
          status: response.status,
          url: response.config.url,
        });
      }
      return response;
    },
    (error: AxiosError) => {
      // Log error details
      console.error('[API Error]', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        fullUrl: error.config?.baseURL + error.config?.url,
      });
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Export singleton instance
export const apiClient = createApiClient();

/**
 * Type-safe API request helpers
 */
export const api = {
  /**
   * GET request
   */
  get: <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(endpoint, config);
  },

  /**
   * POST request
   */
  post: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(endpoint, data, config);
  },

  /**
   * PUT request
   */
  put: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(endpoint, data, config);
  },

  /**
   * PATCH request
   */
  patch: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(endpoint, data, config);
  },

  /**
   * DELETE request
   */
  delete: <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(endpoint, config);
  },
};

export default api;