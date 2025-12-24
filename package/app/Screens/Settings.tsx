import React, { useRef, useState } from 'react';
import { Image, Linking, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Feather } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLORS, FONTS, IMAGES, SIZES } from '../constants/theme';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import ListStyle2 from '../components/list/ListStyle2';
import themeContext from '../constants/themeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const Settings = () => {

     const { colors }: {colors : any} = useTheme();
    const theme = useTheme();

    const RBSheetLanguage = useRef<any>(null);

    const {isDarkTheme, setDarkTheme, setLightTheme} = React.useContext<any>(themeContext);

    const onShare = async () => {
        try {
          const result = await Share.share({
                message:
                'React Native Dating Application.\nDownload : https://support.w3itexperts.com/us/ntcVbjbh \n Best application for every developer.',
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
    };

    const languagetData = [
        {
            flag : IMAGES.indiaFlag,
            name : "Indian",
        },
        {
            flag : IMAGES.UnitedStatesFlag,
            name : "English",
        },
        {
            flag : IMAGES.germanFlag,
            name : "German",
        },
        {
            flag : IMAGES.italianFlag,
            name : "Italian",
        },
        {
            flag : IMAGES.spanishFlag,
            name : "Spanish",
        },
    ]

    const handleTheme = () => {
        if(isDarkTheme){
            setLightTheme();
        }else{
            setDarkTheme();
        }
    }
    

    return (
        <>
            <RBSheet
                ref={RBSheetLanguage}
                closeOnDragDown={true}
                height={400}
                openDuration={300}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,.3)',
                    },
                    container:{
                        backgroundColor:colors.card,
                        borderTopLeftRadius:15,
                        borderTopRightRadius:15,
                    },
                }}
            >
                <View style={{alignItems:'center',borderBottomWidth:1,borderColor:colors.borderColor,paddingBottom:8,paddingTop:4}}>
                    <Text style={{...FONTS.h5,color:colors.title}}>Language</Text>
                </View>
                <ScrollView contentContainerStyle={{paddingBottom:20,paddingHorizontal:15}}>
                    {languagetData.map((data,index) => (
                        <TouchableOpacity
                            onPress={() => RBSheetLanguage.current.close()}
                            key={index}
                            style={{
                                paddingVertical:15,
                                borderBottomWidth:1,
                                borderColor:colors.borderColor,
                                flexDirection:'row',
                                alignItems:'center',
                            }}
                        >
                            <Image
                                style={{
                                    height:20,
                                    width:25,
                                    marginRight:12,
                                }}
                                source={data.flag}
                            />
                            <Text style={{...FONTS.fontLg,color:colors.title,flex:1}}>{data.name}</Text>
                            <Feather name="chevron-right" color={colors.text} size={24}/>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </RBSheet>
       
            <SafeAreaView
                style={[GlobalStyleSheet.container,{
                    flex:1,
                    backgroundColor:colors.background,
                    padding:0
                }]}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}}>
                    <View>
                        <LinearGradient
                            colors={["#FFD6E7","#ED94B3"]}
                            //start={{x: 0.25, y: 1.0}} end={{x: 1.0, y: 0.75}}
                            style={[{
                                //backgroundColor:"#181842",
                                alignItems:'center',
                                paddingBottom:60,
                                paddingTop:40,
                            },Platform.OS === 'ios' &&{
                                paddingTop:0
                            }]}
                        >
                            <Image
                                source={IMAGES.logo}
                                style={[{
                                    height:80,
                                    width:80,
                                    resizeMode:'contain',
                                    marginBottom:12,
                                },Platform.OS === 'ios' &&{
                                    marginTop:20
                                }]}
                            />
                            <Text style={{...FONTS.h2,color:COLORS.title,lineHeight:34,marginBottom:4}}>Explore Dating Kit</Text>
                            <Text style={[{...FONTS.font,fontSize:15,color:"rgba(35,41,84,.7)"},Platform.OS === 'ios' &&{marginBottom:30}]}>React Native Dating Application </Text>
                        </LinearGradient>
                        <Image
                            source={IMAGES.heartShape}
                            style={{
                                position:'absolute',
                                height:60,
                                width:60,
                                resizeMode:'contain',
                                right:10,
                                top:60,
                                transform:[{rotate:'-20deg'}]
                            }}
                        />
                        <Image
                            source={IMAGES.heartShape}
                            style={{
                                position:'absolute',
                                height:50,
                                width:50,
                                resizeMode:'contain',
                                left:30,
                                top:20,
                                transform:[{rotate:'32deg'}]
                            }}
                        />
                        <Image
                            source={IMAGES.heartShape}
                            style={{
                                position:'absolute',
                                height:30,
                                width:30,
                                resizeMode:'contain',
                                left:15,
                                bottom:90,
                                transform:[{rotate:'-24deg'}]
                            }}
                        />
                        <Image
                            source={theme.dark ? IMAGES.bubbleDark : IMAGES.bubble}
                            style={[{
                                width:'100%',
                                height:undefined,
                                aspectRatio:8/1,
                                resizeMode:'stretch',
                                marginTop:-35,
                            },Platform.OS === 'ios' &&{
                                marginTop:-90
                            }]}
                        />
                        {/* <Image 
                            style={{
                                position:'absolute',
                                height:'100%',
                                width:'100%',
                                opacity:.1,
                                resizeMode:'cover',
                                tintColor:COLORS.white,
                                zIndex:0,
                            }}
                            source={IMAGES.pattern}
                        /> */}
                    </View>
                    <View style={{...GlobalStyleSheet.container,flex:1}}>
                        
                            <View style={[styles.card,GlobalStyleSheet.shadow,{
                                backgroundColor: colors.cardBg,
                            }]}>
                                <ListStyle2
                                    onPress={() => handleTheme()}
                                    icon={<Ionicons color={"#ff4db8"} size={18} name={isDarkTheme ? 'sunny' : 'moon'} />}
                                    title={isDarkTheme ? "Light mode" : "Dark mode"}
                                    desc="Just for you"
                                />
                                <ListStyle2
                                    onPress={() => onShare()}
                                    icon={<Ionicons color={"#4a8be0"} size={20} name='share-social-sharp' />}
                                    title="App share"
                                    desc="Just for you"
                                />
                                <ListStyle2
                                    onPress={() => RBSheetLanguage.current.open()}
                                    icon={<SimpleLineIcons color={"#ff586e"} size={18} name='globe' />}
                                    title="Language"
                                    desc="Just for you"
                                />
                            </View>
                    </View>
                    <View
                        style={{
                            backgroundColor:"#090920",
                            paddingHorizontal:30,
                            paddingBottom:50,
                            paddingTop:40,
                            borderTopLeftRadius:18,
                            borderTopRightRadius:18,
                            alignItems:'center',
                        }}
                    >
                        <Image
                            style={{
                                height:32,
                                width:170,
                                resizeMode:'contain',
                                marginBottom:12,
                            }}
                            source={IMAGES.logoFullWhite}
                        />
                        <Text style={{...FONTS.font,color:"#A1B0FF",textAlign:'center'}}>Built to match the design trends and give your page the awesome facelift it deserves.</Text>
                        <View
                            style={{
                                flexDirection:'row',
                                marginTop:22,
                                paddingBottom:50,
                            }}
                        >
                            <TouchableOpacity 
                                onPress={() => Linking.openURL('https://www.facebook.com/w3itexperts/')}
                                style={styles.socialIcon}>
                                <FontAwesome size={18} color={COLORS.white} name="facebook"/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => Linking.openURL('https://twitter.com/w3itexpert')}
                                style={styles.socialIcon}>
                                <FontAwesome size={18} color={COLORS.white} name="twitter"/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => Linking.openURL('https://www.youtube.com/channel/UCs7cFherrz5jhcvUJ7s9MQg')}
                                style={styles.socialIcon}>
                                <FontAwesome size={18} color={COLORS.white} name="youtube-play"/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => Linking.openURL('https://in.linkedin.com/company/w3itexperts')}
                                style={styles.socialIcon}>
                                <FontAwesome size={18} color={COLORS.white} name="linkedin-square"/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => Linking.openURL('https://www.instagram.com/dexignzone/')}
                                style={styles.socialIcon}>
                                <FontAwesome size={18} color={COLORS.white} name="instagram"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    socialIcon : {
        height:45,
        width:45,
        backgroundColor:'rgba(255,255,255,.1)',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:8,
        marginHorizontal:4,
    },
    card : {
        padding:15,
        borderRadius:SIZES.radius,
        marginBottom:15,
    }
})


export default Settings;