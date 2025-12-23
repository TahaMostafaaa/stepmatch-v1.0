import { View, Text, Platform, StatusBar, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';

const PrivacyPolicy = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme
    
    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const navigation = useNavigation<any>();
    

    return (
        <View 
            style={[GlobalStyleSheet.container,{
                paddingTop:STATUSBAR_HEIGHT,
                padding:0,
                flex:1,
                backgroundColor:colors.card
            }]}
        >
            <Header
                title="Privacy Policy"
                leftIcon={'back'}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow:1,paddingBottom:50}}
            >   
                <View
                    style={{flex:1,paddingHorizontal:20,paddingTop:20}}
                >
                    <Text style={[FONTS.fontSemiBold,{fontSize:16,textTransform:'capitalize'}]}>Privacy Policy</Text>
                    <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text}]}>Effective : September 22, 2025</Text>
                    <View style={{paddingTop:22}}>
                        <Text style={[FONTS.fontSemiBold,{fontSize:16,textTransform:'capitalize'}]}>Information We Collect</Text>
                        <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,marginTop:8}]}>We gather some personal & health info to make your experience better. Here’s what we look at:</Text>
                        <View style={{marginTop:10,marginBottom:10}}>
                            <View style={styles.listItem}>
                                <Text style={[styles.bullet, {color:colors.text}]}>•</Text>
                                <Text style={[styles.text,{color:colors.text}]}>
                                    Your Basics: Name, email, age, gender – the essentials to get started!
                                </Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={[styles.bullet, {color:colors.text}]}>•</Text>
                                <Text style={[styles.text,{color:colors.text}]}>
                                    About You: Name, email, age & gender – so we know who’s awesome!
                                </Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={[styles.bullet, {color:colors.text}]}>•</Text>
                                <Text style={[styles.text,{color:colors.text}]}>
                                    Your Health: Menstrual cycle info, symptoms & anything you choose to share all to personalize your experience!
                                </Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={[styles.bullet, {color:colors.text}]}>•</Text>
                                <Text style={[styles.text,{color:colors.text}]}>
                                    Cycle & Wellness: Dates, symptoms, and other details you share to make the app work better for you!
                                </Text>
                            </View>
                        </View>
                        <Text style={[FONTS.fontSemiBold,{fontSize:16,textTransform:'capitalize'}]}>Your Rights</Text>
                        <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,marginTop:8}]}>We use your data to</Text>
                        <View style={{marginTop:10,marginBottom:20}}>
                            <View style={[styles.listItem,{marginBottom:0}]}>
                                <Text style={[styles.bullet, {color:colors.text}]}>•</Text>
                                <Text style={[styles.text,{color:colors.text}]}>
                                    Provide personalized insights and reminders.
                                </Text>
                            </View>
                            <View style={[styles.listItem,{marginBottom:0}]}>
                                <Text style={[styles.bullet, {color:colors.text}]}>•</Text>
                                <Text style={[styles.text,{color:colors.text}]}>
                                    Improve app performance and user experience.
                                </Text>
                            </View>
                            <View style={[styles.listItem,{marginBottom:0}]}>
                                <Text style={[styles.bullet, {color:colors.text}]}>•</Text>
                                <Text style={[styles.text,{color:colors.text}]}>
                                    Develop aggregated, anonymized analytics to refine features.
                                </Text>
                            </View>
                        </View>
                        <View style={{marginBottom:30}}>
                            <Text style={[FONTS.fontSemiBold,{fontSize:16,textTransform:'capitalize'}]}>Your Privacy, Our Promise</Text>
                            <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,marginTop:8}]}>We respect your personal info and health details. Everything you share stays safe with us, and we only use it to make your app experience better. Your data, your control!</Text>
                        </View>
                        <View style={{marginBottom:30,paddingRight:20}}>
                            <Text style={[FONTS.fontSemiBold,{fontSize:16,textTransform:'capitalize'}]}>Privacy First</Text>
                            <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,marginTop:8}]}>We keep your info safe & sound. What you share helps us personalize your journey—nothing more, nothing less!</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingRight:50
    },
    bullet: {
        fontSize: 20,
        color: COLORS.text,
        marginRight: 8,
    },
    text: {
        flex: 1,
        fontSize: 14,
        color:COLORS.text,
        lineHeight: 22,
    },
    bold: {
        fontWeight: '600',
        color: '#000',
    },
});

export default PrivacyPolicy