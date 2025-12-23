import React from 'react';
import { 
    Image, 
    ScrollView, 
    Text, 
    TouchableOpacity, 
    View 
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, ICONS, IMAGES } from '../../constants/theme';
import Header from '../../layout/Header';

const Chat = () => {
    
    const navigation = useNavigation<any>();

    const theme = useTheme();
    const { colors }: {colors : any} = theme; 

    const NewMatchData = [
        {
            image : IMAGES.likedPic5,
            name : "Emily",
            online:true,
        },
        {
            image : IMAGES.likedPic6,
            name : "Olivia",
            online:true,
        },
        {
            image : IMAGES.likedPic7,
            name : "Aria",
            online:true,
        },
        {
            image : IMAGES.likedPic8,
            name : "Harper",
            online:true,
        },
        {
            image : IMAGES.likedPic9,
            name : "Sofia",
        },
        {
            image : IMAGES.likedPic1,
            name : "Grace",
        },
        {
            image : IMAGES.likedPic2,
            name : "Mitchell",
        },
    ]

    const MessagesData = [
        {
            image : IMAGES.likedPic5,
            name : "Emily",
            lastMsg : "You're my heart's melody.",
            date : '2 Hours ago',
            messageSent : false,
            recentmessageCount:"3"
        },
        {
            image : IMAGES.likedPic6,
            name : "Olivia",
            lastMsg : "Forever yours, my darling.",
            date : '4 Hours ago',
            messageSent : true,
        },
        {
            image : IMAGES.likedPic7,
            name : "Aria",
            lastMsg : "You're my eternal love.",
            date : '5 Day ago',
            messageSent : false,
            recentmessageCount:"12"
        },
        {
            image : IMAGES.likedPic8,
            name : "Harper",
            lastMsg : "You complete me perfectly.",
            date : '2 Week ago',
            messageSent : true,
        },
        {
            image : IMAGES.likedPic9,
            name : "Sofia",
            lastMsg : "Love you to infinity",
            date : '12 Hours ago',
            messageSent : true,
        },
        {
            image : IMAGES.likedPic10,
            name : "Grace",
            lastMsg : "You're my eternal love.",
            date : '5 Hours ago',
            messageSent : false,
            recentmessageCount:"7"
        }
    ]

    return (
        <>
            <View 
                style={[GlobalStyleSheet.container,{
                    padding:0,
                    flex:1,
                    backgroundColor:colors.card
                }]}
            >
                <Header
                    title={'Chats'}
                    leftIcon={'back'}
                    rightIcon={'Notifaction'}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={GlobalStyleSheet.container}>
                        <View style={[GlobalStyleSheet.flexCenter]}>
                            <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>online Now</Text>
                            <View
                                style={{
                                    padding:12,
                                    paddingVertical:6,
                                    borderRadius:50,
                                    backgroundColor:theme.dark ? 'rgba(255,255,255,0.08)': 'rgba(0,0,0,0.08)'
                                }}
                            >
                                <Text style={[FONTS.fontBold,{fontSize:12,color:colors.text,lineHeight:12}]}>{NewMatchData.length}</Text>
                            </View>
                        </View>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft:15,
                        }}
                    >
                        {NewMatchData.map((data,index) => {
                            return(
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('SingleChat',{data : data})}
                                    key={index}
                                    style={{
                                        alignItems:'center',
                                        marginRight:20,
                                    }}
                                >
                                    <View
                                        style={{
                                            marginBottom:10,
                                        }}
                                    >
                                        <Image
                                            style={{
                                                height:65,
                                                width:65,
                                                borderRadius:60,
                                            }}
                                            source={data.image}
                                        />
                                        {data.online === true &&
                                            <View
                                                style={{
                                                    width:12,
                                                    height:12,
                                                    borderRadius:10,
                                                    backgroundColor:COLORS.success,
                                                    borderWidth:1,
                                                    borderColor:COLORS.white,
                                                    position:'absolute',
                                                    right:5
                                                }}
                                            />
                                        }
                                    </View>
                                    <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.title}]}>{data.name}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                    <View style={[GlobalStyleSheet.container,{marginTop:5}]}>
                        <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>Recent</Text>
                    </View>
                    <View style={{marginBottom:80}}>
                        {MessagesData.map((data,index) => {
                            return(
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('SingleChat',{data : data})}
                                    key={index}
                                    style={{
                                        flexDirection:'row',
                                        paddingHorizontal:-15,
                                        marginHorizontal:15,
                                        alignItems:'center',
                                        borderBottomWidth:1,
                                        borderColor:colors.borderColor,
                                    }}
                                >
                                    <View
                                        style={{
                                            marginRight:12,
                                        }}
                                    >
                                        <Image
                                            style={{
                                                height:57,
                                                width:57,
                                                borderRadius:60,
                                            }}
                                            source={data.image}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            paddingVertical:18,
                                            flex:1,
                                            paddingRight:15,
                                        }}
                                    >
                                        <Text style={[FONTS.fontSemiBold,{fontSize:16,color:theme.dark ? colors.title : '#191919'}]}>{data.name}</Text>
                                        <Text numberOfLines={1} style={[FONTS.fontMedium,{fontSize: 14, color:theme.dark ? colors.text : '#999999'}]}>{data.lastMsg}</Text>
                                    </View>
                                    <View style={{alignItems:'flex-end'}}>
                                        <Text style={[FONTS.fontSemiBold, {fontSize : 11,color:theme.dark ? colors.text : '#888888',marginBottom:8}]}>{data.date}</Text>
                                        {data.messageSent === true ? 
                                            <Image
                                                style={{
                                                    width:16,
                                                    height:14,
                                                    marginTop:8
                                                }}
                                                resizeMode='contain'
                                                source={IMAGES.Check2}
                                            />
                                        :
                                            <View
                                                style={{
                                                    padding:6,
                                                    paddingVertical:4,
                                                    borderRadius:11,
                                                    backgroundColor:COLORS.primary,
                                                    alignItems:'center',
                                                    justifyContent:'center'
                                                }}
                                            >   
                                                <Text style={[FONTS.fontSemiBold,{fontSize:13,color:COLORS.white,lineHeight:13}]}>{data.recentmessageCount}</Text>
                                            </View>
                                        }
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

export default Chat;