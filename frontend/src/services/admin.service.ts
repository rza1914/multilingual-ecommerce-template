import api from './api';
import { API_CONFIG } from '../config/api.config';

export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  orders_by_status: Record<string, number>;
  recent_orders_count: number;
  recent_revenue: number;
  low_stock_count: number;
  new_users_count: number;
}

export interface RecentOrder {
  id: number;
  user_id: number;
  full_name: string;
  total: number;
  status: string;
  created_at: string;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  orders: number;
}

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return await api.get(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_STATS);
};

// Get recent orders
export const getRecentOrders = async (limit: number = 10): Promise<RecentOrder[]> => {
  return await api.get(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_RECENT_ORDERS(limit));
};

// Get revenue chart data
export const getRevenueChart = async (days: number = 30): Promise<RevenueChartData[]> => {
  return await api.get(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_REVENUE_CHART(days));
};

// Product Management Interfaces
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price: number | null;
  is_active: boolean;
  is_featured: boolean;
  category: string;
  image_url: string;
  tags: string | null;
  created_at: string;
  updated_at: string;
  owner_id: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  is_active?: boolean;
  is_featured?: boolean;
  category: string;
  image_url: string;
  tags?: string;
}

// Product Management Functions
export const getAdminProducts = async (
  skip: number = 0,
  limit: number = 100,
  search?: string
): Promise<ProductsResponse> => {
  let url = `${API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS_LIST}?skip=${skip}&limit=${limit}`;
  if (search) url += `&search=${search}`;
  return await api.get(url);
};

export const getAdminProduct = async (id: number): Promise<Product> => {
  return await api.get(API_CONFIG.ENDPOINTS.ADMIN.PRODUCT_DETAIL(id));
};

export const createProduct = async (data: ProductFormData): Promise<Product> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });
  return await api.post(API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS_LIST, formData);
};

export const updateProduct = async (id: number, data: ProductFormData): Promise<Product> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });
  return await api.put(API_CONFIG.ENDPOINTS.ADMIN.PRODUCT_DETAIL(id), formData);
};

export const deleteProduct = async (id: number): Promise<void> => {
  return await api.delete(API_CONFIG.ENDPOINTS.ADMIN.PRODUCT_DETAIL(id));
};

// Order Management Interfaces
export interface AdminOrder {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  shipping_method: string;
  payment_method: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
  items_count: number;
}

export interface OrdersResponse {
  orders: AdminOrder[];
  total: number;
  skip: number;
  limit: number;
}

// Order Management Functions
export const getAdminOrders = async (
  skip: number = 0,
  limit: number = 100,
  status?: string
): Promise<OrdersResponse> => {
  let url = `${API_CONFIG.ENDPOINTS.ADMIN.ORDERS_LIST}?skip=${skip}&limit=${limit}`;
  if (status && status !== 'all') url += `&status=${status}`;
  return await api.get(url);
};

export const getAdminOrderDetails = async (id: number): Promise<any> => {
  return await api.get(API_CONFIG.ENDPOINTS.ADMIN.ORDER_DETAIL(id));
};

export const updateOrderStatus = async (id: number, status: string): Promise<any> => {
  const formData = new FormData();
  formData.append('status', status);
  return await api.put(API_CONFIG.ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(id), formData);
};

export const deleteAdminOrder = async (id: number): Promise<void> => {
  return await api.delete(API_CONFIG.ENDPOINTS.ADMIN.ORDER_DETAIL(id));
};
