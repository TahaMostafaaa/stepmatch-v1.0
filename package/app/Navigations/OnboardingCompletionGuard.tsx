/**
 * Onboarding Completion Guard
 * 
 * Component that checks if onboarding is complete via API responses.
 * Routes to onboarding flow if incomplete, otherwise routes to main app.
 */

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { OnboardingProvider, useOnboarding } from '../context/onboardingContext';
import { onboardingApi } from '../api/onboarding.api';
import AppNavigator from './AppNavigator';
import OnboardingNavigatorV2 from './OnboardingNavigatorV2';
import { COLORS, FONTS } from '../constants/theme';

interface OnboardingCompletionGuardProps {
  children?: React.ReactNode;
}

/**
 * Inner component that uses onboarding context
 */
const OnboardingCompletionGuardInner: React.FC<OnboardingCompletionGuardProps> = () => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [isChecking, setIsChecking] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state, fetchQuestions, getUserResponses, getQuestionsForScreen, isScreenComplete } = useOnboarding();

  // Check onboarding completion on mount
  useEffect(() => {
    checkOnboardingCompletion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkOnboardingCompletion = async () => {
    try {
      setIsChecking(true);
      setError(null);

      // Fetch questions directly from API to get fresh data
      let questionsData;
      try {
        const questionsResponse = await onboardingApi.getAllQuestions();
        questionsData = questionsResponse.screens || [];
        
        // Also update context
        if (!state.questions || state.questions.length === 0) {
          await fetchQuestions();
        }
      } catch (err) {
        // If API fails, try to use cached or context state
        if (state.questions && state.questions.length > 0) {
          questionsData = state.questions;
        } else {
          await fetchQuestions();
          questionsData = state.questions || [];
        }
      }

      // Fetch user responses directly from API
      let userResponses;
      try {
        userResponses = await onboardingApi.getUserResponses();
        // Also update context
        await getUserResponses();
      } catch (err) {
        // If API fails, use context state
        userResponses = state.userResponses || [];
        if (userResponses.length === 0) {
          await getUserResponses();
          userResponses = state.userResponses || [];
        }
      }

      // If no questions exist, assume incomplete (show onboarding)
      if (!questionsData || questionsData.length === 0) {
        console.log('[OnboardingGuard] No questions found, showing onboarding');
        setIsComplete(false);
        return;
      }

      // Check if all required questions are answered
      let allComplete = true;
      let hasRequiredQuestions = false;

      for (const screen of questionsData) {
        const requiredQuestions = screen.questions.filter((q) => q.is_required);
        
        if (requiredQuestions.length === 0) continue;
        
        hasRequiredQuestions = true;

        // Check if all required questions in this screen are answered
        const screenComplete = requiredQuestions.every((q) => {
          const response = userResponses.find((r) => r.question_id === q.id);
          if (!response) {
            console.log(`[OnboardingGuard] Missing response for required question: ${q.id} (${q.question_text})`);
            return false;
          }

          // Check if response has value
          if (response.text_value && response.text_value.trim()) return true;
          if (response.option_id) return true;
          if (response.option_ids && response.option_ids.length > 0) return true;

          console.log(`[OnboardingGuard] Response exists but has no value for question: ${q.id}`);
          return false;
        });

        if (!screenComplete) {
          console.log(`[OnboardingGuard] Screen ${screen.screen_order} is incomplete`);
          allComplete = false;
          break;
        }
      }

      // If there are no required questions at all, consider complete
      if (!hasRequiredQuestions) {
        console.log('[OnboardingGuard] No required questions found, marking as complete');
        allComplete = true;
      }

      console.log('[OnboardingGuard] Completion check result:', {
        allComplete,
        totalScreens: questionsData.length,
        questionsCount: questionsData.reduce((sum, s) => sum + s.questions.length, 0),
        responsesCount: userResponses.length,
        hasRequiredQuestions,
      });

      setIsComplete(allComplete);
    } catch (err: any) {
      console.error('Error checking onboarding completion:', err);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Failed to check onboarding status';
      setError(errorMessage);

      // On error, assume incomplete to be safe (user will see onboarding)
      setIsComplete(false);
    } finally {
      setIsChecking(false);
    }
  };

  // Show loading state while checking (must complete within 2 seconds per SC-007)
  if (isChecking) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // If onboarding is complete, route to main app
  if (isComplete) {
    return <AppNavigator />;
  }

  // If onboarding is incomplete, route to onboarding flow
  // Pass checkOnboardingCompletion as callback so navigator can trigger re-check when complete
  return (
    <OnboardingNavigatorV2 onCompletion={checkOnboardingCompletion} />
  );
};

/**
 * Main component that wraps with OnboardingProvider
 */
const OnboardingCompletionGuard: React.FC<OnboardingCompletionGuardProps> = () => {
  return (
    <OnboardingProvider>
      <OnboardingCompletionGuardInner />
    </OnboardingProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingCompletionGuard;
