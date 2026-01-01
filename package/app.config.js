/**
 * Expo Configuration
 * 
 * This file extends app.json and adds environment variable support.
 * Environment variables are read from .env file and exposed via expo-constants.
 * 
 * Usage in app: import Constants from 'expo-constants';
 *               const apiUrl = Constants.expoConfig?.extra?.API_URL;
 */

// Load environment variables from .env file
// Note: In production builds, set these via EAS build secrets or CI/CD
const API_URL = process.env.API_URL || 'http://localhost:8000';

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      API_URL,
    },
  };
};

