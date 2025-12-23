import React from 'react';
import { SafeAreaView, ScrollView, Text, View,Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';
import Divider from '../../components/Dividers/Divider';
import DividerIcon from '../../components/Dividers/DividerIcon';

const DividerElements = () => {

     const { colors }: {colors : any} = useTheme();

    return (
        <>
            <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
                <Header 
                    titleLeft
                    title={'Dividers'}
                    leftIcon={'back'}
                />
                <ScrollView>
                    <View style={GlobalStyleSheet.container}>
                        
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:8}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Simple Dividers</Text>
                                </View>
                                <Divider/>
                                <Divider color={COLORS.danger}/>
                                <Divider color={COLORS.primary}/>
                                <Divider color={COLORS.secondary}/>
                                <Divider color={COLORS.info}/>
                                <Divider color={colors.title}/>
                            </View>
                        

                        
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:8}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Dashed Dividers</Text>
                                </View>
                                <Divider dashed/>
                                <Divider dashed color={COLORS.danger}/>
                                <Divider dashed color={COLORS.primary}/>
                                <Divider dashed color={COLORS.secondary}/>
                                <Divider dashed color={COLORS.info}/>
                                <Divider dashed color={colors.title}/>
                            </View>
                        

                        
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:8}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Dividers with icon</Text>
                                </View>
                                <DividerIcon icon={<Feather name={'x'} color={colors.text} size={18}/>}/>
                                <DividerIcon color={COLORS.danger} icon={<Feather name={'alert-circle'} color={COLORS.danger} size={18}/>}/>
                                <DividerIcon color={COLORS.primary} icon={<Feather name={'alert-triangle'} color={COLORS.primary} size={18}/>}/>
                                <DividerIcon color={COLORS.secondary} icon={<Feather name={'sun'} color={COLORS.secondary} size={18}/>}/>
                                <DividerIcon color={COLORS.info} icon={<Feather name={'truck'} color={COLORS.info} size={18}/>}/>
                                <DividerIcon color={colors.title} icon={<Feather name={'settings'} color={COLORS.title} size={18}/>}/>
                            </View>
                        

                        
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:8}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Dividers with icon</Text>
                                </View>
                                <DividerIcon dashed icon={<Feather name={'x'} color={colors.text} size={18}/>}/>
                                <DividerIcon dashed color={COLORS.danger} icon={<Feather name={'alert-circle'} color={COLORS.danger} size={18}/>}/>
                                <DividerIcon dashed color={COLORS.primary} icon={<Feather name={'alert-triangle'} color={COLORS.primary} size={18}/>}/>
                                <DividerIcon dashed color={COLORS.secondary} icon={<Feather name={'sun'} color={COLORS.secondary} size={18}/>}/>
                                <DividerIcon dashed color={COLORS.info} icon={<Feather name={'truck'} color={COLORS.info} size={18}/>}/>
                                <DividerIcon dashed color={colors.title} icon={<Feather name={'settings'} color={COLORS.title} size={18}/>}/>
                            </View>
                        
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};


export default DividerElements;