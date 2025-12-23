import React, { useState } from 'react';
import {  Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text,  View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { FONTS, IMAGES } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import Button from '../../components/Button/Button';
import Header from '../../layout/Header';
import CheckList from '../components/CheckList';


type IntrestedScreenProps = NativeStackScreenProps<RootStackParamList, 'Intrested'>;

const Intrested = ({ navigation } : IntrestedScreenProps) => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme

    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const genderData= ["Women" , "Men", "Other"];
    const [activeGender , setGender] = useState(genderData[1]);

    return (
        <View
            style={{
                flex:1,
                backgroundColor:colors.card,
            }}
        >
            <KeyboardAvoidingView
                style={{flex: 1}}
            >
                <View style={{flex:1,paddingTop:STATUSBAR_HEIGHT}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <Header
                            title={'Ditto'}
                            explore
                            leftIcon={'back'}
                            onPress={() => navigation.goBack()}
                        />
                        <View style={[GlobalStyleSheet.container,{paddingTop:50}]}>
                            <Text style={[FONTS.fontBold,{fontSize:25,color:theme.dark ? colors.title : '#191919'}]}>Who are you interested in seeing ?</Text>
                            <View style={{marginVertical:10}}>
                                {genderData.map((data,index) => {
                                    return(
                                        <CheckList
                                            onPress={() => setGender(data)}
                                            item={data}
                                            checked={data == activeGender ? true : false}
                                            key={index}
                                        />
                                    )
                                })}
                            </View>
                            <View
                                style={{
                                    position:'absolute',
                                    left:25,
                                    top:25,
                                    transform:[{rotate:'-23.81deg'}]
                                }}
                            >
                                <Image
                                    style={{width:22,height:19}}
                                    resizeMode='contain'
                                    tintColor={'#BDD3FF'}
                                    source={IMAGES.heart7}
                                />
                            </View>
                            <View
                                style={{
                                    alignItems:'flex-end',
                                    right:0,
                                    top:80,
                                    transform:[{rotate:'-23.81deg'}]
                                }}
                            >
                                <Image
                                    style={{width:39,height:32}}
                                    resizeMode='contain'
                                    tintColor={'#BDD3FF'}
                                    source={IMAGES.heart}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View
                    style={[GlobalStyleSheet.container,{
                        paddingHorizontal:20,
                        paddingVertical:30,
                    }]}
                >
                    <Button
                        onPress={() => navigation.navigate('LookingFor')}
                        title={'Next'}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};


export default Intrested;