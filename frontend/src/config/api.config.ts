export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api/v1',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
    },
    USERS: {
      ME: '/users/me',
    },
    PRODUCTS: {
      LIST: '/products/',
      DETAIL: (id: number) => `/products/${id}`,
    },
  },
  STORAGE_KEYS: {
    TOKEN: 'auth_token',
    USER: 'user_data',
  },
};
