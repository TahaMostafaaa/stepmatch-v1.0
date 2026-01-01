/**
 * Onboarding Service
 * 
 * Service for managing onboarding flow, validation, and progress tracking.
 * Handles:
 * - Question definitions (required/optional)
 * - Validation rules
 * - Progress tracking
 * - Local storage helpers
 * - Retry queue management
 */

import { Profile } from '../auth/auth.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Question IDs for tracking
export const ONBOARDING_QUESTIONS = {
  FIRST_NAME: 'firstName',
  BIRTHDATE: 'birthdate',
  GENDER: 'gender',
  ORIENTATION: 'orientation',
  INTERESTS: 'interests',
  LOOKING_FOR: 'lookingFor',
  PHOTOS: 'photos',
} as const;

export type QuestionId = typeof ONBOARDING_QUESTIONS[keyof typeof ONBOARDING_QUESTIONS];

// Question definitions
export interface QuestionDefinition {
  id: QuestionId;
  required: boolean;
  order: number;
  screenName: string;
}

export const QUESTION_DEFINITIONS: QuestionDefinition[] = [
  { id: ONBOARDING_QUESTIONS.FIRST_NAME, required: true, order: 1, screenName: 'FirstName' },
  { id: ONBOARDING_QUESTIONS.BIRTHDATE, required: true, order: 2, screenName: 'EnterBirthDate' },
  { id: ONBOARDING_QUESTIONS.GENDER, required: true, order: 3, screenName: 'YourGender' },
  { id: ONBOARDING_QUESTIONS.ORIENTATION, required: true, order: 4, screenName: 'Orientation' },
  { id: ONBOARDING_QUESTIONS.INTERESTS, required: false, order: 5, screenName: 'Intrested' },
  { id: ONBOARDING_QUESTIONS.LOOKING_FOR, required: false, order: 6, screenName: 'LookingFor' },
  { id: ONBOARDING_QUESTIONS.PHOTOS, required: true, order: 7, screenName: 'RecentPics' },
];

// Onboarding progress data structure
export interface OnboardingProgress {
  userId: string;
  answeredQuestions: {
    firstName?: string;
    birthdate?: string; // YYYY-MM-DD
    gender?: string;
    orientation?: string[];
    interests?: string[];
    lookingFor?: string;
    photos?: string[]; // URLs or local paths
  };
  lastAnsweredQuestion?: QuestionId;
  completedAt?: string; // ISO timestamp
  flowType: 'signup' | 'login';
}

// Retry queue item
export interface RetryQueueItem {
  questionId: QuestionId;
  answer: any;
  timestamp: string;
  retryCount: number;
  lastRetryAt?: string;
}

/**
 * Check if onboarding is complete based on profile data
 * @param profile - User profile data
 * @param images - Optional array of image URLs from getUserImages() API. If provided, uses this instead of profile.images for photo check
 */
export function isOnboardingComplete(profile: Profile, images?: string[]): boolean {
  // Check all required fields
  const hasName = !!profile.name && profile.name.trim().length >= 2;
  const hasBirthdate = !!profile.birthdate;
  // Note: gender and orientation may not be in Profile type yet - assuming they will be added
  const hasGender = !!(profile as any).gender;
  const hasOrientation = !!(profile as any).orientation;
  
  // Use provided images array if available, otherwise fall back to profile.images
  const hasPhotos = images 
    ? images.length > 0 
    : !!(profile.images && profile.images.length > 0);

  return hasName && hasBirthdate && hasGender && hasOrientation && hasPhotos;
}

/**
 * Get missing required questions based on profile data
 * @param profile - User profile data
 * @param images - Optional array of image URLs from getUserImages() API. If provided, uses this instead of profile.images for photo check
 */
export function getMissingRequiredQuestions(profile: Profile, images?: string[]): QuestionId[] {
  const missing: QuestionId[] = [];

  if (!profile.name || profile.name.trim().length < 2) {
    missing.push(ONBOARDING_QUESTIONS.FIRST_NAME);
  }

  if (!profile.birthdate) {
    missing.push(ONBOARDING_QUESTIONS.BIRTHDATE);
  }

  if (!(profile as any).gender) {
    missing.push(ONBOARDING_QUESTIONS.GENDER);
  }

  if (!(profile as any).orientation) {
    missing.push(ONBOARDING_QUESTIONS.ORIENTATION);
  }

  // Use provided images array if available, otherwise fall back to profile.images
  const hasPhotos = images 
    ? images.length > 0 
    : !!(profile.images && profile.images.length > 0);
    
  if (!hasPhotos) {
    missing.push(ONBOARDING_QUESTIONS.PHOTOS);
  }

  return missing;
}

/**
 * Validate name (2-50 characters)
 */
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  if (name.trim().length > 50) {
    return { valid: false, error: 'Name must be 50 characters or less' };
  }
  return { valid: true };
}

/**
 * Validate birthdate (must be 18+ years old)
 */
export function validateBirthdate(birthdate: Date | string): { valid: boolean; error?: string; age?: number } {
  const date = typeof birthdate === 'string' ? new Date(birthdate) : birthdate;
  
  if (!date || isNaN(date.getTime())) {
    return { valid: false, error: 'Please enter a valid birthdate' };
  }

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  if (age < 18) {
    return { valid: false, error: 'You must be at least 18 years old', age };
  }

  return { valid: true, age };
}

/**
 * Validate photo (file size max 10MB, format JPG/PNG)
 */
