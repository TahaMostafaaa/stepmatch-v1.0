import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import { COLORS, FONTS } from '../../constants/theme';
import ToggleStyle1 from '../../components/Toggles/ToggleStyle1';
import ToggleStyle2 from '../../components/Toggles/ToggleStyle2';
import ToggleStyle3 from '../../components/Toggles/ToggleStyle3';
import ToggleStyle4 from '../../components/Toggles/ToggleStyle4';

const Toggles = () => {
    
     const { colors }: {colors : any} = useTheme();

    return (
        <>
            <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
                <Header title={'Toggles'} titleLeft leftIcon={'back'}/>
                <ScrollView>
                    <View style={{...GlobalStyleSheet.container}}>
                        
                            <View style={{...GlobalStyleSheet.card,...GlobalStyleSheet.shadow,backgroundColor:colors.cardBg,borderColor:colors.borderColor}}>
                                
                                <View
                                    style={{
                                        paddingVertical:14,
                                        borderBottomWidth:1,
                                        borderBottomColor:colors.borderColor,
                                        flexDirection:"row",
                                        alignItems:'center',
                                        justifyContent:'space-between',
                                    }}
                                >
                                    <Text style={{...FONTS.font,color:colors.title,...FONTS.fontBold}}>Default Toggle</Text>
                                    
                                    <ToggleStyle1/>
                                    
                                </View>
                                <View
                                    style={{
                                        paddingVertical:14,
                                        borderBottomWidth:1,
                                        borderBottomColor:colors.borderColor,
                                        flexDirection:"row",
                                        alignItems:'center',
                                        justifyContent:'space-between',
                                    }}
                                >
                                    <Text style={{...FONTS.font,color:colors.title,...FONTS.fontBold}}>Toggle with Icon</Text>
                                    
                                    <ToggleStyle2/>
                                    
                                </View>
                                <View
                                    style={{
                                        paddingVertical:14,
                                        borderBottomWidth:1,
                                        borderBottomColor:colors.borderColor,
                                        flexDirection:"row",
                                        alignItems:'center',
                                        justifyContent:'space-between',
                                    }}
                                >
                                    <Text style={{...FONTS.font,color:colors.title,...FONTS.fontBold}}>Toggle with Text</Text>
                                    
                                    <ToggleStyle3/>
                                    
                                </View>
                                <View
                                    style={{
                                        paddingVertical:14,
                                        borderBottomWidth:1,
                                        borderBottomColor:colors.borderColor,
                                        flexDirection:"row",
                                        alignItems:'center',
                                        justifyContent:'space-between',
                                    }}
                                >
                                    <Text style={{...FONTS.font,color:colors.title,...FONTS.fontBold}}>Toggle Radio</Text>
                                    
                                    <ToggleStyle4/>
                                    
                                </View>

                            </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};


export default Toggles;