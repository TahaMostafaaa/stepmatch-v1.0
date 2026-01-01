/**
 * Environment Configuration
 * 
 * Centralized configuration for API URLs and environment settings
 */

// Declare __DEV__ for TypeScript (React Native global)
declare const __DEV__: boolean | undefined;

// Determine API URL at module load time
// In React Native/Expo, __DEV__ is set by Metro bundler
const API_URL = 
  (typeof __DEV__ !== 'undefined' && __DEV__)
    ? 'http://localhost:8000'  // Development
    : 'https://api.stepmatch.com'; // Production

// #region agent log
if (typeof fetch !== 'undefined') {
  fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'env.ts:15',message:'ENV module loading',data:{apiUrl:API_URL,__DEV__:typeof __DEV__ !== 'undefined' ? __DEV__ : 'undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
}
// #endregion

export const ENV = {
  API_URL,
  API_TIMEOUT: 30000,
};
