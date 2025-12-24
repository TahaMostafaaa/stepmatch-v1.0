/**
 * Login Screen
 * 
 * Handles user authentication with email/password.
 * Uses secure auth context for state management.
 */

import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, StatusBar, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import CustomInput from '../../components/Input/CustomInput';
import Button from '../../components/Button/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../Navigations/AuthNavigator';
import { useAuthActions, useAuth } from '../../auth/auth.hooks';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login = ({ navigation }: LoginScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auth hooks
    const { login } = useAuthActions();
    const { error } = useAuth();

    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    /**
     * Validate form inputs
     */
    const validateForm = (): boolean => {
        if (!email.trim()) {
            Alert.alert('Validation Error', 'Please enter your email address');
            return false;
        }
        
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert('Validation Error', 'Please enter a valid email address');
            return false;
        }
        
        if (!password) {
            Alert.alert('Validation Error', 'Please enter your password');
            return false;
        }
        
        if (password.length < 6) {
            Alert.alert('Validation Error', 'Password must be at least 6 characters');
            return false;
        }
        
        return true;
    };

    /**
     * Handle login form submission
     */
    const handleLogin = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        try {
            const response = await login({
                email: email.trim().toLowerCase(),
                password,
            });
            
            // If tokens are null, email verification may be required
            if (!response.access_token) {
                Alert.alert(
                    'Email Verification Required',
                    response.message || 'Please verify your email before logging in.',
                    [{ text: 'OK' }]
                );
            }
            // If login successful, AuthGuard will automatically redirect to app stack
        } catch (err: any) {
            // Handle specific error cases
            const status = err.response?.status;
            const message = err.response?.data?.detail || err.response?.data?.message;
            
            if (status === 401) {
                Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
            } else if (status === 403) {
                Alert.alert(
                    'Email Not Verified',
                    'Please verify your email address before logging in.',
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert('Login Failed', message || 'Something went wrong. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.card,
            }}
        >
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={theme.dark ? "light-content" : "dark-content"}
            />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[GlobalStyleSheet.container, { flex: 1, paddingHorizontal: 27, paddingTop: STATUSBAR_HEIGHT }]}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={[FONTS.fontBold, { fontSize: 25, color: COLORS.primary }]}>StepMatch</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={[FONTS.fontBold, { fontSize: 30, color: colors.title, textAlign: 'center' }]}>Welcome Back!</Text>
                        <Text style={[FONTS.fontNunitoRegular, { fontSize: 18, color: colors.text, textAlign: 'center' }]}>Welcome Back We Missed You</Text>
                        <View
                            style={{
                                position: 'absolute',
                                left: 53,
                                top: -20,
                                transform: [{ rotate: '-23.81deg' }]
                            }}
                        >
                            <Image
                                style={{ width: 22, height: 19 }}
                                resizeMode='contain'
                                tintColor={'#BDD3FF'}
                                source={IMAGES.heart}
                            />
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                right: 13,
                                top: 20,
                                transform: [{ rotate: '-23.81deg' }]
                            }}
                        >
                            <Image
                                style={{ width: 39, height: 32 }}
                                resizeMode='contain'
                                tintColor={'#BDD3FF'}
                                source={IMAGES.heart}
                            />
                        </View>
                    </View>
                    <View style={[{ flex: 1 }]}>
                        <View style={{ marginBottom: 15 }}>
                            <Text style={[FONTS.fontSemiBold, { fontSize: 26, color: colors.title }]}>Login</Text>
                        </View>
                        
                        {/* Email Input */}
                        <View>
                            <Text style={[FONTS.fontNunitoRegular, { fontSize: 14, color: colors.text, textTransform: 'capitalize' }]}>Email</Text>
                            <View style={{ marginVertical: 10 }}>
                                <CustomInput
                                    icon={IMAGES.Email}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>
                        
                        {/* Password Input */}
                        <View>
                            <Text style={[FONTS.fontNunitoRegular, { fontSize: 14, color: colors.text, textTransform: 'capitalize' }]}>Password</Text>
                            <View style={{ marginVertical: 10 }}>
                                <CustomInput
                                    icon={IMAGES.lock}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    type={'password'}
                                />
                            </View>
                        </View>
                        
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                paddingTop: 14,
                                paddingBottom: 28
                            }}
                        >
                            <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: COLORS.primary }]}>Forget Password</Text>
                        </TouchableOpacity>
                        
                        {/* Show error message if any */}
                        {error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}
                        
                        <View style={{ marginBottom: Platform.OS === 'web' ? 100 : 0 }}>
                            <Button
                                title={isSubmitting ? 'Signing In...' : 'Sign In'}
                                onPress={handleLogin}
                                disabled={isSubmitting}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 15, paddingHorizontal: 30 }}>
                                <LinearGradient
                                    colors={['transparent', '#669AFE']}
                                    style={{ flex: 1, height: 1 }}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                />
                                <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: COLORS.primary }]}>Or Sign Up With</Text>
                                <LinearGradient
                                    colors={['#669AFE', 'transparent']}
                                    style={{ flex: 1, height: 1 }}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                />
                            </View>
                            <View
                                style={[styles.flex, { gap: 10, paddingVertical: 5 }]}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.background, { borderColor: colors.borderColor }]}
                                >
                                    <Image
                                        style={{ height: 22, width: 22 }}
                                        resizeMode='contain'
                                        source={IMAGES.Apple}
                                        tintColor={colors.title}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.background, { borderColor: colors.borderColor }]}
                                >
                                    <Image
                                        style={{ height: 22, width: 22 }}
                                        resizeMode='contain'
                                        source={IMAGES.google}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.background, { borderColor: colors.borderColor }]}
                                >
                                    <Image
                                        style={{ height: 22, width: 22 }}
                                        resizeMode='contain'
                                        source={IMAGES.facebook}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 15, flex: 1 }}>
                            <Text style={{ ...FONTS.fontNunitoRegular, fontSize: 14, color: colors.title }}>Don't have an account?
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('SignUp')}
                            >
                                <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: COLORS.primary, textDecorationLine: 'underline', textDecorationColor: '#2979F8', marginLeft: 5 }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        height: 51,
        width: 51,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 14,
        textAlign: 'center',
    },
});

export default Login;
