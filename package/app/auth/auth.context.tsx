/**
 * Authentication Context
 * 
 * Provides global authentication state using React Context + Reducer pattern.
 * Handles:
 * - Auth state management (isAuthenticated, user, loading, error)
 * - Session bootstrap on app start
 * - Login/Signup/Logout actions
 * - Secure token storage integration
 * 
 * Usage: Wrap your app with <AuthProvider>, then use useAuth() hook
 */

import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  AuthState,
  AuthAction,
  User,
  LoginRequest,
  SignupRequest,
  AuthResponse,
} from './auth.types';
import {
  storeTokens,
  storeUser,
  getUser,
  getTokens,
  clearAuthData,
  isTokenExpired,
} from '../storage/secureStorage';
import { authApi } from '../api/auth.api';
import { setLogoutCallback } from '../api/apiClient';

// Initial state - loading true until we check storage
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

/**
 * Auth Reducer
 * Pure function to handle state transitions
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      };
    case 'AUTH_RESTORE':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Context type definitions
interface AuthContextValue {
  state: AuthState;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  signup: (data: SignupRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create context with undefined default
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * Wraps the app and provides authentication state/actions
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Handle forced logout from API client (e.g., refresh token expired)
   * Connected to apiClient via setLogoutCallback
   */
  const handleForcedLogout = useCallback(() => {
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  /**
   * Bootstrap auth state on app start
   * Checks for stored tokens and validates them
   */
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        // Check if we have stored tokens
        const tokens = await getTokens();
        
        if (!tokens || !tokens.access_token) {
          // No tokens stored - user needs to login
          dispatch({ type: 'AUTH_LOGOUT' });
          return;
        }

        // Check if token is expired
        const expired = await isTokenExpired();
        
        if (expired && tokens.refresh_token) {
          // Try to refresh the token
          try {
            const response = await authApi.refreshToken(tokens.refresh_token);
            
            if (response && response.access_token && response.user) {
              await storeTokens({
                access_token: response.access_token,
                refresh_token: response.refresh_token || tokens.refresh_token,
                expires_at: response.expires_at,
              });
              await storeUser(response.user);
              dispatch({ type: 'AUTH_RESTORE', payload: response.user });
              return;
            } else {
              // Invalid response - clear and require login
              console.warn('Invalid refresh token response:', response);
              await clearAuthData();
              dispatch({ type: 'AUTH_LOGOUT' });
              return;
            }
          } catch (refreshError: any) {
            // Refresh failed - clear tokens and require login
            console.error('Token refresh failed:', refreshError?.message || refreshError);
            try {
              await clearAuthData();
            } catch (clearError) {
              console.error('Error clearing auth data after refresh failure:', clearError);
            }
            dispatch({ type: 'AUTH_LOGOUT' });
            return;
          }
        }

        // Token still valid - restore user from storage
        const user = await getUser();
        if (user && user.id) {
          dispatch({ type: 'AUTH_RESTORE', payload: user });
        } else {
          // Token exists but no user - something wrong, clear everything
          console.warn('Token exists but user data is missing or invalid');
          await clearAuthData();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error: any) {
        console.error('Auth bootstrap error:', error);
        console.error('Auth bootstrap error details:', {
          message: error?.message,
          stack: error?.stack,
          name: error?.name,
        });
        // Clear any potentially corrupted data and require login
        try {
          await clearAuthData();
        } catch (clearError) {
          console.error('Error clearing auth data during bootstrap:', clearError);
        }
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    // Connect logout callback to API client
    setLogoutCallback(handleForcedLogout);
    
    bootstrapAuth();
  }, [handleForcedLogout]);

  /**
   * Login action
   * @param credentials - Email and password
   * @returns AuthResponse from the API
   */
  const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authApi.login(credentials);
      
      // Check if email verification is required (tokens will be null)
      if (!response.access_token) {
        dispatch({
          type: 'AUTH_FAILURE',
          payload: response.message || 'Email verification required',
        });
        return response;
      }

      // Store tokens and user securely
      await storeTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_at: response.expires_at,
      });
      
      if (response.user) {
        await storeUser(response.user);
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      }
      
      return response;
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  /**
   * Signup action
   * @param data - Signup form data (email, password, name, birthdate)
   * @returns AuthResponse from the API
   */
  const signup = useCallback(async (data: SignupRequest): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authApi.signup(data);
      
      // Check if email verification is required (tokens will be null)
      if (!response.access_token) {
        // Don't set as failure - this is a valid state
        // Just return the response and let the UI handle it
        dispatch({ type: 'AUTH_LOGOUT' });
        return response;
      }

      // Store tokens and user securely
      await storeTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_at: response.expires_at,
      });
      
      if (response.user) {
        await storeUser(response.user);
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      }
      
      return response;
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Signup failed. Please try again.';
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  }, []);

  /**
   * Logout action
   * Calls API logout and clears local storage
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Call API to invalidate refresh token server-side
      await authApi.logout();
    } catch (error) {
      // Continue with local logout even if API call fails
      console.error('Logout API call failed, continuing with local logout');
    } finally {
      // Always clear local storage and state
      await clearAuthData();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextValue = {
    state,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

