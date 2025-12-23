import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../../constants/theme';

import home from '../../../assets/images/icons/home.png';
import collage from '../../../assets/images/icons/collage.png';
import profile from '../../../assets/images/icons/user.png';
import heart from '../../../assets/images/icons/heart.png';
import blog from '../../../assets/images/icons/blog.png';
import { GlobalStyleSheet } from '../../../constants/StyleSheet';

type Props = {
    state : any,
    navigation : any,
    descriptors : any
}



const CustomNavigation = ({state,navigation,descriptors} : Props) => {
    
     const { colors }: {colors : any} = useTheme();

    const tabWidth = SIZES.width - 20;

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
                position:'absolute',
                width:'auto',
                left:10,
                right:10,
                bottom:10,
                borderRadius: 20,
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
                                <Image
                                    style={{
                                        height:22,
                                        width:22,
                                        resizeMode:'contain',
                                        opacity:isFocused ? 1 : .6,
                                        tintColor:isFocused ? COLORS.white : colors.text,
                                    }}
                                    source={
                                        label === "Home" ? home :
                                        label === "Markets" ? heart:
                                        label === "Change" ? collage:
                                        label === "Wallet" ? blog :
                                        label === "Profile" && profile
                                    }
                                />
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
        padding:10,
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