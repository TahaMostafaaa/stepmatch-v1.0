import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../layout/Header';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS, IMAGES, SIZES } from '../constants/theme';

const Apps = ({navigation} : any) => {
    
     const { colors }: {colors : any} = useTheme();

    return (
        <SafeAreaView
            style={[GlobalStyleSheet.container,{
                flex:1,
                backgroundColor:colors.themeBg,
                padding:0
            }]}
        >
            <Header
                leftIcon={'back'}
                title={'Apps'}
                titleLeft
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom:70,
                }}
            >
                <View style={GlobalStyleSheet.container}>
                    <View style={GlobalStyleSheet.row}>
                        <View style={GlobalStyleSheet.col50}>
                            
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('BadooPages')}
                                    style={{
                                        borderRadius:SIZES.radius,
                                        backgroundColor:colors.cardBg,
                                        paddingHorizontal:5,
                                        paddingBottom:30,
                                        alignItems:'center',
                                        paddingTop:5,
                                        marginBottom:35,
                                        marginRight:5,
                                        ...GlobalStyleSheet.shadow,
                                    }}
                                >    
                                    <View style={{marginBottom:12,borderWidth:1,borderRadius:SIZES.radius,borderColor:colors.borderColor}}>
                                        <Image
                                            style={{
                                                width:'100%',
                                                height:SIZES.width > SIZES.container ? undefined : 320,
                                                aspectRatio: 1 / 2,
                                                borderRadius:SIZES.radius,
                                            }}
                                            source={IMAGES.demoCommingSoon}
                                        />
                                    </View>
                                    <Text style={{...FONTS.fontSm,...FONTS.fontBold,color:colors.title,textAlign:'center'}}>W3Badoo App</Text>
                                    <View
                                        style={{
                                            backgroundColor:COLORS.primary2,
                                            paddingHorizontal:15,
                                            paddingVertical:8,
                                            borderRadius:8,
                                            position:'absolute',
                                            bottom:-14,
                                        }}
                                    >
                                        <Text style={{...FONTS.fontXs,...FONTS.fontBold,color:COLORS.white,top:1}}>View Demo</Text>
                                    </View>
                                </TouchableOpacity>
                        </View>
                        <View style={GlobalStyleSheet.col50}>
                           
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('W3DatingPage')}
                                    style={{
                                        borderRadius:SIZES.radius,
                                        backgroundColor:colors.cardBg,
                                        paddingHorizontal:5,
                                        paddingBottom:30,
                                        alignItems:'center',
                                        paddingTop:5,
                                        marginBottom:35,
                                        marginLeft:5,
                                        ...GlobalStyleSheet.shadow,
                                    }}
                                >    
                                    <View style={{marginBottom:12,borderWidth:1,borderRadius:SIZES.radius,borderColor:colors.borderColor}}>
                                        <Image
                                            style={{
                                                width:'100%',
                                                height:SIZES.width > SIZES.container ? undefined : 320,
                                                aspectRatio: 1 / 2,
                                                borderRadius:SIZES.radius,
                                            }}
                                            source={IMAGES.demo1}
                                        />
                                    </View>
                                    <Text style={{...FONTS.fontSm,...FONTS.fontBold,color:colors.title,textAlign:'center'}}>W3Dating App</Text>
                                    <View
                                        style={{
                                            backgroundColor:COLORS.primary2,
                                            paddingHorizontal:15,
                                            paddingVertical:8,
                                            borderRadius:8,
                                            position:'absolute',
                                            bottom:-14,
                                        }}
                                    >
                                        <Text style={{...FONTS.fontXs,...FONTS.fontBold,color:COLORS.white,top:1}}>View Demo</Text>
                                    </View>
                                </TouchableOpacity>
                        </View>
                        <View style={GlobalStyleSheet.col50}>
                            
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('TinderPage')}
                                    style={{
                                        borderRadius:SIZES.radius,
                                        backgroundColor:colors.cardBg,
                                        paddingHorizontal:5,
                                        paddingBottom:30,
                                        alignItems:'center',
                                        paddingTop:5,
                                        marginBottom:35,
                                        marginRight:5,
                                        ...GlobalStyleSheet.shadow,
                                    }}
                                >    
                                    <View style={{marginBottom:12}}>
                                        <Image
                                            style={{
                                                width:'100%',
                                                height:SIZES.width > SIZES.container ? undefined : 320,
                                                aspectRatio: 1 / 2,
                                                borderRadius:SIZES.radius,
                                            }}
                                            source={IMAGES.demo2}
                                        />
                                    </View>
                                    <Text style={{...FONTS.fontSm,...FONTS.fontBold,color:colors.title,textAlign:'center'}}>W3Tinder App</Text>
                                    <View
                                        style={{
                                            backgroundColor:COLORS.primary2,
                                            paddingHorizontal:15,
                                            paddingVertical:8,
                                            borderRadius:8,
                                            position:'absolute',
                                            bottom:-14,
                                        }}
                                    >
                                        <Text style={{...FONTS.fontXs,...FONTS.fontBold,color:COLORS.white,top:1}}>View Demo</Text>
                                    </View>
                                </TouchableOpacity>
                        </View>
                        <View style={GlobalStyleSheet.col50}>
                            
                            <TouchableOpacity
                                onPress={() => navigation.navigate('W3BumblePage')}
                                style={{
                                    borderRadius:SIZES.radius,
                                    backgroundColor:colors.cardBg,
                                    paddingHorizontal:5,
                                    paddingBottom:30,
                                    alignItems:'center',
                                    paddingTop:5,
                                    marginBottom:35,
                                    marginRight:5,
                                    ...GlobalStyleSheet.shadow,
                                }}
                            >    
                                <View style={{marginBottom:12}}>
                                    <Image
                                        style={{
                                            width:'100%',
                                            height:SIZES.width > SIZES.container ? undefined : 320,
                                            aspectRatio: 1 / 2,
                                            borderRadius:SIZES.radius,
                                        }}
                                        source={IMAGES.demo4_8}
                                    />
                                </View>
                                <Text style={{...FONTS.fontSm,...FONTS.fontBold,color:colors.title,textAlign:'center'}}>W3Bumble App</Text>
                                <View
                                    style={{
                                        backgroundColor:COLORS.primary2,
                                        paddingHorizontal:15,
                                        paddingVertical:8,
                                        borderRadius:8,
                                        position:'absolute',
                                        bottom:-14,
                                    }}
                                >
                                    <Text style={{...FONTS.fontXs,...FONTS.fontBold,color:COLORS.white,top:1}}>View Demo</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    );
};

export default Apps;