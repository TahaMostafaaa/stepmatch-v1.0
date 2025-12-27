/**
 * Matching Context
 * 
 * Context for managing matching state (feed, matches, preferences)
 * Follows the same pattern as themeContext
 */

import React, { createContext, useState, useMemo, useCallback } from 'react';
import { matchingApi } from '../api/matching.api';
import {
  ProfileCard,
  MatchInfo,
  UserPreferences,
  PreferencesUpdateRequest,
} from '../api/matching.types';
import { getCurrentLocation } from '../services/locationService';

// #region agent log
if (typeof fetch !== 'undefined') {
  fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'matchingContext.tsx:19',message:'matchingContext module loading',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
}
// #endregion

// Create context with default empty object (same as themeContext)
const matchingContext = createContext<any>({});

// MatchingProvider component
export const MatchingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'matchingContext.tsx:22',message:'MatchingProvider rendering',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  }, []);
  // #endregion

  // Feed state
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Matches state
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState<string | null>(null);

  // Preferences state
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Match modal state
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchData, setMatchData] = useState<MatchInfo | null>(null);

  // Load feed
  const loadFeed = useCallback(async (limit: number = 10) => {
    try {
      console.log('[MatchingContext] loadFeed called with limit:', limit);
      setFeedLoading(true);
      setFeedError(null);
      const response = await matchingApi.getFeed(limit, 0);
      setProfiles(response.profiles || []);
      setOffset(0);
      setHasMore(response.has_more || false);
      console.log('[MatchingContext] loadFeed success:', {
        profilesCount: response.profiles?.length || 0,
        hasMore: response.has_more,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to load feed. Please check your connection.';
      setFeedError(errorMessage);
      console.error('[MatchingContext] loadFeed error:', error);
    } finally {
      setFeedLoading(false);
    }
  }, []);

  // Load more feed (pagination)
  const loadMoreFeed = useCallback(async (limit: number = 10) => {
    try {
      if (feedLoading || !hasMore) return;
      
      console.log('[MatchingContext] loadMoreFeed called:', {
        currentOffset: offset,
        limit,
        hasMore,
      });
      setFeedLoading(true);
      const newOffset = offset + profiles.length;
      const response = await matchingApi.getFeed(limit, newOffset);
      setProfiles((prev) => [...prev, ...(response.profiles || [])]);
      setOffset(newOffset);
      setHasMore(response.has_more || false);
      console.log('[MatchingContext] loadMoreFeed success:', {
        newProfilesCount: response.profiles?.length || 0,
        totalProfiles: profiles.length + (response.profiles?.length || 0),
        hasMore: response.has_more,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to load more profiles.';
      setFeedError(errorMessage);
      console.error('[MatchingContext] loadMoreFeed error:', error);
    } finally {
      setFeedLoading(false);
    }
  }, [offset, profiles.length, hasMore, feedLoading]);

  // Swipe action (like or pass)
  const swipe = useCallback(
    async (targetUserId: string, action: 'like' | 'pass') => {
      try {
        console.log('[MatchingContext] swipe called:', {
          targetUserId,
          action,
        });
        const response = await matchingApi.swipe(targetUserId, action);
        
        // Remove swiped profile from feed
        setProfiles((prev) => prev.filter((p) => p.id !== targetUserId));
        
        // If it's a match, show match modal
        if (action === 'like' && response.is_match) {
          console.log('[MatchingContext] Match found!', response.match);
          if (response.match && response.match.matched_user_id) {
            // Ensure match object has required fields
            const matchData: MatchInfo = {
              id: response.match.id || '',
              matched_user_id: response.match.matched_user_id,
              matched_user_name: response.match.matched_user_name || null,
              matched_user_image: response.match.matched_user_image || null,
              matched_at: response.match.matched_at || new Date().toISOString(),
            };
            openMatchModal(matchData);
          } else {
            console.warn('[MatchingContext] Match response missing match data:', response);
          }
        }
        
        console.log('[MatchingContext] swipe success:', {
          isMatch: response.is_match,
          action,
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          'Failed to record swipe. Please try again.';
        console.error('[MatchingContext] swipe error:', error);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Load matches
  const loadMatches = useCallback(async () => {
    try {
      setMatchesLoading(true);
      setMatchesError(null);
      const response = await matchingApi.getMatches();
      setMatches(response.matches);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to load matches. Please try again.';
      setMatchesError(errorMessage);
      console.error('Error loading matches:', error);
    } finally {
      setMatchesLoading(false);
    }
  }, []);

  // Unmatch
  const unmatch = useCallback(async (matchId: string) => {
    try {
      // Optimistic update
      setMatches((prev) => prev.filter((match) => match.id !== matchId));

      await matchingApi.unmatch(matchId);
    } catch (error: any) {
      // Revert optimistic update on error
      await loadMatches();

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to unmatch. Please try again.';
      console.error('Error unmatching:', error);
      throw new Error(errorMessage);
    }
  }, [loadMatches]);

  // Load preferences
  const loadPreferences = useCallback(async () => {
    try {
      setPreferencesLoading(true);
      const prefs = await matchingApi.getPreferences();
      setPreferences(prefs);
    } catch (error: any) {
      console.error('Error loading preferences:', error);
      // Don't set error state for preferences - just log
    } finally {
      setPreferencesLoading(false);
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback(
    async (prefs: PreferencesUpdateRequest) => {
      try {
        setSavingPreferences(true);
        const updated = await matchingApi.updatePreferences(prefs);
        setPreferences(updated);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          'Failed to update preferences.';
        console.error('Error updating preferences:', error);
        throw new Error(errorMessage);
      } finally {
        setSavingPreferences(false);
      }
    },
    []
  );

  // Update location manually
  const updateLocation = useCallback(
    async (lat: number, lng: number) => {
      try {
        await matchingApi.updateLocation({ lat, lng });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          'Failed to update location.';
        console.error('Error updating location:', error);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Update location from GPS
  const updateLocationFromGPS = useCallback(async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        await updateLocation(location.latitude, location.longitude);
      } else {
        throw new Error('Could not get current location');
      }
    } catch (error: any) {
      console.error('Error updating location from GPS:', error);
      throw error;
    }
  }, [updateLocation]);

  // Open match modal
  const openMatchModal = useCallback((match: MatchInfo) => {
    setMatchData(match);
    setShowMatchModal(true);
  }, []);

  // Close match modal
  const closeMatchModal = useCallback(() => {
    setShowMatchModal(false);
    setMatchData(null);
  }, []);

  // Context value (using useMemo like themeContext)
  const contextValue = useMemo(
    () => ({
      // Feed
      profiles,
      feedLoading,
      feedError,
      hasMore,
      loadFeed,
      loadMoreFeed,
      swipe,

      // Matches
      matches,
      matchesLoading,
      matchesError,
      loadMatches,
      unmatch,

      // Preferences
      preferences,
      preferencesLoading,
      savingPreferences,
      loadPreferences,
      updatePreferences,
      updateLocation,
      updateLocationFromGPS,

      // Match modal
      showMatchModal,
      matchData,
      openMatchModal,
      closeMatchModal,
    }),
    [
      profiles,
      feedLoading,
      feedError,
      hasMore,
      loadFeed,
      loadMoreFeed,
      swipe,
      matches,
      matchesLoading,
      matchesError,
      loadMatches,
      unmatch,
      preferences,
      preferencesLoading,
      savingPreferences,
      loadPreferences,
      updatePreferences,
      updateLocation,
      updateLocationFromGPS,
      showMatchModal,
      matchData,
      openMatchModal,
      closeMatchModal,
    ]
  );

  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'matchingContext.tsx:352',message:'MatchingProvider about to render children',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  }, []);
  // #endregion

  return (
    <matchingContext.Provider value={contextValue}>
      {children}
    </matchingContext.Provider>
  );
};

export default matchingContext;
