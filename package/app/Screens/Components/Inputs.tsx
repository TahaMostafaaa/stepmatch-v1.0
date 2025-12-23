import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, ICONS, SIZES } from '../../constants/theme';
import Header from '../../layout/Header';
import CustomInput from '../../components/Input/CustomInput';

const Inputs = () => {

    const { colors }: {colors : any} = useTheme();
    
    const [passwordShow , setPasswordShow ] = useState(true);
    
    const handndleShowPassword = () => {
        setPasswordShow(!passwordShow);
    }

    return (
        <>
            <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
                <Header 
                    titleLeft
                    title={'Inputs'}  
                    leftIcon={'back'}
                />
                <ScrollView>
                    <View style={GlobalStyleSheet.container}>
                        
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>

                                <View style={{marginBottom:15}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Input with icon</Text>
                                </View>

                                <View style={{marginBottom:15}}>
                                    <View style={styles.inputIcon}>
                                        <SvgXml
                                            stroke={COLORS.primary}
                                            xml={ICONS.user}
                                        />
                                    </View>
                                    <TextInput
                                        style={[styles.inputStyle,{borderColor:colors.borderColor,color:colors.title}]}
                                        placeholder='Username'
                                        placeholderTextColor={colors.text}
                                    />
                                </View>
                                <View style={{marginBottom:15}}>
                                    <View style={styles.inputIcon}>
                                        <SvgXml
                                            stroke={COLORS.primary}
                                            xml={ICONS.email}
                                        />
                                    </View>
                                    <TextInput
                                        style={[styles.inputStyle,{borderColor:colors.borderColor,color:colors.title}]}
                                        placeholder='Email'
                                        placeholderTextColor={colors.text}
                                    />
                                </View>
                                <View style={{marginBottom:15}}>
                                    <View style={styles.inputIcon}>
                                        <SvgXml
                                            fill={COLORS.primary}
                                            xml={ICONS.lock}
                                        />
                                    </View>
                                    <TextInput
                                        secureTextEntry={passwordShow}
                                        style={[styles.inputStyle,{borderColor:colors.borderColor,color:colors.title}]}
                                        placeholder='Password'
                                        placeholderTextColor={colors.text}
                                    />
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
                                </View>

                            </View>
                        

                        
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:15}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Input with border</Text>
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        icon={<FontAwesome style={{opacity:.6}} name={'user'} size={20} color={colors.text}/> }
                                        value={''}  
                                        placeholder="Enter Username"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        icon={<MaterialIcon style={{opacity:.6}} name={'email'} size={20} color={colors.text}/>}
                                        value={''}  
                                        placeholder="Enter Email"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        type={'password'}
                                        icon={<FontAwesome style={{opacity:.6}} name={'lock'} size={20} color={colors.text}/> }
                                        value={''}  
                                        placeholder="Password"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                            </View>
                        

                        
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:15}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Input with different sizes</Text>
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        inputLg
                                        icon={<FontAwesome style={{opacity:.6}} name={'user'} size={20} color={colors.textLight}/> }
                                        value={''}  
                                        placeholder="Enter Username"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        icon={<FontAwesome style={{opacity:.6}} name={'user'} size={20} color={colors.textLight}/> }
                                        value={''}  
                                        placeholder="Enter Username"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        inputSm
                                        icon={<FontAwesome style={{opacity:.6}} name={'user'} size={20} color={colors.textLight}/> }
                                        value={''}  
                                        placeholder="Enter Username"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                            </View>
                           
                        
                        
                        
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:15}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Input Fields With Radius</Text>
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        inputRounded
                                        icon={<FontAwesome style={{opacity:.6}} name={'user'} size={20} color={colors.textLight}/> }
                                        value={''}  
                                        placeholder="Enter Username"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        inputRounded
                                        icon={<MaterialIcon style={{opacity:.6}} name={'email'} size={20} color={colors.textLight}/>}
                                        value={''}  
                                        placeholder="Enter Email"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        inputRounded
                                        type={'password'}
                                        icon={<FontAwesome style={{opacity:.6}} name={'lock'} size={20} color={colors.textLight}/> }
                                        value={''}  
                                        placeholder="Password"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                            </View>
                        

                        
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:15}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Input with bottom border</Text>
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        inputBorder
                                        icon={<FontAwesome style={{opacity:.6}} name={'user'} size={20} color={colors.textLight}/> }
                                        value={''}  
                                        placeholder="Enter Username"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        inputBorder
                                        icon={<MaterialIcon style={{opacity:.6}} name={'email'} size={20} color={colors.textLight}/>}
                                        value={''}  
                                        placeholder="Enter Email"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                                <View style={{marginBottom:15}}>
                                    <CustomInput
                                        inputBorder
                                        type={'password'}
                                        icon={<FontAwesome style={{opacity:.6}} name={'lock'} size={20} color={colors.textLight}/> }
                                        value={''}  
                                        placeholder="Password"
                                        onChangeText={(value:any)=> console.log(value)}
                                    />
                                </View>
                            </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    card : {
        padding:15,
        borderRadius:SIZES.radius,
        marginBottom:15,
        borderWidth:1,
        borderColor:COLORS.borderColor,
        backgroundColor:COLORS.white,
    },
    inputStyle:{
        ...FONTS.fontLg,
        height:50,
        paddingLeft:60,
        borderWidth : 1,
        borderRadius: SIZES.radius,
    },
    inputIcon:{
        backgroundColor:COLORS.primayLight,
        height:40,
        width:40,
        borderRadius:10,
        position : 'absolute',
        left:5,
        top : 5,
        alignItems:'center',
        justifyContent:'center',
    },
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


export default Inputs;