/**
 * Onboarding Context
 * 
 * Provides global onboarding state using React Context + Reducer pattern.
 * Handles:
 * - Questions fetching and caching
 * - User responses management
 * - Screen navigation state
 * - Loading and error states
 * 
 * Usage: Wrap onboarding flow with <OnboardingProvider>, then use useOnboarding() hook
 */

import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  OnboardingState,
  OnboardingAction,
  QuestionScreen,
  UserResponse,
  Question,
} from '../types/onboarding';
import { onboardingApi } from '../api/onboarding.api';
import {
  cacheQuestions,
  getCachedQuestions,
  cacheResponses,
  getCachedResponses,
} from '../storage/onboardingStorage';

// Initial state
const initialState: OnboardingState = {
  questions: null,
  userResponses: [],
  currentScreen: 1,
  isLoading: false,
  isSaving: false,
  error: null,
  totalScreens: 5,
};

/**
 * Onboarding Reducer
 * Pure function to handle state transitions
 */
const onboardingReducer = (
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState => {
  switch (action.type) {
    case 'FETCH_QUESTIONS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_QUESTIONS_SUCCESS':
      return {
        ...state,
        questions: action.payload,
        isLoading: false,
        error: null,
        totalScreens: action.payload.length,
      };
    case 'FETCH_QUESTIONS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SAVE_RESPONSE_START':
      return {
        ...state,
        isSaving: true,
        error: null,
      };
    case 'SAVE_RESPONSE_SUCCESS':
      // Update or add response to userResponses array
      const existingIndex = state.userResponses.findIndex(
        (r) => r.question_id === action.payload.question_id
      );
      const updatedResponses =
        existingIndex >= 0
          ? [
              ...state.userResponses.slice(0, existingIndex),
              action.payload,
              ...state.userResponses.slice(existingIndex + 1),
            ]
          : [...state.userResponses, action.payload];

      return {
        ...state,
        userResponses: updatedResponses,
        isSaving: false,
        error: null,
      };
    case 'SET_USER_RESPONSES':
      return {
        ...state,
        userResponses: action.payload,
      };
    case 'SET_CURRENT_SCREEN':
      return {
        ...state,
        currentScreen: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'RESET_ONBOARDING':
      return initialState;
    default:
      return state;
  }
};

// Context type definitions
interface OnboardingContextValue {
  state: OnboardingState;
  fetchQuestions: () => Promise<void>;
  fetchQuestionsByScreen: (screenOrder: number) => Promise<QuestionScreen | null>;
  saveResponse: (
    questionId: string,
    optionId?: string,
    textValue?: string
  ) => Promise<void>;
  saveMultipleResponses: (
    questionId: string,
    optionIds: string[]
  ) => Promise<void>;
  getUserResponses: () => Promise<void>;
  batchUpdateResponses: (responses: any[]) => Promise<void>;
  setCurrentScreen: (screen: number) => void;
  clearError: () => void;
  resetOnboarding: () => void;
  getQuestionsForScreen: (screenOrder: number) => Question[];
  getResponseForQuestion: (questionId: string) => UserResponse | undefined;
  isScreenComplete: (screenOrder: number) => boolean;
}

// Create context with undefined default
export const OnboardingContext = createContext<
  OnboardingContextValue | undefined
>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

/**
 * Onboarding Provider Component
 * Wraps the onboarding flow and provides state/actions
 */
export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  /**
   * Fetch all questions from API
   * Falls back to cached questions if API fails
   */
  const fetchQuestions = useCallback(async (): Promise<void> => {
    dispatch({ type: 'FETCH_QUESTIONS_START' });

    try {
      // Try to fetch from API
      const response = await onboardingApi.getAllQuestions();
      const screens = response.screens;

      // Cache questions for offline access
      await cacheQuestions(response);

      dispatch({ type: 'FETCH_QUESTIONS_SUCCESS', payload: screens });
    } catch (error: any) {
      console.error('Error fetching questions:', error);

      // Try to load from cache
      const cached = await getCachedQuestions();
      if (cached && cached.screens) {
        console.log('Using cached questions');
        dispatch({
          type: 'FETCH_QUESTIONS_SUCCESS',
          payload: cached.screens,
        });
      } else {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          'Failed to fetch questions. Please check your connection.';
        dispatch({ type: 'FETCH_QUESTIONS_FAILURE', payload: errorMessage });
      }
    }
  }, []);

  /**
   * Fetch questions for a specific screen
   */
  const fetchQuestionsByScreen = useCallback(
    async (screenOrder: number): Promise<QuestionScreen | null> => {
      try {
        const screen = await onboardingApi.getQuestionsByScreen(screenOrder);
        return screen;
      } catch (error: any) {
        console.error('Error fetching questions for screen:', error);
        // Try to get from cached questions
        const cached = await getCachedQuestions();
        if (cached) {
          const screen = cached.screens.find((s) => s.screen_order === screenOrder);
          if (screen) return screen;
        }
        return null;
      }
    },
    []
  );

  /**
   * Save a single response (stores locally, will be sent via batch update on Complete)
   */
  const saveResponse = useCallback(
    async (
      questionId: string,
      optionId?: string,
      textValue?: string
    ): Promise<void> => {
      dispatch({ type: 'SAVE_RESPONSE_START' });

      // Create local response object (no API call - will batch save on Complete)
      const localResponse: UserResponse = {
        id: `local-${questionId}-${Date.now()}`,
        question_id: questionId,
        option_id: optionId,
        text_value: textValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update local cache
      const updatedResponses = [...state.userResponses];
      const existingIndex = updatedResponses.findIndex(
        (r) => r.question_id === questionId
      );
      if (existingIndex >= 0) {
        updatedResponses[existingIndex] = localResponse;
      } else {
        updatedResponses.push(localResponse);
      }
      await cacheResponses(updatedResponses);

      console.log('[OnboardingContext] Stored response locally:', {
        questionId,
        optionId,
        textValue,
      });

      dispatch({ type: 'SAVE_RESPONSE_SUCCESS', payload: localResponse });
    },
    [state.userResponses]
  );

  /**
   * Save multiple responses for multi-select question (stores locally, will be sent via batch update on Complete)
   */
  const saveMultipleResponses = useCallback(
    async (questionId: string, optionIds: string[]): Promise<void> => {
      dispatch({ type: 'SAVE_RESPONSE_START' });

      // Create local response object (no API call - will batch save on Complete)
      const localResponse: UserResponse = {
        id: `local-${questionId}-${Date.now()}`,
        question_id: questionId,
        option_ids: optionIds,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update local cache
      const updatedResponses = [...state.userResponses];
      const existingIndex = updatedResponses.findIndex(
        (r) => r.question_id === questionId
      );
      if (existingIndex >= 0) {
        updatedResponses[existingIndex] = localResponse;
      } else {
        updatedResponses.push(localResponse);
      }
      await cacheResponses(updatedResponses);

      console.log('[OnboardingContext] Stored multi-select response locally:', {
        questionId,
        optionIds,
      });

      dispatch({ type: 'SAVE_RESPONSE_SUCCESS', payload: localResponse });
    },
    [state.userResponses]
  );

  /**
   * Fetch user responses from API
   */
  const getUserResponses = useCallback(async (): Promise<void> => {
    try {
      const responses = await onboardingApi.getUserResponses();
      await cacheResponses(responses);
      dispatch({ type: 'SET_USER_RESPONSES', payload: responses });
    } catch (error: any) {
      console.error('Error fetching user responses:', error);
      // Try to load from cache
      const cached = await getCachedResponses();
      if (cached.length > 0) {
        dispatch({ type: 'SET_USER_RESPONSES', payload: cached });
      }
    }
  }, []);

  /**
   * Batch update responses
   * Calls batch API, then refetches responses from server
   */
  const batchUpdateResponses = useCallback(
    async (responses: any[]): Promise<void> => {
      try {
        // Call batch update API
        const result = await onboardingApi.batchUpdateResponses(responses);
        
        console.log('[OnboardingContext] Batch update result:', {
          success: result.success,
          message: result.message,
          total: result.total_responses,
          updated: result.updated_responses,
          created: result.created_responses,
          errors: result.errors,
        });

        // Check for errors in the response
        if (!result.success && result.errors && result.errors.length > 0) {
          const errorMessage = result.errors.join(', ');
          console.error('[OnboardingContext] Batch update had errors:', errorMessage);
          dispatch({ type: 'FETCH_QUESTIONS_FAILURE', payload: errorMessage });
          throw new Error(errorMessage);
        }

        // Refetch user responses from server to get the updated data
        const updatedResponses = await onboardingApi.getUserResponses();
        await cacheResponses(updatedResponses);
        dispatch({ type: 'SET_USER_RESPONSES', payload: updatedResponses });
        
        console.log('[OnboardingContext] Refetched responses after batch update:', updatedResponses.length);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          'Failed to update responses. Please try again.';
        dispatch({ type: 'FETCH_QUESTIONS_FAILURE', payload: errorMessage });
        throw error;
      }
    },
    []
  );

  /**
   * Set current screen
   */
  const setCurrentScreen = useCallback((screen: number) => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  /**
   * Reset onboarding state
   */
  const resetOnboarding = useCallback(() => {
    dispatch({ type: 'RESET_ONBOARDING' });
  }, []);

  /**
   * Get questions for a specific screen
   */
  const getQuestionsForScreen = useCallback(
    (screenOrder: number): Question[] => {
      if (!state.questions) return [];
      const screen = state.questions.find(
        (s) => s.screen_order === screenOrder
      );
      return screen ? screen.questions : [];
    },
    [state.questions]
  );

  /**
   * Get response for a specific question
   */
  const getResponseForQuestion = useCallback(
    (questionId: string): UserResponse | undefined => {
      return state.userResponses.find((r) => r.question_id === questionId);
    },
    [state.userResponses]
  );

  /**
   * Check if all required questions in a screen are answered
   */
  const isScreenComplete = useCallback(
    (screenOrder: number): boolean => {
      const questions = getQuestionsForScreen(screenOrder);
      if (questions.length === 0) {
        console.log(`[isScreenComplete] No questions found for screen ${screenOrder}`);
        return false;
      }

      const requiredQuestions = questions.filter((q) => q.is_required);
      if (requiredQuestions.length === 0) {
        console.log(`[isScreenComplete] No required questions for screen ${screenOrder}`);
        return true;
      }

      const result = requiredQuestions.every((q) => {
        const response = getResponseForQuestion(q.id);
        if (!response) {
          console.log(`[isScreenComplete] Missing response for required question: ${q.id} (${q.question_text})`);
          return false;
        }

        // Check if response has value
        // For text: must have non-empty trimmed value
        if (response.text_value !== undefined && response.text_value !== null) {
          const trimmed = response.text_value.trim();
          if (trimmed.length > 0) {
            console.log(`[isScreenComplete] Text response valid for question: ${q.id}`);
            return true;
          } else {
            console.log(`[isScreenComplete] Text response is empty/whitespace for question: ${q.id}`);
            return false;
          }
        }
        
        // For single-select: must have option_id
        if (response.option_id) {
          console.log(`[isScreenComplete] Option response valid for question: ${q.id}`);
          return true;
        }
        
        // For multi-select: must have at least one option_id
        if (response.option_ids && response.option_ids.length > 0) {
          console.log(`[isScreenComplete] Multi-select response valid for question: ${q.id} (${response.option_ids.length} options)`);
          return true;
        }

        console.log(`[isScreenComplete] Response exists but has no valid value for question: ${q.id}`, {
          hasTextValue: response.text_value !== undefined,
          textValue: response.text_value,
          hasOptionId: !!response.option_id,
          hasOptionIds: !!(response.option_ids && response.option_ids.length > 0),
        });
        return false;
      });

      console.log(`[isScreenComplete] Screen ${screenOrder} completion: ${result}`, {
        requiredCount: requiredQuestions.length,
        responsesFound: requiredQuestions.map(q => ({
          questionId: q.id,
          hasResponse: !!getResponseForQuestion(q.id),
        })),
      });

      return result;
    },
    [getQuestionsForScreen, getResponseForQuestion]
  );

  // Load cached responses on mount
  useEffect(() => {
    const loadCachedResponses = async () => {
      const cached = await getCachedResponses();
      if (cached.length > 0) {
        dispatch({ type: 'SET_USER_RESPONSES', payload: cached });
      }
    };
    loadCachedResponses();
  }, []);

  const value: OnboardingContextValue = {
    state,
    fetchQuestions,
    fetchQuestionsByScreen,
    saveResponse,
    saveMultipleResponses,
    getUserResponses,
    batchUpdateResponses,
    setCurrentScreen,
    clearError,
    resetOnboarding,
    getQuestionsForScreen,
    getResponseForQuestion,
    isScreenComplete,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

/**
 * Hook to use onboarding context
 * @throws Error if used outside OnboardingProvider
 */
export const useOnboarding = (): OnboardingContextValue => {
  const context = React.useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
