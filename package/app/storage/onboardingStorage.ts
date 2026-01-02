/**
 * Onboarding Storage Utilities
 * 
 * Functions for storing and retrieving onboarding questions and responses locally
 * Uses AsyncStorage for React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  QuestionScreen,
  UserResponse,
  QuestionsResponse,
} from '../types/onboarding';

// Storage keys
const STORAGE_KEYS = {
  CACHED_QUESTIONS: 'onboarding_cached_questions',
  CACHED_RESPONSES: 'onboarding_cached_responses',
  CACHED_TIMESTAMP: 'onboarding_cached_timestamp',
} as const;

/**
 * Cache questions locally for offline access
 * @param questions - QuestionsResponse to cache
 */
export const cacheQuestions = async (
  questions: QuestionsResponse
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CACHED_QUESTIONS,
      JSON.stringify(questions)
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.CACHED_TIMESTAMP,
      new Date().toISOString()
    );
  } catch (error) {
    console.error('Error caching questions:', error);
    throw error;
  }
};

/**
 * Get cached questions from local storage
 * @returns Cached QuestionsResponse or null if not found
 */
export const getCachedQuestions = async (): Promise<QuestionsResponse | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_QUESTIONS);
    if (!data) return null;
    return JSON.parse(data) as QuestionsResponse;
  } catch (error) {
    console.error('Error getting cached questions:', error);
    return null;
  }
};

/**
 * Get cache timestamp
 * @returns ISO timestamp string or null
 */
export const getCacheTimestamp = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.CACHED_TIMESTAMP);
  } catch (error) {
    console.error('Error getting cache timestamp:', error);
    return null;
  }
};

/**
 * Cache user responses locally
 * @param responses - Array of UserResponse objects to cache
 */
export const cacheResponses = async (
  responses: UserResponse[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CACHED_RESPONSES,
      JSON.stringify(responses)
    );
  } catch (error) {
    console.error('Error caching responses:', error);
    throw error;
  }
};

/**
 * Get cached responses from local storage
 * @returns Array of cached UserResponse objects or empty array if not found
 */
export const getCachedResponses = async (): Promise<UserResponse[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_RESPONSES);
    if (!data) return [];
    return JSON.parse(data) as UserResponse[];
  } catch (error) {
    console.error('Error getting cached responses:', error);
    return [];
  }
};

/**
 * Clear all cached onboarding data
 */
export const clearOnboardingCache = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CACHED_QUESTIONS,
      STORAGE_KEYS.CACHED_RESPONSES,
      STORAGE_KEYS.CACHED_TIMESTAMP,
    ]);
  } catch (error) {
    console.error('Error clearing onboarding cache:', error);
  }
};

/**
 * Clear only cached responses (keep questions)
 */
export const clearCachedResponses = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CACHED_RESPONSES);
  } catch (error) {
    console.error('Error clearing cached responses:', error);
  }
};

