/**
 * Routes - Main Navigation Entry Point
 * 
 * Wraps the app with:
 * - SafeAreaProvider for safe area handling
 * - ThemeContext for dark/light mode
 * - AuthProvider for authentication state
 * - NavigationContainer with theme
 * - AuthGuard for routing based on auth state
 */

import React, { useState } from "react";
import {
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import themeContext from '../constants/themeContext';
import { COLORS } from "../constants/theme";
import { AuthProvider } from "../auth/auth.context";
import AuthGuard from "./AuthGuard";

const Routes = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // Theme context value for switching between light/dark mode
    const themeContextValue = React.useMemo(() => ({
        isDarkTheme,
        setDarkTheme: () => {
            setIsDarkTheme(true);
        },
        setLightTheme: () => {
            setIsDarkTheme(false);
        }
    }), [isDarkTheme]);

    // Custom light theme colors
    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            text: COLORS.text,
            textLight: '#a19fa8',
            title: COLORS.title,
            background: 'rgba(25,25,25,0.04)',
            input: "#EDEDED",
            bgLight: '#F0F0F0',
            card: COLORS.white,
            cardBg: COLORS.white,
            borderColor: COLORS.borderColor,
            themeBg: "#F4F6FF",
            bgGradient: ['#FFFBF6', '#FBE7DF'],
        }
    };

    // Custom dark theme colors
    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            text: 'rgba(255, 255, 255, 0.7)',
            textLight: 'rgba(255, 255, 255, 0.7)',
            title: '#fff',
            background: '#303437',
            input: "#303437",
            bgLight: 'rgba(255,255,255,.1)',
            card: '#0C1216',
            cardBg: "#0c1746",
            borderColor: COLORS.darkBorder,
            themeBg: "#00092D",
            bgGradient: ['#2c3f6d', '#2c3f6d'],
        }
    };

    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

    return (
        <SafeAreaProvider>
            <themeContext.Provider value={themeContextValue}>
                <AuthProvider>
                    <NavigationContainer theme={theme}>
                        <AuthGuard />
                    </NavigationContainer>
                </AuthProvider>
            </themeContext.Provider>
        </SafeAreaProvider>
    );
};

export default Routes;
