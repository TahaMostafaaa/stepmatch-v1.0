/**
 * Onboarding Navigator
 * 
 * Stack navigator for onboarding screens.
 * Handles navigation through onboarding questions based on completion status.
 */

import React, { useRef, useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Profile } from '../auth/auth.types';
import { getMissingRequiredQuestions, isOnboardingComplete } from '../services/onboardingService';
import { authApi } from '../api/auth.api';
import { getUserImages } from '../api/images.api';

// Import onboarding screens
import FirstName from '../pages/info/FirstName';
import EnterBirthDate from '../pages/info/EnterBirthDate';
import YourGender from '../pages/info/YourGender';
import Orientation from '../pages/info/Orientation';
import Intrested from '../pages/info/Intrested';
import LookingFor from '../pages/info/LookingFor';
import RecentPics from '../pages/info/RecentPics';

// Navigation param list for onboarding stack
export type OnboardingStackParamList = {
  FirstName: undefined;
  EnterBirthDate: undefined;
  YourGender: undefined;
  Orientation: undefined;
  Intrested: undefined;
  LookingFor: undefined;
  RecentPics: { onCompletion?: () => void } | undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

interface OnboardingNavigatorProps {
  profile?: Profile | null;
  onCompletion?: () => void;
}

const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ profile, onCompletion }) => {
  const navigation = useNavigation<any>();
  const lastCheckTimeRef = useRef<number>(0);
  const CHECK_DEBOUNCE_MS = 1000; // Minimum time between checks (1 second)

  // Wrapper component to ensure onCompletion callback is always available
  // Defined inside OnboardingNavigator to access onCompletion via closure
  const RecentPicsWrapper = React.useCallback((props: any) => {
    // Merge onCompletion from parent navigator into route params
    const routeWithCallback = {
      ...props.route,
      params: {
        ...props.route.params,
        onCompletion: props.route.params?.onCompletion || onCompletion,
      },
    };
    
    return <RecentPics {...props} route={routeWithCallback} />;
  }, [onCompletion]);

  // Check completion status when screens come into focus (on-demand instead of polling)
  useFocusEffect(
    useCallback(() => {
      const checkCompletion = async () => {
        const now = Date.now();
        // Debounce: only check if enough time has passed since last check
        if (now - lastCheckTimeRef.current < CHECK_DEBOUNCE_MS) {
          return;
        }
        
        lastCheckTimeRef.current = now;
        
        try {
          // Fetch both profile and images in parallel
          // Use getUserImages() as source of truth for photo detection
          const [currentProfile, images] = await Promise.all([
            authApi.getProfile(),
            getUserImages().catch(() => []) // Fallback to empty array on error
          ]);
          
          // Pass images array to completion check for accurate photo detection
          if (isOnboardingComplete(currentProfile, images)) {
            // Onboarding complete - trigger parent guard to re-check
            onCompletion?.();
          }
        } catch (error) {
          console.error('Error checking completion:', error);
        }
      };

      // Check when screen comes into focus (user navigates to/back to a screen)
      checkCompletion();
    }, [onCompletion])
  );

  // Determine initial route based on missing questions
  const getInitialRoute = (): keyof OnboardingStackParamList => {
    if (!profile) {
      // No profile data - start from beginning
      return 'FirstName';
    }

    const missing = getMissingRequiredQuestions(profile);
    if (missing.length === 0) {
      // All required questions answered - trigger completion check
      onCompletion?.();
      return 'FirstName'; // Fallback
    }

    // Map missing question IDs to screen names
    const questionToScreen: Record<string, keyof OnboardingStackParamList> = {
      firstName: 'FirstName',
      birthdate: 'EnterBirthDate',
      gender: 'YourGender',
      orientation: 'Orientation',
      interests: 'Intrested',
      lookingFor: 'LookingFor',
      photos: 'RecentPics',
    };

    // Return first missing question's screen
    const firstMissing = missing[0];
    return questionToScreen[firstMissing] || 'FirstName';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="FirstName" component={FirstName} />
      <Stack.Screen name="EnterBirthDate" component={EnterBirthDate} />
      <Stack.Screen name="YourGender" component={YourGender} />
      <Stack.Screen name="Orientation" component={Orientation} />
      <Stack.Screen name="Intrested" component={Intrested} />
      <Stack.Screen name="LookingFor" component={LookingFor} />
      <Stack.Screen 
        name="RecentPics" 
        component={RecentPicsWrapper}
        initialParams={{ onCompletion }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;

