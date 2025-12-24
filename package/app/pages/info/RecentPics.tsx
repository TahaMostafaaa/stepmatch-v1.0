import React, { useState } from 'react';
import {  Image, KeyboardAvoidingView, PermissionsAndroid, Platform, ScrollView, StatusBar, StyleSheet, Text,  TouchableOpacity,  View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import Button from '../../components/Button/Button';
import Header from '../../layout/Header';
import uuid from 'react-native-uuid';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


type RecentPicsScreenProps = NativeStackScreenProps<RootStackParamList, 'RecentPics'>;

const RecentPics = ({ navigation } : RecentPicsScreenProps) => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme

    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

     const [imageData , setImageData] = useState<any>([{
        id : uuid.v4(),
        imagePath : IMAGES.likedPic6,
    }]);
    
    const UploadFile = async (type: any) => {
        try {
            // Request media library permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                alert('Sorry, we need media library permissions to make this work!');
                return;
            }
    
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: type === 'photo' 
                    ? ImagePicker.MediaTypeOptions.Images 
                    : ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
    
            if (!result.canceled) {
                setImageData([...imageData, { id: uuid.v4(), image: result.assets[0].uri }]);
            }
        } catch (error) {
            console.warn(error);
        }
    };

    const removeImageItem = (index: number) => {
        setImageData([
            ...imageData.slice(0, index),
            ...imageData.slice(index + 1, imageData.length)
        ]);
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
                            <View style={{marginVertical:10}}>
                                <View
                                    style={{
                                        flexDirection:'row',
                                        flexWrap:'wrap',
                                    }}
                                >
                                    <View style={GlobalStyleSheet.col66}>
                                        <TouchableOpacity
                                            onPress={() => UploadFile('photo')}
                                            activeOpacity={.9}
                                            style={[styles.imageBox,{height:SIZES.width / 1.8,borderColor:colors.borderColor}]}
                                        >
                                            {imageData[0] ?
                                                <>
                                                    <Image
                                                        source={ imageData[0].image ? {uri : imageData[0].image} : imageData[0].imagePath}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
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
                                                </>
                                                :
                                                <Feather name='image' color={colors.borderColor} size={45}/>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={GlobalStyleSheet.col33}>
                                        <TouchableOpacity
                                            onPress={() => UploadFile('photo')}
                                            activeOpacity={.9}
                                            style={[styles.imageBox,{borderColor:colors.borderColor}]}
                                        >
                                            {imageData[1] ?
                                                <>
                                                    <Image
                                                        source={{uri : imageData[1].image}}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
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
                                                </>
                                                :
                                                <Feather name='plus' color={colors.borderColor} size={40}/>
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => UploadFile('photo')}
                                            activeOpacity={.9}
                                            style={[styles.imageBox,{borderColor:colors.borderColor}]}
                                        >
                                            {imageData[2] ?
                                                <>
                                                    <Image
                                                        source={{uri : imageData[2].image}}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
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
                                                </>
                                                :
                                                <Feather name='plus' color={colors.borderColor} size={40}/>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={GlobalStyleSheet.col33}>
                                        <TouchableOpacity
                                            onPress={() => UploadFile('photo')}
                                            activeOpacity={.9}
                                            style={[styles.imageBox,{borderColor:colors.borderColor}]}
                                        >
                                            {imageData[3] ?
                                                <>
                                                    <Image
                                                        source={{uri : imageData[3].image}}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
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
                                                </>
                                                :
                                                <Feather name='plus' color={colors.borderColor} size={40}/>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={GlobalStyleSheet.col33}>
                                        <TouchableOpacity
                                            onPress={() => UploadFile('photo')}
                                            activeOpacity={.9}
                                            style={[styles.imageBox,{borderColor:colors.borderColor}]}
                                        >
                                            {imageData[4] ?
                                                <>
                                                    <Image
                                                        source={{uri : imageData[4].image}}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
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
                                                </>
                                                :
                                                <Feather name='plus' color={colors.borderColor} size={40}/>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={GlobalStyleSheet.col33}>
                                        <TouchableOpacity
                                            onPress={() => UploadFile('photo')}
                                            activeOpacity={.9}
                                            style={[styles.imageBox,{borderColor:colors.borderColor}]}
                                        >
                                            {imageData[5] ?
                                                <>
                                                    <Image
                                                        source={{uri : imageData[5].image}}
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:SIZES.radius,
                                                            
                                                        }}
                                                    />
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
                    <Button
                        onPress={() => navigation.navigate('DrawerNavigation')}
                        title={'Next'}
                    />
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