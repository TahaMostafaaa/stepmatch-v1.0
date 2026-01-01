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
 * Location Permission Status
 * Represents the current state of location permission on the device
 */
export type LocationPermissionStatus = 'granted' | 'denied' | 'undetermined' | 'blocked';

/**
 * Location Permission State
 * Complete state information for location permission
 */
export interface LocationPermissionState {
  status: LocationPermissionStatus;
  canRequestAgain: boolean;
  lastChecked: Date | null;
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
 * Get location permission state with detailed information
 * @returns LocationPermissionState with status, canRequestAgain flag, and lastChecked timestamp
 */
export const getLocationPermissionState = async (): Promise<LocationPermissionState> => {
  try {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
    
    // Map Expo Location status to our LocationPermissionStatus type
    let permissionStatus: LocationPermissionStatus;
    let canRequestAgain = true;

    if (status === 'granted') {
      permissionStatus = 'granted';
      canRequestAgain = true;
    } else if (status === 'denied') {
      // Check if permission can be requested again
      // On iOS, canAskAgain is always true if status is denied
      // On Android, canAskAgain is false if user selected "Don't ask again"
      if (canAskAgain === false) {
        permissionStatus = 'blocked';
        canRequestAgain = false;
      } else {
        permissionStatus = 'denied';
        canRequestAgain = true;
      }
    } else {
      permissionStatus = 'undetermined';
      canRequestAgain = true;
    }

    return {
      status: permissionStatus,
      canRequestAgain,
      lastChecked: new Date(),
    };
  } catch (error) {
    console.error('Error getting location permission state:', error);
    return {
      status: 'undetermined',
      canRequestAgain: true,
      lastChecked: new Date(),
    };
  }
};

/**
 * Validate location coordinates
 * @param coordinates - Location coordinates to validate
 * @throws Error if coordinates are null, undefined, NaN, or out of valid range
 */
export const validateLocationCoordinates = (coordinates: LocationCoordinates | null | undefined): void => {
  if (!coordinates) {
    throw new Error('Invalid location data. Please try again.');
  }

  if (typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
    throw new Error('Invalid location data. Please try again.');
  }

  if (isNaN(coordinates.latitude) || isNaN(coordinates.longitude)) {
    throw new Error('Invalid location data. Please try again.');
  }

  if (coordinates.latitude < -90 || coordinates.latitude > 90) {
    throw new Error('Invalid location data. Please try again.');
  }

  if (coordinates.longitude < -180 || coordinates.longitude > 180) {
    throw new Error('Invalid location data. Please try again.');
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
