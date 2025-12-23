import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { useRoute, useTheme } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GlobalStyleSheet } from '../../constants/StyleSheet';

const ChatData = [
    {
        id: '1',
        title: 'Good morning!',
        send: false,
    },
    {
        id: '2',
        title: "I'm looking for a new laptop",
        time: "10:30",
        send: false,
        userimage:IMAGES.likedPic5
    },
    {
        id: '3',
        title: 'Good morning!',
        send: true,
    },
    {
        id: '4',
        title: 'Of course, we have a great selection of laptops.',
        time: "10:30",
        send: true,
    },
    {
        id: '5',
        title: "I'll mainly use it for work, so something with good processing power and a comfortable keyboard is essential.",
        time: "10:30",
        send: false,
        userimage:IMAGES.likedPic5
    },
    {
        id: '6',
        title: 'Got it!',
        send: true,
    },
    {
        id: '7',
        title: 'We have several options that would suit your needs. Let me show you a few models that match your criteria.',
        time: "10:30",
        send: true,
    },
    {
        id: '8',
        title: "I'm looking to spend around $800 to $1,000.",
        time: "10:30",
        send: false,
        userimage:IMAGES.likedPic5
    }
]

type SingleChatScreenProps = NativeStackScreenProps<RootStackParamList, 'SingleChat'>;

