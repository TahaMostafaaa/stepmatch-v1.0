import React, { useState } from 'react';
import {  Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text,  View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import Button from '../../components/Button/Button';
import Header from '../../layout/Header';
import { Checkbox } from 'react-native-paper';


type OrientationScreenProps = NativeStackScreenProps<RootStackParamList, 'Orientation'>;

const Orientation = ({ navigation } : OrientationScreenProps) => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme

    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const Data = [
        {
            title : "Straight",
            checked : false,
        },
        {
            title : "Gay",
            checked : false,
        },
        {
            title : "Lesbian",
            checked : false,
        },
        {
            title : "Bisexual",
            checked : false,
        },
        {
            title : "Asexual",
            checked : false,
        },
        {
            title : "Queer",
            checked : false,
        },
        {
            title : "Demisexual",
            checked : false,
        },
    ]

    const handleOrientationSelected = (val:any) => {
        let Data = isChecked.map((data) => {
            if (val === data.title) {
                return { ...data, checked: !data.checked };
            }
            return data;
        });
        setisChecked(Data);
    }

    const [isChecked, setisChecked] = useState(Data);

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
                            title={'StepMatch'}
                            explore
                            leftIcon={'back'}
                            onPress={() => navigation.goBack()}
                        />
                        <View style={[GlobalStyleSheet.container,{paddingTop:50}]}>
                            <Text style={[FONTS.fontBold,{fontSize:25,color:theme.dark ? colors.title : '#191919'}]}>Your sexual orientation ?</Text>
                            <View style={{marginVertical:10}}>
                                {isChecked.map((data,index) => {
                                    return(
                                        <View key={index}>
                                            <Checkbox.Item
                                                onPress={() => handleOrientationSelected(data.title)} 
                                                position='leading'
                                                label={data.title}
                                                color={COLORS.primary}
                                                uncheckedColor={colors.text}
                                                status={data.checked ? 'checked' : 'unchecked'}
                                                style={{
                                                    paddingHorizontal: 0,
                                                    paddingVertical: 5,
                                                }}
                                                labelStyle={{
                                                    ...FONTS.font,
                                                    fontSize: 15,
                                                    color: colors.title,
                                                    textAlign: 'left',
                                                    paddingLeft:10
                                                }}
                                            />
                                        </View>
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
                        onPress={() => navigation.navigate('Intrested')}
                        title={'Next'}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};


export default Orientation;