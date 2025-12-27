/**
 * Secure Storage Utilities
 * 
 * Functions for storing and retrieving authentication tokens securely
 * Uses AsyncStorage for React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, AuthTokens, User } from '../auth/auth.types';

/**
 * Get the access token from secure storage
 * @returns Access token string or null if not found
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Get the refresh token from secure storage
 * @returns Refresh token string or null if not found
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    return token;
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Store access token in secure storage
 * @param token - Access token to store
 */
export const setAccessToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error('Error storing access token:', error);
  }
};

/**
 * Store refresh token in secure storage
 * @param token - Refresh token to store
 */
export const setRefreshToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error('Error storing refresh token:', error);
  }
};

/**
 * Remove all authentication tokens from storage
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.EXPIRES_AT,
    ]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

/**
 * Store tokens object (access_token, refresh_token, expires_at)
 * @param tokens - AuthTokens object to store
 */
export const storeTokens = async (tokens: AuthTokens): Promise<void> => {
  try {
    if (tokens.access_token) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
    }
    if (tokens.refresh_token) {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
    }
    if (tokens.expires_at) {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPIRES_AT, tokens.expires_at);
    }
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

/**
 * Get tokens object (access_token, refresh_token, expires_at)
 * @returns AuthTokens object or null if not found
 */
export const getTokens = async (): Promise<AuthTokens | null> => {
  try {
    const [accessToken, refreshToken, expiresAt] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.getItem(STORAGE_KEYS.EXPIRES_AT),
    ]);

    if (!accessToken && !refreshToken) {
      return null;
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    };
  } catch (error) {
    console.error('Error getting tokens:', error);
    return null;
  }
};

/**
 * Store user object in secure storage
 * @param user - User object to store
 */
export const storeUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

/**
 * Get user object from secure storage
 * @returns User object or null if not found
 */
export const getUser = async (): Promise<User | null> => {
  try {
    const userString = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (!userString) {
      return null;
    }
    return JSON.parse(userString) as User;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Clear all authentication data (tokens and user)
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.EXPIRES_AT,
      STORAGE_KEYS.USER,
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Check if the access token is expired
 * @returns true if token is expired or missing, false otherwise
 */
export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const expiresAt = await AsyncStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    if (!expiresAt) {
      return true; // No expiration date means expired
    }

    const expirationDate = new Date(expiresAt);
    const now = new Date();
    
    // Add 5 minute buffer to account for clock skew
    return expirationDate.getTime() < (now.getTime() + 5 * 60 * 1000);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired on error
  }
};
