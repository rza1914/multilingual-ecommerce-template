/**
 * Admin Service
 * Handles all admin-related API operations
 */

import { api } from './api.service';
import { API_CONFIG } from '../config/api.config';

// AI Settings interfaces
export interface AISettings {
  botName: string;
  selectedPersonality: string;
  customPrompt: string;
  useCustomPrompt: boolean;
}

export interface AIPersonality {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
}

// Dashboard interfaces
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

/**
 * Admin Service object
 */
export const adminService = {
  // AI Settings
  /**
   * Get AI settings
   */
  async getAISettings(): Promise<AISettings> {
    try {
      return await api.get<AISettings>(API_CONFIG.ENDPOINTS.ADMIN.AI_SETTINGS);
    } catch (error) {
      console.error('Failed to fetch AI settings:', error);
      throw error;
    }
  },

  /**
   * Update AI settings
   */
  async updateAISettings(settings: AISettings): Promise<AISettings> {
    try {
      return await api.put<AISettings>(API_CONFIG.ENDPOINTS.ADMIN.AI_SETTINGS, settings);
    } catch (error) {
      console.error('Failed to update AI settings:', error);
      throw error;
    }
  },

  /**
   * Get available AI personalities
   */
  async getAIPersonalities(): Promise<AIPersonality[]> {
    try {
      return await api.get<AIPersonality[]>(API_CONFIG.ENDPOINTS.ADMIN.AI_SETTINGS_PERSONALITIES);
    } catch (error) {
      console.error('Failed to fetch AI personalities:', error);
      throw error;
    }
  },

  // Dashboard
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      return await api.get<DashboardStats>(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_STATS);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get recent orders
   */
  async getRecentOrders(limit: number = 5): Promise<any[]> {
    try {
      return await api.get<any[]>(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_RECENT_ORDERS(limit));
    } catch (error) {
      console.error('Failed to fetch recent orders:', error);
      throw error;
    }
  },

  /**
   * Get revenue chart data
   */
  async getRevenueChart(days: number = 30): Promise<any> {
    try {
      return await api.get<any>(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_REVENUE_CHART(days));
    } catch (error) {
      console.error('Failed to fetch revenue chart data:', error);
      throw error;
    }
  }
};

export default adminService;