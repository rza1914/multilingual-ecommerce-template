import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any;
  setAuth: (token: string | null, user?: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('access_token'),
  user: null,
  setAuth: (token, user) => {
    if (token) localStorage.setItem('access_token', token);
    else localStorage.removeItem('access_token');
    set({ token, user });
  },
}));