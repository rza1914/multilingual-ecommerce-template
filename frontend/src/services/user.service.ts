import api from './api';

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
  const response = await api.get<UserProfile>('/users/me');
  return response as unknown as UserProfile;
};

// Update user profile
export const updateUserProfile = async (data: UserUpdate): Promise<UserProfile> => {
  const response = await api.put<UserProfile>('/users/me', data);
  return response as unknown as UserProfile;
};

// Change password
export const changePassword = async (data: PasswordChange): Promise<void> => {
  await api.put('/users/me/password', data);
};
