// Debug: Log environment variable value
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('MODE:', import.meta.env.MODE);

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:8000/api/v1',
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
      SMART_SEARCH: '/products/smart-search',
    },
    ORDERS: {
      LIST: '/orders/',
      DETAIL: (id: number) => `/orders/${id}`,
      CANCEL: (id: number) => `/orders/${id}/cancel`,
    },
    ADMIN: {
      DASHBOARD_STATS: '/admin/dashboard/stats',
      DASHBOARD_RECENT_ORDERS: (limit: number) => `/admin/dashboard/recent-orders?limit=${limit}`,
      DASHBOARD_REVENUE_CHART: (days: number) => `/admin/dashboard/revenue-chart?days=${days}`,
      PRODUCTS_LIST: '/admin/products',
      PRODUCT_DETAIL: (id: number) => `/admin/products/${id}`,
      ORDERS_LIST: '/admin/orders',
      ORDER_DETAIL: (id: number) => `/admin/orders/${id}`,
      UPDATE_ORDER_STATUS: (id: number) => `/admin/orders/${id}/status`,

    },

  },
  STORAGE_KEYS: {
    TOKEN: 'auth_token',
    USER: 'user_data',
  },
};
