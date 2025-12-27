import { View, Text, Platform, StatusBar, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import { Slider } from '@miblanchard/react-native-slider';
import Header from '../layout/Header';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../constants/theme';
import Button from '../components/Button/Button';
import matchingContext from '../context/matchingContext';
import { getCurrentLocation } from '../services/locationService';
import { useAuthActions } from '../auth/auth.hooks';

const Settings = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme
    
    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const navigation = useNavigation<any>();

    // Get auth actions
    const { logout } = useAuthActions();

    // Get matching context
    const {
        preferences,
        preferencesLoading,
        savingPreferences,
        loadPreferences,
        updatePreferences,
        updateLocationFromGPS,
    } = React.useContext(matchingContext);

    // Local state for preferences
    const [searchRadius, setSearchRadius] = useState(50);
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(99);
    const [updatingLocation, setUpdatingLocation] = useState(false);

    // Load preferences on mount
    useEffect(() => {
        loadPreferences();
    }, []);

    // Update local state when preferences load
    useEffect(() => {
        if (preferences) {
            setSearchRadius(preferences.search_radius_km);
            setMinAge(preferences.min_age);
            setMaxAge(preferences.max_age);
        }
    }, [preferences]);

    const handleUpdateLocation = async () => {
        try {
            setUpdatingLocation(true);
            await updateLocationFromGPS();
            Alert.alert('Success', 'Location updated successfully!');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update location. Please try again.');
        } finally {
            setUpdatingLocation(false);
        }
    };

    const handleSavePreferences = async () => {
        // Validate age range
        if (minAge > maxAge) {
            Alert.alert('Invalid Age Range', 'Minimum age cannot be greater than maximum age.');
            return;
        }

        try {
            await updatePreferences({
                search_radius_km: searchRadius,
                min_age: minAge,
                max_age: maxAge,
            });
            Alert.alert('Success', 'Preferences saved successfully!');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to save preferences. Please try again.');
        }
    };

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
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete account. Please try again.');
                        }
                    },
                },
            ]
        );
    };

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
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to log out. Please try again.');
                        }
                    },
                },
            ]
        );
    };
    

    return (
        <View 
            style={[GlobalStyleSheet.container,{
                paddingTop:STATUSBAR_HEIGHT,
                padding:0,
                flex:1,
                backgroundColor:colors.card
            }]}
        >
            <Header
                title="Settings"
                leftIcon={'back'}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow:1}}
            >   
                <View
                    style={{flex:1,paddingHorizontal:26,paddingTop:20}}
                >
                    {/* Matching Preferences Section */}
                    <View style={{ marginBottom: 30 }}>
                        <Text style={[FONTS.fontBold, { fontSize: 18, color: colors.title, marginBottom: 20 }]}>
                            Matching Preferences
                        </Text>

                        {/* Search Radius */}
                        <View style={{ marginBottom: 25 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: colors.title }]}>
                                    Search Radius
                                </Text>
                                <Text style={[FONTS.fontBold, { fontSize: 14, color: COLORS.primary }]}>
                                    {searchRadius} km
                                </Text>
                            </View>
                            <Slider
                                value={searchRadius}
                                onValueChange={(value) => setSearchRadius(Math.round(value[0]))}
                                minimumValue={1}
                                maximumValue={500}
                                step={1}
                                minimumTrackTintColor={COLORS.primary}
                                maximumTrackTintColor={colors.borderColor}
                                thumbTintColor={COLORS.primary}
                            />
                        </View>

                        {/* Age Range */}
                        <View style={{ marginBottom: 25 }}>
                            <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: colors.title, marginBottom: 15 }]}>
                                Age Range
                            </Text>
                            
                            {/* Min Age */}
                            <View style={{ marginBottom: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <Text style={[FONTS.fontMedium, { fontSize: 13, color: colors.text }]}>
                                        Minimum Age
                                    </Text>
                                    <Text style={[FONTS.fontBold, { fontSize: 13, color: COLORS.primary }]}>
                                        {minAge} years
                                    </Text>
                                </View>
                                <Slider
                                    value={minAge}
                                    onValueChange={(value) => {
                                        const newMin = Math.round(value[0]);
                                        if (newMin <= maxAge) {
                                            setMinAge(newMin);
                                        }
                                    }}
                                    minimumValue={18}
                                    maximumValue={100}
                                    step={1}
                                    minimumTrackTintColor={COLORS.primary}
                                    maximumTrackTintColor={colors.borderColor}
                                    thumbTintColor={COLORS.primary}
                                />
                            </View>

                            {/* Max Age */}
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <Text style={[FONTS.fontMedium, { fontSize: 13, color: colors.text }]}>
                                        Maximum Age
                                    </Text>
                                    <Text style={[FONTS.fontBold, { fontSize: 13, color: COLORS.primary }]}>
                                        {maxAge} years
                                    </Text>
                                </View>
                                <Slider
                                    value={maxAge}
                                    onValueChange={(value) => {
                                        const newMax = Math.round(value[0]);
                                        if (newMax >= minAge) {
                                            setMaxAge(newMax);
                                        }
                                    }}
                                    minimumValue={18}
                                    maximumValue={100}
                                    step={1}
                                    minimumTrackTintColor={COLORS.primary}
                                    maximumTrackTintColor={colors.borderColor}
                                    thumbTintColor={COLORS.primary}
                                />
                            </View>
                        </View>

                        {/* Location */}
                        <View style={{ marginBottom: 25 }}>
                            <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: colors.title, marginBottom: 10 }]}>
                                Location
                            </Text>
                            {preferences?.latitude && preferences?.longitude ? (
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={[FONTS.fontRegular, { fontSize: 13, color: colors.text }]}>
                                        {preferences.latitude.toFixed(4)}, {preferences.longitude.toFixed(4)}
                                    </Text>
                                    {preferences.last_location_update && (
                                        <Text style={[FONTS.fontRegular, { fontSize: 12, color: colors.textLight, marginTop: 4 }]}>
                                            Updated: {new Date(preferences.last_location_update).toLocaleDateString()}
                                        </Text>
                                    )}
                                </View>
                            ) : (
                                <Text style={[FONTS.fontRegular, { fontSize: 13, color: colors.textLight, marginBottom: 10 }]}>
                                    Location not set
                                </Text>
                            )}
                            <TouchableOpacity
                                onPress={handleUpdateLocation}
                                disabled={updatingLocation}
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor: COLORS.primary,
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: updatingLocation ? 0.6 : 1,
                                }}
                            >
                                {updatingLocation ? (
                                    <ActivityIndicator size="small" color={COLORS.white} />
                                ) : (
                                    <>
                                        <Image
                                            style={{ width: 16, height: 16, marginRight: 8 }}
                                            resizeMode='contain'
                                            tintColor={COLORS.white}
                                            source={IMAGES.pin2}
                                        />
                                        <Text style={[FONTS.fontBold, { color: COLORS.white, fontSize: 14 }]}>
                                            Update Location
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Other Settings */}
                    <View style={{ borderTopWidth: 1, borderTopColor: colors.borderColor, paddingTop: 20 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[GlobalStyleSheet.flexaling,{gap:10,paddingVertical:10}]}
                        >
                            <Image
                                style={{
                                    width:20,
                                    height:20,
                                }}
                                resizeMode='contain'
                                tintColor={colors.title}
                                source={IMAGES.info}
                            />
                            <Text style={[FONTS.fontBold,{fontSize:14,color:colors.title,lineHeight:14}]}>About us</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDeleteAccount}
                            activeOpacity={0.8}
                            style={[GlobalStyleSheet.flexaling,{gap:10,paddingVertical:10}]}
                        >
                            <Image
                                style={{
                                    width:20,
                                    height:20,
                                }}
                                resizeMode='contain'
                                tintColor={COLORS.danger}
                                source={IMAGES.delete}
                            />
                            <Text style={[FONTS.fontBold,{fontSize:14,color:COLORS.danger,lineHeight:14}]}>Delete Account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleLogout}
                            activeOpacity={0.8}
                            style={[GlobalStyleSheet.flexaling,{gap:10,paddingVertical:10}]}
                        >
                            <Image
                                style={{
                                    width:20,
                                    height:20,
                                }}
                                resizeMode='contain'
                                tintColor={COLORS.danger}
                                source={IMAGES.logOut}
                            />
                            <Text style={[FONTS.fontBold,{fontSize:14,color:COLORS.danger,lineHeight:14}]}>Log out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <View style={{paddingHorizontal:17,paddingVertical:15,paddingBottom:30}}>
                <Button
                    title={savingPreferences ? 'Saving...' : 'Save Preferences'}
                    onPress={handleSavePreferences}
                    disabled={savingPreferences || preferencesLoading}
                />
            </View>
        </View>
    )
}

export default Settings