/**
 * Location Permission Guard
 * 
 * Component that blocks dashboard access until location permission is granted.
 * Shows PermissionModal when permission is not granted and handles permanent denial.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Platform } from 'react-native';
import PermissionModal from '../components/PermissionModal';
import { getLocationPermissionState, requestLocationPermission } from '../services/locationService';
import { LocationPermissionState } from '../services/locationService';
import { COLORS, FONTS, IMAGES } from '../constants/theme';

interface LocationPermissionGuardProps {
  children: React.ReactNode;
  onPermissionGranted?: () => void;
}

const LocationPermissionGuard: React.FC<LocationPermissionGuardProps> = ({
  children,
  onPermissionGranted,
}) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [permissionState, setPermissionState] = useState<LocationPermissionState | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSettingsMessage, setShowSettingsMessage] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  // Check permission state on mount and when app comes to foreground
  useEffect(() => {
    checkPermission();
    
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const checkPermission = async () => {
    try {
      setCheckingPermission(true);
      const state = await getLocationPermissionState();
      setPermissionState(state);

      if (state.status === 'granted') {
        setShowModal(false);
        setShowSettingsMessage(false);
        onPermissionGranted?.();
      } else if (state.status === 'blocked') {
        setShowModal(false);
        setShowSettingsMessage(true);
      } else {
        setShowModal(true);
        setShowSettingsMessage(false);
      }
    } catch (error) {
      console.error('Error checking permission:', error);
      // On error, allow access but show modal
      setShowModal(true);
    } finally {
      setCheckingPermission(false);
    }
  };

  const handleAllowPermission = async () => {
    try {
      const result = await requestLocationPermission();
      if (result.granted) {
        setShowModal(false);
        setShowSettingsMessage(false);
        onPermissionGranted?.();
        // Re-check permission state
        await checkPermission();
      } else {
        // Permission denied, but can request again
        // Modal will remain visible
        const state = await getLocationPermissionState();
        setPermissionState(state);
        if (state.status === 'blocked') {
          setShowModal(false);
          setShowSettingsMessage(true);
        }
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // Show loading state while checking permission
  if (checkingPermission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[FONTS.fontRegular, { color: colors.text }]}>Checking permissions...</Text>
      </View>
    );
  }

  // Show settings message if permanently denied
  if (showSettingsMessage && permissionState?.status === 'blocked') {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <View style={[styles.messageBox, { backgroundColor: colors.card }]}>
          <Text style={[FONTS.fontBold, styles.title, { color: theme.dark ? colors.title : '#191919' }]}>
            Location Access Required
          </Text>
          <Text style={[FONTS.fontNunitoRegular, styles.message, { color: colors.text }]}>
            Location access is required to use this app. Please enable location permissions in your device settings.
          </Text>
          <TouchableOpacity style={styles.settingsBtn} onPress={handleOpenSettings}>
            <Text style={[styles.settingsText, { color: COLORS.white }]}>Open Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={checkPermission}
            style={styles.retryBtn}
          >
            <Text style={[styles.retryText, { color: theme.dark ? colors.text : '#999999' }]}>
              Check Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show permission modal if permission not granted
  if (showModal && permissionState && permissionState.status !== 'granted') {
    return (
      <>
        <PermissionModal
          visible={showModal}
          icon={IMAGES.location}
          title="Location Access Required"
          description="We need your location to show you nearby matches. Please enable location access to continue."
          onAllow={handleAllowPermission}
          allowButtonText="Allow Access"
        />
        {/* Block children from rendering */}
        <View style={[styles.blocked, { backgroundColor: colors.card }]} />
      </>
    );
  }

  // Permission granted - render children
  if (permissionState?.status === 'granted') {
    return <>{children}</>;
  }

  // Default: show blocked view
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[FONTS.fontRegular, { color: colors.text }]}>Checking permissions...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blocked: {
    flex: 1,
    opacity: 0.3,
  },
  messageBox: {
    width: '80%',
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 15,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
  },
  settingsBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 52,
    marginBottom: 15,
  },
  settingsText: {
    ...FONTS.fontSemiBold,
    fontSize: 18,
  },
  retryBtn: {
    paddingHorizontal: 52,
    paddingVertical: 12,
    borderRadius: 15,
  },
  retryText: {
    ...FONTS.fontSemiBold,
    fontSize: 14,
  },
});

export default LocationPermissionGuard;
