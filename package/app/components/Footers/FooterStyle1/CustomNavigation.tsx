import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../../constants/theme';

import home from '../../../assets/images/icons/home2.png';
import market from '../../../assets/images/icons/clock.png';
import exchange from '../../../assets/images/icons/exchange.png';
import wallet from '../../../assets/images/icons/wallet.png';
import profile from '../../../assets/images/icons/user2.png';

import { GlobalStyleSheet } from '../../../constants/StyleSheet';

type Props = {
    state : any,
    navigation : any,
    descriptors : any
}


const CustomNavigation = ({state,navigation,descriptors} : Props) => {
    
     const { colors }: {colors : any} = useTheme();

    const tabWidth = SIZES.width;

    const circlePosition = useRef(
        new Animated.Value(
            tabWidth < SIZES.container ? tabWidth / 2.5 : SIZES.container / 2.5,
        ),
    ).current;
    
    const tabW =
        tabWidth < SIZES.container ? tabWidth / 5 : SIZES.container / 5;

    const onTabPress = (index:any) => {
        Animated.spring(circlePosition, {
            toValue: index * tabW,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        Animated.spring(circlePosition, {
            toValue: state.index * tabW,
            useNativeDriver: true,
        }).start();
    },[state.index]);

    return (
        <>
            <View style={[GlobalStyleSheet.container,{
                padding:0,
                height:60,
                flexDirection:'row',
                backgroundColor: colors.cardBg,
                shadowColor: "rgba(0,0,0,.6)",
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.30,
                shadowRadius: 4.65,

                elevation: 8,
            }]}>
                <Animated.View style={{transform: [{translateX: circlePosition}]}}>
                    <View style={{
                        width: tabWidth < ( SIZES.container - 20) ? tabWidth / 5 : ( SIZES.container - 20) / 5,
                        position:'absolute',
                        zIndex:1,
                        top: 7.5,
                        left:0,
                        alignItems:'center',
                        justifyContent:'center',
                    }}>
                        <View
                            style={{
                                height:45,
                                width:45,
                                borderRadius:45,
                                backgroundColor:COLORS.primary,
                            }}
                        />
                    </View>
                </Animated.View>
                {state.routes.map((route: { key: string | number; name: any; }, index: React.Key | null | undefined) => {

                    const { options } = descriptors[route.key];
                    const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                    const isFocused = state.index === index;
                    
                    const iconTranslateY = useRef(new Animated.Value(0)).current;
                    Animated.timing(iconTranslateY, {
                        toValue: isFocused ? 10 : 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
        
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate({name: route.name, merge: true});
                            onTabPress(index);
                        }
                    };

                    return(
                        <View style={styles.tabItem} key={index}>
                            <TouchableOpacity
                                style={styles.tabLink}
                                onPress={onPress}
                            >
                                <Animated.View
                                    style={{
                                        transform: [{translateY: iconTranslateY}],
                                }}>
                                    <Image
                                        style={{
                                            height:20,
                                            width:20,
                                            resizeMode:'contain',
                                            marginBottom:4,
                                            opacity:isFocused ? 1 : .6,
                                            tintColor:isFocused ? COLORS.white : colors.text,
                                        }}
                                        source={
                                            label === "Home" ? home :
                                            label === "Markets" ? market:
                                            label === "Change" ? exchange:
                                            label === "Wallet" ? wallet :
                                            label === "Profile" && profile
                                        }
                                    />
                                </Animated.View>
                                <Text style={{...FONTS.fontSm,color:colors.text,opacity: isFocused ? 0 : 1}}>{label}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
        </>
    );
};



const styles = StyleSheet.create({
    tabLink:{
        alignItems:'center',
    },
    tabItem:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    navText:{
        ...FONTS.fontSm,
    }
})


export default CustomNavigation;