/**
 * Location Service
 * 
 * Utilities for handling location permissions and GPS coordinates
 */

import * as Location from 'expo-location';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationPermissionResult {
  granted: boolean;
  error?: string;
}

/**
 * Request location permissions
 * @returns LocationPermissionResult with granted status
 */
export const requestLocationPermission = async (): Promise<LocationPermissionResult> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status === 'granted') {
      return { granted: true };
    } else {
      return {
        granted: false,
        error: 'Location permission denied. Please enable location access in settings.',
      };
    }
  } catch (error: any) {
    return {
      granted: false,
      error: error.message || 'Failed to request location permission',
    };
  }
};

/**
 * Check if location permissions are granted
 * @returns true if permissions are granted
 */
export const checkLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};

/**
 * Get current location coordinates
 * @returns LocationCoordinates or null if unavailable
 */
export const getCurrentLocation = async (): Promise<LocationCoordinates | null> => {
  try {
    // Check if permission is granted
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      const permissionResult = await requestLocationPermission();
      if (!permissionResult.granted) {
        return null;
      }
    }

    // Get current position
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeout: 15000, // 15 second timeout
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error: any) {
    console.error('Error getting current location:', error);
    return null;
  }
};

/**
 * Watch location updates
 * @param callback - Function called with location updates
 * @returns Location subscription object with remove method
 */
export const watchLocation = (
  callback: (location: LocationCoordinates) => void
): { remove: () => void } => {
  let subscription: Location.LocationSubscription | null = null;

  const startWatching = async () => {
    try {
      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        const permissionResult = await requestLocationPermission();
        if (!permissionResult.granted) {
          return;
        }
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 300000, // 5 minutes
          distanceInterval: 100, // 100 meters
        },
        (position) => {
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      );
    } catch (error) {
      console.error('Error watching location:', error);
    }
  };

  startWatching();

  return {
    remove: () => {
      if (subscription) {
        subscription.remove();
        subscription = null;
      }
    },
  };
};
