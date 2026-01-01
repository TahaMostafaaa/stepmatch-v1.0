/**
 * Onboarding Completion Guard
 * 
 * Component that checks profile completeness and routes users accordingly:
 * - If onboarding incomplete → routes to OnboardingNavigator
 * - If onboarding complete → routes to AppNavigator
 * 
 * Similar pattern to LocationPermissionGuard
 */

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { authApi } from '../api/auth.api';
import { getUserImages } from '../api/images.api';
import { isOnboardingComplete } from '../services/onboardingService';
import { Profile } from '../auth/auth.types';
import OnboardingNavigator from './OnboardingNavigator';
import AppNavigator from './AppNavigator';

interface OnboardingCompletionGuardProps {
  children?: React.ReactNode;
}

const OnboardingCompletionGuard: React.FC<OnboardingCompletionGuardProps> = () => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [isChecking, setIsChecking] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check onboarding completion on mount
  useEffect(() => {
    checkOnboardingCompletion();
  }, []);

  const checkOnboardingCompletion = async () => {
    try {
      setIsChecking(true);
      setError(null);
      
      // Fetch both profile and images in parallel
      // Use getUserImages() as source of truth for photo detection
      // Use timeout to ensure check completes within 2 seconds (SC-007)
      const profilePromise = authApi.getProfile();
      const imagesPromise = getUserImages().catch(() => []); // Fallback to empty array on error
      const timeoutPromise = new Promise<[Profile, string[]]>((_, reject) => 
        setTimeout(() => reject(new Error('Profile check timeout')), 2000)
      );
      
      const [profileData, images] = await Promise.race([
        Promise.all([profilePromise, imagesPromise]),
        timeoutPromise
      ]);
      
      setProfile(profileData);
      
      // Pass images array to completion check for accurate photo detection
      const complete = isOnboardingComplete(profileData, images);
      setIsComplete(complete);
    } catch (err: any) {
      console.error('Error checking onboarding completion:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to check onboarding status';
      setError(errorMessage);
      
      // On error, assume incomplete to be safe (user will see onboarding)
      setIsComplete(false);
    } finally {
      setIsChecking(false);
    }
  };

  // Expose check function for child components to trigger re-check
  React.useImperativeHandle(React.useRef(), () => ({
    recheck: checkOnboardingCompletion,
  }));

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
  return <OnboardingNavigator profile={profile} onCompletion={checkOnboardingCompletion} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingCompletionGuard;

