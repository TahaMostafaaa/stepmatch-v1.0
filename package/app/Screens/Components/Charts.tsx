import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { FONTS } from '../../constants/theme';
import BasicLineChart from '../../components/Charts/LineChart';
import BasicBarChart from '../../components/Charts/BarChart';
import BasicPieChart from '../../components/Charts/PieChart';

const Charts = () => {

     const { colors }: {colors : any} = useTheme();

    return (
        <>
            <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
                <Header 
                    titleLeft
                    title={'Charts'} 
                    leftIcon={'back'}
                />
                <ScrollView>
                    <View style={GlobalStyleSheet.container}>
                        
                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:15}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Line Chart</Text>
                                </View>
                                <BasicLineChart/>
                            </View>

                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:15}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Bar Chart</Text>
                                </View>

                                <BasicBarChart/>

                            </View>

                            <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                                <View style={{marginBottom:15}}>
                                    <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Pie Chart</Text>
                                </View>
                                
                                <BasicPieChart/>

                            </View>
    
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default Charts;