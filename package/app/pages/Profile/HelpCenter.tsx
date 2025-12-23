import { View, Text, Platform, StatusBar, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import Button from '../../components/Button/Button';
import { Feather } from '@expo/vector-icons';

const HelpCenter = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme
    
    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const navigation = useNavigation<any>();
    
    const [comment, setComment] = useState("Mismatch in Details");

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
                title="Help Center"
                leftIcon={'back'}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow:1}}
            >   
                <View
                    style={{flex:1,paddingHorizontal:20,paddingTop:20}}
                >
                    <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.title}]}>Recent Complaints</Text>
                    <View
                        style={{marginVertical:10}}
                    >
                        <View
                            style={{
                                paddingHorizontal:15,
                                paddingVertical:10,
                                borderRadius:10,
                                backgroundColor:theme.dark ? colors.background : '#F6F6F6',
                                marginBottom:15
                            }}
                        >
                            <View style={[GlobalStyleSheet.flexCenter]}>
                                <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.title,lineHeight:24}]}>Legal</Text>
                                <Text style={[FONTS.fontSemiBold,{fontSize:14,color:COLORS.primary,textTransform:'uppercase',lineHeight:24}]}>OPEN</Text>
                            </View>
                            <View style={[GlobalStyleSheet.flexCenter]}>
                                <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.text,lineHeight:24}]}>Sale Agreement</Text>
                                <Text style={[FONTS.fontSemiBold,{fontSize:12,color:colors.text,lineHeight:24}]}>Jun 15, 2025</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                paddingHorizontal:15,
                                paddingVertical:10,
                                borderRadius:10,
                                backgroundColor:theme.dark ? colors.background : '#F6F6F6',
                                marginBottom:5
                            }}
                        >
                            <View style={[GlobalStyleSheet.flexCenter]}>
                                <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.title,lineHeight:24}]}>Service & Maintenance</Text>
                                <Text style={[FONTS.fontSemiBold,{fontSize:14,color:COLORS.success,lineHeight:24}]}>Closed</Text>
                            </View>
                            <View style={[GlobalStyleSheet.flexCenter]}>
                                <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.text,lineHeight:24}]}>Placeholder Text</Text>
                                <Text style={[FONTS.fontSemiBold,{fontSize:12,color:colors.text,lineHeight:24}]}>Jun 15, 2025</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{marginBottom:25}}>
                        <Button
                            title={'View All'}
                        />
                    </View>
                    <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.title}]}>Raise a Complaint</Text>
                    <View
                        style={{marginVertical:10}}
                    >
                        <View
                            style={{
                                paddingHorizontal:15,
                                paddingVertical:10,
                                borderRadius:10,
                                backgroundColor:theme.dark ? colors.background : '#F6F6F6',
                                marginBottom:15
                            }}
                        >
                            <View style={[GlobalStyleSheet.flexCenter]}>
                                <Text style={[FONTS.fontBold,{fontSize:12,color:colors.text,lineHeight:24}]}>Category</Text>
                            </View>
                            <View style={[GlobalStyleSheet.flexCenter]}>
                                <Text style={[FONTS.fontSemiBold,{fontSize:16,color:colors.title,lineHeight:24}]}>Legal</Text>
                                <Feather name='chevron-down' size={20} color={colors.text}/>
                            </View>
                        </View>
                        <View
                            style={{
                                paddingHorizontal:15,
                                paddingVertical:10,
                                borderRadius:10,
                                backgroundColor:theme.dark ? colors.background : '#F6F6F6',
                                marginBottom:15
                            }}
                        >
                            <View style={[GlobalStyleSheet.flexCenter]}>
                                <Text style={[FONTS.fontBold,{fontSize:12,color:colors.text,lineHeight:24}]}>Sub Categorys</Text>
                            </View>
                            <View style={[GlobalStyleSheet.flexCenter]}>
                                <Text style={[FONTS.fontSemiBold,{fontSize:16,color:colors.title,lineHeight:24}]}>Sale Agreement</Text>
                                <Feather name='chevron-down' size={20} color={colors.text}/>
                            </View>
                        </View>
                        <View
                            style={{
                                paddingHorizontal:15,
                                paddingVertical:10,
                                borderRadius:10,
                                backgroundColor:theme.dark ? colors.background : '#F6F6F6',
                                marginBottom:15
                            }}
                        >
                            <View style={[GlobalStyleSheet.flexCenter]}>
                                <Text style={[FONTS.fontBold,{fontSize:12,color:colors.text,lineHeight:24}]}>Comment</Text>
                            </View>
                            <View
                                style={{
                                    backgroundColor: colors.card,
                                    borderRadius: 10,
                                    paddingHorizontal: 15,
                                    paddingVertical:15,
                                    paddingTop:0,
                                    marginTop:5
                                }}
                            >
                                <TextInput
                                    placeholder="Enter your comment..."
                                    value={comment}
                                    onChangeText={setComment}
                                    multiline
                                    textAlignVertical="top"
                                    style={{
                                        ...FONTS.fontSemiBold,
                                        fontSize: 16,
                                        lineHeight:24,
                                        color: colors.text,
                                        minHeight: 149,
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={{paddingHorizontal:17,paddingVertical:15,paddingBottom:30}}>
                <Button
                    title={'Submit'}
                    onPress={() => navigation.goBack()}
                />
            </View>
        </View>
    )
}

export default HelpCenter