/**
 * Splash Screen
 * 
 * Note: With the AuthGuard implementation, this screen is primarily
 * used for the visual splash display. The actual auth bootstrap
 * (loading tokens, checking expiry) is handled by AuthGuard.
 * 
 * This screen can be used for:
 * - Initial branding display
 * - Transitional navigation in the app stack
 */

import { View, Image } from 'react-native';
import React from 'react';
import { COLORS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';

const Splash = () => {
    // The auth bootstrap is now handled by AuthGuard
    // This screen just displays the splash image
    // Navigation is controlled by AuthGuard based on auth state
    
    return (
        <View style={[GlobalStyleSheet.container, { padding: 0, flex: 1, backgroundColor: COLORS.white }]}>
            <Image
                style={{
                    width: '100%',
                    height: '100%'
                }}
                resizeMode='cover'
                source={IMAGES.Splash}
            />
        </View>
    );
};

export default Splash;
