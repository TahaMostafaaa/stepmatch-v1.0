/**
 * Settings Screen
 * 
 * Contains app settings including logout functionality.
 * Demonstrates how to use the auth hooks for logout.
 */

import { View, Text, Platform, StatusBar, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../layout/Header';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../constants/theme';
import Button from '../components/Button/Button';
import { useAuthActions, useAuth } from '../auth/auth.hooks';

const Settings = () => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const navigation = useNavigation<any>();
    
    // Auth hooks for logout and user info
    const { logout } = useAuthActions();
    const { user } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    /**
     * Handle logout with confirmation
     */
    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: performLogout,
                },
            ]
        );
    };

    /**
     * Perform the actual logout
     * AuthGuard will automatically redirect to login screen
     */
    const performLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            // AuthGuard handles navigation automatically
        } catch (error) {
            Alert.alert('Error', 'Failed to log out. Please try again.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    /**
     * Handle account deletion (placeholder - implement as needed)
     */
    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Implement account deletion API call
                        Alert.alert('Info', 'Account deletion is not yet implemented.');
                    },
                },
            ]
        );
    };

    return (
        <View
            style={[GlobalStyleSheet.container, {
                paddingTop: STATUSBAR_HEIGHT,
                padding: 0,
                flex: 1,
                backgroundColor: colors.card
            }]}
        >
            <Header
                title="Settings"
                leftIcon={'back'}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View
                    style={{ flex: 1, paddingHorizontal: 26, paddingTop: 20 }}
                >
                    {/* User info section */}
                    {user && (
                        <View style={{ marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.borderColor }}>
                            <Text style={[FONTS.fontNunitoRegular, { fontSize: 12, color: colors.text, marginBottom: 4 }]}>Logged in as</Text>
                            <Text style={[FONTS.fontBold, { fontSize: 16, color: colors.title }]}>{user.email}</Text>
                            {user.user_metadata?.name && (
                                <Text style={[FONTS.fontNunitoRegular, { fontSize: 14, color: colors.text }]}>{user.user_metadata.name}</Text>
                            )}
                        </View>
                    )}

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[GlobalStyleSheet.flexaling, { gap: 10, paddingVertical: 10 }]}
                    >
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                            }}
                            resizeMode='contain'
                            tintColor={colors.title}
                            source={IMAGES.info}
                        />
                        <Text style={[FONTS.fontBold, { fontSize: 14, color: colors.title, lineHeight: 14 }]}>About us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleDeleteAccount}
                        activeOpacity={0.8}
                        style={[GlobalStyleSheet.flexaling, { gap: 10, paddingVertical: 10 }]}
                    >
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                            }}
                            resizeMode='contain'
                            tintColor={COLORS.danger}
                            source={IMAGES.delete}
                        />
                        <Text style={[FONTS.fontBold, { fontSize: 14, color: COLORS.danger, lineHeight: 14 }]}>Delete Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleLogout}
                        activeOpacity={0.8}
                        disabled={isLoggingOut}
                        style={[GlobalStyleSheet.flexaling, { gap: 10, paddingVertical: 10, opacity: isLoggingOut ? 0.5 : 1 }]}
                    >
                        <Image
                            style={{
                                width: 20,
                                height: 20,
                            }}
                            resizeMode='contain'
                            tintColor={COLORS.danger}
                            source={IMAGES.logOut}
                        />
                        <Text style={[FONTS.fontBold, { fontSize: 14, color: COLORS.danger, lineHeight: 14 }]}>
                            {isLoggingOut ? 'Logging out...' : 'Log out'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ paddingHorizontal: 17, paddingVertical: 15, paddingBottom: 30 }}>
                <Button
                    title={'Save'}
                    onPress={() => navigation.goBack()}
                />
            </View>
        </View>
    );
};

export default Settings;
