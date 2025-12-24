/**
 * Auth Guard
 * 
 * Navigation guard that switches between Auth and App navigators
 * based on authentication state.
 * 
 * - Shows loading screen while checking auth status
 * - Shows AuthNavigator for unauthenticated users
 * - Shows AppNavigator for authenticated users
 * - Handles navigation reset to prevent back navigation into auth screens
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useAuth } from '../auth/auth.hooks';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { COLORS, IMAGES } from '../constants/theme';

const AuthGuard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking auth status
  // This prevents flash of wrong screen on app start
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          style={styles.splashImage}
          resizeMode="cover"
          source={IMAGES.Splash}
        />
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  // Route to appropriate navigator based on auth state
  // The navigator switch automatically resets the navigation stack,
  // preventing users from navigating "back" to the other stack
  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  loaderOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default AuthGuard;

