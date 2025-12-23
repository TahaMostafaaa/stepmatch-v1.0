import React, { useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import ProfileDetailsSheet from '../ProfileDetailsSheet';
import { BlurView } from 'expo-blur';

const Likes = () => {

    const navigation = useNavigation<any>();

    const { colors }: {colors : any} = useTheme();

    const LikedData = [
        {
            id:"0",
            image : IMAGES.likedPic5,
            name : "Chelsea",
            age : 25,
        },
        {
            id:"1",
            image : IMAGES.likedPic6,
            name : "Abby",
            age : 27,
        },
        {
            id:"2",
            image : IMAGES.likedPic7,
            name : "Javelle",
            age : 23,
        },
        {
            id:"3",
            image : IMAGES.likedPic8,
            name : "Veronica",
            age : 25,
        },
        {
            id:"4",
            image : IMAGES.likedPic9,
            name : "Richard",
            age : 22,
        },
        {
            id:"5",
            image : IMAGES.likedPic10,
            name : "chelsea",
            age : 25,
        },
        {
            id:"6",
            image : IMAGES.likedPic12,
            name : "Chelsea",
            age : 25,
        },
        {
            id:"7",
            image : IMAGES.likedPic1,
            name : "Abby",
            age : 27,
        },
        {
            id:"8",
            image : IMAGES.likedPic2,
            name : "Javelle",
            age : 23,
        },
        {
            id:"9",
            image : IMAGES.likedPic4,
            name : "Veronica",
            age : 25,
        },
    ]

    const [liked, setLiked] = useState(null);

    const handleLike = (id : any) => {
        setLiked(liked === id ? null : id); // toggle like
    };

    const ProfileDetailsSheetRef = useRef<any>(null);
    
    const openProfileSheet = () => {
        ProfileDetailsSheetRef.current?.openSheet();
    };

    return (
        <>
            <View
                style={[GlobalStyleSheet.container,{
                    padding:0,
                    flex:1,
                    backgroundColor:colors.card,
                }]}
            >
                <Header
                    title={'Matches'}
                    leftIcon={'back'}
                    rightIcon={'Notifaction'}
                />
                <View style={styles.container}>
                    {/* Left gradient line */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0)', '#666666']}
                        style={styles.line}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />

                    {/* Center text */}
                    <Text style={[FONTS.fontSemiBold, styles.text,{fontSize:14,color:'rgba(102,102,102,0.80)'}]}>Today</Text>

                    {/* Right gradient line */}
                    <LinearGradient
                        colors={['#666666', 'rgba(0,0,0,0)']}
                        style={styles.line}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />
                </View>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom:80}}
                >
                    <View
                        style={GlobalStyleSheet.container}
                    >
                        <View style={GlobalStyleSheet.row}>
                            {LikedData.map((data,index) => {

                                const isLiked = liked === data.id;

                                return(
                                    <View
                                        style={[GlobalStyleSheet.col50,{marginBottom:10}]}
                                        key={index}
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{
                                                width:'100%',
                                                height:205,
                                                borderRadius:15,
                                                overflow:'hidden'
                                            }}
                                            onPress={openProfileSheet}
                                            // onPress={() => navigation.navigate('ProfileDetails',{item : data})}
                                        >
                                            <Image
                                                style={{
                                                    width:'100%',
                                                    height:'100%',
                                                    borderRadius:15,
                                                }}
                                                source={data.image}
                                            />
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('SingleChat',{data : data})}
                                                activeOpacity={0.8}
                                                style={{
                                                    height:33,
                                                    width:33,
                                                    borderRadius:30,
                                                    alignItems:'center',
                                                    justifyContent:'center',
                                                    backgroundColor:'rgba(25,25,25,0.10)',
                                                    position:'absolute',
                                                    right:10,
                                                    top:10
                                                }}
                                            >
                                                <Image
                                                    style={{
                                                        height:16,
                                                        width:16
                                                    }}
                                                    source={IMAGES.chat2}
                                                />
                                            </TouchableOpacity>
                                            <View
                                                style={{
                                                    height: 42,
                                                    position: 'absolute',
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <BlurView
                                                    intensity={40} // Similar to blurAmount={4}
                                                    tint="light" // Similar to blurType="light"
                                                    style={{
                                                    height: 42,
                                                    backgroundColor: 'rgba(25,25,25,0.30)',
                                                    }}
                                                />

                                                <View
                                                    style={[
                                                    GlobalStyleSheet.flexCenter,
                                                    {
                                                        height: 42,
                                                        paddingHorizontal: 12,
                                                        position: 'absolute',
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                    },
                                                    ]}
                                                >
                                                    <Text
                                                    style={[
                                                        FONTS.fontBold,
                                                        { fontSize: 16, color: COLORS.white, flex: 1 },
                                                    ]}
                                                    >
                                                    {data.name}, {data.age}
                                                    </Text>

                                                    {/* Like Button */}
                                                    <TouchableOpacity onPress={() => handleLike(data.id)} activeOpacity={0.8}>
                                                    <Image
                                                        style={{
                                                        height: 20,
                                                        width: 20,
                                                        }}
                                                        resizeMode="contain"
                                                        source={isLiked ? IMAGES.heart2 : IMAGES.heart6}
                                                    />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </ScrollView>
            </View>
            <ProfileDetailsSheet
                ref={ProfileDetailsSheetRef}
            />
        </>
    );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: 10
  },
  likeButton: {
    padding: 4,
  },
});

export default Likes;