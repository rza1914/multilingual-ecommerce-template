import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth.types';
import * as authService from '../services/auth.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Check authentication status on mount
   * Verify token and fetch user data
   */
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        // Token exists, try to fetch user data
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token is invalid or expired
      console.error('Auth check failed:', error);
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      // Call login API
      const response = await authService.login({ email, password });

      // Save token to localStorage
      authService.saveToken(response.access_token);

      // Fetch user data
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Login failed:', error);

      // Extract error message from API response
      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      }

      throw new Error(errorMessage);
    }
  };

  /**
   * Register new user
   * Auto login after successful registration
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      // Call register API
      await authService.register({ name, email, password });

      // Auto login after registration
      await login(email, password);
    } catch (error: any) {
      console.error('Registration failed:', error);

      // Extract error message from API response
      let errorMessage = 'Registration failed. Please try again.';

      if (error.response?.data?.detail) {
        // Handle different error formats
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail) && detail.length > 0) {
          errorMessage = detail[0].msg || detail[0];
        }
      } else if (error.response?.status === 400) {
        errorMessage = 'Email already registered or invalid data';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      }

      throw new Error(errorMessage);
    }
  };

  /**
   * Logout user
   * Clear token and user data
   */
  const logout = () => {
    authService.removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === 'admin';

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
