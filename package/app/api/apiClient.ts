/**
 * API Client
 * 
 * Centralized axios instance with authentication interceptors
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ENV } from '../config/env';
import { getAccessToken } from '../storage/secureStorage';

// #region agent log
fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiClient.ts:11',message:'apiClient module loading',data:{apiUrl:ENV.API_URL,timeout:ENV.API_TIMEOUT},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
// #endregion

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// #region agent log
fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiClient.ts:19',message:'apiClient instance created',data:{baseURL:apiClient.defaults.baseURL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
// #endregion

// Request interceptor - Add auth token to headers
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[APIClient] Request with auth token:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
        });
      } else {
        console.warn('[APIClient] Request without auth token:', {
          method: config.method?.toUpperCase(),
          url: config.url,
        });
      }
      
      // Handle FormData - remove Content-Type so axios can set multipart/form-data with boundary
      // But preserve Authorization header we just added
      if (config.data instanceof FormData && config.headers) {
        delete config.headers['Content-Type'];
        const authHeader = config.headers.Authorization;
        const authString = typeof authHeader === 'string' ? authHeader : String(authHeader || '');
        console.log('[APIClient] FormData detected - removed Content-Type header');
        console.log('[APIClient] FormData request headers:', {
          hasAuthorization: !!authHeader,
          authorizationPreview: authString ? `${authString.substring(0, 30)}...` : 'missing',
          allHeaders: Object.keys(config.headers),
        });
      }
    } catch (error) {
      console.error('[APIClient] Error getting access token:', error);
    }
    return config;
  },
  (error) => {
    console.error('[APIClient] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Logout callback for auth context
let logoutCallback: (() => void) | null = null;

/**
 * Set the logout callback function
 * Called when a 401 error is detected
 */
export const setLogoutCallback = (callback: () => void): void => {
  logoutCallback = callback;
};

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('[APIClient] Response received:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
    });
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      // Call logout callback if set
      if (logoutCallback) {
        console.log('[APIClient] Calling logout callback due to 401');
        logoutCallback();
      }
      console.error('[APIClient] Unauthorized (401) - token may be expired:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        data: error.response?.data,
      });
    } else {
      console.error('[APIClient] Response error:', {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        data: error.response?.data,
        message: error.message,
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
