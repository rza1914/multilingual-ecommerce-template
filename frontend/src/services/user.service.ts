import api from './api';
import { API_CONFIG } from '../config/api.config';

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface UserUpdate {
  full_name?: string;
  phone?: string;
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}

// Get current user profile
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>(API_CONFIG.ENDPOINTS.USERS.ME);
  return response as unknown as UserProfile;
};

// Update user profile
export const updateUserProfile = async (data: UserUpdate): Promise<UserProfile> => {
  const response = await api.put<UserProfile>(API_CONFIG.ENDPOINTS.USERS.ME, data);
  return response as unknown as UserProfile;
};

// Change password
export const changePassword = async (data: PasswordChange): Promise<void> => {
  await api.put(`${API_CONFIG.ENDPOINTS.USERS.ME}/password`, data);
};
