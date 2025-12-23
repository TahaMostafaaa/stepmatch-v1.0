import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';

const SocialBtn = (props:any) => {

    const theme = useTheme();

    return (
        <TouchableOpacity
            style={[{
                //backgroundColor:props.color ? props.color : COLORS.primary,
                backgroundColor:theme.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)',
                paddingVertical:12,
                borderRadius:SIZES.radius,
                overflow:'hidden',
                paddingLeft:56,
                paddingRight:20,
            },props.rounded && {
                borderRadius:30,
            }]}
        >
            <View
                style={[{
                    width:38,
                    borderRadius:10,
                    position:'absolute',
                    top:4,
                    bottom:4,
                    left:4,
                    backgroundColor:props.color ? props.color : COLORS.primary,
                    alignItems:'center',
                    justifyContent:'center',
                }, props.rounded && {
                    borderRadius:30,
                }]}
            >
                {props.icon}
            </View>
            <Text style={{...FONTS.font,...FONTS.fontBold,color:theme.dark ? COLORS.white : COLORS.title}}>{props.text}</Text>
        </TouchableOpacity>
    );
};



export default SocialBtn;