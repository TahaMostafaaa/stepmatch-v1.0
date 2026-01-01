/**
 * Matching API Type Definitions
 * 
 * TypeScript interfaces matching the FastAPI backend response structures
 */

// Profile image structure
export interface ProfileImage {
  id: string;
  image_url: string;
  display_order: number;
}

// Profile card displayed in feed
export interface ProfileCard {
  id: string;
  name: string;
  age: number | null;
  images: ProfileImage[];
  distance_km: number | null;
  dance_styles: string[];
  dance_role: string | null;
  proficiency: string | null;
  goals: string[];
  bio: string | null;
}

// Match information
export interface MatchInfo {
  id: string;
  matched_user_id: string;
  matched_user_name: string | null;
  matched_user_image: string | null;
  matched_at: string;
}

// Feed response
export interface FeedResponse {
  profiles: ProfileCard[];
  total_count: number;
  has_more: boolean;
}

// Swipe request body
export interface SwipeRequest {
  action: 'like' | 'pass';
}

// Swipe response
export interface SwipeResponse {
  success: boolean;
  action: 'like' | 'pass';
  is_match: boolean;
  match: MatchInfo | null;
  message: string;
}

// Matches response
export interface MatchesResponse {
  matches: MatchInfo[];
  total_count: number;
}

// Location update request
export interface LocationUpdateRequest {
  latitude: number;
  longitude: number;
}

// Location update response
export interface LocationUpdateResponse {
  success: boolean;
  latitude: number;
  longitude: number;
  last_location_update: string;
}

// Preferences update request
export interface PreferencesUpdateRequest {
  search_radius_km?: number;
  min_age?: number;
  max_age?: number;
}

// Preferences update response
export interface PreferencesUpdateResponse {
  success: boolean;
  search_radius_km: number;
  min_age: number;
  max_age: number;
}

// User preferences (get response)
export interface UserPreferences {
  search_radius_km: number;
  min_age: number;
  max_age: number;
  latitude: number | null;
  longitude: number | null;
  last_location_update: string | null;
}
