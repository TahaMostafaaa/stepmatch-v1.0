import React, { useEffect, useState } from 'react';
import BottomNavigation from './BottomNavigation';
import {  Platform, StatusBar, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useNavigation } from '@react-navigation/native';
import { authApi } from '../api/auth.api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from './AppNavigator';
import { COLORS } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

const DrawerNavigation = (props : any) => {

    const theme = useTheme();
    const {colors} : {colors : any} = theme;
    const navigation = useNavigation<NavigationProp>();
    const [checkingPhotos, setCheckingPhotos] = useState(true);

    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    // Check if user has uploaded photos on mount
    useEffect(() => {
        const checkPhotos = async () => {
            try {
                const profile = await authApi.getProfile();
                // Check if user has no photos or empty photos array
                if (!profile.images || profile.images.length === 0) {
                    // Redirect to RecentPics screen
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'RecentPics' }],
                    });
                } else {
                    setCheckingPhotos(false);
                }
            } catch (error) {
                console.error('Error checking photos:', error);
                // On error, allow access but log the error
                setCheckingPhotos(false);
            }
        };

        checkPhotos();
    }, [navigation]);

    // Show loading while checking
    if (checkingPhotos) {
        return (
            <SafeAreaView
                style={{
                    flex:1,
                    backgroundColor:colors.card,
                    paddingTop:STATUSBAR_HEIGHT,
                    alignItems:'center',
                    justifyContent:'center'
                }}
                edges={['bottom']}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={{
                flex:1,
                backgroundColor:colors.card,
                paddingTop:STATUSBAR_HEIGHT
            }}
            edges={['bottom']}
        >
            <BottomNavigation/>
        </SafeAreaView>
    );
};


export default DrawerNavigation;