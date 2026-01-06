/**
 * Cart Service
 * Handles all cart-related API operations
 */

import { api } from './api.service';
import { API_CONFIG } from '../config/api.config';

// Cart item interface
export interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
}

// Product interface for suggestions
export interface SuggestedProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  discount?: number;
  stock: number;
  rating: number;
  is_active: boolean;
  is_featured: boolean;
  image_url?: string;
  category?: string;
  tags?: string;
  created_at?: string;
  updated_at?: string;
  score?: number;
  reason?: string;
}

// Bundle interface
export interface Bundle {
  items: SuggestedProduct[];
  original_price: number;
  discounted_price: number;
  savings: number;
  discount_percent: number;
  description: string;
}

// Cart suggestions response interface
export interface CartSuggestionsResponse {
  cross_sell: SuggestedProduct[];
  bundle: Bundle | null;
  up_sell: SuggestedProduct[];
  reasoning: string;
}

/**
 * Cart Service object
 */
export const cartService = {
  /**
   * Get cart suggestions based on current cart items
   */
  async getCartSuggestions(cartItems: CartItem[]): Promise<CartSuggestionsResponse> {
    try {
      const response = await api.post<any>(API_CONFIG.ENDPOINTS.CART.SUGGESTIONS, { cart_items: cartItems });
      
      // Properly type the response
      const responseData = response;

      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response structure from server');
      }

      // Validate required properties in response
      const result: CartSuggestionsResponse = {
        cross_sell: Array.isArray(responseData.cross_sell) ? responseData.cross_sell : [],
        bundle: responseData.bundle || null,
        up_sell: Array.isArray(responseData.up_sell) ? responseData.up_sell : [],
        reasoning: typeof responseData.reasoning === 'string' ? responseData.reasoning : 'پیشنهادهای سبد خرید'
      };

      return result;
    } catch (error) {
      console.error('Error in cart suggestions:', error);
      // Return a safe default result on error
      return {
        cross_sell: [],
        bundle: null,
        up_sell: [],
        reasoning: 'خطا در دریافت پیشنهادها'
      };
    }
  }
};

export default cartService;