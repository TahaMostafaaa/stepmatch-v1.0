/**
 * Authentication Types
 * 
 * TypeScript interfaces for the auth system.
 * These types mirror the FastAPI backend responses.
 */

// User metadata returned from the backend
export interface UserMetadata {
  name: string;
  birthdate: string;
}

// User object returned from auth endpoints
export interface User {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  user_metadata: UserMetadata;
}

// Auth tokens returned from login/signup/refresh
export interface AuthTokens {
  access_token: string | null;
  refresh_token: string | null;
  expires_at: string | null;
}

// Complete auth response from login/signup endpoints
export interface AuthResponse {
  success: boolean;
  message: string;
  access_token: string | null;
  refresh_token: string | null;
  user: User | null;
  expires_at: string | null;
}

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Signup request payload
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  birthdate: string; // Format: YYYY-MM-DD
}

// Refresh token request payload
export interface RefreshTokenRequest {
  refresh_token: string;
}

// Global auth state managed by context
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

// Actions for the auth reducer
export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_RESTORE'; payload: User }
  | { type: 'CLEAR_ERROR' };

// API error response structure
export interface ApiError {
  detail?: string;
  message?: string;
}

// Storage keys for secure storage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  EXPIRES_AT: 'auth_expires_at',
  USER: 'auth_user',
} as const;