export function validatePhoto(uri: string, fileSize?: number): { valid: boolean; error?: string } {
  // Check file extension
  const extension = uri.split('.').pop()?.toLowerCase();
  if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
    return { valid: false, error: 'Photo must be in JPG or PNG format' };
  }

  // Check file size if provided (10MB = 10 * 1024 * 1024 bytes)
  const maxSizeBytes = 10 * 1024 * 1024;
  if (fileSize && fileSize > maxSizeBytes) {
    return { valid: false, error: 'Photo must be 10MB or smaller' };
  }

  return { valid: true };
}

/**
 * Validate gender selection (single selection required)
 */
export function validateGender(gender: string | null | undefined): { valid: boolean; error?: string } {
  if (!gender || gender.trim().length === 0) {
    return { valid: false, error: 'Please select your gender' };
  }
  return { valid: true };
}

/**
 * Validate orientation selection (single selection required)
 */
export function validateOrientation(orientation: string[] | null | undefined): { valid: boolean; error?: string } {
  if (!orientation || orientation.length === 0) {
    return { valid: false, error: 'Please select your sexual orientation' };
  }
  if (orientation.length > 1) {
    return { valid: false, error: 'Please select only one option' };
  }
  return { valid: true };
}

/**
 * Get total question count
 */
export function getTotalQuestionCount(): number {
  return QUESTION_DEFINITIONS.length;
}

/**
 * Get current question index (1-based)
 */
export function getCurrentQuestionIndex(questionId: QuestionId): number {
  const question = QUESTION_DEFINITIONS.find(q => q.id === questionId);
  return question ? question.order : 0;
}

/**
 * Get question definition by ID
 */
export function getQuestionDefinition(questionId: QuestionId): QuestionDefinition | undefined {
  return QUESTION_DEFINITIONS.find(q => q.id === questionId);
}

/**
 * Get next question ID in sequence
 */
export function getNextQuestionId(currentQuestionId: QuestionId, answeredQuestions: Set<QuestionId>): QuestionId | null {
  const currentQuestion = QUESTION_DEFINITIONS.find(q => q.id === currentQuestionId);
  if (!currentQuestion) return null;

  // Find next unanswered question
  for (let i = currentQuestion.order; i < QUESTION_DEFINITIONS.length; i++) {
    const nextQuestion = QUESTION_DEFINITIONS[i];
    if (!answeredQuestions.has(nextQuestion.id)) {
      return nextQuestion.id;
    }
  }

  return null;
}

/**
 * Get storage key for onboarding progress
 */
export function getOnboardingProgressKey(userId: string): string {
  return `onboarding_progress_${userId}`;
}

/**
 * Get storage key for retry queue
 */
export function getRetryQueueKey(userId: string): string {
  return `onboarding_retry_queue_${userId}`;
}

/**
 * Save onboarding progress to local storage
 */
export async function saveOnboardingProgress(progress: OnboardingProgress): Promise<void> {
  try {
    const key = getOnboardingProgressKey(progress.userId);
    await AsyncStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving onboarding progress:', error);
    throw error;
  }
}

/**
 * Get onboarding progress from local storage
 */
export async function getOnboardingProgress(userId: string): Promise<OnboardingProgress | null> {
  try {
    const key = getOnboardingProgressKey(userId);
    const data = await AsyncStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as OnboardingProgress;
  } catch (error) {
    console.error('Error getting onboarding progress:', error);
    return null;
  }
}

/**
 * Clear onboarding progress from local storage
 */
export async function clearOnboardingProgress(userId: string): Promise<void> {
  try {
    const key = getOnboardingProgressKey(userId);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing onboarding progress:', error);
  }
}

/**
 * Save answer locally (for offline support)
 */
export async function saveAnswerLocally(
  userId: string,
  questionId: QuestionId,
  answer: any,
  flowType: 'signup' | 'login'
): Promise<void> {
  try {
    const progress = await getOnboardingProgress(userId) || {
      userId,
      answeredQuestions: {},
      flowType,
    };

    // Update answer
    (progress.answeredQuestions as any)[questionId] = answer;
    progress.lastAnsweredQuestion = questionId;

    await saveOnboardingProgress(progress);
  } catch (error) {
    console.error('Error saving answer locally:', error);
    throw error;
  }
}

/**
 * Get retry queue from storage
 */
export async function getRetryQueue(userId: string): Promise<RetryQueueItem[]> {
  try {
    const key = getRetryQueueKey(userId);
    const data = await AsyncStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data) as RetryQueueItem[];
  } catch (error) {
    console.error('Error getting retry queue:', error);
    return [];
  }
}

/**
 * Add item to retry queue
 */
export async function addToRetryQueue(
  userId: string,
  questionId: QuestionId,
  answer: any
): Promise<void> {
  try {
    const queue = await getRetryQueue(userId);
    const item: RetryQueueItem = {
      questionId,
      answer,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };
    queue.push(item);
    
    const key = getRetryQueueKey(userId);
    await AsyncStorage.setItem(key, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to retry queue:', error);
  }
}

/**
 * Remove item from retry queue
 */
export async function removeFromRetryQueue(userId: string, questionId: QuestionId): Promise<void> {
  try {
    const queue = await getRetryQueue(userId);
    const filtered = queue.filter(item => item.questionId !== questionId);
    
    const key = getRetryQueueKey(userId);
    await AsyncStorage.setItem(key, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from retry queue:', error);
  }
}

/**
 * Clear retry queue
 */
export async function clearRetryQueue(userId: string): Promise<void> {
  try {
    const key = getRetryQueueKey(userId);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing retry queue:', error);
  }
}

/**
 * Calculate exponential backoff delay (1s, 2s, 4s, 8s, max 30s)
 */
export function calculateBackoffDelay(retryCount: number): number {
  const delay = Math.min(Math.pow(2, retryCount) * 1000, 30000); // Max 30 seconds
  return delay;
}

