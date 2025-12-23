import { View, Text, Dimensions, Animated, TouchableOpacity, Image, ScrollView, FlatList, Pressable, Platform } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import RBSheet from 'react-native-raw-bottom-sheet';
import { useNavigation, useTheme } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES } from '../constants/theme';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { LinearGradient } from 'expo-linear-gradient';

const InterestsOption = [
        {
            option:'Travel',
            image:IMAGES.travel
        },
        {
            option:'Yoga',
            image:IMAGES.yoga
        },
        {
            option:'Gaming',
            image:IMAGES.game
        }
    ]

const LanguagesData = [
    {
        name:"English",
        flag:IMAGES.english
    },
    {
        name:"Hindi",
        flag:IMAGES.hindi
    },
    {
        name:"German",
        flag:IMAGES.German
    }
]

const RelationshipData = [
    {
        name:"Dating",
        image:IMAGES.dating
    }
]

const { width } = Dimensions.get("window");

const images = [
  IMAGES.likedPic1,
  IMAGES.likedPic2,
  IMAGES.likedPic3,
  IMAGES.likedPic4,
];

const ProfileDetailsSheet = forwardRef((props:any, ref:any,) => {
    

    const theme = useTheme();
    const { colors }: {colors : any} = theme;

    const ProfileDetailsSheetRef = useRef<any>(null);
    
    useImperativeHandle(ref, () => ({
        openSheet: () => {
            ProfileDetailsSheetRef.current?.open();
        },
        closeSheet: () => {
            ProfileDetailsSheetRef.current?.close();
        },
    }));

    const [currentIndex, setCurrentIndex] = useState(0);
    const progress = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const [paused, setPaused] = useState(false);
    const animationRef = useRef(null);

    const startAnimation = () => {
        animationRef.current = Animated.timing(progress, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: false,
        });
        animationRef.current.start(({ finished } : any) => {
            if (finished && !paused) {
                const nextIndex = (currentIndex + 1) % images.length;
                flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
                setCurrentIndex(nextIndex);
                progress.setValue(0);
            }
        });
    };

    useEffect(() => {
        if (!paused) {
            progress.setValue(0);
            startAnimation();
        } else {
        if (animationRef.current) animationRef.current.stop();
        }

        return () => {
        if (animationRef.current) animationRef.current.stop();
        };
    }, [currentIndex, paused]);

    const handlePressIn = () => {
        setPaused(true);
    };

    const handlePressOut = () => {
        setPaused(false);
    };

    const navigation = useNavigation<any>();
    
    return (
        <RBSheet
            ref={ProfileDetailsSheetRef}
            height={'100%'}
            closeOnDragDown={true}
            customStyles={{
                container:{
                    backgroundColor: colors.card,
                    paddingBottom:20,
                    paddingTop:Platform.OS === 'ios' ? 60 : 0
                },
                draggableIcon: {
                    marginTop:5,
                    marginBottom:0,
                    height:5,
                    width:90,
                    backgroundColor: colors.borderColor,
                }
            }}
            customModalProps={{
                animationType: 'slide',
                // statusBarTranslucent: true,
            }}
        >
            <View style={[GlobalStyleSheet.container,GlobalStyleSheet.flexCenter,{paddingHorizontal:23}]}>
                <Text style={[FONTS.fontBold,{fontSize:24,color:colors.title}]}>Emily, 24</Text>
                <TouchableOpacity
                    onPress={() => ProfileDetailsSheetRef.current.close()} 
                    activeOpacity={0.8}
                    style={[
                        GlobalStyleSheet.headerBtn,
                        {
                            backgroundColor:theme.dark ? colors.background : 'rgba(25,25,25,0.04)',
                            position:'absolute',
                            right:18
                        }
                    ]}
                >
                    <Image
                        style={{
                            height:20,
                            width:12,
                        }}
                        resizeMode='contain'
                        tintColor={colors.title}
                        source={IMAGES.downarrow}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom:100,flexGrow:1}}
            >
                <View style={[GlobalStyleSheet.container,{padding:0,paddingTop:10,flex:1}]}>
                    <View style={{ marginBottom: 15 }}>
                        {/* Progress Bars */}
                        <View
                            style={{
                                flexDirection: "row",
                                position: "absolute",
                                top: 10,
                                zIndex: 2,
                                width: "100%",
                                justifyContent: "center",
                                paddingHorizontal: 15,
                            }}
                        >
                            {images.map((_, i) => {
                            const barWidth = progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 100],
                            });

                                return (
                                    <View
                                        key={i}
                                        style={{
                                            flex: 1,
                                            height: 3,
                                            backgroundColor: "rgba(255,255,255,0.4)",
                                            marginHorizontal: 3,
                                            borderRadius: 3,
                                            overflow: "hidden",
                                        }}
                                    >
                                    {i === currentIndex && (
                                        <Animated.View
                                            style={{
                                                height: "100%",
                                                backgroundColor: COLORS.white,
                                                width: barWidth + "%",
                                            }}
                                        />
                                    )}
                                    {i < currentIndex && (
                                        <View
                                            style={{
                                                height: "100%",
                                                backgroundColor: COLORS.white,
                                                width: "100%",
                                            }}
                                        />
                                    )}
                                    </View>
                                );
                            })}
                        </View>

                        {/* Image Slider */}
                        <FlatList
                            ref={flatListRef}
                            data={images}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <View style={{ width}}>
                                    <Pressable
                                        onPressIn={handlePressIn}
                                        onPressOut={handlePressOut}
                                        style={{ width: "100%" }}
                                    >
                                        <Image
                                            source={item}
                                            style={[{
                                                width: "100%",
                                                height:null,
                                                aspectRatio: 1 / 1.48,
                                                borderRadius: 20,
                                            },Platform.OS === 'web' && {
                                                aspectRatio:1/.5
                                            }]}
                                            resizeMode='cover'
                                        />
                                        <LinearGradient
                                            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,.3)"]}
                                            style={{
                                                position: "absolute",
                                                height: "100%",
                                                width: "100%",
                                                top: 0,
                                                borderRadius: 20,
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    paddingHorizontal: 18,
                                                    paddingVertical: 20,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => { ProfileDetailsSheetRef.current?.close();
                                                        navigation.navigate('SingleChat', {
                                                            data: {
                                                                name: 'Emily',
                                                                image: IMAGES.likedPic1
                                                            }
                                                        })
                                                        }
                                                    }
                                                    style={{
                                                        height: 50,
                                                        width: 50,
                                                        borderRadius: 50,
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        backgroundColor: COLORS.white,
                                                    }}
                                                >
                                                    <Image
                                                        style={{ height: 20, width: 20, tintColor: COLORS.primary }}
                                                        source={IMAGES.sendMessage}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </LinearGradient>
                                    </Pressable>
                                </View>
                            )}
                        />
                    </View>
                    <View style={{paddingHorizontal:22}}>
                        <View style={{flexDirection:'row',alignItems:'center',gap:10,marginBottom:5}}>
                            <Text style={[FONTS.fontBold,{fontSize:24,color:colors.title}]}>Emily, 24</Text>
                            <Image
                                style={{height:27,width:27}}
                                resizeMode='contain'
                                source={IMAGES.Check}
                            />
                        </View>
                        <Text style={[FONTS.fontSemiBold,{fontSize:16,color:colors.text}]}>Bookworm searching for someone to share literary discussions and quiet moments.</Text>
                        <View style={{marginBottom:5,marginTop:15}}>
                            <Text style={[FONTS.fontBold,{fontSize:24,color:colors.title}]}>Interests</Text>
                            <View style={[GlobalStyleSheet.row,{gap:12,paddingVertical:15}]}>
                                {InterestsOption.map((data:any,index) => (
                                    <View
                                        key={index}
                                        style={[{
                                            flexDirection:'row',
                                            alignItems:'center',
                                            gap:10,
                                            paddingHorizontal:17,
                                            paddingVertical:10,
                                            borderWidth:1,
                                            borderRadius:50,
                                            borderColor:theme.dark ? 'rgba(255,255,255,0.20)': 'rgba(0,0,0,0.20)'
                                        }]}
                                    >
                                        <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.title}]}>
                                            {data.option}
                                        </Text>
                                        <Image
                                            style={{
                                                height:20,
                                                width:20
                                            }}
                                            resizeMode='contain'
                                            source={data.image}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={{marginBottom:5}}>
                            <Text style={[FONTS.fontBold,{fontSize:24,color:colors.title}]}>Languages I Know</Text>
                            <View style={[GlobalStyleSheet.row,{gap:12,paddingVertical:15}]}>
                                {LanguagesData.map((data:any,index) => (
                                    <View
                                        key={index}
                                        style={[{
                                            flexDirection:'row',
                                            alignItems:'center',
                                            gap:10,
                                            paddingHorizontal:17,
                                            paddingVertical:10,
                                            borderWidth:1,
                                            borderRadius:50,
                                            borderColor:theme.dark ? 'rgba(255,255,255,0.20)': 'rgba(0,0,0,0.20)'
                                        }]}
                                    >
                                        <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.title}]}>
                                            {data.name}
                                        </Text>
                                        <Image
                                            style={{
                                                height:20,
                                                width:20
                                            }}
                                            resizeMode='contain'
                                            source={data.flag}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={{marginBottom:5}}>
                            <Text style={[FONTS.fontBold,{fontSize:24,color:colors.title}]}>Relationship Goals</Text>
                            <View style={[GlobalStyleSheet.row,{gap:12,paddingVertical:15}]}>
                                {RelationshipData.map((data:any,index) => (
                                    <View
                                        key={index}
                                        style={[{
                                            flexDirection:'row',
                                            alignItems:'center',
                                            gap:10,
                                            paddingHorizontal:17,
                                            paddingVertical:10,
                                            borderWidth:1,
                                            borderRadius:50,
                                            borderColor:theme.dark ? 'rgba(255,255,255,0.20)': 'rgba(0,0,0,0.20)'
                                        }]}
                                    >
                                        <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.title}]}>
                                            {data.name}
                                        </Text>
                                        <Image
                                            style={{
                                                height:20,
                                                width:20
                                            }}
                                            resizeMode='contain'
                                            source={data.image}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={{
                position:'absolute',
                bottom:80,
                left:0,
                right:0,
                zIndex:99,
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                gap:12
            }}>
                <TouchableOpacity
                    onPress={() => ProfileDetailsSheetRef.current.close()}
                    activeOpacity={0.8}
                    style={[GlobalStyleSheet.headerBtn,{
                        height:60,
                        width:60,
                        borderRadius:50,
                        backgroundColor:COLORS.white,
                        shadowColor: 'rgba(0,0,0,0.22)',
                        elevation:9
                    }]}
                >
                    <Image
                        style={{
                            height:20,
                            width:20,
                        }}
                        resizeMode='contain'
                        source={IMAGES.close2}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[GlobalStyleSheet.headerBtn,{
                        height:60,
                        width:60,
                        borderRadius:50,
                        backgroundColor:COLORS.white,
                        shadowColor: 'rgba(0,0,0,0.22)',
                        elevation:9
                    }]}
                >
                    <Image
                        style={{
                            height:30,
                            width:30,
                        }}
                        resizeMode='contain'
                        source={IMAGES.heart2}
                        tintColor={COLORS.primary}
                    />
                </TouchableOpacity>
            </View>
        </RBSheet>
    )
})

export default ProfileDetailsSheet;