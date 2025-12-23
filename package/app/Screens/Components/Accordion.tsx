import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { FONTS, SIZES } from '../../constants/theme';
import ClassicAccordion from '../../components/Accordion/ClassicAccordion';
import AccordionHighlight from '../../components/Accordion/AccordionHighlight';
import AccordionSeprator from '../../components/Accordion/AccordionSeprator';

const AccordionScreen = () => {

     const { colors }: {colors : any} = useTheme();

    return (
        <>
            <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
                <Header 
                    titleLeft 
                    title={'Accordions'} 
                    leftIcon={'back'}
                />
                <ScrollView>
                    <View style={GlobalStyleSheet.container}>
                        
                        <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                            <View style={{marginBottom:15,marginTop:5}}>
                                <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Classic Accordion</Text>
                            </View>
                            <ClassicAccordion/>
                        </View>
                        <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                            <View style={{marginBottom:15,marginTop:5}}>
                                <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Accordion Highlight</Text>
                            </View>
                            <AccordionHighlight/>
                        </View>
                        <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.cardBg,borderColor:colors.borderColor}]}>
                            <View style={{marginBottom:15,marginTop:5}}>
                                <Text style={{...FONTS.h6,lineHeight:18,marginBottom:2,color:colors.title}}>Accordion Seprator</Text>
                            </View>
                            <AccordionSeprator/>
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
    }
})

export default AccordionScreen;