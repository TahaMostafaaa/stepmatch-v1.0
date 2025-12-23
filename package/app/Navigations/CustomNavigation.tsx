import React, { useCallback, useRef } from 'react';
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES, SIZES } from '../constants/theme';
import { GlobalStyleSheet } from '../constants/StyleSheet';

type Props = {
    state: any,
    navigation: any,
    descriptors: any
};

const CustomNavigation = ({ state, navigation, descriptors }: Props) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme

    // 🔹 React Native Animated instead of Reanimated
    const offset = useRef(new Animated.Value(0)).current;

    const animateTo = (toValue: number) => {
        Animated.timing(offset, {
            toValue,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    useFocusEffect(
        useCallback(() => {
            const interval = setInterval(() => {
                navigation.navigate("AMatch"); 
            }, 0.8 * 60 * 1000); // 30s

            return () => clearInterval(interval);
        }, [navigation])
    );

    return (
        <>
            <View
                style={[
                    GlobalStyleSheet.container,
                    {
                        padding: 0,
                        height: 60,
                        flexDirection: 'row',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor:colors.card,
                    },
                ]}
            >
                {/* 🔹 Animated pink circle indicator */}
                <Animated.View
                    style={{
                        transform: [{ translateX: offset }],
                    }}
                >
                    <View
                        style={{
                            width:
                                SIZES.width > SIZES.container
                                    ? (SIZES.container - 20) / 5
                                    : SIZES.width / 5,
                            position: 'absolute',
                            zIndex: 1,
                            top: 3,
                            left: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                shadowColor: COLORS.primary,
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.5,
                                shadowRadius: 12,
                                borderRadius: 50,
                            }}
                        >
                            <View
                                style={{
                                    height:54,
                                    width:54,
                                    borderRadius:15,
                                    backgroundColor:COLORS.primary
                                }}
                            />
                        </View>
                    </View>
                </Animated.View>

                {/* 🔹 Tabs */}
                {state.routes.map((route: any, index: number) => {
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
                            navigation.navigate({ name: route.name, merge: true });
                        }

                        let tabIndex = 0;

                        if (route.name === 'Home') {
                            tabIndex = 0;
                        } else if (route.name === 'Explore') {
                            tabIndex = 1;
                        } else if (route.name === 'Likes') {
                            tabIndex = 2;
                        } else if (route.name === 'Chat') {
                            tabIndex = 3;
                        } else if (route.name === 'Profile') {
                            tabIndex = 4; 
                        }

                        const tabWidth =
                            SIZES.width > SIZES.container
                                ? SIZES.container / 5
                                : SIZES.width / 5;

                        const moveTo = tabWidth * tabIndex;
                        animateTo(moveTo);
                    };

                    return (
                        <View style={styles.tabItem} key={index}>
                            <TouchableOpacity style={styles.tabLink} onPress={onPress}>
                                <Image
                                    style={{
                                        height:28,
                                        width:28,
                                        tintColor: isFocused ? COLORS.white :theme.dark ? 'rgba(255,255,255,0.40)': 'rgba(102,102,102,.40)',
                                    }}
                                    resizeMode='contain'
                                    source={
                                        label === 'Home'
                                        ? IMAGES.home
                                        : label === 'Explore'
                                        ? IMAGES.Explore
                                        : label === 'Likes'
                                        ? IMAGES.heart2
                                        : label === 'Chat'
                                        ? IMAGES.chat
                                        : label === 'Profile'
                                        ? IMAGES.user 
                                        : IMAGES.home 
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    tabLink: {
        alignItems: 'center',
        padding: 15,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        ...FONTS.fontSm,
    },
});

export default CustomNavigation;
