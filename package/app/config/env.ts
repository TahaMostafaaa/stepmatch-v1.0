/**
 * Environment Configuration
 * 
 * Centralized access to environment variables.
 * Uses expo-constants to read from app.config.js extra field.
 */

import Constants from 'expo-constants';

interface EnvConfig {
  API_URL: string;
}

// Get environment variables from Expo Constants
// Falls back to localhost for development if not configured
const getEnvConfig = (): EnvConfig => {
  const extra = Constants.expoConfig?.extra;
  
  return {
    API_URL: extra?.API_URL || 'http://localhost:8000',
  };
};

export const ENV = getEnvConfig();

// Validate that required environment variables are set
export const validateEnv = (): boolean => {
  if (!ENV.API_URL) {
    console.warn('API_URL is not configured. Using default localhost:8000');
    return false;
  }
  return true;
};

