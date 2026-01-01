/**
 * SignUp Screen
 * 
 * Handles new user registration with:
 * - Email, password, name, and birthdate fields
 * - Form validation
 * - API integration via auth context
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
import DateTimePicker from '@react-native-community/datetimepicker';

type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUp = ({ navigation }: SignUpScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    // Form state
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [birthdate, setBirthdate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auth hooks
    const { signup } = useAuthActions();
    const { error } = useAuth();

    /**
     * Format date as YYYY-MM-DD for API
     */
    const formatDateForApi = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    /**
     * Format date for display
     */
    const formatDateForDisplay = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    /**
     * Calculate age from birthdate
     */
    const calculateAge = (date: Date): number => {
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
            age--;
        }
        return age;
    };

    /**
     * Validate form inputs
     */
    const validateForm = (): boolean => {
        if (!name.trim()) {
            Alert.alert('Validation Error', 'Please enter your name');
            return false;
        }

        if (name.trim().length < 2) {
            Alert.alert('Validation Error', 'Name must be at least 2 characters');
            return false;
        }

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

        if (!birthdate) {
            Alert.alert('Validation Error', 'Please enter your birthdate');
            return false;
        }

        // Age validation (must be 18+)
        const age = calculateAge(birthdate);
        if (age < 18) {
            Alert.alert('Age Requirement', 'You must be at least 18 years old to sign up');
            return false;
        }

        if (!password) {
            Alert.alert('Validation Error', 'Please enter a password');
            return false;
        }

        if (password.length < 8) {
            Alert.alert('Validation Error', 'Password must be at least 8 characters');
            return false;
        }

        return true;
    };

    /**
     * Handle signup form submission
     */
    const handleSignUp = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await signup({
                email: email.trim().toLowerCase(),
                password,
                name: name.trim(),
                birthdate: formatDateForApi(birthdate!),
            });

            // If tokens are null, email verification is required
            if (!response.access_token) {
                Alert.alert(
                    'Verify Your Email',
                    response.message || 'Please check your email to verify your account.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login'),
                        },
                    ]
                );
            }
            // If signup successful with tokens, AuthGuard will automatically redirect
        } catch (err: any) {
            const message = err.response?.data?.detail || err.response?.data?.message;

            // Handle specific error cases
            if (message?.toLowerCase().includes('email') && message?.toLowerCase().includes('exists')) {
                Alert.alert(
                    'Email Already Registered',
                    'This email is already associated with an account. Please login or use a different email.',
                    [
                        { text: 'Login', onPress: () => navigation.navigate('Login') },
                        { text: 'Try Again', style: 'cancel' },
                    ]
                );
            } else {
                Alert.alert('Sign Up Failed', message || 'Something went wrong. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handle date picker change
     */
    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setBirthdate(selectedDate);
        }
    };

    // Maximum date is 18 years ago (for age requirement)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);

    // Minimum date is 100 years ago
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100);

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
                <View style={[GlobalStyleSheet.container, { flex: 1, paddingHorizontal: 27 }]}>
                    <View style={{ alignItems: 'center', marginTop: 60, flex: 1 }}>
                        <Text style={[FONTS.fontBold, { fontSize: 25, color: COLORS.primary }]}>StepMatch</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={[FONTS.fontBold, { fontSize: 30, color: colors.title, textAlign: 'center' }]}>Create Account</Text>
                        <Text style={[FONTS.fontNunitoRegular, { fontSize: 18, color: colors.text, textAlign: 'center' }]}>Find Your Partner</Text>
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
                    <View style={[{ flex: 1, }]}>
                        <View style={{ marginBottom: 15 }}>
                            <Text style={[FONTS.fontSemiBold, { fontSize: 26, color: colors.title }]}>Sign Up</Text>
                        </View>

                        {/* Name Input */}
                        <View>
                            <Text style={[FONTS.fontNunitoRegular, { fontSize: 14, color: colors.text, textTransform: 'capitalize' }]}>Full Name</Text>
                            <View style={{ marginVertical: 10 }}>
                                <CustomInput
                                    icon={IMAGES.user2}
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
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

                        {/* Birthdate Input */}
                        <View>
                            <Text style={[FONTS.fontNunitoRegular, { fontSize: 14, color: colors.text, textTransform: 'capitalize' }]}>Birthdate</Text>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    styles.datePickerButton,
                                    { borderColor: colors.borderColor }
                                ]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Image
                                    style={{ height: 20, width: 20, marginRight: 10 }}
                                    resizeMode='contain'
                                    source={IMAGES.calendar}
                                    tintColor={colors.text}
                                />
                                <Text style={[FONTS.fontNunitoRegular, { fontSize: 17, color: birthdate ? colors.text : colors.textLight }]}>
                                    {birthdate ? formatDateForDisplay(birthdate) : 'Select your birthdate'}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={birthdate || maxDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onDateChange}
                                    maximumDate={maxDate}
                                    minimumDate={minDate}
                                />
                            )}
                        </View>

                        {/* Password Input */}
                        <View style={{ marginTop: 10 }}>
                            <Text style={[FONTS.fontNunitoRegular, { fontSize: 14, color: colors.text, textTransform: 'capitalize' }]}>Password</Text>
                            <View style={{ marginVertical: 10 }}>
                                <CustomInput
                                    icon={IMAGES.lock}
                                    placeholder="Create a password (min 8 chars)"
                                    value={password}
                                    onChangeText={setPassword}
                                    type={'password'}
                                />
                            </View>
                        </View>

                        {/* Show error message if any */}
                        {error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <View style={{ marginBottom: Platform.OS === 'web' ? 100 : 0, marginTop: 15 }}>
                            <Button
                                title={isSubmitting ? 'Creating Account...' : 'Sign Up'}
                                onPress={handleSignUp}
                                disabled={isSubmitting}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 15, paddingHorizontal: 30 }}>
                                <LinearGradient 
                                    colors={['transparent', '#669AFE']}
                                    style={{ flex: 1, height: 1 }}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }} 
                                />
                                <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: COLORS.primary }]}>Or Sign In With</Text>
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
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 15, flex: 1, paddingTop: 10 }}>
                        <Text style={{ ...FONTS.fontNunitoRegular, fontSize: 14, color: colors.title }}>Already have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: COLORS.primary, textDecorationLine: 'underline', textDecorationColor: '#2979F8', marginLeft: 5 }}>Sign In</Text>
                        </TouchableOpacity>
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
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginVertical: 10,
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 14,
        textAlign: 'center',
    },
});

export default SignUp;
