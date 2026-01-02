/**
 * Onboarding Screen Component
 * 
 * Dynamic screen component that displays questions for a specific screen_order
 */

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOnboarding } from '../../context/onboardingContext';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { FONTS, COLORS, SIZES } from '../../constants/theme';
import Header from '../../layout/Header';
import Button from '../../components/Button/Button';
import QuestionWrapper from '../../components/Onboarding/QuestionWrapper';
import { Question } from '../../types/onboarding';
import { QuestionTextRef } from '../../components/Onboarding/QuestionText';
import { mapResponsesToBatch } from '../../services/onboardingService';

// Define navigation param list for onboarding screens
export type OnboardingScreenParamList = {
  OnboardingScreen: {
    screenOrder: number;
    onCompletion?: () => void;
  };
};

type OnboardingScreenProps = NativeStackScreenProps<
  OnboardingScreenParamList,
  'OnboardingScreen'
>;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const { screenOrder, onCompletion } = route.params;

  const {
    state,
    fetchQuestions,
    getQuestionsForScreen,
    getResponseForQuestion,
    isScreenComplete,
    setCurrentScreen,
    batchUpdateResponses,
  } = useOnboarding();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionCheckKey, setCompletionCheckKey] = useState(0);
  const textQuestionRefs = useRef<Map<string, QuestionTextRef>>(new Map());

  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

  // Load questions for this screen
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // If questions not loaded, fetch them
        if (!state.questions || state.questions.length === 0) {
          await fetchQuestions();
        }

        // Get questions for this screen
        const screenQuestions = getQuestionsForScreen(screenOrder);
        
        if (screenQuestions.length === 0) {
          setError('No questions found for this screen');
        } else {
          // Sort questions by display_order
          const sorted = [...screenQuestions].sort(
            (a, b) => a.display_order - b.display_order
          );
          setQuestions(sorted);
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          'Failed to load questions. Please try again.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
    setCurrentScreen(screenOrder);
  }, [screenOrder, state.questions, fetchQuestions, getQuestionsForScreen, setCurrentScreen]);

  // Track previous responses to detect changes
  const prevResponsesRef = useRef(state.userResponses);
  const prevIsSavingRef = useRef(state.isSaving);

  // Force refresh completion check when responses change
  useEffect(() => {
    const responsesChanged = 
      prevResponsesRef.current.length !== state.userResponses.length ||
      prevResponsesRef.current.some((prevR, idx) => {
        const currR = state.userResponses[idx];
        return !currR || 
          prevR.question_id !== currR.question_id ||
          prevR.option_id !== currR.option_id ||
          prevR.text_value !== currR.text_value ||
          JSON.stringify(prevR.option_ids) !== JSON.stringify(currR.option_ids);
      });

    const savingCompleted = prevIsSavingRef.current && !state.isSaving;

    if (responsesChanged || savingCompleted) {
      // Increment key to force useMemo recomputation
      // Use a small delay to ensure state has fully updated
      const timer = setTimeout(() => {
        setCompletionCheckKey(prev => prev + 1);
      }, savingCompleted ? 300 : 100);
      
      prevResponsesRef.current = state.userResponses;
      prevIsSavingRef.current = state.isSaving;
      
      return () => clearTimeout(timer);
    }
    
    prevResponsesRef.current = state.userResponses;
    prevIsSavingRef.current = state.isSaving;
  }, [state.userResponses, state.isSaving]);

  const handleNext = async () => {
    // First, force-save all text inputs that have unsaved changes
    try {
      const savePromises: Promise<void>[] = [];
      textQuestionRefs.current.forEach((ref) => {
        savePromises.push(ref.save());
      });
      await Promise.all(savePromises);
      
      // Wait for state to update (increased wait time)
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('[OnboardingScreen] Error saving text inputs:', error);
    }

    // Double-check completion before navigating (with retry)
    let isComplete = isScreenComplete(screenOrder);
    let retries = 0;
    const maxRetries = 3;
    
    while (!isComplete && retries < maxRetries) {
      console.log(`[OnboardingScreen] Screen not complete, retrying check (${retries + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 300));
      isComplete = isScreenComplete(screenOrder);
      retries++;
    }
    
    if (!isComplete) {
      console.log('[OnboardingScreen] Screen not complete after retries, cannot proceed');
      console.log('[OnboardingScreen] Current state:', {
        responsesCount: state.userResponses.length,
        screenOrder,
        responses: state.userResponses.filter(r => 
          questions.some(q => q.id === r.question_id)
        ),
      });
      return;
    }

    if (screenOrder < state.totalScreens) {
      // Navigate to next screen, passing onCompletion callback
      navigation.navigate('OnboardingScreen', {
        screenOrder: screenOrder + 1,
        onCompletion,
      });
    } else {
      // Last screen - user pressed Complete button
      console.log('[OnboardingScreen] Complete button pressed, saving responses and completing onboarding');
      try {
        // Batch save all responses to ensure everything is saved
        // Use helper function that filters out invalid responses
        const responses = mapResponsesToBatch(state.userResponses);

        if (responses.length > 0) {
          console.log(`[OnboardingScreen] Batch updating ${responses.length} valid responses`);
          await batchUpdateResponses(responses);
        } else {
          console.log('[OnboardingScreen] No valid responses to batch update');
        }
      } catch (error) {
        console.error('[OnboardingScreen] Error saving responses:', error);
        // Continue with completion even if batch save fails
      }

      // Trigger completion callback to navigate to main app
      console.log('[OnboardingScreen] Triggering onCompletion callback');
      onCompletion?.();
    }
  };

  const handleTextRefReady = (questionId: string) => (ref: QuestionTextRef | null) => {
    if (ref) {
      textQuestionRefs.current.set(questionId, ref);
    } else {
      textQuestionRefs.current.delete(questionId);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (screenOrder > 1) {
      navigation.navigate('OnboardingScreen', {
        screenOrder: screenOrder - 1,
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    fetchQuestions()
      .then(() => {
        const screenQuestions = getQuestionsForScreen(screenOrder);
        const sorted = [...screenQuestions].sort(
          (a, b) => a.display_order - b.display_order
        );
        setQuestions(sorted);
      })
      .catch((err: any) => {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message ||
            'Failed to load questions'
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Recompute screenComplete whenever responses or questions change
  const screenComplete = useMemo(() => {
    const complete = isScreenComplete(screenOrder);
    const screenQuestions = getQuestionsForScreen(screenOrder);
    const requiredQuestions = screenQuestions.filter(q => q.is_required);
    const screenResponses = state.userResponses.filter(r => 
      screenQuestions.some(q => q.id === r.question_id)
    );
    
    console.log(`[OnboardingScreen] Screen ${screenOrder} complete check (key: ${completionCheckKey}):`, {
      complete,
      responsesCount: state.userResponses.length,
      screenResponsesCount: screenResponses.length,
      questionsCount: screenQuestions.length,
      requiredQuestionsCount: requiredQuestions.length,
      requiredQuestions: requiredQuestions.map(q => ({
        id: q.id,
        text: q.question_text,
        type: q.question_type,
        hasResponse: !!screenResponses.find(r => r.question_id === q.id),
        response: screenResponses.find(r => r.question_id === q.id),
      })),
      allResponses: screenResponses.map(r => ({
        questionId: r.question_id,
        hasOptionId: !!r.option_id,
        hasOptionIds: !!(r.option_ids && r.option_ids.length > 0),
        hasTextValue: !!r.text_value,
        textValue: r.text_value,
        optionId: r.option_id,
        optionIds: r.option_ids,
      })),
    });
    return complete;
  }, [isScreenComplete, screenOrder, state.userResponses, state.questions, getQuestionsForScreen, completionCheckKey]);

  const isLastScreen = screenOrder >= state.totalScreens;

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.card, paddingTop: STATUSBAR_HEIGHT },
        ]}
      >
        <Header
          title="StepMatch"
          explore
          leftIcon="back"
          backAction={handleBack}
        />
        <View style={[GlobalStyleSheet.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={[
              FONTS.font,
              { color: colors.text, marginTop: SIZES.margin },
            ]}
          >
            Loading questions...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.card, paddingTop: STATUSBAR_HEIGHT },
        ]}
      >
        <Header
          title="StepMatch"
          explore
          leftIcon="back"
          backAction={handleBack}
        />
        <View style={[GlobalStyleSheet.container, styles.errorContainer]}>
          <Text
            style={[
              FONTS.h5,
              { color: COLORS.danger, marginBottom: SIZES.margin },
            ]}
          >
            Error
          </Text>
          <Text style={[FONTS.font, { color: colors.text, marginBottom: SIZES.margin * 2 }]}>
            {error}
          </Text>
          <Button title="Retry" onPress={handleRetry} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.card,
      }}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1, paddingTop: STATUSBAR_HEIGHT }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Header
              title="StepMatch"
              explore
              leftIcon="back"
              backAction={handleBack}
            />
            <View style={[GlobalStyleSheet.container, { paddingTop: 30 }]}>
              {/* Progress Indicator */}
              <View style={styles.progressContainer}>
                <Text
                  style={[
                    FONTS.font,
                    { color: colors.text },
                  ]}
                >
                  Screen {screenOrder} of {state.totalScreens}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(screenOrder / state.totalScreens) * 100}%`,
                        backgroundColor: COLORS.primary,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Questions */}
              {questions.map((question) => {
                const response = getResponseForQuestion(question.id);
                return (
                  <QuestionWrapper
                    key={question.id}
                    question={question}
                    response={response}
                    disabled={state.isSaving}
                    onRefReady={handleTextRefReady(question.id)}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Bottom Button */}
        <View
          style={[
            GlobalStyleSheet.container,
            {
              paddingHorizontal: 20,
              paddingVertical: 30,
              backgroundColor: colors.card,
            },
          ]}
        >
          {isLastScreen ? (
            <Button
              title={state.isSaving ? "Saving..." : "Complete"}
              onPress={() => {
                if (!state.isSaving) {
                  handleNext();
                }
              }}
              style={(!screenComplete || state.isSaving) ? { opacity: 0.6 } : {}}
              disabled={!screenComplete || state.isSaving}
            />
          ) : (
            <Button
              title={state.isSaving ? "Saving..." : "Next"}
              onPress={() => {
                if (!state.isSaving) {
                  handleNext();
                }
              }}
              style={(!screenComplete || state.isSaving) ? { opacity: 0.6 } : {}}
              disabled={!screenComplete || state.isSaving}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 100,
  },
  progressContainer: {
    marginBottom: SIZES.margin * 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.light,
    borderRadius: 2,
    marginTop: SIZES.margin / 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default OnboardingScreen;

