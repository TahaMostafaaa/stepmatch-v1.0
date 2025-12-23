import React, { useState } from 'react';
import {  Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { FONTS, IMAGES } from '../../constants/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import Button from '../../components/Button/Button';
import Header from '../../layout/Header';
import CustomInput from '../../components/Input/CustomInput';
import DateTimePicker from '@react-native-community/datetimepicker';


type EnterBirthDateScreenProps = NativeStackScreenProps<RootStackParamList, 'EnterBirthDate'>;

const EnterBirthDate = ({ navigation } : EnterBirthDateScreenProps) => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme

    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const [datePicker, setDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [birthDate, setBirthDate] = useState(false);

    function onDateSelected(event:any, value:any) {
        setDate(value);
        setDatePicker(false);
        setBirthDate(true);
    };

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
                            <Text style={[FONTS.fontBold,{fontSize:25,color:theme.dark ? colors.title : '#191919'}]}>Enter Your Birth Date ?</Text>
                            <View style={{marginVertical:10}}>
                                <CustomInput
                                    icon={IMAGES.calendar2}
                                    value={birthDate ?  date.getDate() +"/"+ date.getMonth() +"/"+ date.getFullYear() : ""}
                                    placeholder={'DD/MM/YYYY'}
                                />
                                <TouchableOpacity
                                    onPress={() => setDatePicker(true)}
                                    style={{
                                        position:'absolute',
                                        top:0,
                                        left:0,
                                        bottom:0,
                                        right:0,
                                    }}
                                />
                            </View>
                            {datePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    is24Hour={true}
                                    onChange={onDateSelected}
                                />
                            )}
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
                                    position:'absolute',
                                    right:22,
                                    top:180,
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
                        onPress={() => navigation.navigate('YourGender')}
                        title={'Next'}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};


export default EnterBirthDate;