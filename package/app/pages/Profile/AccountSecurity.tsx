import { View, Text, Platform, StatusBar, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';

const AccountSecurity = () => {

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
                title="Account & Security"
                leftIcon={'back'}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow:1,paddingBottom:100}}
            >   
                <View
                    style={{flex:1,paddingHorizontal:20,paddingTop:20}}
                >
                    <View style={{marginBottom:25,paddingRight:20}}>
                        <Text style={[FONTS.fontSemiBold,{fontSize:16,textTransform:'capitalize'}]}>Last updated on 30 September 2025</Text>
                        <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,marginTop:8}]}>Lorem ipsum dolor sit amet consectetur. Varius in sed odio euismod eget et. Eget consectetur ligula enim praesent tristique eu nunc. Augue feugiat nulla quis venenatis.</Text>
                    </View>
                    <View>
                        <Text style={[FONTS.fontSemiBold,{fontSize:16,textTransform:'capitalize'}]}>Account Eligibility & Security</Text>
                        <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,marginTop:8}]}>Lorem ipsum dolor sit amet consectetur. Varius in sed odio euismod eget et. Eget consectetur.</Text>
                        <View style={{marginTop:10,marginBottom:30}}>
                            <View style={styles.listItem}>
                                <Text style={[styles.bullet, {color:colors.text}]}>•</Text>
                                <Text style={[styles.text,{color:colors.text}]}>
                                    You are 18 years of age or older,
                                </Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={[styles.bullet, {color:colors.text}]}>•</Text>
                                <Text style={[styles.text,{color:colors.text}]}>
                                    You are capable of entering into a legally binding agreement
                                </Text>
                            </View>
                            <View style={styles.listItem}>
                                <Text style={[styles.bullet, {color:colors.text}]}>•</Text>
                                <Text style={[styles.text,{color:colors.text}]}>
                                    You are not barred or otherwise legally prohibited from accessing or using the CASHLY App and CASHLY services.
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text style={[styles.text,{color:colors.text,lineHeight:20,marginBottom:25}]}>
                                Lorem ipsum dolor sit amet consectetur. Lacus tempor viverra a risus egestas sit dignissim nunc in viverra. Fringilla faucibus eget nisl at lacus nunc amet non. Eu neque tellus amet sollicitudin nec pharetra id. Sapien pellentesque risus id eget nisl in. Eu scelerisque odio nec augue interdum sit. Etiam morbi dolor at gravida. Dictum tristique varius varius adipiscing elementum. Gravida massa ac velit elit. Viverra dui gravida scelerisque massa massa pellentesque.
                            </Text>
                            <Text style={[styles.text,{color:colors.text,lineHeight:20}]}>
                                Lorem ipsum dolor sit amet consectetur. Lacus tempor viverra a risus egestas sit dignissim nunc in viverra. Fringilla faucibus eget nisl at lacus nunc amet non. Eu neque tellus amet sollicitudin nec pharetra id. Sapien pellentesque risus id eget nisl in. Eu scelerisque odio nec augue interdum sit. Etiam morbi dolor at gravida. Dictum tristique varius varius adipiscing elementum. Gravida massa ac velit elit. Viverra dui gravida scelerisque massa massa pellentesque.
                            </Text>
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
        marginBottom: 0,
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

export default AccountSecurity