import React from "react";
import { View, StyleSheet, ImageBackground, Platform, StatusBar, Text, TouchableOpacity, TextInput, Image, ScrollView, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { useTheme } from "@react-navigation/native";
import { COLORS, FONTS, IMAGES } from "../../constants/theme";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import AnimatedUserMarker from "../../components/AnimatedUserMarker";
import DistanceSlider2 from "../../components/DistanceSlider2";


const { width } = Dimensions.get("window");

const NearbyYou3 = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme

    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    return (
        <View
            style={[GlobalStyleSheet.container,{
                padding:0,
                flex:1,
                backgroundColor:colors.card,
            }]}
        >
            <ImageBackground
                style={{width:'100%',height:'100%'}}
                source={theme.dark ? IMAGES.DarkMape : IMAGES.Mape}
                resizeMode='cover'
            >
                <LinearGradient
                    colors={[theme.dark ? '#000000': '#FFFFFF', theme.dark ? 'rgba(0,0,0,0)': 'rgba(255,255,255,0)']}
                    locations={[0.5,0.6]}
                    style={{
                        width:'100%',
                        height:250,
                        position:'absolute',
                        left:0,
                        right:0,
                        top:0
                    }}
                />
                <View
                    style={[GlobalStyleSheet.container,{
                        flex:1,
                        padding:0,
                        paddingTop:STATUSBAR_HEIGHT,
                    }]}
                >
                    <View style={[GlobalStyleSheet.flexCenter,{paddingHorizontal:20,}]}>
                        <Text style={[FONTS.fontBold,{fontSize:25,color:theme.dark ? colors.title : '#191919'}]}>Nearby You</Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[GlobalStyleSheet.headerBtn,]}
                        >
                            <Feather name="more-horizontal" color={colors.text} size={24}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingHorizontal:20,}}>
                        <TextInput
                            style={{
                                ...FONTS.fontMedium,
                                color:theme.dark ? colors.title : '#191919',
                                fontSize:16,
                                height:50,
                                borderRadius:15,
                                backgroundColor:colors.card,
                                paddingHorizontal:20,
                                paddingRight:40,
                                paddingLeft:40,
                                elevation: 5,
                                shadowColor: "#000031",
                                shadowOpacity: 0.15,
                                shadowRadius: 8,
                                
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
                            left: 0,
                            right:0,
                            bottom: width * 0.15,
                            zIndex:99
                        }}
                    >
                        <DistanceSlider2/>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <AnimatedUserMarker />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};


const styles = StyleSheet.create({
    image:{
        height:35,
        width:35,
        borderRadius:50,
        borderWidth:1,
        borderColor:COLORS.white
    }
})

export default NearbyYou3;
