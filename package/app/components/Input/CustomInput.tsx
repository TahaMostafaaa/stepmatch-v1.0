import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View,Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import {  SvgXml } from 'react-native-svg';
import { COLORS, FONTS, ICONS, SIZES } from '../../constants/theme';

const CustomInput = (props :any) => {

     const { colors }: {colors : any} = useTheme();

    const [passwordShow , setPasswordShow ] = useState(true);
    
    const handndleShowPassword = () => {
        setPasswordShow(!passwordShow);
    }

    const [isFocused, setIsFocused] = useState(false);

    return (
        <>
            <View style={{position:'relative',justifyContent:'center'}}>
                {props.icon && 
                    <View style={{
                        position:'absolute',
                        left:3,
                    }}>
                        <View 
                            style={{
                                padding:14,
                                paddingVertical:12,
                                borderTopLeftRadius:12,
                                borderBottomLeftRadius:12,
                                borderRightWidth:1,
                                borderColor:colors.borderColor
                            }}
                        >
                            <Image
                                style={{
                                    height:20,
                                    width:20,
                                }}
                                resizeMode='contain'
                                source={props.icon && props.icon}
                            />
                        </View>
                    </View>
                }
                <TextInput
                    secureTextEntry={props.type === "password" ? passwordShow : false}
                    style={[{
                        ...FONTS.font,
                        fontSize:17,
                        borderWidth:1,
                        color:colors.text,
                        borderColor:isFocused ? COLORS.primary :colors.borderColor,
                        borderRadius:SIZES.radius,
                        paddingVertical:15,
                        paddingHorizontal:15,
                    }, props.icon && {
                        paddingLeft:63,
                    },props.inputLg && {
                        paddingVertical:18,
                    },props.inputSm && {
                        paddingVertical:7,
                    },props.inputRounded && {
                        borderRadius:30,
                    },props.inputBorder && {
                        borderWidth:0,
                        borderBottomWidth:1,
                        borderRadius:0,
                        paddingHorizontal:0,
                        paddingVertical:10,
                        color:isFocused ? colors.title : colors.text
                    }]}
                    selectionColor={COLORS.primary}
                    placeholderTextColor={colors.text}
                    placeholder={props.placeholder}
                    onChangeText={props.onChangeText}
                    value={props.value && props.value}
                    defaultValue={props.defaultValue && props.defaultValue}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus && props.onFocus(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur && props.onBlur(e);
                    }}
                    keyboardType={props.keyboardType}
                />
                {props.type === "password" &&
                    <TouchableOpacity
                        accessible={true}
                        accessibilityLabel="Password"
                        accessibilityHint="Password show and hidden"
                        onPress={() => handndleShowPassword()}
                        style={styles.eyeIcon}>
                        <SvgXml
                            xml={passwordShow ? ICONS.eyeClose : ICONS.eyeOpen}
                        />
                    </TouchableOpacity>
                }
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    
    eyeIcon:{
        position:'absolute',
        height:50,
        width:50,
        alignItems:'center',
        justifyContent:'center',
        right:0,
        zIndex:1,
        top:0,
    }
})

export default CustomInput;