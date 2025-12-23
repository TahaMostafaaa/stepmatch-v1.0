import { View, Text, Platform, StatusBar, ScrollView, Image } from 'react-native'
import React from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';

const uaserData = [
    {
        userpic:IMAGES.likedPic10,
        name:'Like You Profile',
        likepic:IMAGES.likedPic1
    },
    {
        userpic:IMAGES.likedPic14,
        name:'Like You Profile',
        likepic:IMAGES.likedPic5
    },
    {
        userpic:IMAGES.likedPic9,
        name:'Like You Profile',
        likepic:IMAGES.likedPic2
    },
]


const Notifications = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme
    
    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const navigation = useNavigation<any>();
    
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
                title="Notifications"
                leftIcon={'back'}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow:1}}
            >   
                <View
                    style={{flex:1,paddingHorizontal:20,paddingTop:10}}
                >
                    <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.text}]}>last 7 days</Text>
                    {uaserData.map((data, index) => {
                        return(
                            <View
                                key={index}
                                style={[GlobalStyleSheet.flexCenter,{
                                    paddingVertical:15,
                                    borderBottomWidth:1,
                                    borderColor: colors.borderColor,
                                }]}
                            >
                                <View style={[GlobalStyleSheet.flexCenter,{gap:10}]}>
                                    <View>
                                        <Image
                                            style={{
                                                height:57,
                                                width:57,
                                                borderRadius:50
                                            }}
                                            resizeMode='cover'
                                            source={data.userpic}
                                        />
                                        <View
                                            style={[GlobalStyleSheet.headerBtn,{
                                                height:22,
                                                width:22,
                                                borderRadius:30,
                                                backgroundColor:'#F9595F',
                                                position:'absolute',
                                                bottom:-2,
                                                right:-2
                                            }]}
                                        >
                                            <Image
                                                style={[{height:12,width:12, tintColor:COLORS.white}]}
                                                resizeMode='contain'
                                                source={IMAGES.heart2}
                                            />
                                        </View>
                                    </View>
                                    <Text style={[FONTS.fontSemiBold,{fontSize:16,color:theme.dark ? colors.title : '#191919'}]}>{data.name}</Text>
                                </View>
                                <View
                                    style={[{
                                        height:50,
                                        width:50,
                                        borderRadius:10,
                                        backgroundColor:colors.background,
                                        overflow:'hidden'
                                    }]}
                                >
                                    <Image
                                        style={{
                                            height:'100%',
                                            width:'100%'
                                        }}
                                        resizeMode='cover'
                                        source={data.likepic}
                                    />
                                </View>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

export default Notifications