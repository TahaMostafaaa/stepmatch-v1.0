import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const Button = (props : any) => {
    const isDisabled = props.disabled === true;
    
    return (
        <TouchableOpacity
            activeOpacity={isDisabled ? 1 : 0.8}
            onPress={()=> {
                if (!isDisabled && props.onPress) {
                    props.onPress();
                }
            }}
            style={[{
                ...props.style,
                backgroundColor: props.color ? props.color : COLORS.primary,
                paddingHorizontal:12,
                paddingVertical:12,
                height:50,
                flexDirection:'row',
                borderRadius: props.btnSquare ? 0 : props.btnRounded ? 30 : 15,
                alignItems:'center',
                justifyContent:'center',
            }, isDisabled && { opacity: 0.6 }]}
        >
            <Text numberOfLines={1} style={[{fontSize:props.fontSize ? 18 : 18,lineHeight:props.fontSize ? 26 : 20,...FONTS.fontSemiBold,color:COLORS.white}, props.textColor && {color : props.textColor}]}>{props.title}</Text>
        </TouchableOpacity>
    );
};


export default Button;