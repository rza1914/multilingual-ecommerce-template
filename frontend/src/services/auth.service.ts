import api from './api';
import { API_CONFIG } from '../config/api.config';
import { LoginData, RegisterData, LoginResponse, User } from '../types/auth.types';

/**
 * Login user with email and password
 * FastAPI OAuth2 expects form data (URLSearchParams), not JSON
 */
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', data.email); // OAuth2 uses 'username' field
  formData.append('password', data.password);

  const response = await api.post<any, LoginResponse>(
    API_CONFIG.ENDPOINTS.AUTH.LOGIN,
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response;
};

/**
 * Register new user
 * Uses JSON format
 */
export const register = async (data: RegisterData): Promise<User> => {
  const response = await api.post<any, User>(
    API_CONFIG.ENDPOINTS.AUTH.REGISTER,
    data
  );

  return response;
};

/**
 * Get current authenticated user
 * Requires valid token in Authorization header
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<any, User>(API_CONFIG.ENDPOINTS.USERS.ME);
  return response;
};

/**
 * Check if user is authenticated
 * Verifies if token exists in localStorage
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
  return !!token;
};

/**
 * Save authentication token to localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(API_CONFIG.STORAGE_KEYS.TOKEN, token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN);
};

/**
 * Get stored token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
};
