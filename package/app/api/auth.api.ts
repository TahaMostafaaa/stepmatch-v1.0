/**
 * Authentication API Functions
 * 
 * Typed API functions for auth endpoints.
 * Uses the central apiClient for requests.
 */

import apiClient from './apiClient';
import axios from 'axios';
import { ENV } from '../config/env';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  Profile,
  UpdateProfileRequest,
} from '../auth/auth.types';
import { getRefreshToken } from '../storage/secureStorage';

/**
 * Auth API object containing all authentication endpoints
 */
export const authApi = {
  /**
   * Login with email and password
   * @param credentials - { email, password }
   * @returns AuthResponse with tokens and user
   * @throws 401 for invalid credentials, 403 for unverified email
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  /**
   * Register a new user
   * @param data - { email, password, name, birthdate }
   * @returns AuthResponse with tokens (may be null if email verification required)
   */
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/signup',
      data
    );
    return response.data;
  },

  /**
   * Refresh the access token using a refresh token
   * Uses direct axios call to bypass interceptors
   * @param refreshToken - The refresh token to use
   * @returns AuthResponse with new tokens
   * @throws 401 for invalid/expired refresh token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
      `${ENV.API_URL}/auth/refresh`,
      { refresh_token: refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );
    return response.data;
  },

  /**
   * Logout the current user
   * Invalidates refresh token server-side
   * Note: Local token cleanup is handled by auth context
   */
  logout: async (): Promise<void> => {
    try {
      const refreshToken = await getRefreshToken();
      
      if (refreshToken) {
        // Include refresh token in logout request for server-side invalidation
        await apiClient.post('/auth/logout', {
          refresh_token: refreshToken,
        });
      }
    } catch (error) {
      // Logout should not throw - log and continue
      // Local cleanup will still happen in auth context
      console.error('Logout API call failed');
    }
  },

  /**
   * Get user profile information
   * @returns Profile data with user details
   * @throws 401 for unauthorized, 404 if profile not found
   */
  getProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<Profile>('/auth/profile');
    return response.data;
  },

  /**
   * Update user profile information
   * @param data - UpdateProfileRequest with fields to update
   * @returns Updated Profile data
   * @throws 401 for unauthorized, 400 for validation errors
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    const response = await apiClient.put<Profile>('/auth/profile', data);
    return response.data;
  },
};

