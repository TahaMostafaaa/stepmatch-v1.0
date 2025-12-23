import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import FilterSheet from '../FilterSheet';
import ProfileDetailsSheet from '../ProfileDetailsSheet';
import DiscoverScreen from '../components/DiscoverScreen';
import PermissionModal from '../../components/PermissionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

const Home = () => {

    const navigation = useNavigation<any>();

    const theme = useTheme();
    const { colors }: {colors : any} = theme;

    const filterSheetRef = useRef<any>(null);

    const openFilterSheet = () => {
        filterSheetRef.current?.openSheet();
    };

    const ProfileDetailsSheetRef = useRef<any>(null);

    const openProfileSheet = () => {
        ProfileDetailsSheetRef.current?.openSheet();
    };

    const [step, setStep] = useState<number>(0);

  // Load saved permission progress
    useEffect(() => {
        const loadPermissions = async () => {
        const camera = await AsyncStorage.getItem('camera_permission');
        const location = await AsyncStorage.getItem('location_permission');
        const notification = await AsyncStorage.getItem('notification_permission');

        if (!camera) setStep(1);
        else if (!location) setStep(2);
        else if (!notification) setStep(3);
        else setStep(0);
        };
        loadPermissions();
    }, []);

    // 📸 Camera Permission
    const handleCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
        await AsyncStorage.setItem('camera_permission', 'granted');
        }
        setStep(2);
    };

    // 📍 Location Permission
    const handleLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
        await AsyncStorage.setItem('location_permission', 'granted');
        }
        setStep(3);
    };

    // 🔔 Notification Permission
    const handleNotificationPermission = async () => {
        try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
            await AsyncStorage.setItem('notification_permission', 'granted');
        }
        setStep(0);
        } catch (err) {
        console.error('Permission request failed:', err);
        }
    };

    return (
        <>
            <View
                style={[GlobalStyleSheet.container,{
                    padding:0,
                    flex:1,
                    backgroundColor:colors.card,
                }]}
            >
                {/* Camera Permission */}
                <PermissionModal
                    visible={step === 1}
                    icon={IMAGES.ModelCamera}
                    title="Camera Access"
                    description="Please allow access to your camera to take photos."
                    onAllow={handleCameraPermission}
                    onSkip={() => setStep(2)}
                />

                {/* Location Permission */}
                <PermissionModal
                    visible={step === 2}
                    icon={IMAGES.ModelMap}
                    title="Share Your Location"
                    description="Please allow access to your location for better experience."
                    onAllow={handleLocationPermission}
                    onSkip={() => setStep(3)}
                />

                {/* Notification Permission */}
                <PermissionModal
                    visible={step === 3}
                    icon={IMAGES.ModelBell}
                    title="Enable Push Notifications"
                    description="Enable push notifications to receive updates and news."
                    // onAllow={handleNotificationPermission}
                    onSkip={() => setStep(0)}
                />

                <View
                    style={[GlobalStyleSheet.homeHeader,{justifyContent:'center'}]}
                >
                    <Text style={{...FONTS.fontBold,fontSize:25,color:colors.title,flex:1}}>Discover</Text>
                    <TouchableOpacity
                        onPress={openFilterSheet}
                        // onPress={() => navigation.navigate('Filter')}
                        style={[GlobalStyleSheet.headerBtn,{backgroundColor:colors.background}]}
                    >
                        <Image
                            style={{
                                height:20,
                                width:20,
                                tintColor:theme.dark ? COLORS.white : colors.text,
                            }}
                            source={IMAGES.filter}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[GlobalStyleSheet.container,{paddingTop:5}]}>
                    <View>
                        <TextInput
                            style={{
                                ...FONTS.fontMedium,
                                fontSize:18,
                                height:50,
                                borderRadius:15,
                                backgroundColor:colors.input,
                                paddingHorizontal:20,
                                paddingRight:55,
                                color:colors.title
                            }}
                            placeholder='Search'
                            placeholderTextColor={colors.title}
                        />
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={[GlobalStyleSheet.headerBtn,
                                {
                                    borderRadius:15,
                                    position:'absolute',
                                    right:3,
                                    top:3,
                                }
                            ]}
                        >
                            <Feather name='search' size={20} color={colors.title}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <DiscoverScreen
                    openProfileSheet={openProfileSheet}
                />
                <FilterSheet
                    ref={filterSheetRef}
                />
                <ProfileDetailsSheet
                    ref={ProfileDetailsSheetRef}
                />
            </View>
        </>
    );
};


export default Home;