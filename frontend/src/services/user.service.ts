import api from './api';

export interface UserUpdate {
  full_name?: string;
  phone?: string;
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}

// Get current user profile
export const getUserProfile = async () => {
  return await api.get('/users/me');
};

// Update user profile
export const updateUserProfile = async (data: UserUpdate) => {
  return await api.put('/users/me', data);
};

// Change password
export const changePassword = async (data: PasswordChange) => {
  return await api.put('/users/me/password', data);
};
