import { View, Text, Platform, StatusBar, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomInput from '../../components/Input/CustomInput';
import Button from '../../components/Button/Button';

const EditProfile = () => {

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
                title="Edit Profile"
                leftIcon={'back'}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow:1}}
            >   
                <View
                    style={{flex:1}}
                >
                    <View
                        style={{
                            alignItems:'center',
                            justifyContent:'center',
                            paddingVertical:45,
                        }}
                    >
                        <View>
                            <Image
                                style={{
                                    height:160,
                                    width:160,
                                    borderRadius:100,
                                }}
                                source={IMAGES.likedPic8}
                            />
                            <TouchableOpacity
                                style={[GlobalStyleSheet.headerBtn,{
                                    height:29,
                                    width:29,
                                    borderRadius:30,
                                    backgroundColor:COLORS.primary,
                                    position:'absolute',
                                    bottom:0,
                                    right:20
                                }]}
                            >
                                <MaterialIcons size={16} color={COLORS.white} name="edit"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{flex:1,paddingHorizontal:27}}
                    >
                        <View style={{marginBottom:15}}>
                            <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>Name</Text>
                            <View style={{marginVertical:5}}>
                                <CustomInput
                                    defaultValue={'Sofia'}
                                    inputBorder
                                />
                            </View>
                        </View>
                        <View style={{marginBottom:15}}>
                            <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>phone</Text>
                            <View style={{marginVertical:5}}>
                                <CustomInput
                                    defaultValue={'+91 - 123-456-789'}
                                    inputBorder
                                    keyboardType={'number-pad'}
                                />
                            </View>
                        </View>
                        <View style={{marginBottom:15}}>
                            <Text style={[FONTS.fontNunitoRegular,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>Email</Text>
                            <View style={{marginVertical:5}}>
                                <CustomInput
                                    defaultValue={'Example@gmail.com'}
                                    inputBorder
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={{paddingHorizontal:17,paddingVertical:15,paddingBottom:30}}>
                <Button
                    title={'Save'}
                    onPress={() => navigation.goBack()}
                />
            </View>
        </View>
    )
}

export default EditProfile