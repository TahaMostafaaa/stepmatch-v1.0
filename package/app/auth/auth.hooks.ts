/**
 * Authentication Hooks
 * 
 * Custom hooks for accessing auth state and actions.
 * Provides type-safe access to the AuthContext.
 * 
 * Usage:
 *   const { isAuthenticated, user, isLoading, error } = useAuth();
 *   const { login, signup, logout, clearError } = useAuthActions();
 */

import { useContext } from 'react';
import { AuthContext } from './auth.context';
import { AuthState, LoginRequest, SignupRequest, AuthResponse } from './auth.types';

/**
 * Hook to access authentication state
 * @returns Current auth state (isAuthenticated, user, isLoading, error)
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context.state;
};

/**
 * Hook to access authentication actions
 * @returns Auth actions (login, signup, logout, clearError)
 * @throws Error if used outside of AuthProvider
 */
export const useAuthActions = (): {
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  signup: (data: SignupRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
} => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthActions must be used within an AuthProvider');
  }
  
  return {
    login: context.login,
    signup: context.signup,
    logout: context.logout,
    clearError: context.clearError,
  };
};

/**
 * Combined hook for both state and actions
 * Use this when you need both in the same component
 * @returns Object with all auth state and actions
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return {
    // State
    isAuthenticated: context.state.isAuthenticated,
    isLoading: context.state.isLoading,
    user: context.state.user,
    error: context.state.error,
    // Actions
    login: context.login,
    signup: context.signup,
    logout: context.logout,
    clearError: context.clearError,
  };
};

