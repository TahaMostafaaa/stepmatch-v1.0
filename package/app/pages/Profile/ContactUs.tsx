import { View, Text, Platform, StatusBar, ScrollView, Image, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import Button from '../../components/Button/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import NotifySelectorSheet from '../../components/ActionSheet/NotifySelectorSheet';

const ContactUs = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme
    
    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const navigation = useNavigation<any>();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);

    const formattedDate = selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === "ios");
        setDate(currentDate);
    };

    const sheetRef = useRef<any>('');
    const [notifyTime, setNotifyTime] = useState<any>('2 hours Before');

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
                title="Contact Us"
                leftIcon={'back'}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow:1}}
            >   
                <View
                    style={{flex:1,paddingHorizontal:20,paddingTop:20}}
                >
                    <Text style={[FONTS.fontNunitoRegular,{fontSize:16,color:colors.text,textTransform:'capitalize'}]}>
                        Choose your Desired date and time and send your Dating invitation
                    </Text>
                    <View style={{marginTop:20}}>
                        <View
                            style={{
                                paddingHorizontal:21,
                                paddingVertical:14,
                                borderRadius:10,
                                backgroundColor:theme.dark ? colors.background : '#F6F6F6',
                                flex:1,
                                marginBottom:15
                            }}
                        >
                            <View style={[GlobalStyleSheet.flexaling,{gap:12}]}>
                                <Image
                                    style={{
                                        height:20,
                                        width:20,
                                    }}
                                    resizeMode='contain'
                                    tintColor={theme.dark ? colors.text : '#999999'}
                                    source={IMAGES.Text}
                                />
                                <View style={{flex:1}}>
                                    <Text style={[
                                        FONTS.fontSemiBold,
                                        {
                                            fontSize:14,
                                            lineHeight:24,
                                            color:colors.text,
                                        }
                                    ]}>Title</Text>
                                    <TextInput
                                        multiline
                                        style={{
                                            height: 'auto',
                                            ...FONTS.fontBold,
                                            fontSize:16,
                                            color:colors.title,
                                            lineHeight:24,
                                            minHeight: 0,
                                            paddingVertical: 0,
                                            textAlignVertical: 'center',
                                        }}
                                        value='Meetup Kuy'
                                    />
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                paddingHorizontal:21,
                                paddingVertical:14,
                                borderRadius:10,
                                backgroundColor:theme.dark ? colors.background : '#F6F6F6',
                                flex:1,
                                marginBottom:15
                            }}
                        >
                            <View style={[GlobalStyleSheet.flexaling,{gap:12}]}>
                                <Image
                                    style={{
                                        height:20,
                                        width:20,
                                    }}
                                    resizeMode='contain'
                                    tintColor={theme.dark ? colors.text : '#999999'}
                                    source={IMAGES.calendar}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowModal(true)} 
                                    style={{flex:1}}
                                >
                                    <Text style={[
                                        FONTS.fontSemiBold,
                                        {
                                            fontSize:14,
                                            lineHeight:24,
                                            color:colors.text,
                                        }
                                    ]}>Date</Text>
                                    <Text style={[
                                        FONTS.fontBold,
                                        {
                                            fontSize:16,
                                            lineHeight:24,
                                            color:colors.title,
                                        }
                                    ]}>{formattedDate}</Text>
                                </TouchableOpacity>
                                {/* Modal for Date Picker */}
                                <Modal visible={showModal} transparent animationType="slide">
                                    <View style={styles.modalOverlay}>
                                        <View>
                                            {Platform.OS === 'ios' ? (
                                                <DateTimePicker
                                                    value={selectedDate}
                                                    mode="date"
                                                    display="spinner"
                                                    onChange={(event, date) => setSelectedDate(date || selectedDate)}
                                                />
                                            ) : (
                                                <DateTimePicker
                                                    value={selectedDate}
                                                    mode="date"
                                                    display="default"
                                                    onChange={(event, date) => {
                                                    setShowModal(false);
                                                    if (date) setSelectedDate(date);
                                                    }}
                                                />
                                            )}

                                            {Platform.OS === 'ios' && (
                                                <TouchableOpacity
                                                    style={styles.doneButton}
                                                    onPress={() => setShowModal(false)}
                                                >
                                                    <Text style={styles.doneText}>Done</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </View>
                        <View
                            style={{
                                paddingHorizontal:21,
                                paddingVertical:14,
                                borderRadius:10,
                                backgroundColor:theme.dark ? colors.background : '#F6F6F6',
                                flex:1,
                                marginBottom:15
                            }}
                        >
                            <View style={[GlobalStyleSheet.flexaling,{gap:12}]}>
                                <Image
                                    style={{
                                        height:20,
                                        width:20,
                                    }}
                                    resizeMode='contain'
                                    tintColor={theme.dark ? colors.text : '#999999'}
                                    source={IMAGES.clock}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPicker(true)} 
                                    style={{flex:1}}
                                >
                                    <Text style={[
                                        FONTS.fontSemiBold,
                                        {
                                            fontSize:14,
                                            lineHeight:24,
                                            color:colors.text,
                                        }
                                    ]}>Time</Text>
                                    <View style={[GlobalStyleSheet.flexCenter]}> 
                                        <Text style={[
                                            FONTS.fontBold,
                                            {
                                                fontSize:16,
                                                lineHeight:24,
                                                color:colors.title,
                                            }
                                        ]}>
                                            {date.toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </Text>
                                        <Feather name='chevron-down' size={20} color={colors.text}/>
                                    </View>
                                </TouchableOpacity>
                                {showPicker && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode="date"
                                        display={Platform.OS === "ios" ? "spinner" : "default"}
                                        onChange={onChange}
                                    />
                                )}
                            </View>
                        </View>
                        <View
                            style={{
                                paddingHorizontal:21,
                                paddingVertical:14,
                                borderRadius:10,
                                backgroundColor:theme.dark ? colors.background : '#F6F6F6',
                                flex:1,
                                marginBottom:15
                            }}
                        >
                            <View style={[GlobalStyleSheet.flexaling,{gap:12}]}>
                                <Image
                                    style={{
                                        height:20,
                                        width:20,
                                    }}
                                    resizeMode='contain'
                                    tintColor={theme.dark ? colors.text : '#999999'}
                                    source={IMAGES.location}
                                />
                                <View style={{flex:1}}>
                                    <Text style={[
                                        FONTS.fontSemiBold,
                                        {
                                            fontSize:14,
                                            lineHeight:24,
                                            color:colors.text,
                                        }
                                    ]}>Location</Text>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        borderRadius:80,
                                        borderWidth:1,
                                        alignItems:'center',
                                        justifyContent:'center',
                                        paddingHorizontal:10,
                                        borderColor:COLORS.primary
                                    }}
                                >
                                    <Text style={[FONTS.fontSemiBold,{fontSize:12,lineHeight:24,color:COLORS.primary,textTransform:'capitalize'}]}>open map</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={{
                                paddingHorizontal:21,
                                paddingVertical:14,
                                borderRadius:10,
                                backgroundColor:theme.dark ? colors.background : '#F6F6F6',
                                flex:1,
                                marginBottom:15
                            }}
                        >
                            <View style={[GlobalStyleSheet.flexaling,{gap:12}]}>
                                <Image
                                    style={{
                                        height:20,
                                        width:20,
                                    }}
                                    resizeMode='contain'
                                    tintColor={theme.dark ? colors.text : '#999999'}
                                    source={IMAGES.chat3}
                                />
                                <View style={{flex:1}}>
                                    <Text style={[
                                        FONTS.fontSemiBold,
                                        {
                                            fontSize:14,
                                            lineHeight:24,
                                            color:colors.text,
                                        }
                                    ]}>Message</Text>
                                    <TextInput
                                        multiline
                                        style={{
                                            height: 'auto',
                                            ...FONTS.fontBold,
                                            fontSize:16,
                                            color:colors.title,
                                            lineHeight:24,
                                            minHeight: 0,
                                            paddingVertical: 0,
                                            textAlignVertical: 'center',
                                        }}
                                        placeholder='Enter Your Message'
                                        placeholderTextColor={'#999999'}
                                    />
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                paddingHorizontal:21,
                                paddingVertical:14,
                                borderRadius:10,
                                backgroundColor:theme.dark ? colors.background : '#F6F6F6',
                                flex:1,
                                marginBottom:15
                            }}
                        >
                            <View style={[GlobalStyleSheet.flexaling,{gap:12}]}>
                                <Image
                                    style={{
                                        height:20,
                                        width:20,
                                    }}
                                    resizeMode='contain'
                                    tintColor={theme.dark ? colors.text : '#999999'}
                                    source={IMAGES.bell2}
                                />
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => sheetRef.current.open()}
                                    style={{flex:1}}
                                >
                                    <Text style={[
                                        FONTS.fontSemiBold,
                                        {
                                            fontSize:14,
                                            lineHeight:24,
                                            color:colors.text,
                                        }
                                    ]}>Notify</Text>
                                    <View style={[GlobalStyleSheet.flexCenter]}> 
                                        <Text style={[
                                            FONTS.fontBold,
                                            {
                                                fontSize:16,
                                                lineHeight:24,
                                                color:colors.title,
                                            }
                                        ]}>
                                            {notifyTime}
                                        </Text>
                                        <Feather name='chevron-down' size={20} color={colors.text}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={{paddingHorizontal:17,paddingVertical:15,paddingBottom:30}}>
                <Button
                    title={'Send Request'}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <NotifySelectorSheet
                ref={sheetRef}
                onSelect={(value : any) => setNotifyTime(value)} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  label: {
    fontSize: 13,
    color: '#777',
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  doneButton: {
    marginTop: 15,
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  doneText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ContactUs