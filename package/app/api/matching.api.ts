/**
 * Matching API Functions
 * 
 * Typed API functions for matching endpoints.
 * Uses the central apiClient for requests.
 */

import apiClient from './apiClient';
import {
  FeedResponse,
  SwipeRequest,
  SwipeResponse,
  MatchesResponse,
  LocationUpdateRequest,
  LocationUpdateResponse,
  PreferencesUpdateRequest,
  PreferencesUpdateResponse,
  UserPreferences,
} from './matching.types';

// #region agent log
if (typeof fetch !== 'undefined') {
  fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'matching.api.ts:24',message:'matchingApi module loading',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
}
// #endregion

/**
 * Matching API object containing all matching endpoints
 */
export const matchingApi = {
  /**
   * Get feed of potential matches
   * @param limit - Number of profiles to return (1-50, default: 10)
   * @param offset - Pagination offset (default: 0)
   * @returns FeedResponse with profiles and pagination info
   * @throws 401 for unauthorized, 404 if profile not found
   */
  getFeed: async (limit: number = 10, offset: number = 0): Promise<FeedResponse> => {
    const params = {
      limit: Math.min(Math.max(limit, 1), 50), // Clamp between 1-50
      offset: Math.max(offset, 0),
    };
    console.log('[MatchingAPI] GET /matching/feed called with params:', params);
    try {
      const response = await apiClient.get<FeedResponse>('/matching/feed', { params });
      console.log('[MatchingAPI] GET /matching/feed response:', {
        status: response.status,
        profilesCount: response.data?.profiles?.length || 0,
        totalCount: response.data?.total_count,
        hasMore: response.data?.has_more,
      });
      return response.data;
    } catch (error: any) {
      console.error('[MatchingAPI] GET /matching/feed error:', {
        url: '/matching/feed',
        params,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  /**
   * Record a swipe action (like or pass)
   * @param targetUserId - UUID of the user being swiped on
   * @param action - 'like' or 'pass'
   * @returns SwipeResponse with match info if mutual like
   * @throws 400 for invalid request, 401 for unauthorized, 404 if user not found
   */
  swipe: async (targetUserId: string, action: 'like' | 'pass'): Promise<SwipeResponse> => {
    const requestBody: SwipeRequest = { action };
    const url = `/matching/swipe/${targetUserId}`;
    console.log('[MatchingAPI] POST /matching/swipe/{targetUserId} called:', {
      url,
      targetUserId,
      requestBody,
    });
    try {
      const response = await apiClient.post<SwipeResponse>(url, requestBody);
      console.log('[MatchingAPI] POST /matching/swipe/{targetUserId} response:', {
        status: response.status,
        success: response.data?.success,
        action: response.data?.action,
        isMatch: response.data?.is_match,
        matchId: response.data?.match?.id,
      });
      return response.data;
    } catch (error: any) {
      console.error('[MatchingAPI] POST /matching/swipe/{targetUserId} error:', {
        url,
        targetUserId,
        requestBody,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  /**
   * Get all matches for the authenticated user
   * @returns MatchesResponse with list of matches
   * @throws 401 for unauthorized
   */
  getMatches: async (): Promise<MatchesResponse> => {
    const response = await apiClient.get<MatchesResponse>('/matching/matches');
    return response.data;
  },

  /**
   * Unmatch with a user
   * @param matchId - UUID of the match to remove
   * @returns Success response
   * @throws 401 for unauthorized, 403 if user not part of match, 404 if match not found
   */
  unmatch: async (matchId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/matching/matches/${matchId}`
    );
    return response.data;
  },

  /**
   * Update user's current location
   * @param latitude - Latitude (-90 to 90)
   * @param longitude - Longitude (-180 to 180)
   * @returns LocationUpdateResponse with updated location
   * @throws 401 for unauthorized, 404 if profile not found
   */
  updateLocation: async (
    latitude: number,
    longitude: number
  ): Promise<LocationUpdateResponse> => {
    const requestBody: LocationUpdateRequest = {
      latitude: Math.max(-90, Math.min(90, latitude)), // Clamp latitude
      longitude: Math.max(-180, Math.min(180, longitude)), // Clamp longitude
    };
    const response = await apiClient.put<LocationUpdateResponse>(
      '/matching/profile/location',
      requestBody
    );
    return response.data;
  },

  /**
   * Update user's matching preferences
   * @param preferences - PreferencesUpdateRequest with optional fields
   * @returns PreferencesUpdateResponse with updated preferences
   * @throws 400 for invalid age range, 401 for unauthorized, 404 if profile not found
   */
  updatePreferences: async (
    preferences: PreferencesUpdateRequest
  ): Promise<PreferencesUpdateResponse> => {
    const response = await apiClient.put<PreferencesUpdateResponse>(
      '/matching/profile/preferences',
      preferences
    );
    return response.data;
  },

  /**
   * Get user's current matching preferences and location
   * @returns UserPreferences with current settings
   * @throws 401 for unauthorized, 404 if profile not found
   */
  getPreferences: async (): Promise<UserPreferences> => {
    const response = await apiClient.get<UserPreferences>('/matching/profile/preferences');
    return response.data;
  },
};
