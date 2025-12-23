import { View, Text, Platform, StatusBar, ScrollView, Image, TouchableOpacity, StyleSheet, Animated, FlatList, Dimensions, Modal } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import CongratulationsModel from '../../components/Modal/CongratulationsModel';

const Subscription = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme
    
    const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 60 : StatusBar.currentHeight;

    const navigation = useNavigation<any>();

    const [selectedTab, setSelectedTab] = useState<any>('Trial');
    const lineAnim = useRef(new Animated.Value(0)).current; // animation value for underline

    const tabs = ['Trial', 'Premium'];

    useEffect(() => {
        Animated.spring(lineAnim, {
        toValue: selectedTab === 'Trial' ? 0 : 1,
        useNativeDriver: false,
        }).start();
    }, [selectedTab]);

    const trialData = [
        { feature: 'See Who Liked You', trial: 'Limited' },
        { feature: 'Send Super Likes', trial: '1/day' },
        { feature: 'Undo Last Swipe', trial: '1/day' },
        { feature: 'Compatibility Insights',},
        { feature: 'Discover Nearby Singles',},
        { feature: 'Smart Match Suggestions',},
        { feature: 'Profile Boosts',},
        { feature: 'Incognito Mode',},
        { feature: 'Advanced Filters',},
        { feature: 'Priority Visibility',},
    ];

    const premiumData = [
        { feature: 'See Who Liked You', premium: 'Unlimited' },
        { feature: 'Send Super Likes', premium: '10/day' },
        { feature: 'Undo Last Swipe', premium: 'Unlimited' },
        { feature: 'Compatibility Insights', },
        { feature: 'Discover Nearby Singles', },
        { feature: 'Smart Match Suggestions', },
        { feature: 'Profile Boosts', },
        { feature: 'Incognito Mode', },
        { feature: 'Advanced Filters', },
        { feature: 'Priority Visibility', },
    ];

    const renderItem = ({ item } : any) => (
        <View style={styles.row}>
            <Text style={[styles.featureText,{color:theme.dark ? colors.title : '#191919' }]}>{item.feature}</Text>
            <Text
                style={[
                    styles.valueText,
                    { color:theme.dark ? colors.title : '#191919'},
                ]}
            >
                {selectedTab === 'Trial' ?
                    (item.trial && item.trial ?
                            item.trial
                        :
                        <Feather name='x' size={20} color={'#FF003B'}/>
                    ) 
                    :
                    (item.premium && item.premium ?
                            item.premium
                        :
                        <Image
                            style={{
                                width:26,
                                height:20
                            }}
                            resizeMode='contain'
                            source={IMAGES.check3}
                        />
                    ) 
                }
            </Text>
        </View>
    );
    
    const [modalVisible, setModalVisible] = useState(false);
    const [nextModalVisible, setNextModalVisible] = useState(false);

    const [rating , setRating] = useState(3);

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                statusBarTranslucent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{
                    alignItems:'center',
                    justifyContent:'center',
                    flex:1,
                    position:'relative',
                }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            setModalVisible(false);
                            setTimeout(() => setNextModalVisible(true), 400); // small delay for smooth transition
                        }}
                        style={{
                            position:'absolute',
                            height:'100%',
                            width:'100%',
                            top:0,
                            bottom:0,
                            left:0,
                            right:0,
                            backgroundColor:'rgba(0,0,0,.3)',
                        }}
                    />
                    <CongratulationsModel/>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={nextModalVisible}
                statusBarTranslucent={true}
                onRequestClose={() => setNextModalVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                    }}
                >
                    <View
                        style={{
                            alignItems:'center',
                            paddingHorizontal:20,
                            paddingVertical:30,
                            backgroundColor:colors.card,
                            borderRadius:15,
                            marginHorizontal:30,
                            paddingBottom:18,
                            maxWidth:300,
                        }}
                    >
                        <Text style={[FONTS.fontBold,{fontSize:18,color:theme.dark ? colors.title : '#191919'}]}>Do You Love Ditto ?</Text>
                        <Text style={[FONTS.fontBold,{fontSize:14,color:theme.dark ? colors.title : '#191919'}]}>Please Rate Us With 5 stars </Text>
                        <View style={{flexDirection:'row',marginTop:15,marginBottom:40}}>
                            {new Array(rating).fill(rating).map((_,index) => {
                                return(
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => setRating(index + 1)}
                                        key={index}
                                        style={{margin:5}}
                                    >
                                        <Image
                                            style={[{height:35,width:35,resizeMode:'contain',zIndex:1}]}
                                            source={IMAGES.star3}
                                        /> 
                                    </TouchableOpacity>
                                )
                            })}
                            {new Array(5 - rating).fill(5 - rating).map((_,index) => {
                                return(
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        key={index}
                                        onPress={() => setRating(index + rating + 1)}
                                        style={{margin:5}}
                                    >
                                        <Image
                                            style={[{height:35,width:35,resizeMode:'contain',zIndex:1}]}
                                            source={IMAGES.star2}
                                        />    
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <View style={{width:252}}>
                            <Button
                                title="Rate us"
                                onPress={() => setNextModalVisible(false)}
                            />
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setNextModalVisible(false)}
                            style={{
                                paddingHorizontal:15,
                                paddingVertical:12,
                                borderRadius:25,
                            }}
                        >
                            <Text style={[FONTS.fontBold,{fontSize:14,color:theme.dark ? colors.text : '#999999'}]}>Maybe later</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View 
                style={[GlobalStyleSheet.container,{
                    padding:0,
                    flex:1,
                    backgroundColor:colors.card
                }]}
            >
                <View
                    style={{
                        padding:20,
                        backgroundColor:COLORS.primary,
                        paddingTop:STATUSBAR_HEIGHT,
                        paddingHorizontal:30,
                    }}
                >
                    
                    <View style={{alignItems:'center',paddingTop:10}}>
                        <Text style={[FONTS.fontBold,{fontSize:25,color:COLORS.white}]}>Congratulations!</Text>
                        <Text style={[FONTS.fontSemiBold,{fontSize:14,color:COLORS.white,textAlign:'center',paddingHorizontal:50}]}>Your FREE trial starts now! Find what’s included below</Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                paddingHorizontal:26,
                                paddingVertical:10,
                                backgroundColor:'rgba(255,255,255,0.30)',
                                borderRadius:10,
                                marginTop:20
                            }}
                        >
                            <Text style={[FONTS.fontSemiBold,{fontSize:14,color:COLORS.white,lineHeight:14}]}>{selectedTab === 'Trial' ? 'Current plan': 'Switch to Premium+'}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                        style={[GlobalStyleSheet.headerBtn,{
                            height:45,
                            width:45,
                            backgroundColor: 'rgba(255,255,255,0.30)',
                            position:'absolute',
                            top:STATUSBAR_HEIGHT,
                            left:15
                        }]}
                    >
                        <Feather name='x' size={20} color={COLORS.white}/>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flexGrow:1}}
                >   
                    <View
                        style={{flex:1}}
                    >
                        <View style={{flex:1}}>
                            {/* Tabs */}
                            <View style={styles.tabRow}>
                                {tabs.map((tab) => (
                                    <TouchableOpacity
                                        key={tab}
                                        style={[styles.tab,{width:'50%'}]}
                                        onPress={() => setSelectedTab(tab)}
                                    >
                                        {tab === 'Premium' && (
                                            <Image    
                                                style={{height:24,width:24,  marginRight: 5 }}
                                                source={IMAGES.pro}
                                                resizeMode='contain'
                                                tintColor={'#FFB743'}
                                            />
                                        )}
                                        <Text
                                            style={[
                                                styles.tabText,{
                                                    color: theme.dark ? colors.title :'#191919'
                                                }
                                            ]}
                                        >
                                            {tab}
                                        </Text>
                                    </TouchableOpacity>
                                ))}

                                {/* Animated Underline */}
                                <Animated.View
                                    style={[
                                        styles.underline,
                                        {
                                            transform: [
                                                {
                                                    translateX: lineAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, Dimensions.get('window').width / 2],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                />
                            </View>

                            {/* List */}
                            <FlatList
                                data={selectedTab === 'Trial' ? trialData : premiumData}
                                keyExtractor={(item) => item.feature}
                                renderItem={renderItem}
                                contentContainerStyle={{ paddingVertical: 30 ,flex:1}}
                            />
                            <View style={{paddingHorizontal:17,paddingVertical:15,paddingBottom:30}}>
                                {selectedTab === 'Trial' &&
                                    <Button
                                        title={'Go Premium'}
                                    />
                                }
                                {selectedTab === 'Premium' &&
                                    <Button
                                        title={'Purchase'}
                                        onPress={() => setModalVisible(true)}
                                    />
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    priceListItem:{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:8,
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 10,
        margin: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'relative',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        width: '50%', // must match underline movement
        justifyContent: 'center',
    },
    tabText: {
        ...FONTS.fontBold,
        fontSize: 20,
    },
    activeText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    underline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right:0,
        width: '50%', // same as tab width
        height: 1,
        backgroundColor: COLORS.primary,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 7.5,
        paddingHorizontal: 20,
    },
    featureText: {
        ...FONTS.fontSemiBold,
        fontSize: 14,
    },
    valueText: {
         ...FONTS.fontSemiBold,
        fontSize: 14,
    },
})

export default Subscription