/**
 * Onboarding Navigator V2
 * 
 * Stack navigator for API-driven onboarding screens.
 * Handles navigation through 5 screens based on screen_order.
 * 
 * NOTE: Completion is triggered manually by pressing the Complete button,
 * NOT automatically when all questions are answered.
 */

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useOnboarding } from '../context/onboardingContext';
import OnboardingScreen from '../pages/Onboarding/OnboardingScreen';

// Navigation param list for onboarding stack
export type OnboardingStackParamListV2 = {
  OnboardingScreen: {
    screenOrder: number;
    onCompletion?: () => void;
  };
};

const Stack = createNativeStackNavigator<OnboardingStackParamListV2>();

interface OnboardingNavigatorV2Props {
  onCompletion?: () => void;
}

const OnboardingNavigatorV2: React.FC<OnboardingNavigatorV2Props> = ({
  onCompletion,
}) => {
  const {
    state,
    fetchQuestions,
    getUserResponses,
    isScreenComplete,
  } = useOnboarding();

  // Fetch questions on mount
  useEffect(() => {
    const initialize = async () => {
      if (!state.questions || state.questions.length === 0) {
        await fetchQuestions();
      }
      // Load existing responses
      await getUserResponses();
    };
    initialize();
  }, []);

  // NOTE: Auto-completion removed - user must press Complete button to navigate

  // Determine initial route based on user responses
  const getInitialRoute = (): keyof OnboardingStackParamListV2 => {
    // Find first incomplete screen
    for (let i = 1; i <= state.totalScreens; i++) {
      if (!isScreenComplete(i)) {
        return 'OnboardingScreen';
      }
    }
    // All complete, start from screen 1
    return 'OnboardingScreen';
  };

  const getInitialParams = () => {
    // Find first incomplete screen
    for (let i = 1; i <= state.totalScreens; i++) {
      if (!isScreenComplete(i)) {
        return { screenOrder: i, onCompletion };
      }
    }
    // All complete, start from screen 1
    return { screenOrder: 1, onCompletion };
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        initialParams={getInitialParams()}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigatorV2;

