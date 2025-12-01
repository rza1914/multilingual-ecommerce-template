import { useState, useEffect } from 'react';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: any | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    user: null
  });

  const login = (token: string, user?: any) => {
    localStorage.setItem('token', token);
    setAuthState({
      token,
      isAuthenticated: true,
      user: user || null
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      token: null,
      isAuthenticated: false,
      user: null
    });
  };

  return {
    ...authState,
    login,
    logout
  };
};