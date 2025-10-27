import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Return data directly for successful responses
    return response.data;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Clear token and user data
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.TOKEN);
      localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER);

      // Redirect to home page if not already there
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network Error: Unable to connect to the server');
    }

    // Return error for component-level handling
    return Promise.reject(error);
  }
);

export default api;
