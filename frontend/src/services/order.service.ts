import api from './api';

export interface OrderItem {
  product_id: number;
  quantity: number;
  price_at_time: number;
}

export interface OrderCreate {
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
  items: OrderItem[];
}

export interface Order {
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
  items: any[];
}

// Create order
export const createOrder = async (orderData: OrderCreate): Promise<Order> => {
  return await api.post('/orders/', orderData);
};

// Get user orders
export const getUserOrders = async (): Promise<any[]> => {
  return await api.get('/orders/');
};

// Get single order
export const getOrder = async (orderId: number): Promise<Order> => {
  return await api.get(`/orders/${orderId}`);
};

// Cancel order
export const cancelOrder = async (orderId: number): Promise<Order> => {
  return await api.put(`/orders/${orderId}/cancel`);
};
