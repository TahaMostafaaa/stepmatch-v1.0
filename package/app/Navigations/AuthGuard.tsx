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

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useAuth } from '../auth/auth.hooks';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { COLORS, IMAGES } from '../constants/theme';

const AuthGuard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthGuard.tsx:21',message:'AuthGuard auth state',data:{isAuthenticated,isLoading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
  }, [isAuthenticated, isLoading]);
  // #endregion

  // #region agent log
  useEffect(() => {
    if (isLoading) {
      fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthGuard.tsx:28',message:'AuthGuard showing loading screen',data:{isLoading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
    } else {
      fetch('http://127.0.0.1:7242/ingest/9eba5a3f-effc-404b-8ca6-35a671e4da8f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthGuard.tsx:30',message:'AuthGuard routing to navigator',data:{isAuthenticated,showing:isAuthenticated?'AppNavigator':'AuthNavigator'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
    }
  }, [isLoading, isAuthenticated]);
  // #endregion

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

