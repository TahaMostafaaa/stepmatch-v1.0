import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { COLORS, FONTS } from "../constants/theme";
import { useTheme } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const DistanceSlider = () => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme

    const minKm = 0;
    const maxKm = 2;
    const sliderHeight = 180; // total slider height
    const knobSize = 45; // blue circle size

    const [distance, setDistance] = useState(2);
    const translateY = useRef(new Animated.Value(0)).current;

    // Convert position → distance
    const positionToDistance = (y) => {
        const ratio = 1 - y / (sliderHeight - knobSize);
        const km = (ratio * (maxKm - minKm) + minKm).toFixed(1);
        return Math.max(minKm, Math.min(maxKm, km));
    };

    const panResponder = useRef(
        PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            let newY = gesture.dy;
            newY = Math.max(0, Math.min(sliderHeight - knobSize, newY));

            translateY.setValue(newY);
            const newDistance = positionToDistance(newY);
            setDistance(newDistance);
        },
        onPanResponderRelease: (_, gesture) => {
            let newY = Math.max(0, Math.min(sliderHeight - knobSize, gesture.dy));
            Animated.spring(translateY, {
            toValue: newY,
            useNativeDriver: true,
            speed: 20,
            bounciness: 6,
            }).start();
        },
        })
    ).current;

    return (
        <View style={styles.wrapper}>
            <View style={[styles.slider,{backgroundColor:colors.card}]}>
                {/* Background track */}
                <View style={[styles.track,{backgroundColor: theme.dark ? 'rgba(255,255,255,0.10)': "rgba(0,0,0,0.10)",}]} />

                {/* Draggable knob */}
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.knob,
                        {
                        transform: [
                            {
                            translateY: translateY.interpolate({
                                inputRange: [0, sliderHeight - knobSize],
                                outputRange: [0, sliderHeight - knobSize],
                                extrapolate: "clamp",
                            }),
                            },
                        ],
                        },
                    ]}
                >
                    <Text style={[styles.knobText,{color:COLORS.white}]}>{distance} Km</Text>
                </Animated.View>
            </View>
        </View>
    );
};

export default DistanceSlider;

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        right: 20,
        top: height * 0.24,
        alignItems: "center",
        zIndex:999
    },
    slider: {
        height: 180,
        width: 44,
        backgroundColor: "#fff",
        borderRadius: 30,
        justifyContent: "flex-start",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        overflow: "hidden",
    },
    track: {
        position: "absolute",
        top: 14,
        bottom: 14,
        width: 6,
        backgroundColor: "rgba(0,0,0,0.10)",
        borderRadius: 3,
    },
    knob: {
        position: "absolute",
        top: 4,
        width: 37,
        height: 37,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor:COLORS.primary,
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    knobText: {
        ...FONTS.fontSemiBold,
        fontSize: 10,
    },
});
