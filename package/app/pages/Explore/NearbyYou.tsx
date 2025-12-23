import React from "react";
import { View, StyleSheet, ImageBackground, Platform, StatusBar, Text, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { useTheme } from "@react-navigation/native";
import { COLORS, FONTS, IMAGES } from "../../constants/theme";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import DistanceSlider from "../../components/DistanceSlider";
import AnimatedUserMarker from "../../components/AnimatedUserMarker";

const MapeUser = [
    {
        name:"Isabella Marie",
        image:IMAGES.likedPic5,
        age:"26",
        Kilomiter:"1.5"
    },
    {
        name:"Emily",
        image:IMAGES.likedPic6,
        age:"24",
        Kilomiter:"1.8"
    },
    {
        name:"Olivia",
        image:IMAGES.likedPic5,
        age:"20",
        Kilomiter:"1.4"
    },
]

const NearbyYou = () => {

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
                {/* <MapView
                    provider={PROVIDER_GOOGLE}
                    style={StyleSheet.absoluteFillObject}
                    initialRegion={{
                        latitude: 26.929187054328832,
                        longitude: 75.74185634944932,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    <Marker coordinate={{ latitude: 40.7128, longitude: -74.006 }} />
                </MapView> */}
                <View style={{flex:1}}>
                    <LinearGradient
                        colors={[theme.dark ? '#000000': '#FFFFFF', theme.dark ? 'rgba(0,0,0,0)': 'rgba(255,255,255,0)']}
                        locations={[0.5,0.7]}
                        style={{
                            width:'100%',
                            height:250,
                            position:'absolute',
                            left:0,
                            right:0,
                            top:0
                        }}
                    />
                    <LinearGradient
                        colors={[theme.dark ? 'rgba(0,0,0,0)': 'rgba(255,255,255,0)',theme.dark ? '#000000': '#FFFFFF']}
                        locations={[0.2,0.9]}
                        style={{
                            width:'100%',
                            height:250,
                            position:'absolute',
                            left:0,
                            right:0,
                            bottom:0
                        }}
                    />
                    <View
                        style={[GlobalStyleSheet.container,{
                            flex:1,
                            padding:0,
                            paddingTop:STATUSBAR_HEIGHT,
                        }]}
                    >
                        <View>
                            <Image
                                style={[styles.image,{
                                    borderColor:colors.card,
                                    position:'absolute',
                                    left:150,
                                    top:174
                                }]}
                                source={IMAGES.likedPic7}
                            />
                            <Image
                                style={[styles.image,{
                                    borderColor:colors.card,
                                    position:'absolute',
                                    left:60,
                                    top:250
                                }]}
                                source={IMAGES.likedPic9}
                            />
                            <Image
                                style={[styles.image,{
                                    height:30,
                                    width:30,
                                    borderColor:colors.card,
                                    position:'absolute',
                                    right:110,
                                    top:280
                                }]}
                                source={IMAGES.likedPic8}
                            />
                        </View>
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
                            style={[GlobalStyleSheet.flexCenter,{marginTop:20,marginBottom:5,paddingHorizontal:20,}]}
                        >
                            <TouchableOpacity
                                style={[GlobalStyleSheet.headerBtn,{
                                    backgroundColor:colors.card,
                                    elevation: 5,
                                    shadowColor: "#000",
                                    shadowOpacity: 0.15,
                                    shadowRadius: 8,
                                }]}
                            >
                                <Image
                                    style={{height:20,width:20}}
                                    resizeMode='contain'
                                    tintColor={colors.title}
                                    source={IMAGES.location2}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[GlobalStyleSheet.headerBtn,{
                                    backgroundColor:colors.card,
                                    elevation: 5,
                                    shadowColor: "#000",
                                    shadowOpacity: 0.15,
                                    shadowRadius: 8,
                                }]}
                            >
                                <Image
                                    style={{height:20,width:20}}
                                    resizeMode='contain'
                                    tintColor={colors.title}
                                    source={IMAGES.grid2}
                                />
                            </TouchableOpacity>
                        </View>
                        <DistanceSlider/>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{flexGrow:1,alignItems:'flex-end',marginBottom:60}}
                        >
                            <View style={[GlobalStyleSheet.flexCenter,{marginHorizontal:20,marginLeft:50}]}>
                                {MapeUser.map((data,index) => {
                                    return(
                                        <View
                                            key={index}
                                            style={[GlobalStyleSheet.flexCenter,{
                                                flex:1,
                                                padding:10,
                                                borderRadius:10,
                                                backgroundColor:colors.card,
                                                elevation: 5,
                                                shadowColor: "#000031",
                                                shadowOpacity: 0.15,
                                                shadowRadius: 8,
                                                marginRight:20
                                            }]}
                                        >
                                            <View style={[GlobalStyleSheet.flexCenter,{gap:10,marginRight:50}]}>
                                                <View>
                                                    <Image
                                                        style={{height:40,width:40,borderRadius:6}}
                                                        resizeMode='cover'
                                                        source={IMAGES.likedPic5}
                                                    />
                                                    <View
                                                        style={{
                                                            height:8,
                                                            width:8,
                                                            borderRadius:5,
                                                            backgroundColor:COLORS.success,
                                                            borderWidth:1,
                                                            borderColor:colors.card,
                                                            position:'absolute',
                                                            bottom:-3,
                                                            right:-3
                                                        }}
                                                    />
                                                </View>
                                                <View>
                                                    <Text style={[FONTS.fontBold,{fontSize:16,color:theme.dark ? colors.title : '#191919'}]}>Isabella Marie</Text>
                                                    <Text style={[FONTS.fontBold,{fontSize:13,color:colors.text}]}>26</Text>
                                                </View>
                                            </View>
                                            <Text style={[FONTS.fontSemiBold,{fontSize:18,color:colors.title,marginRight:5}]}>1.5 <Text style={{fontSize:12,color:colors.text}}>kM</Text></Text>
                                        </View>
                                    )
                                })}
                            </View>
                        </ScrollView>
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
                        <View>
                            <Image
                                style={[styles.image,{
                                    borderColor:colors.card,
                                    position:'absolute',
                                    left:30,
                                    bottom:330
                                }]}
                                source={IMAGES.likedPic10}
                            />
                            <Image
                                style={[styles.image,{
                                    borderColor:colors.card,
                                    position:'absolute',
                                    left:100,
                                    bottom:260
                                }]}
                                source={IMAGES.likedPic5}
                            />
                            <Image
                                style={[styles.image,{  
                                    borderColor:colors.card,
                                    position:'absolute',
                                    right:70,
                                    bottom:320
                                }]}
                                source={IMAGES.likedPic6}
                            />
                        </View>
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

export default NearbyYou;
