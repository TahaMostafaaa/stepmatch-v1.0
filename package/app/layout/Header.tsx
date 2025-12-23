import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation, useTheme } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { COLORS, FONTS, IMAGES } from '../constants/theme';
import { GlobalStyleSheet } from '../constants/StyleSheet';

const Header = (props:any) => {

    const navigation = useNavigation<any>();

    const theme =  useTheme();
    const { colors }: {colors : any} = theme;

    const handleBackPress = () => {
        try {
            if (props.backAction) {
                props.backAction();
            } else if (navigation.canGoBack && navigation.canGoBack()) {
                navigation.goBack();
            } else {
                // Fallback: Try to navigate to a safe screen
                // For Settings, try to go back to Profile or DrawerNavigation
                try {
                    if (navigation.navigate) {
                        // Try to navigate to DrawerNavigation first
                        navigation.navigate('DrawerNavigation' as never);
                    }
                } catch (error) {
                    // If navigation fails, do nothing (button won't work but won't crash)
                    console.log('Navigation error:', error);
                }
            }
        } catch (error) {
            console.log('Back button error:', error);
        }
    };

    return (
        <>
            <View
                style={[GlobalStyleSheet.container,{
                    padding:0,
                    paddingVertical:15,
                    flexDirection:'row',
                    alignItems:'center',
                    paddingHorizontal:15,
                    backgroundColor:'transparent',
                },props.transparent && {
                    position:'absolute',
                    zIndex:2,
                    left:0,
                    right:0,
                }]}    
            >
                {props.leftIcon == "back" &&
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleBackPress}
                        style={[GlobalStyleSheet.headerBtn,{
                            backgroundColor:theme.dark ? colors.input : 'rgba(25,25,25,0.04)',
                            position:'absolute',
                            left:props.transparent ? 10: 5,
                            zIndex:999999,
                            alignItems:'center',
                            justifyContent:'center',
                        }]}
                    >
                        <MaterialIcons size={20} color={theme.dark ? COLORS.white : COLORS.primary} name="arrow-back"/>
                    </TouchableOpacity>
                }
                <View style={{flex:1}}>
                    <Text style={{...FONTS.fontBold,fontSize:25,color:props.explore ? COLORS.primary : colors.title,textAlign:props.titleLeft ? 'left' : 'center'}}>{props.title}</Text>
                    {props.productId &&
                        <Text style={{...FONTS.font,textAlign:'center'}}>{props.productId}</Text>
                    }
                </View>
                {props.rightIcon == "Notifaction" &&
                    <View
                        style={{
                            position:'absolute',
                            right:5
                        }}
                    >
                        <IconButton
                            style={[GlobalStyleSheet.headerBtn,{
                                backgroundColor:theme.dark ? colors.input : 'rgba(25,25,25,0.04)',
                            }]}
                            onPress={() => navigation.navigate('Notifications')}
                            icon={() => <Image source={IMAGES.bell} style={{height:16,width:16,}} tintColor={theme.dark ? COLORS.white : colors.text}/>} 
                        />
                        <View
                            style={{height:10,width:10,borderRadius:5,backgroundColor:'#FF0000',position:'absolute',right:8,top:10}}
                        />
                    </View>
                }
                {props.rightIcon == "EditProfile" &&
                    <View
                        style={{
                            position:'absolute',
                            right:5
                        }}
                    >
                        <IconButton
                            style={[GlobalStyleSheet.headerBtn,{
                                backgroundColor:theme.dark ? colors.input : 'rgba(25,25,25,0.04)',
                            }]}
                            onPress={() => navigation.navigate('EditProfile')}
                            icon={() => <MaterialIcons size={20} color={theme.dark ? COLORS.white : colors.text} name="edit"/>} 
                        />
                    </View>
                }
            </View>
        </>
    );
};



export default Header;