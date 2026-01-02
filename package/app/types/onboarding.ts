/**
 * Onboarding API Types
 * 
 * TypeScript interfaces matching the onboarding questions API response structures.
 */

/**
 * Question option structure
 */
export interface QuestionOption {
  id: string; // UUID
  option_text: string;
  option_value: string;
  display_order: number;
}

/**
 * Question category types
 */
export type QuestionCategory = 
  | 'basic_info' 
  | 'dance_style' 
  | 'lifestyle' 
  | 'proficiency' 
  | 'life_goals';

/**
 * Question type
 */
export type QuestionType = 
  | 'single_select' 
  | 'multi_select' 
  | 'text';

/**
 * Question structure
 */
export interface Question {
  id: string; // UUID
  question_text: string;
  category: QuestionCategory;
  question_type: QuestionType;
  display_order: number;
  screen_order: number; // 1-5
  is_required: boolean;
  options: QuestionOption[];
}

/**
 * Screen structure containing questions
 */
export interface QuestionScreen {
  screen_order: number; // 1-5
  questions: Question[];
}

/**
 * GET /questions/ response structure
 */
export interface QuestionsResponse {
  screens: QuestionScreen[];
  total_questions: number;
}

/**
 * POST /questions/responses request body
 */
export interface SaveResponseRequest {
  question_id: string; // UUID
  option_id?: string; // UUID (for single-select questions)
  text_value?: string; // For text responses
}

/**
 * POST /questions/responses response
 */
export interface SaveResponseResponse {
  id: string;
  question_id: string;
  option_id?: string;
  option_ids?: string[]; // For multi-select responses
  text_value?: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/**
 * POST /questions/responses/multiple request body
 */
export interface SaveMultipleResponsesRequest {
  question_id: string; // UUID
  option_ids: string[]; // Array of UUIDs
}

/**
 * GET /questions/responses response item
 */
export interface UserResponse {
  id: string;
  question_id: string;
  option_id?: string;
  option_ids?: string[]; // For multi-select responses
  text_value?: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/**
 * PUT /questions/responses/batch request body item
 */
export interface BatchResponseItem {
  question_id: string;
  option_ids?: string[]; // For multi-select
  option_id?: string; // For single-select
  text_value?: string; // For text responses
}

/**
 * PUT /questions/responses/batch request body
 */
export interface BatchUpdateRequest {
  responses: BatchResponseItem[];
}

/**
 * Onboarding context state
 */
export interface OnboardingState {
  questions: QuestionScreen[] | null;
  userResponses: UserResponse[];
  currentScreen: number; // 1-5
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  totalScreens: number;
}

/**
 * Onboarding context actions
 */
export type OnboardingAction =
  | { type: 'FETCH_QUESTIONS_START' }
  | { type: 'FETCH_QUESTIONS_SUCCESS'; payload: QuestionScreen[] }
  | { type: 'FETCH_QUESTIONS_FAILURE'; payload: string }
  | { type: 'SAVE_RESPONSE_START' }
  | { type: 'SAVE_RESPONSE_SUCCESS'; payload: UserResponse }
  | { type: 'SAVE_RESPONSE_FAILURE'; payload: string }
  | { type: 'SET_USER_RESPONSES'; payload: UserResponse[] }
  | { type: 'SET_CURRENT_SCREEN'; payload: number }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_ONBOARDING' };

