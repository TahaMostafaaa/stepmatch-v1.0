import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Animated, Platform } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useTheme, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { MatchInfo } from '../../api/matching.types';

interface AMatchProps {
    matchData: MatchInfo | null;
    onClose: () => void;
}

const AMatch = ({ matchData, onClose }: AMatchProps) => {

    const theme = useTheme()
    const { colors }: {colors : any} = theme;
    const navigation = useNavigation<any>();

    // Animation for celebration
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Celebration animation on mount
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto-dismiss after 5 seconds (optional)
        // const timer = setTimeout(() => {
        //     onClose();
        // }, 5000);
        // return () => clearTimeout(timer);
    }, []);

    // Early return if matchData is not available
    if (!matchData) {
        return null;
    }

    const handleSendMessage = () => {
        onClose();
        navigation.navigate('SingleChat', {
            data: {
                name: matchData.matched_user_name || 'Match',
                image: matchData.matched_user_image || IMAGES.likedPic14,
                id: matchData.matched_user_id,
            }
        });
    };

    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <SafeAreaView
                style={[GlobalStyleSheet.container, {
                    padding: 0,
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                }]}
            >
                <Animated.View
                    style={{
                        flex: 1,
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }],
                    }}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{
                            flex:1,
                            alignItems:'center',
                            justifyContent:'center',
                            paddingTop:50,
                            paddingBottom:20,
                        }}>
                    <View style={{position:'absolute',top:-127.01,left:-130.01}}>
                        <View style={{position:'relative',alignItems:'center',justifyContent:'center'}}>
                            <Image
                                style={{
                                    width:'100%',
                                    height:null,
                                    aspectRatio:1/1,
                                }}
                                resizeMode='contain'
                                source={IMAGES.Ellipse}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            position:'absolute',
                            left:95,
                            top:75,
                            transform:[{rotate:'-23.81deg'}]
                        }}
                    >
                        <Image
                            style={{width:24,height:22}}
                            resizeMode='contain'
                            tintColor={'#BDD3FF'}
                            source={IMAGES.heart7}
                        />
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',position:'relative',left:20,top:60}}>
                        <View
                            style={{
                                transform: [{ rotate: '-7.16deg' }],
                                zIndex:-1,
                                borderRadius:25,
                                overflow:'hidden',
                                top:-100
                            }}
                        >
                            <View
                                style={{
                                    padding:5,
                                    borderRadius:25,
                                    backgroundColor:'rgba(255,255,255,0.4)',
                                    alignItems:'center',
                                    justifyContent:'center'
                                }}
                            >
                                <View
                                    style={{
                                        height: 260, 
                                        width: 180,
                                        borderRadius: 25,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: colors.card,
                                    }}
                                >
                                    {matchData.matched_user_image ? (
                                        <Image  
                                            style={{
                                                height:'100%',
                                                width: '100%',
                                                borderRadius:25
                                            }}
                                            resizeMode="cover"
                                            source={{ uri: matchData.matched_user_image }}
                                        />
                                    ) : (
                                        <Image  
                                            style={{
                                                height:'100%',
                                                width: '100%',
                                                borderRadius:25
                                            }}
                                            source={IMAGES.likedPic12}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                transform: [{ rotate: '14.48deg' }],
                                borderRadius:25,
                                overflow:'hidden',
                                right:60,
                            }}
                        >
                            <View
                                style={{
                                    height: 275, 
                                    width: 198,
                                    borderRadius: 25,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: colors.card,
                                }}
                            >
                                {/* Current user image - you might want to get this from profile context */}
                                <Image  
                                    style={{
                                        height:'100%',
                                        width: '100%',
                                        borderRadius:25
                                    }}
                                    source={IMAGES.likedPic14}
                                />
                            </View>
                        </View>
                        <View
                            style={[GlobalStyleSheet.headerBtn,{
                                height:80,
                                width:80,
                                borderRadius:50,
                                backgroundColor:COLORS.primary,
                                position:'absolute',
                                left:110,
                                right:0,
                                top:50
                            }]}
                        >
                            <Image
                                style={{
                                    width:43,
                                    height:35,
                                }}
                                resizeMode='contain'
                                source={IMAGES.heart2}
                            />
                        </View>
                        <View
                            style={{
                                position:'absolute',
                                right:100,
                                top:-50,
                                transform:[{rotate:'-23.81deg'}]
                            }}
                        >
                            <Image
                                style={{width:38,height:32}}
                                resizeMode='contain'
                                tintColor={'#BDD3FF'}
                                source={IMAGES.heart6}
                            />
                        </View>
                        <View
                            style={{
                                position:'absolute',
                                left:30,
                                bottom:45,
                                transform:[{rotate:'-23.81deg'}]
                            }}
                        >
                            <Image
                                style={{width:27,height:23}}
                                resizeMode='contain'
                                tintColor={'#BDD3FF'}
                                source={IMAGES.heart7}
                            />
                        </View>
                        </View>
                        </View>
                        <View style={{ marginBottom: 35, alignItems: 'center' }}>
                            <Text style={[FONTS.OleoScriptBold, { fontSize: 45, color: COLORS.primary, lineHeight: 63, marginBottom: 12 }]}>
                                It's a Match!
                            </Text>
                            <Text style={[FONTS.fontNunitoRegular, { fontSize: 16, color: colors.text, paddingHorizontal: 75, textAlign: 'center' }]}>
                                {`Say hello to ${matchData.matched_user_name || 'your match'} and start your conversation now!`}
                            </Text>
                        </View>
                        <View
                            style={{ alignItems: 'center', marginBottom: 50, flexDirection: 'row', justifyContent: 'center', gap: 20 }}
                        >
                            <TouchableOpacity
                                onPress={onClose}
                                activeOpacity={0.8}
                                style={[GlobalStyleSheet.headerBtn, {
                                    height: 50,
                                    paddingHorizontal: 30,
                                    borderRadius: 25,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                }]}
                            >
                                <Text style={[FONTS.fontBold, { color: COLORS.white, fontSize: 16 }]}>
                                    Keep Swiping
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSendMessage}
                                activeOpacity={0.8}
                                style={[GlobalStyleSheet.headerBtn, {
                                    height: 90,
                                    width: 90,
                                    borderRadius: 50,
                                    backgroundColor: COLORS.primary,
                                    zIndex: 99
                                }]}
                            >
                                <Image
                                    style={{
                                        width: 43,
                                        height: 35,
                                    }}
                                    resizeMode='contain'
                                    source={IMAGES.chat}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{position:'absolute',bottom:-120,right:-120}}>
                            <Image
                                style={{
                                    width:'100%',
                                    height:null,
                                    aspectRatio:1/1,
                                }}
                                resizeMode='contain'
                                source={IMAGES.Ellipse}
                            />
                        </View>
                    </ScrollView>
                </Animated.View>
            </SafeAreaView>
        </Modal>
    )
}


export default AMatch