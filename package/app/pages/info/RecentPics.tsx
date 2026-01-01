import React, { useState, useEffect } from 'react';
import {  Image, KeyboardAvoidingView, PermissionsAndroid, Platform, ScrollView, StatusBar, StyleSheet, Text,  TouchableOpacity,  View, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import { AppStackParamList } from '../../Navigations/AppNavigator';
import Button from '../../components/Button/Button';
import Header from '../../layout/Header';
import uuid from 'react-native-uuid';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { authApi } from '../../api/auth.api';
import { uploadImages } from '../../api/images.api';
import { ProfileImage } from '../../api/matching.types';


type RecentPicsScreenProps = NativeStackScreenProps<RootStackParamList, 'RecentPics'> | NativeStackScreenProps<AppStackParamList, 'RecentPics'>;

interface ImageItem {
    id: string;
    image?: string; // Local URI or uploaded image URL
    imagePath?: any; // Local image asset
    uploaded?: boolean; // Whether image has been uploaded
    profileImageId?: string; // ID from ProfileImage if uploaded
}

const RecentPics = ({ navigation } : RecentPicsScreenProps) => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme

    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const [imageData, setImageData] = useState<ImageItem[]>([]);
    const [uploadedImages, setUploadedImages] = useState<ProfileImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkingPhotos, setCheckingPhotos] = useState(true);

    // Guard check: Redirect if photos already exist
    useEffect(() => {
        const checkPhotosAndRedirect = async () => {
            try {
                const profile = await authApi.getProfile();
                
                // If photos exist, redirect to DrawerNavigation immediately
                if (profile.images && profile.images.length > 0) {
                    // Redirect to main app since photos already exist
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'DrawerNavigation' }],
                    });
                    return;
                }
                
                // No photos exist - allow screen to proceed
                setCheckingPhotos(false);
            } catch (error) {
                console.error('Error checking photos:', error);
                // On error, allow screen to proceed (graceful fallback)
                setCheckingPhotos(false);
            }
        };

        checkPhotosAndRedirect();
    }, [navigation]);

    // Fetch existing images on mount (only if no photos exist)
    useEffect(() => {
        // Only fetch if we've confirmed no photos exist
        if (checkingPhotos) {
            return;
        }

        const fetchExistingImages = async () => {
            try {
                setLoading(true);
                const profile = await authApi.getProfile();
                
                // This should not happen if guard check worked, but handle it anyway
                if (profile.images && profile.images.length > 0) {
                    // Photos exist - redirect
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'DrawerNavigation' }],
                    });
                    return;
                }
                
                // Initialize with empty slots for upload
                const emptySlots: ImageItem[] = Array(6).fill(null).map(() => ({
                    id: uuid.v4() as string,
                }));
                setImageData(emptySlots);
            } catch (error) {
                console.error('Error fetching existing images:', error);
                // Initialize with empty slots on error
                const emptySlots: ImageItem[] = Array(6).fill(null).map(() => ({
                    id: uuid.v4() as string,
                }));
                setImageData(emptySlots);
            } finally {
                setLoading(false);
            }
        };

        fetchExistingImages();
    }, [checkingPhotos, navigation]);
    
    const UploadFile = async (index: number) => {
        try {
            // Request media library permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Please allow access to your photo library to upload images.');
                return;
            }
    
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });
    
            if (!result.canceled && result.assets[0]) {
                const newImageData = [...imageData];
                newImageData[index] = {
                    id: uuid.v4() as string,
                    image: result.assets[0].uri,
                    uploaded: false,
                };
                setImageData(newImageData);
                setUploadError(null);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const removeImageItem = (index: number) => {
        const newImageData = [...imageData];
        newImageData[index] = {
            id: uuid.v4() as string,
        };
        setImageData(newImageData);
        
        // Remove from uploadedImages if it was uploaded
        if (imageData[index]?.profileImageId) {
            setUploadedImages(uploadedImages.filter(img => img.id !== imageData[index].profileImageId));
        }
    };

    // Upload local images to server
    const handleUploadImages = async (): Promise<boolean> => {
        // Get all local images that haven't been uploaded
        const localImages = imageData
            .filter(item => item.image && !item.uploaded && !item.imagePath)
            .map(item => item.image!);

        if (localImages.length === 0) {
            return true; // No images to upload
        }

        try {
            setUploading(true);
            setUploadError(null);

            const uploadedUrls = await uploadImages(localImages);
            
            // Update imageData to mark images as uploaded
            const newImageData = [...imageData];
            let uploadedIndex = 0;
            
            newImageData.forEach((item, index) => {
                if (item.image && !item.uploaded && !item.imagePath) {
                    const uploadedUrl = uploadedUrls[uploadedIndex];
                    if (uploadedUrl) {
                        newImageData[index] = {
                            ...item,
                            image: uploadedUrl,
                            uploaded: true,
                            profileImageId: uuid.v4() as string, // Generate ID for tracking
                        };
                        uploadedIndex++;
                    }
                }
            });

            setImageData(newImageData);
            
            // Convert uploaded URLs to ProfileImage format for tracking
            const newProfileImages: ProfileImage[] = uploadedUrls.map((url, index) => ({
                id: uuid.v4() as string,
                image_url: url,
                display_order: uploadedImages.length + index,
            }));
            
            setUploadedImages([...uploadedImages, ...newProfileImages]);
            return true;
        } catch (error: any) {
            // Extract error message from response
            let errorMessage = 'Failed to upload images. Please try again.';
            
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                // Check if it's a nested error message (like RLS policy error)
                if (typeof detail === 'string') {
                    // Try to extract the actual error message from nested structure
                    const rlsMatch = detail.match(/message['"]:\s*['"]([^'"]+)['"]/);
                    if (rlsMatch) {
                        errorMessage = `Upload failed: ${rlsMatch[1]}. Please contact support if this issue persists.`;
                    } else if (detail.includes('row-level security') || detail.includes('RLS')) {
                        errorMessage = 'Upload failed due to security policy. Please contact support.';
                    } else {
                        errorMessage = detail;
                    }
                } else {
                    errorMessage = detail;
                }
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setUploadError(errorMessage);
            Alert.alert('Upload Failed', errorMessage);
            console.error('Image upload error:', error);
            return false;
        } finally {
            setUploading(false);
        }
    };

    // Handle continue button press
    const handleContinue = async () => {
        // Check if at least one image is uploaded or ready to upload
        const hasUploadedImages = uploadedImages.length > 0;
        const hasLocalImages = imageData.some(item => item.image && !item.imagePath);
        
        if (!hasUploadedImages && !hasLocalImages) {
            Alert.alert(
                'Photo Required',
                'Please upload at least one photo to continue.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Upload any remaining local images
        if (hasLocalImages) {
            const uploadSuccess = await handleUploadImages();
            if (!uploadSuccess) {
                return; // Upload failed, don't proceed
            }
        }

        // Final check: ensure at least one image is uploaded
        // After upload, check both uploadedImages state and imageData for uploaded items
        const finalUploadedCount = uploadedImages.length > 0 
            ? uploadedImages.length 
            : imageData.filter(item => item.uploaded).length;
            
        if (finalUploadedCount === 0) {
            Alert.alert(
                'Photo Required',
                'Please upload at least one photo to continue.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Navigate to main app
        navigation.reset({
            index: 0,
            routes: [{ name: 'DrawerNavigation' }],
        });
    };

    // Show loading while checking if photos exist
    if (checkingPhotos) {
        return (
            <View
                style={{
                    flex:1,
                    backgroundColor:colors.card,
                    alignItems:'center',
                    justifyContent:'center',
                    paddingTop:STATUSBAR_HEIGHT
                }}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View
            style={{
                flex:1,
                backgroundColor:colors.card,
            }}
        >
            <KeyboardAvoidingView
                style={{flex: 1}}
            >
                <View style={{flex:1,paddingTop:STATUSBAR_HEIGHT}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <Header
                            title={'StepMatch'}
                            explore
                            leftIcon={'back'}
                            onPress={() => navigation.goBack()}
                        />
                        <View style={[GlobalStyleSheet.container,{paddingTop:50}]}>
                            <Text style={[FONTS.fontBold,{fontSize:25,color:theme.dark ? colors.title : '#191919'}]}>Add your recent pics</Text>
                            {uploadError && (
                                <View style={{marginTop:10,padding:10,backgroundColor:COLORS.danger + '20',borderRadius:8}}>
                                    <Text style={[FONTS.fontRegular,{fontSize:14,color:COLORS.danger}]}>{uploadError}</Text>
                                </View>
                            )}
                            {loading && (
                                <View style={{marginVertical:20,alignItems:'center'}}>
                                    <ActivityIndicator size="small" color={COLORS.primary} />
                                    <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.text,marginTop:10}]}>Loading photos...</Text>
                                </View>
                            )}
                            <View style={{marginVertical:10}}>
                                <View
                                    style={{
                                        flexDirection:'row',
                                        flexWrap:'wrap',
                                    }}
                                >
                                    <View style={GlobalStyleSheet.col66}>
                                        <TouchableOpacity
                                            onPress={() => UploadFile(0)}
                                            activeOpacity={.9}
                                            disabled={uploading || loading}
                                            style={[styles.imageBox,{height:SIZES.width / 1.8,borderColor:colors.borderColor,opacity: uploading || loading ? 0.6 : 1}]}
                                        >
                                            {imageData[0]?.image || imageData[0]?.imagePath ?
                                                <>
                                                    <Image
                                                        source={ imageData[0].image ? {uri : imageData[0].image} : imageData[0].imagePath}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
                                                    {!loading && (
                                                    <TouchableOpacity
                                                        onPress={() => removeImageItem(0)}
                                                        activeOpacity={.8}
                                                        style={{
                                                            height:25,
                                                            width:25,
                                                            borderRadius:20,
                                                            position:'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            zIndex:1,
                                                            alignItems:'center',
                                                            justifyContent:'center',
                                                            backgroundColor:COLORS.danger,
                                                        }}
                                                    >
                                                        <Feather name='x' size={16} color={COLORS.white}/>
                                                    </TouchableOpacity>
                                                    )}
                                                </>
                                                :
                                                <Feather name='image' color={colors.borderColor} size={45}/>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={GlobalStyleSheet.col33}>
                                        <TouchableOpacity
                                            onPress={() => UploadFile(1)}
                                            activeOpacity={.9}
                                            disabled={uploading || loading}
                                            style={[styles.imageBox,{borderColor:colors.borderColor,opacity: uploading || loading ? 0.6 : 1}]}
                                        >
                                            {imageData[1]?.image ?
                                                <>
                                                    <Image
                                                        source={{uri : imageData[1].image}}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
                                                    {!loading && (
                                                    <TouchableOpacity
                                                        onPress={() => removeImageItem(1)}
                                                        activeOpacity={.8}
                                                        style={{
                                                            height:25,
                                                            width:25,
                                                            borderRadius:20,
                                                            position:'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            zIndex:1,
                                                            alignItems:'center',
                                                            justifyContent:'center',
                                                            backgroundColor:COLORS.danger,
                                                        }}
                                                    >
                                                        <Feather name='x' size={16} color={COLORS.white}/>
                                                    </TouchableOpacity>
                                                    )}
                                                </>
                                                :
                                                <Feather name='plus' color={colors.borderColor} size={40}/>
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => UploadFile(2)}
                                            activeOpacity={.9}
                                            disabled={uploading || loading}
                                            style={[styles.imageBox,{borderColor:colors.borderColor,opacity: uploading || loading ? 0.6 : 1}]}
                                        >
                                            {imageData[2]?.image ?
                                                <>
                                                    <Image
                                                        source={{uri : imageData[2].image}}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
                                                    {!loading && (
                                                    <TouchableOpacity
                                                        onPress={() => removeImageItem(2)}
                                                        activeOpacity={.8}
                                                        style={{
                                                            height:25,
                                                            width:25,
                                                            borderRadius:20,
                                                            position:'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            zIndex:1,
                                                            alignItems:'center',
                                                            justifyContent:'center',
                                                            backgroundColor:COLORS.danger,
                                                        }}
                                                    >
                                                        <Feather name='x' size={16} color={COLORS.white}/>
                                                    </TouchableOpacity>
                                                    )}
                                                </>
                                                :
                                                <Feather name='plus' color={colors.borderColor} size={40}/>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={GlobalStyleSheet.col33}>
                                        <TouchableOpacity
                                            onPress={() => UploadFile(3)}
                                            activeOpacity={.9}
                                            disabled={uploading || loading}
                                            style={[styles.imageBox,{borderColor:colors.borderColor,opacity: uploading || loading ? 0.6 : 1}]}
                                        >
                                            {imageData[3]?.image ?
                                                <>
                                                    <Image
                                                        source={{uri : imageData[3].image}}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
                                                    {!loading && (
                                                    <TouchableOpacity
                                                        onPress={() => removeImageItem(3)}
                                                        activeOpacity={.8}
                                                        style={{
                                                            height:25,
                                                            width:25,
                                                            borderRadius:20,
                                                            position:'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            zIndex:1,
                                                            alignItems:'center',
                                                            justifyContent:'center',
                                                            backgroundColor:COLORS.danger,
                                                        }}
                                                    >
                                                        <Feather name='x' size={16} color={COLORS.white}/>
                                                    </TouchableOpacity>
                                                    )}
                                                </>
                                                :
                                                <Feather name='plus' color={colors.borderColor} size={40}/>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={GlobalStyleSheet.col33}>
                                        <TouchableOpacity
                                            onPress={() => UploadFile(4)}
                                            activeOpacity={.9}
                                            disabled={uploading || loading}
                                            style={[styles.imageBox,{borderColor:colors.borderColor,opacity: uploading || loading ? 0.6 : 1}]}
                                        >
                                            {imageData[4]?.image ?
                                                <>
                                                    <Image
                                                        source={{uri : imageData[4].image}}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
                                                    {!loading && (
                                                    <TouchableOpacity
                                                        activeOpacity={.8}
                                                        onPress={() => removeImageItem(4)}
                                                        style={{
                                                            height:25,
                                                            width:25,
                                                            borderRadius:20,
                                                            position:'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            zIndex:1,
                                                            alignItems:'center',
                                                            justifyContent:'center',
                                                            backgroundColor:COLORS.danger,
                                                        }}
                                                    >
                                                        <Feather name='x' size={16} color={COLORS.white}/>
                                                    </TouchableOpacity>
                                                    )}
                                                </>
                                                :
                                                <Feather name='plus' color={colors.borderColor} size={40}/>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={GlobalStyleSheet.col33}>
                                        <TouchableOpacity
                                            onPress={() => UploadFile(5)}
                                            activeOpacity={.9}
                                            disabled={uploading || loading}
                                            style={[styles.imageBox,{borderColor:colors.borderColor,opacity: uploading || loading ? 0.6 : 1}]}
                                        >
                                            {imageData[5]?.image ?
                                                <>
                                                    <Image
                                                        source={{uri : imageData[5].image}}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
                                                    {!loading && (
                                                    <TouchableOpacity
                                                        onPress={() => removeImageItem(5)}
                                                        activeOpacity={.8}
                                                        style={{
                                                            height:25,
                                                            width:25,
                                                            borderRadius:20,
                                                            position:'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            zIndex:1,
                                                            alignItems:'center',
                                                            justifyContent:'center',
                                                            backgroundColor:COLORS.danger,
                                                        }}
                                                    >
                                                        <Feather name='x' size={16} color={COLORS.white}/>
                                                    </TouchableOpacity>
                                                    )}
                                                </>
                                                :
                                                <Feather name='plus' color={colors.borderColor} size={40}/>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    position:'absolute',
                                    left:25,
                                    top:25,
                                    transform:[{rotate:'-23.81deg'}]
                                }}
                            >
                                <Image
                                    style={{width:22,height:19}}
                                    resizeMode='contain'
                                    tintColor={'#BDD3FF'}
                                    source={IMAGES.heart7}
                                />
                            </View>
                            <View
                                style={{
                                    alignItems:'flex-end',
                                    right:0,
                                    top:80,
                                    transform:[{rotate:'-23.81deg'}]
                                }}
                            >
                                <Image
                                    style={{width:39,height:32}}
                                    resizeMode='contain'
                                    tintColor={'#BDD3FF'}
                                    source={IMAGES.heart}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View
                    style={[GlobalStyleSheet.container,{
                        paddingHorizontal:20,
                        paddingVertical:30,
                    }]}
                >
                    {uploading ? (
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingVertical:15}}>
                            <ActivityIndicator size="small" color={COLORS.primary} style={{marginRight:10}} />
                            <Text style={[FONTS.fontRegular,{fontSize:16,color:colors.text}]}>Uploading photos...</Text>
                        </View>
                    ) : (
                    <Button
                            onPress={handleContinue}
                        title={'Next'}
                            style={{opacity: loading ? 0.6 : 1}}
                    />
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};


const styles = StyleSheet.create({
    imageBox : {
        flex:1,
        borderWidth:1.3,
        marginVertical:5,
        borderRadius:SIZES.radius,
        borderStyle:'dashed',
         minHeight:SIZES.width > SIZES.container ? SIZES.container/3.5 : SIZES.width/3.5,
        alignItems:'center',
        justifyContent:'center',
        padding:12,
    }
})

export default RecentPics;