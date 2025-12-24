/**
 * API Client with Axios
 * 
 * Central Axios instance with:
 * - Automatic token attachment via request interceptor
 * - Token refresh on 401 responses with mutex lock
 * - Request queuing during refresh
 * - Auto-logout on refresh failure
 * 
 * SECURITY: This module handles sensitive tokens.
 * Never log token values in production.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';
import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearAuthData,
  isTokenExpired,
} from '../storage/secureStorage';
import { AuthResponse } from '../auth/auth.types';

// Callback to notify auth context of logout (set by AuthProvider)
let onLogoutCallback: (() => void) | null = null;

/**
 * Set the logout callback function
 * Called by AuthProvider to connect API client to auth state
 */
export const setLogoutCallback = (callback: () => void): void => {
  onLogoutCallback = callback;
};

// Mutex to prevent concurrent refresh requests
let isRefreshing = false;

// Queue of requests waiting for token refresh
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * Subscribe a request to wait for token refresh
 * @param callback - Function to call with new token
 */
const subscribeTokenRefresh = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

/**
 * Notify all queued requests with the new token
 * @param token - The new access token
 */
const onTokenRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Create the main Axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * - Attaches access token to Authorization header
 * - Checks token expiry and refreshes if needed (proactive refresh)
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip auth header for public endpoints
    const publicEndpoints = ['/auth/login', '/auth/signup', '/auth/refresh'];
    const isPublicEndpoint = publicEndpoints.some(
      (endpoint) => config.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      return config;
    }

    // Check if token is expired and refresh proactively
    const expired = await isTokenExpired();
    if (expired && !isRefreshing) {
      try {
        await refreshAccessToken();
      } catch (error) {
        // If refresh fails, let the request proceed - it will get 401
        // and be handled by response interceptor
      }
    }

    // Attach the access token
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handles 401 responses by attempting token refresh
 * - Queues concurrent requests during refresh
 * - Forces logout if refresh fails
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If not a 401 or already retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't retry auth endpoints
    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/signup') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      // If refresh endpoint returns 401, force logout
      if (originalRequest.url?.includes('/auth/refresh')) {
        await handleLogout();
      }
      return Promise.reject(error);
    }

    // Mark request as retried
    originalRequest._retry = true;

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    // Attempt to refresh the token
    try {
      const newToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed - force logout
      await handleLogout();
      return Promise.reject(refreshError);
    }
  }
);

/**
 * Refresh the access token using the refresh token
 * Uses mutex to prevent concurrent refresh attempts
 * @returns The new access token
 * @throws If refresh fails
 */
const refreshAccessToken = async (): Promise<string> => {
  isRefreshing = true;

  try {
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Call refresh endpoint directly (bypass interceptors)
    const response = await axios.post<AuthResponse>(
      `${ENV.API_URL}/auth/refresh`,
      { refresh_token: refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    const { access_token, refresh_token, expires_at } = response.data;

    if (!access_token) {
      throw new Error('No access token in refresh response');
    }

    // Store new tokens
    await storeTokens({
      access_token,
      refresh_token,
      expires_at,
    });

    // Notify queued requests
    onTokenRefreshed(access_token);

    return access_token;
  } finally {
    isRefreshing = false;
  }
};

/**
 * Handle logout - clear tokens and notify auth context
 */
const handleLogout = async (): Promise<void> => {
  await clearAuthData();
  
  // Notify auth context to update state
  if (onLogoutCallback) {
    onLogoutCallback();
  }
};

export default apiClient;