const SingleChat = ({ navigation } : SingleChatScreenProps)  => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    // const sheetRef = React.useRef<any>('');
    
     const route = useRoute<any>();
        
    const { data } = route.params;

    return (
        <SafeAreaView style={{ backgroundColor:colors.card, flex: 1 }}>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:10,paddingBottom:0}]}>
                <View style={{ flexDirection: 'row', alignItems: 'center',borderBottomWidth:1,paddingBottom:10,borderBottomColor:colors.borderColor }}>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                padding:10
                            }}
                        >
                            <Image
                                style={[GlobalStyleSheet.image,{tintColor: colors.text}]}
                                source={IMAGES.arrowleftsolid}
                            />
                        </TouchableOpacity>
                        <View style={{marginRight:10}}>
                            <Image
                                style={{
                                    height:40,
                                    width:40,
                                    borderRadius:60,
                                }}
                                source={data.image}
                            />
                            {data.online === true &&
                                <View
                                    style={{
                                        width:10,
                                        height:10,
                                        borderRadius:10,
                                        backgroundColor:COLORS.success,
                                        borderWidth:1,
                                        borderColor:COLORS.white,
                                        position:'absolute',
                                        bottom:5,
                                        right:0
                                    }}
                                />
                            }
                        </View>
                        <Text style={[FONTS.fontBold,{fontSize:16,color:colors.title}]}>{data.name}</Text> 
                    </View>  
                    <View style={{ flexDirection: 'row',}}>
                        <TouchableOpacity
                            // onPress={() => {navigation.navigate('Call', {data : data})}}
                            style={{padding:5,paddingHorizontal:10}}
                        >
                            <Image
                                style={[GlobalStyleSheet.image,{tintColor:theme.dark ? colors.text :'#999999'}]}
                                source={IMAGES.Phone}
                            /> 
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {navigation.navigate('Video')}}
                            // onPress={() => {navigation.navigate('Video', {data : data})}}
                            style={{ padding: 5 }}
                        >
                            <Image
                                style={[GlobalStyleSheet.image,{ tintColor:theme.dark ? colors.text :'#999999'}]}
                                source={IMAGES.videocall}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            // onPress={() => sheetRef.current.openSheet('Chatoption')}
                            style={{ padding: 5 }}
                        >
                            <Image
                                style={[GlobalStyleSheet.image,{ tintColor:theme.dark ? colors.text :'#999999'}]}
                                source={IMAGES.more}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <KeyboardAvoidingView
                style={[GlobalStyleSheet.container,{padding:0, flex: 1}]}
                // behavior={Platform.OS === 'ios' ? 'padding' : ''}
            >
                <View style={{ flex: 1, backgroundColor:colors.card, paddingHorizontal: 15, marginTop:15 }}>
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flexGrow:1}}
                    >
                        <View style={{ flex: 1 }}>
                            {ChatData.map((data,index) => {
                                return (
                                    <View 
                                        key={index}
                                        style={{flexDirection:'row', alignItems:'flex-end',gap:10}}
                                    >
                                        {data.userimage && 
                                            <Image
                                                style={{
                                                    height:40,
                                                    width:40,
                                                    borderRadius:60,
                                                    marginBottom:30
                                                }}
                                                source={data.userimage}
                                            />
                                        }
                                        <View
                                            style={[{
                                                width: '75%',
                                                marginBottom: 10,
                                                marginLeft:data.userimage ? 0 : 50
                                            },
                                                data.send == false
                                                ?
                                                {
                                                    marginRight: 'auto',
                                                    alignItems: 'flex-start',
                                                }  
                                                :
                                                {
                                                    marginLeft: 'auto',
                                                    alignItems: 'flex-end',
                                                }  
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    data.send == false
                                                        ?
                                                        {
                                                            backgroundColor: COLORS.primary,
                                                            borderRadius:15,
                                                            paddingHorizontal:15,
                                                            paddingVertical:10
                                                        }
                                                        :
                                                        {
                                                            backgroundColor: '#EDEDED',
                                                            borderRadius:15,
                                                            paddingHorizontal:15,
                                                            paddingVertical:10
                                                        }

                                                ]}
                                            >
                                                <Text style={{ ...FONTS.fontNunitoRegular, fontSize:15,lineHeight: 20, color: data.send ? COLORS.title : COLORS.white}}>{data.title}</Text>
                                            </View>
                                            {data.time &&
                                                <Text style={{...FONTS.fontSemiBold, fontSize:11, color:'rgba(25,25,25,0.5)',marginTop:6 }}>{data.time}</Text>
                                            }
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                        <View style={[GlobalStyleSheet.flexCenter,
                            { backgroundColor: colors.card,paddingVertical:15,gap:6 }
                        ]}>
                            <View style={{flex:1}}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        top: 15,
                                        left: 15
                                    }}
                                >
                                    <Image
                                        style={{
                                            tintColor:theme.dark ?  colors.text : '#999999',
                                            width: 20,
                                            height: 20,
                                        }}
                                        source={IMAGES.happy}
                                    />
                                </TouchableOpacity>
                                <TextInput
                                    placeholder='Your Message'
                                    placeholderTextColor={colors.text}
                                    style={[
                                        GlobalStyleSheet.inputBox, {
                                            ...FONTS.fontMedium,
                                            fontSize:16,
                                            lineHeight:16,
                                            color:colors.title,
                                            borderColor:theme.dark ? colors.borderColor : '#CDCDCD',
                                            paddingRight:80
                                        },
                                    ]}
                                />
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        top: 15,
                                        right: 50
                                    }}
                                >
                                    <Image
                                        style={{
                                            tintColor:theme.dark ?  colors.text : '#999999',
                                            width: 20,
                                            height: 20,
                                            resizeMode:'contain'
                                        }}
                                        source={IMAGES.Camera}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        top: 15,
                                        right: 15
                                    }}
                                >
                                    <Image
                                        style={{
                                            tintColor:theme.dark ?  colors.text : '#999999',
                                            width: 20,
                                            height: 20,
                                            resizeMode:'contain'
                                        }}
                                        source={IMAGES.paperclipsolid}
                                    />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={[GlobalStyleSheet.headerBtn,{
                                height:50,
                                width:50,
                                borderRadius:15,
                                backgroundColor:COLORS.primary
                                }]}
                            >
                                <Image
                                    style={{
                                        tintColor: colors.card,
                                        width: 20,
                                        height: 20,
                                        resizeMode: 'contain'
                                    }}
                                    source={IMAGES.send}
                                />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SingleChat;