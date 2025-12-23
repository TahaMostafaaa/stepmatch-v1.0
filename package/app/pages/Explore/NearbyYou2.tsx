import React from "react";
import { View, StyleSheet, ImageBackground, Platform, StatusBar, Text, TouchableOpacity, TextInput, Image, Dimensions } from "react-native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { useTheme, useNavigation } from "@react-navigation/native";
import { COLORS, FONTS, IMAGES } from "../../constants/theme";
import { Feather } from '@expo/vector-icons';
import AnimatedUserMarker2 from "../../components/AnimatedUserMarker2";
import DistanceSlider2 from "../../components/DistanceSlider2";
import Header from "../../layout/Header";


const { width } = Dimensions.get("window");

const NearbyYou2 = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme
    const navigation = useNavigation<any>();

    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    return (
        <View
            style={[GlobalStyleSheet.container,{
                padding:0,
                flex:1,
                backgroundColor:colors.card,
            }]}
        >
            <View
                style={[GlobalStyleSheet.container,{
                    flex:1,
                    padding:0,
                    paddingTop:STATUSBAR_HEIGHT,
                }]}
            >
                <Header
                    title="Nearby You"
                    leftIcon={'back'}
                />
                <View style={{paddingHorizontal:20,}}>
                    <TextInput
                        style={{
                            ...FONTS.fontMedium,
                            color:theme.dark ? colors.title : '#191919',
                            fontSize:16,
                            height:50,
                            borderRadius:15,
                            backgroundColor:colors.input,
                            paddingHorizontal:20,
                            paddingRight:40,
                            paddingLeft:40
                        }}
                        placeholder='New York, USA'
                        placeholderTextColor={theme.dark ? colors.title : '#191919'}
                        
                    />
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={[GlobalStyleSheet.headerBtn,
                            {
                                borderRadius:15,
                                position:'absolute',
                                left:23,
                                top:3,
                            }
                        ]}
                    >
                        <Feather name='map-pin' size={20} color={COLORS.primary}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={[GlobalStyleSheet.headerBtn,
                            {
                                borderRadius:15,
                                position:'absolute',
                                right:23,
                                top:3,
                            }
                        ]}
                    >
                        <Feather name='search' size={20} color={colors.text}/>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        position: "absolute",
                        right:20,
                        bottom: width * 0.12,
                        zIndex:99
                    }}
                >
                    <DistanceSlider2/>
                </View>
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: -10,
                        left: -10,
                        right: 0,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                    }}
                >
                    <AnimatedUserMarker2 />
                </View>
                <View style={{flex:1}}>
                    <Image
                        style={[styles.image,{
                            borderColor:colors.card,
                            position:'absolute',
                            left: width * 0.51,
                            bottom: width * 0.31,
                        }]}
                        source={IMAGES.likedPic10}
                    />
                    <View
                        style={{
                            position:'absolute',
                            left: width * 0.05,
                            bottom: width * 0.55,
                        }}
                    >
                        <Image
                            style={[styles.image,{
                                borderColor:colors.card,
                            }]}
                            source={IMAGES.likedPic5}
                        />
                        <View
                            style={{
                                width:12,
                                height:12,
                                borderRadius:15,
                                backgroundColor:COLORS.success,
                                borderWidth:2,
                                borderColor:COLORS.white,
                                position:'absolute',
                                bottom:-2,
                                right:-2
                            }}
                        />
                    </View>
                    <Image
                        style={[styles.image,{  
                            borderColor:colors.card,
                            position:'absolute',
                            right: width * 0.10,
                            bottom: width * 0.55,
                        }]}
                        source={IMAGES.likedPic7}
                    />
                    <Image
                        style={[styles.image,{  
                            borderColor:colors.card,
                            position:'absolute',
                            left: width * 0.30,
                            bottom: width * 0.90,
                        }]}
                        source={IMAGES.likedPic8}
                    />
                    <Image
                        style={[styles.image,{  
                            borderColor:colors.card,
                            position:'absolute',
                            left: width * 0.10,
                            top: width * 0.50,
                        }]}
                        source={IMAGES.likedPic7}
                    />
                    <View
                        style={{
                            position:'absolute',
                            right: width * 0.15,
                            top: width * 0.75,
                        }}
                    >
                        <Image
                            style={[styles.image,{
                                borderColor:colors.card,
                            }]}
                            source={IMAGES.likedPic2}
                        />
                        <View
                            style={{
                                width:12,
                                height:12,
                                borderRadius:15,
                                backgroundColor:COLORS.success,
                                borderWidth:2,
                                borderColor:COLORS.white,
                                position:'absolute',
                                bottom:-2,
                                right:-2
                            }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    image:{
        height:35,
        width:35,
        borderRadius:10,
        borderWidth:2,
        borderColor:COLORS.white
    }
})

export default NearbyYou2;
