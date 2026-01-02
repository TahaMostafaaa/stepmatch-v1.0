/**
 * Onboarding API Functions
 * 
 * Typed API functions for onboarding questions endpoints.
 * Uses the central apiClient for requests.
 */

import apiClient from './apiClient';
import {
  QuestionsResponse,
  QuestionScreen,
  SaveResponseRequest,
  SaveResponseResponse,
  SaveMultipleResponsesRequest,
  UserResponse,
  BatchUpdateRequest,
  BatchResponseItem,
} from '../types/onboarding';

/**
 * Onboarding API object containing all question endpoints
 */
export const onboardingApi = {
  /**
   * Get all onboarding questions (grouped by screen)
   * @returns QuestionsResponse with screens array and total_questions
   * @throws 401 for unauthorized, 500 for server errors
   */
  getAllQuestions: async (): Promise<QuestionsResponse> => {
    const response = await apiClient.get<QuestionsResponse>('/questions/');
    return response.data;
  },

  /**
   * Get questions for a specific screen
   * @param screenOrder - Screen order number (1-5)
   * @returns QuestionScreen with questions for that screen
   * @throws 401 for unauthorized, 404 if screen not found, 500 for server errors
   */
  getQuestionsByScreen: async (screenOrder: number): Promise<QuestionScreen> => {
    const response = await apiClient.get<QuestionScreen>(
      `/questions/screen/${screenOrder}`
    );
    return response.data;
  },

  /**
   * Save a single response to a question
   * @param questionId - UUID of the question
   * @param optionId - Optional UUID of selected option (for single-select)
   * @param textValue - Optional text value (for text questions)
   * @returns SaveResponseResponse with saved response data
   * @throws 400 for validation errors, 401 for unauthorized, 500 for server errors
   */
  saveResponse: async (
    questionId: string,
    optionId?: string,
    textValue?: string
  ): Promise<SaveResponseResponse> => {
    const requestBody: SaveResponseRequest = {
      question_id: questionId,
    };

    if (optionId) {
      requestBody.option_id = optionId;
    }

    if (textValue !== undefined) {
      requestBody.text_value = textValue;
    }

    const response = await apiClient.post<SaveResponseResponse>(
      '/questions/responses',
      requestBody
    );
    return response.data;
  },

  /**
   * Save multiple responses for a multi-select question
   * @param questionId - UUID of the question
   * @param optionIds - Array of UUIDs for selected options
   * @returns SaveResponseResponse with saved response data
   * @throws 400 for validation errors, 401 for unauthorized, 500 for server errors
   */
  saveMultipleResponses: async (
    questionId: string,
    optionIds: string[]
  ): Promise<SaveResponseResponse> => {
    const requestBody: SaveMultipleResponsesRequest = {
      question_id: questionId,
      option_ids: optionIds,
    };

    const response = await apiClient.post<SaveResponseResponse>(
      '/questions/responses/multiple',
      requestBody
    );
    return response.data;
  },

  /**
   * Get all responses for the authenticated user
   * @returns Array of UserResponse objects
   * @throws 401 for unauthorized, 500 for server errors
   */
  getUserResponses: async (): Promise<UserResponse[]> => {
    const response = await apiClient.get<UserResponse[]>('/questions/responses');
    return response.data;
  },

  /**
   * Batch update multiple responses
   * @param responses - Array of BatchResponseItem objects
   * @returns Array of updated UserResponse objects
   * @throws 400 for validation errors, 401 for unauthorized, 500 for server errors
   */
  batchUpdateResponses: async (
    responses: BatchResponseItem[]
  ): Promise<UserResponse[]> => {
    const requestBody: BatchUpdateRequest = {
      responses,
    };

    const response = await apiClient.put<UserResponse[]>(
      '/questions/responses/batch',
      requestBody
    );
    return response.data;
  },
};

