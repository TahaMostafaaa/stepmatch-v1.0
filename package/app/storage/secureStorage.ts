/**
 * Secure Storage Utility
 * 
 * Wrapper around expo-secure-store for encrypted token storage.
 * - iOS: Uses Keychain Services
 * - Android: Uses SharedPreferences with AES encryption
 * 
 * SECURITY: Never log token values. Use this module exclusively
 * for storing sensitive authentication data.
 */

import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS, User, AuthTokens } from '../auth/auth.types';

// Options for SecureStore - keychainAccessible ensures tokens
// are available when device is unlocked
const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/**
 * Store authentication tokens securely
 * @param tokens - Object containing access_token, refresh_token, expires_at
 */
export const storeTokens = async (tokens: AuthTokens): Promise<void> => {
  try {
    if (tokens.access_token) {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.ACCESS_TOKEN,
        tokens.access_token,
        SECURE_STORE_OPTIONS
      );
    }
    
    if (tokens.refresh_token) {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.REFRESH_TOKEN,
        tokens.refresh_token,
        SECURE_STORE_OPTIONS
      );
    }
    
    if (tokens.expires_at) {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.EXPIRES_AT,
        tokens.expires_at,
        SECURE_STORE_OPTIONS
      );
    }
  } catch (error) {
    // Don't log the actual tokens, just the error type
    console.error('Failed to store tokens securely');
    throw error;
  }
};

/**
 * Retrieve all stored authentication tokens
 * @returns AuthTokens object or null values if not found
 */
export const getTokens = async (): Promise<AuthTokens> => {
  try {
    const [access_token, refresh_token, expires_at] = await Promise.all([
      SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      SecureStore.getItemAsync(STORAGE_KEYS.EXPIRES_AT),
    ]);
    
    return { access_token, refresh_token, expires_at };
  } catch (error) {
    console.error('Failed to retrieve tokens from secure storage');
    return { access_token: null, refresh_token: null, expires_at: null };
  }
};

/**
 * Get the access token only
 * @returns Access token string or null
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Failed to retrieve access token');
    return null;
  }
};

/**
 * Get the refresh token only
 * @returns Refresh token string or null
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Failed to retrieve refresh token');
    return null;
  }
};

/**
 * Get token expiration timestamp
 * @returns ISO datetime string or null
 */
export const getExpiresAt = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.EXPIRES_AT);
  } catch (error) {
    console.error('Failed to retrieve token expiration');
    return null;
  }
};

/**
 * Store user profile data securely
 * @param user - User object to store
 */
export const storeUser = async (user: User): Promise<void> => {
  try {
    await SecureStore.setItemAsync(
      STORAGE_KEYS.USER,
      JSON.stringify(user),
      SECURE_STORE_OPTIONS
    );
  } catch (error) {
    console.error('Failed to store user data');
    throw error;
  }
};

/**
 * Retrieve stored user profile
 * @returns User object or null if not found
 */
export const getUser = async (): Promise<User | null> => {
  try {
    const userJson = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
    if (userJson) {
      return JSON.parse(userJson) as User;
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve user data');
    return null;
  }
};

/**
 * Clear all authentication data from secure storage
 * Call this on logout or when refresh token fails
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.EXPIRES_AT),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER),
    ]);
  } catch (error) {
    console.error('Failed to clear auth data from secure storage');
    // Don't throw - we want logout to succeed even if storage clear fails
  }
};

/**
 * Check if a valid access token exists
 * Does NOT validate the token, just checks existence
 * @returns boolean indicating if token exists
 */
export const hasStoredToken = async (): Promise<boolean> => {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    return token !== null;
  } catch (error) {
    return false;
  }
};

/**
 * Check if the stored token has expired
 * Uses a 5-minute buffer to trigger refresh before actual expiry
 * @returns true if token is expired or will expire within 5 minutes
 */
export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const expiresAt = await SecureStore.getItemAsync(STORAGE_KEYS.EXPIRES_AT);
    
    if (!expiresAt) {
      // No expiry stored, consider it expired
      return true;
    }
    
    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = Date.now();
    const bufferMs = 5 * 60 * 1000; // 5 minute buffer
    
    return currentTime >= (expiryTime - bufferMs);
  } catch (error) {
    console.error('Failed to check token expiration');
    // If we can't check, assume expired for safety
    return true;
  }
};

