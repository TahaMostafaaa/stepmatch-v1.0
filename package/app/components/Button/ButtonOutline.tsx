import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const ButtonOutline = (props:any) => {
    return (
        <TouchableOpacity
            onPress={()=> props.onPress && props.onPress()}
            style={[{
                ...props.style,
                borderWidth:1,
                borderColor: props.color ? props.color : COLORS.primary,
                paddingHorizontal:12,
                paddingVertical:12,
                borderRadius: props.btnSquare ? 0 : props.btnRounded ? 30 : SIZES.radius,
                alignItems:'center',
                height:48,
                justifyContent:'center',
                flexDirection:'row',
            }]}
        >
            <Text style={[{fontSize:15,...FONTS.fontSemiBold,color:props.color ? props.color : COLORS.primary}]}>{props.title}</Text>
        </TouchableOpacity>
    );
};


export default ButtonOutline;