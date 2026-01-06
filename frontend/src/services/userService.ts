/**
 * User Service
 * Handles all user-related API operations
 */

import { api } from './api.service';
import { API_CONFIG } from '../config/api.config';
import type {
  User,
  UserListItem,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters
} from '../types/user.types';

// Define ApiError type locally since it's not imported from api.service
interface ApiError {
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

/**
 * User Service object
 */
export const userService = {
  /**
   * Get paginated list of users
   */
  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<UserListItem>> {
    try {
      const params: Record<string, string> = {};
      
      if (filters?.search) params.search = filters.search;
      if (filters?.role && filters.role !== 'all') params.role = filters.role;
      if (filters?.status && filters.status !== 'all') params.status = filters.status;
      if (filters?.page) params.page = String(filters.page);
      if (filters?.limit) params.limit = String(filters.limit);
      if (filters?.sort_by) params.sort_by = filters.sort_by;
      if (filters?.sort_order) params.sort_order = filters.sort_order;
      
      return await api.get<PaginatedResponse<UserListItem>>(API_CONFIG.ENDPOINTS.ADMIN.USERS_LIST, params);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },
  
  /**
   * Get single user by ID
   */
  async getUser(id: string): Promise<User> {
    try {
      return await api.get<User>(API_CONFIG.ENDPOINTS.ADMIN.USER_DETAIL(Number(id)));
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new user
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    try {
      return await api.post<User>(API_CONFIG.ENDPOINTS.ADMIN.USERS_LIST, data);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  /**
   * Update existing user
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    try {
      return await api.put<User>(API_CONFIG.ENDPOINTS.ADMIN.USER_UPDATE(Number(id)), data);
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(API_CONFIG.ENDPOINTS.ADMIN.USER_DELETE(Number(id)));
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Check if error is an API error
   */
  isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      'status' in error
    );
  }
};

export default userService;