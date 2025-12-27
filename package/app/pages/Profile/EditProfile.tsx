import { View, Text, Platform, StatusBar, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Feather } from '@expo/vector-icons';
import CustomInput from '../../components/Input/CustomInput';
import Button from '../../components/Button/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { authApi } from '../../api/auth.api';
import { Profile as ProfileType, UpdateProfileRequest, LocationData } from '../../auth/auth.types';

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

const EditProfile = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme
    
    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const navigation = useNavigation<any>();

    // Profile data state
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState<LocationData | null>(null);
    const [locationAddress, setLocationAddress] = useState<string>('');
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [birthdate, setBirthdate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

    // Date picker constraints
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18); // Minimum age 18
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100); // Maximum age 100

    // Fetch profile data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const profileData = await authApi.getProfile();
                setProfile(profileData);
                
                // Populate form fields
                setName(profileData.name || '');
                setEmail(profileData.email || '');
                setPhone(profileData.phone || '');
                setBio(profileData.bio || '');
                
                // Set location if available
                if (profileData.location) {
                    setLocation(profileData.location);
                    setLocationAddress(profileData.location.address || '');
                }
                
                // Set birthdate if available
                if (profileData.birthdate) {
                    setBirthdate(new Date(profileData.birthdate));
                }
                
                // Set profile image
                if (profileData.profile_image) {
                    setProfileImageUri(profileData.profile_image);
                }
            } catch (err: any) {
                const errorMessage = 
                    err.response?.data?.detail ||
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to load profile. Please try again.';
                setError(errorMessage);
                console.error('Profile fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Handle date picker change
    const onDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setBirthdate(selectedDate);
            if (Platform.OS === 'ios') {
                setShowDatePicker(false);
            }
        }
    };

    // Handle image picker
    const handleImagePicker = async () => {
        try {
            // Request media library permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Please allow access to your photo library to change your profile picture.'
                );
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1], // Square aspect ratio for profile pictures
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setProfileImageUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    // Reverse geocode coordinates to address
    const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
        try {
            const addresses = await Location.reverseGeocodeAsync({
                latitude: lat,
                longitude: lng,
            });

            if (addresses && addresses.length > 0) {
                const address = addresses[0];
                const parts: string[] = [];
                
                if (address.street) parts.push(address.street);
                if (address.city) parts.push(address.city);
                if (address.region) parts.push(address.region);
                if (address.postalCode) parts.push(address.postalCode);
                if (address.country) parts.push(address.country);

                return parts.length > 0 ? parts.join(', ') : null;
            }
            return null;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return null;
        }
    };

    // Handle get current location
    const handleGetLocation = async () => {
        try {
            setLocationLoading(true);
            setLocationError(null);

            // Request location permissions
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                setLocationError('Location permission denied. Please enable location access in settings.');
                Alert.alert(
                    'Permission Denied',
                    'Location access is required to set your location. Please enable it in your device settings.'
                );
                setLocationLoading(false);
                return;
            }

            // Get current position
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
                timeout: 15000, // 15 second timeout
            });

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Reverse geocode to get address
            const address = await reverseGeocode(lat, lng);

            // Update location state
            const locationData: LocationData = {
                lat,
                lng,
                address: address || null,
            };

            setLocation(locationData);
            setLocationAddress(address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
            setLocationError(null);
        } catch (error: any) {
            const errorMessage = 
                error.message === 'Location request timed out'
                    ? 'Location request timed out. Please try again.'
                    : error.message || 'Failed to get location. Please try again.';
            
            setLocationError(errorMessage);
            Alert.alert('Error', errorMessage);
            console.error('Location error:', error);
        } finally {
            setLocationLoading(false);
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        if (!name.trim()) {
            Alert.alert('Validation Error', 'Please enter your name.');
            return false;
        }

        if (!email.trim()) {
            Alert.alert('Validation Error', 'Please enter your email.');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert('Validation Error', 'Please enter a valid email address.');
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Prepare update payload - only include changed fields
            const updatePayload: UpdateProfileRequest = {};

            if (name !== profile?.name) {
                updatePayload.name = name.trim();
            }

            if (email !== profile?.email) {
                updatePayload.email = email.trim();
            }

            if (phone !== (profile?.phone || '')) {
                updatePayload.phone = phone.trim() || null;
            }

            if (bio !== (profile?.bio || '')) {
                updatePayload.bio = bio.trim() || null;
            }

            // Check if location has changed
            const currentLocation = profile?.location;
            const locationChanged = 
                !location && currentLocation ||
                location && (!currentLocation || 
                    location.lat !== currentLocation.lat || 
                    location.lng !== currentLocation.lng);
            
            if (locationChanged) {
                updatePayload.location = location || null;
            }

            if (birthdate) {
                const birthdateString = formatDateForApi(birthdate);
                if (birthdateString !== profile?.birthdate) {
                    updatePayload.birthdate = birthdateString;
                }
            }

            // Handle profile image - if changed, include the URI
            // Note: If backend requires separate upload endpoint, handle that first
            if (profileImageUri && profileImageUri !== profile?.profile_image) {
                // For now, send the URI. If backend requires upload first, implement that here
                updatePayload.profile_image = profileImageUri;
            }

            // Only make API call if there are changes
            if (Object.keys(updatePayload).length === 0) {
                Alert.alert('No Changes', 'No changes to save.');
                setIsSubmitting(false);
                return;
            }

            // Call update API
            const updatedProfile = await authApi.updateProfile(updatePayload);
            
            // Show success message
            Alert.alert(
                'Success',
                'Profile updated successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (err: any) {
            const errorMessage = 
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                'Failed to update profile. Please try again.';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
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
                title="Edit Profile"
                leftIcon={'back'}
            />
            {loading ? (
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={[FONTS.fontRegular,{color:colors.text,marginTop:15}]}>Loading profile...</Text>
                </View>
            ) : error && !profile ? (
                <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:20}}>
                    <Text style={[FONTS.fontRegular,{color:colors.text,textAlign:'center'}]}>{error}</Text>
                </View>
            ) : (
                <>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flexGrow:1}}
                    >   
                        <View
                            style={{flex:1}}
                        >
                            <View
                                style={{
                                    alignItems:'center',
                                    justifyContent:'center',
                                    paddingVertical:45,
                                }}
                            >
                                <View>
                                    <Image
                                        style={{
                                            height:160,
                                            width:160,
                                            borderRadius:100,
                                        }}
                                        source={
                                            profileImageUri 
                                                ? { uri: profileImageUri }
                                                : IMAGES.likedPic8
                                        }
                                        defaultSource={IMAGES.likedPic8}
                                    />
                                    <TouchableOpacity
                                        onPress={handleImagePicker}
                                        activeOpacity={0.8}
                                        style={[GlobalStyleSheet.headerBtn,{
                                            height:29,
                                            width:29,
                                            borderRadius:30,
                                            backgroundColor:COLORS.primary,
                                            position:'absolute',
                                            bottom:0,
                                            right:20
                                        }]}
                                    >
                                        <MaterialIcons size={16} color={COLORS.white} name="edit"/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View
                                style={{flex:1,paddingHorizontal:27}}
                            >
                                <View style={{marginBottom:15}}>
                                    <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>Name</Text>
                                    <View style={{marginVertical:5}}>
                                        <CustomInput
                                            value={name}
                                            onChangeText={setName}
                                            inputBorder
                                            placeholder="Enter your name"
                                        />
                                    </View>
                                </View>
                                <View style={{marginBottom:15}}>
                                    <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>Phone</Text>
                                    <View style={{marginVertical:5}}>
                                        <CustomInput
                                            value={phone}
                                            onChangeText={setPhone}
                                            inputBorder
                                            keyboardType={'phone-pad'}
                                            placeholder="Enter your phone number"
                                        />
                                    </View>
                                </View>
                                <View style={{marginBottom:15}}>
                                    <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>Email</Text>
                                    <View style={{marginVertical:5}}>
                                        <CustomInput
                                            value={email}
                                            onChangeText={setEmail}
                                            inputBorder
                                            keyboardType={'email-address'}
                                            placeholder="Enter your email"
                                        />
                                    </View>
                                </View>
                                <View style={{marginBottom:15}}>
                                    <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>Bio</Text>
                                    <View style={{marginVertical:5}}>
                                        <CustomInput
                                            value={bio}
                                            onChangeText={setBio}
                                            inputBorder
                                            placeholder="Tell us about yourself"
                                            multiline
                                        />
                                    </View>
                                </View>
                                <View style={{marginBottom:15}}>
                                    <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>Location</Text>
                                    <View style={{marginVertical:5}}>
                                        {locationLoading ? (
                                            <View style={{
                                                flexDirection:'row',
                                                alignItems:'center',
                                                paddingVertical:15,
                                                borderBottomWidth:1,
                                                borderBottomColor:colors.borderColor,
                                            }}>
                                                <ActivityIndicator size="small" color={COLORS.primary} style={{marginRight:10}} />
                                                <Text style={[FONTS.fontNunitoRegular,{fontSize:17,color:colors.text}]}>
                                                    Getting location...
                                                </Text>
                                            </View>
                                        ) : location ? (
                                            <View>
                                                <View style={{
                                                    flexDirection:'row',
                                                    alignItems:'center',
                                                    paddingVertical:10,
                                                    borderBottomWidth:1,
                                                    borderBottomColor:colors.borderColor,
                                                }}>
                                                    <Feather name="map-pin" size={18} color={COLORS.primary} style={{marginRight:10}} />
                                                    <View style={{flex:1}}>
                                                        <Text style={[FONTS.fontNunitoRegular,{fontSize:17,color:colors.text}]}>
                                                            {locationAddress || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
                                                        </Text>
                                                        {location.address && (
                                                            <Text style={[FONTS.fontNunitoRegular,{fontSize:12,color:colors.textLight,marginTop:2}]}>
                                                                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                                {locationError && (
                                                    <Text style={[FONTS.fontNunitoRegular,{fontSize:12,color:COLORS.danger,marginTop:5}]}>
                                                        {locationError}
                                                    </Text>
                                                )}
                                                <TouchableOpacity
                                                    onPress={handleGetLocation}
                                                    activeOpacity={0.8}
                                                    style={{
                                                        marginTop:10,
                                                        flexDirection:'row',
                                                        alignItems:'center',
                                                        alignSelf:'flex-start',
                                                    }}
                                                >
                                                    <Feather name="refresh-cw" size={16} color={COLORS.primary} style={{marginRight:5}} />
                                                    <Text style={[FONTS.fontSemiBold,{fontSize:14,color:COLORS.primary}]}>
                                                        Refresh Location
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <View>
                                                <View style={{
                                                    flexDirection:'row',
                                                    alignItems:'center',
                                                    paddingVertical:10,
                                                    borderBottomWidth:1,
                                                    borderBottomColor:colors.borderColor,
                                                }}>
                                                    <Feather name="map-pin" size={18} color={colors.textLight} style={{marginRight:10}} />
                                                    <Text style={[FONTS.fontNunitoRegular,{fontSize:17,color:colors.textLight}]}>
                                                        No location set
                                                    </Text>
                                                </View>
                                                {locationError && (
                                                    <Text style={[FONTS.fontNunitoRegular,{fontSize:12,color:COLORS.danger,marginTop:5}]}>
                                                        {locationError}
                                                    </Text>
                                                )}
                                                <TouchableOpacity
                                                    onPress={handleGetLocation}
                                                    activeOpacity={0.8}
                                                    style={{
                                                        marginTop:10,
                                                        flexDirection:'row',
                                                        alignItems:'center',
                                                        alignSelf:'flex-start',
                                                        backgroundColor:COLORS.primayLight,
                                                        paddingHorizontal:15,
                                                        paddingVertical:8,
                                                        borderRadius:20,
                                                    }}
                                                >
                                                    <Feather name="navigation" size={16} color={COLORS.primary} style={{marginRight:5}} />
                                                    <Text style={[FONTS.fontSemiBold,{fontSize:14,color:COLORS.primary}]}>
                                                        Get Current Location
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View style={{marginBottom:15}}>
                                    <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>Birthdate</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{
                                            borderBottomWidth:1,
                                            borderBottomColor:colors.borderColor,
                                            paddingVertical:10,
                                            marginVertical:5,
                                        }}
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <Text style={[FONTS.fontNunitoRegular,{fontSize:17,color:birthdate ? colors.text : colors.textLight}]}>
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
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{paddingHorizontal:17,paddingVertical:15,paddingBottom:30}}>
                        <Button
                            title={isSubmitting ? 'Saving...' : 'Save'}
                            onPress={handleSave}
                            style={{opacity: isSubmitting || loading ? 0.6 : 1}}
                        />
                    </View>
                </>
            )}
        </View>
    )
}

export default EditProfile