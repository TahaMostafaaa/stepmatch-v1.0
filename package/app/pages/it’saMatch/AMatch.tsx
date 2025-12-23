import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';

type AMatchScreenProps = NativeStackScreenProps<RootStackParamList, 'AMatch'>;

const AMatch = ({ navigation } : AMatchScreenProps) => {

    const theme = useTheme()
    const { colors }: {colors : any} = theme;

    return (
        <SafeAreaView
            style={[GlobalStyleSheet.container,{
                padding:0,
                flex:1,
                backgroundColor:colors.card,
            }]}
        >
            <View
                style={{
                    paddingHorizontal:0
                }}
            >
                <Header
                    title={'Ditto'}
                    leftIcon={'back'}
                    explore
                    transparent
                />
            </View>
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={{
                    flex:1,
                    alignItems:'center',
                    justifyContent:'center',
                    paddingTop:50,
                    paddingBottom:20,
                }}>
                    <View style={{position:'absolute',top:-127.01,left:-130.01}}>
                        <View style={{position:'relative',alignItems:'center',justifyContent:'center'}}>
                            <Image
                                style={{
                                    width:'100%',
                                    height:null,
                                    aspectRatio:1/1,
                                }}
                                resizeMode='contain'
                                source={IMAGES.Ellipse}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            position:'absolute',
                            left:95,
                            top:75,
                            transform:[{rotate:'-23.81deg'}]
                        }}
                    >
                        <Image
                            style={{width:24,height:22}}
                            resizeMode='contain'
                            tintColor={'#BDD3FF'}
                            source={IMAGES.heart7}
                        />
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',position:'relative',left:20,top:60}}>
                        <View
                            style={{
                                transform: [{ rotate: '-7.16deg' }],
                                zIndex:-1,
                                borderRadius:25,
                                overflow:'hidden',
                                top:-100
                            }}
                        >
                            <View
                                style={{
                                    padding:5,
                                    borderRadius:25,
                                    backgroundColor:'rgba(255,255,255,0.4)',
                                    alignItems:'center',
                                    justifyContent:'center'
                                }}
                            >
                                <View
                                    style={{
                                        height: 260, 
                                        width: 180,
                                        borderRadius: 25,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Image  
                                        style={{
                                            height:'100%',
                                            width: '100%',
                                            borderRadius:25
                                        }}
                                        source={IMAGES.likedPic12}
                                    />
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                transform: [{ rotate: '14.48deg' }],
                                borderRadius:25,
                                overflow:'hidden',
                                right:60,
                            }}
                        >
                            <View
                                style={{
                                    height: 275, 
                                    width: 198,
                                    borderRadius: 25,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Image  
                                    style={{
                                        height:'100%',
                                        width: '100%',
                                        borderRadius:25
                                    }}
                                    source={IMAGES.likedPic14}
                                />
                            </View>
                        </View>
                        <View
                            style={[GlobalStyleSheet.headerBtn,{
                                height:80,
                                width:80,
                                borderRadius:50,
                                backgroundColor:COLORS.primary,
                                position:'absolute',
                                left:110,
                                right:0,
                                top:50
                            }]}
                        >
                            <Image
                                style={{
                                    width:43,
                                    height:35,
                                }}
                                resizeMode='contain'
                                source={IMAGES.heart2}
                            />
                        </View>
                        <View
                            style={{
                                position:'absolute',
                                right:100,
                                top:-50,
                                transform:[{rotate:'-23.81deg'}]
                            }}
                        >
                            <Image
                                style={{width:38,height:32}}
                                resizeMode='contain'
                                tintColor={'#BDD3FF'}
                                source={IMAGES.heart6}
                            />
                        </View>
                        <View
                            style={{
                                position:'absolute',
                                left:30,
                                bottom:45,
                                transform:[{rotate:'-23.81deg'}]
                            }}
                        >
                            <Image
                                style={{width:27,height:23}}
                                resizeMode='contain'
                                tintColor={'#BDD3FF'}
                                source={IMAGES.heart7}
                            />
                        </View>
                    </View>
                </View>
                <View style={{marginBottom:35,alignItems:'center'}}>
                    <Text style={[FONTS.OleoScriptBold,{fontSize:45,color:COLORS.primary,lineHeight:63,marginBottom:12}]}>Your Matched!</Text>
                    <Text style={[FONTS.fontNunitoRegular,{fontSize:16,color:colors.text,paddingHorizontal:75,textAlign:'center'}]}>"Say hello to Marianne and start your conversation now!"</Text>
                </View>
                <View
                    style={{alignItems:'center',marginBottom:50}}
                >
                    <TouchableOpacity
                        onPress={() => 
                            navigation.navigate('SingleChat', {
                                data: {
                                    name: 'Isabella Marie ',
                                    image: IMAGES.likedPic14
                                }
                            })
                        }
                        activeOpacity={0.8}
                        style={[GlobalStyleSheet.headerBtn,{
                            height:90,
                            width:90,
                            borderRadius:50,
                            backgroundColor:COLORS.primary,
                            zIndex:99
                        }]}
                    >
                        <Image
                            style={{
                                width:43,
                                height:35,
                            }}
                            resizeMode='contain'
                            source={IMAGES.chat}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{position:'absolute',bottom:-120,right:-120}}>
                    <Image
                        style={{
                            width:'100%',
                            height:null,
                            aspectRatio:1/1,
                        }}
                        resizeMode='contain'
                        source={IMAGES.Ellipse}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


export default AMatch