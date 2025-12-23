import { View, Text, Platform, StatusBar, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../layout/Header';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../constants/theme';;
import Button from '../components/Button/Button';

const Settings = () => {

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
                        onPress={() => navigation.navigate('OnBoarding')}
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
                        onPress={() => navigation.navigate('OnBoarding')}
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
            </ScrollView>
            <View style={{paddingHorizontal:17,paddingVertical:15,paddingBottom:30}}>
                <Button
                    title={'Save'}
                    onPress={() => navigation.goBack()}
                />
            </View>
        </View>
    )
}

export default Settings