/**
 * Onboarding Service
 * 
 * Service for managing onboarding flow, validation, and progress tracking.
 * Handles:
 * - Question definitions (required/optional)
 * - Validation rules
 * - Progress tracking
 * - Screen navigation helpers
 */

import {
  Question,
  QuestionScreen,
  UserResponse,
  BatchResponseItem,
} from '../types/onboarding';

/**
 * Validate if all required questions in a screen are answered
 * @param screen - QuestionScreen to validate
 * @param responses - Array of UserResponse objects
 * @returns true if all required questions are answered, false otherwise
 */
export function validateRequiredQuestions(
  screen: QuestionScreen,
  responses: UserResponse[]
): boolean {
  const requiredQuestions = screen.questions.filter((q) => q.is_required);
  if (requiredQuestions.length === 0) return true;

  return requiredQuestions.every((q) => {
    const response = responses.find((r) => r.question_id === q.id);
    if (!response) return false;

    // Check if response has value
    if (response.text_value) return true;
    if (response.option_id) return true;
    if (response.option_ids && response.option_ids.length > 0) return true;

    return false;
  });
}

/**
 * Get the next screen order based on current screen and responses
 * @param currentScreen - Current screen order (1-5)
 * @param totalScreens - Total number of screens
 * @param screens - Array of QuestionScreen objects
 * @param responses - Array of UserResponse objects
 * @returns Next screen order or null if no next screen
 */
export function getNextScreen(
  currentScreen: number,
  totalScreens: number,
  screens: QuestionScreen[],
  responses: UserResponse[]
): number | null {
  if (currentScreen >= totalScreens) return null;

  // Find next incomplete screen
  for (let i = currentScreen + 1; i <= totalScreens; i++) {
    const screen = screens.find((s) => s.screen_order === i);
    if (!screen) continue;

    if (!validateRequiredQuestions(screen, responses)) {
      return i;
    }
  }

  // All remaining screens are complete, return next screen
  return currentScreen < totalScreens ? currentScreen + 1 : null;
}

/**
 * Get the first incomplete screen
 * @param screens - Array of QuestionScreen objects
 * @param responses - Array of UserResponse objects
 * @returns Screen order of first incomplete screen, or null if all complete
 */
export function getFirstIncompleteScreen(
  screens: QuestionScreen[],
  responses: UserResponse[]
): number | null {
  for (const screen of screens) {
    if (!validateRequiredQuestions(screen, responses)) {
      return screen.screen_order;
    }
  }
  return null;
}

/**
 * Check if all screens are complete
 * @param screens - Array of QuestionScreen objects
 * @param responses - Array of UserResponse objects
 * @returns true if all required questions in all screens are answered
 */
export function areAllScreensComplete(
  screens: QuestionScreen[],
  responses: UserResponse[]
): boolean {
  return screens.every((screen) =>
    validateRequiredQuestions(screen, responses)
  );
}

/**
 * Convert user responses to batch update format
 * Excludes multi-select responses (with option_ids) as they're already saved individually.
 * Only includes single-select (option_id) and text (text_value) responses.
 * @param responses - Array of UserResponse objects
 * @returns Array of BatchResponseItem objects with valid values only (excluding multi-select)
 */
export function mapResponsesToBatch(
  responses: UserResponse[]
): BatchResponseItem[] {
  return responses
    .filter((r) => {
      // Exclude multi-select responses (they're already saved individually via saveMultipleResponses)
      // Only include single-select and text responses
      return (
        r.option_id || // Single-select
        (r.text_value && r.text_value.trim().length > 0) // Text
      );
      // Note: Excluding option_ids responses as they're already saved and API may not accept them in batch
    })
    .map((r) => {
      const batchItem: BatchResponseItem = {
        question_id: r.question_id,
      };
      if (r.option_id) {
        batchItem.option_id = r.option_id;
      } else if (r.text_value) {
        batchItem.text_value = r.text_value;
      }
      return batchItem;
    });
}

/**
 * Get response for a specific question
 * @param questionId - Question ID
 * @param responses - Array of UserResponse objects
 * @returns UserResponse or undefined
 */
export function getResponseForQuestion(
  questionId: string,
  responses: UserResponse[]
): UserResponse | undefined {
  return responses.find((r) => r.question_id === questionId);
}

/**
 * Check if a question is answered
 * @param question - Question object
 * @param responses - Array of UserResponse objects
 * @returns true if question is answered, false otherwise
 */
export function isQuestionAnswered(
  question: Question,
  responses: UserResponse[]
): boolean {
  const response = getResponseForQuestion(question.id, responses);
  if (!response) return false;

  // Check if response has value
  if (response.text_value) return true;
  if (response.option_id) return true;
  if (response.option_ids && response.option_ids.length > 0) return true;

  return false;
}

/**
 * Get completion percentage for onboarding
 * @param screens - Array of QuestionScreen objects
 * @param responses - Array of UserResponse objects
 * @returns Completion percentage (0-100)
 */
export function getCompletionPercentage(
  screens: QuestionScreen[],
  responses: UserResponse[]
): number {
  if (screens.length === 0) return 0;

  let totalRequired = 0;
  let answeredRequired = 0;

  screens.forEach((screen) => {
    screen.questions.forEach((question) => {
      if (question.is_required) {
        totalRequired++;
        if (isQuestionAnswered(question, responses)) {
          answeredRequired++;
        }
      }
    });
  });

  if (totalRequired === 0) return 100;
  return Math.round((answeredRequired / totalRequired) * 100);
}

/**
 * Get missing required questions for a screen
 * @param screen - QuestionScreen to check
 * @param responses - Array of UserResponse objects
 * @returns Array of Question objects that are required but not answered
 */
export function getMissingRequiredQuestionsForScreen(
  screen: QuestionScreen,
  responses: UserResponse[]
): Question[] {
  return screen.questions.filter((q) => {
    if (!q.is_required) return false;
    return !isQuestionAnswered(q, responses);
  });
}
