/**
 * Location Permission Guard
 * 
 * Component that blocks dashboard access until location permission is granted.
 * Shows PermissionModal when permission is not granted and handles permanent denial.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
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
  const [showRevocationWarning, setShowRevocationWarning] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
  const [wasGranted, setWasGranted] = useState(false);

  // Check permission state on mount and when app comes to foreground
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      setCheckingPermission(true);
      const state = await getLocationPermissionState();
      const previousState = permissionState;
      setPermissionState(state);

      // Check if permission was revoked after being granted
      if (previousState?.status === 'granted' && state.status !== 'granted' && wasGranted) {
        // Permission was revoked - show warning but allow access
        setShowRevocationWarning(true);
        setShowModal(false);
        setShowSettingsMessage(false);
        return;
      }

      if (state.status === 'granted') {
        setShowModal(false);
        setShowSettingsMessage(false);
        setShowRevocationWarning(false);
        setWasGranted(true);
        onPermissionGranted?.();
      } else if (state.status === 'blocked') {
        setShowModal(false);
        setShowSettingsMessage(true);
        setShowRevocationWarning(false);
      } else {
        setShowModal(true);
        setShowSettingsMessage(false);
        setShowRevocationWarning(false);
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
        setShowRevocationWarning(false);
        setWasGranted(true);
        onPermissionGranted?.();
        // Re-check permission state
        await checkPermission();
      } else {
        // Permission denied, but can request again
        // Modal will remain visible
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

  const handleDismissRevocationWarning = () => {
    setShowRevocationWarning(false);
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

  // Show revocation warning if permission was revoked after grant (allow access but show warning)
  if (showRevocationWarning && permissionState && permissionState.status !== 'granted' && wasGranted) {
    return (
      <>
        {children}
        <View style={[styles.warningOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.warningBox, { backgroundColor: colors.card }]}>
            <Text style={[FONTS.fontBold, styles.warningTitle, { color: theme.dark ? colors.title : '#191919' }]}>
              Location Access Disabled
            </Text>
            <Text style={[FONTS.fontNunitoRegular, styles.warningMessage, { color: colors.text }]}>
              Location access disabled. Some features may be limited. Enable location in settings to restore full functionality.
            </Text>
            <View style={styles.warningButtons}>
              <TouchableOpacity style={styles.warningSettingsBtn} onPress={handleOpenSettings}>
                <Text style={[styles.warningSettingsText, { color: COLORS.white }]}>Open Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleDismissRevocationWarning}
                style={styles.warningDismissBtn}
              >
                <Text style={[styles.warningDismissText, { color: theme.dark ? colors.text : '#999999' }]}>
                  Dismiss
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
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
  warningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  warningBox: {
    width: '85%',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  warningMessage: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  warningButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  warningSettingsBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  warningSettingsText: {
    ...FONTS.fontSemiBold,
    fontSize: 16,
  },
  warningDismissBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  warningDismissText: {
    ...FONTS.fontSemiBold,
    fontSize: 16,
  },
});

export default LocationPermissionGuard;
