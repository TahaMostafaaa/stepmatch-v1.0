import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import Chip from '../../components/Chip';

const Chips = () => {

     const { colors }: {colors : any} = useTheme();

    return (
        <>
            <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
                <Header 
                    titleLeft
                    title={'Chips'}
                    leftIcon={'back'}
                />
                <ScrollView>
                    <View style={GlobalStyleSheet.container}>
                       
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:15}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Light Mode</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Chip 
                                        style={{marginRight:8}}
                                        color={COLORS.success}
                                        icon={<Feather name='check' size={18} color={COLORS.white}/>}
                                        title={'All good'}
                                    />
                                    <Chip 
                                        style={{marginRight:8}}
                                        color={COLORS.danger}
                                        icon={<Feather name='x' size={18} color={COLORS.white}/>}
                                        title={'Error'}
                                    />
                                    <Chip 
                                        style={{marginRight:8}}
                                        image={IMAGES.userPic}
                                        title={'Profile'}
                                    />
                                </View>
                            </View>
                        

                       
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:15}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Dark Mode</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Chip 
                                        darkMode
                                        style={{marginRight:8}}
                                        color={COLORS.success}
                                        icon={<Feather name='check' size={18} color={COLORS.white}/>}
                                        title={'All good'}
                                    />
                                    <Chip 
                                        darkMode
                                        style={{marginRight:8}}
                                        color={COLORS.danger}
                                        icon={<Feather name='x' size={18} color={COLORS.white}/>}
                                        title={'Error'}
                                    />
                                    <Chip 
                                        darkMode
                                        style={{marginRight:8}}
                                        image={IMAGES.userPic}
                                        title={'Profile'}
                                    />
                                </View>
                            </View>
                        

                       
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:15}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Diffrent Sizes</Text>
                                </View>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Chip 
                                        style={{marginRight:8}}
                                        chipLarge
                                        icon={<Feather name='settings' size={16} color={COLORS.white}/>}
                                        title={'Large'}
                                    />
                                    <Chip 
                                        style={{marginRight:8}}
                                        icon={<Feather name='settings' size={16} color={COLORS.white}/>}
                                        title={'Default'}
                                    />
                                    <Chip 
                                        style={{marginRight:8}}
                                        chipSmall
                                        icon={<Feather name='settings' size={16} color={COLORS.white}/>}
                                        title={'Small'}
                                    />
                                </View>
                            </View>
                        

                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};


export default Chips;