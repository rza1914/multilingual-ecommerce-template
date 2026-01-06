/**
 * User-related TypeScript types
 */

// User roles enum
export type UserRole = 'admin' | 'customer' | 'moderator';

// User status enum
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

// Base user interface
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

// User for display in lists
export interface UserListItem {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  created_at: string;
  orders_count?: number;
}

// Create user request
export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: UserRole;
  phone?: string;
}

// Update user request
export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  status?: UserStatus;
  phone?: string;
}

// User filters for list query
export interface UserFilters {
  search?: string;
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'email' | 'name';
  sort_order?: 'asc' | 'desc';
}