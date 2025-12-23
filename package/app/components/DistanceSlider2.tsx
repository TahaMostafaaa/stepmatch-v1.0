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

const { width } = Dimensions.get("window");

const DistanceSlider2 = () => {
    const minKm = 0;
    const maxKm = 2;
    const sliderWidth = 220; // total slider width
    const knobSize = 45; // blue circle size

    const [distance, setDistance] = useState(2);
    const translateX = useRef(new Animated.Value(sliderWidth - knobSize)).current;

    // Convert position → distance
    const positionToDistance = (x: number) => {
        const ratio = x / (sliderWidth - knobSize);
        const km = (ratio * (maxKm - minKm) + minKm).toFixed(1);
        return Math.max(minKm, Math.min(maxKm, km));
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                let newX = gesture.dx + (sliderWidth - knobSize);
                newX = Math.max(0, Math.min(sliderWidth - knobSize, newX));
                translateX.setValue(newX);
                const newDistance = positionToDistance(newX);
                setDistance(newDistance);
            },
            onPanResponderRelease: (_, gesture) => {
                let newX = Math.max(0, Math.min(sliderWidth - knobSize, gesture.dx));
                Animated.spring(translateX, {
                toValue: newX,
                useNativeDriver: true,
                speed: 20,
                bounciness: 6,
                }).start();
            },
        })
    ).current;

    return (
        <View style={styles.wrapper}>
            <View style={styles.slider}>
                {/* Background track */}
                <View style={styles.track} />

                {/* Draggable knob */}
                <Animated.View
                    {...panResponder.panHandlers}
                        style={[
                            styles.knob,
                            {
                                transform: [
                                    {
                                    translateX: translateX.interpolate({
                                        inputRange: [0, sliderWidth - knobSize],
                                        outputRange: [0, sliderWidth - knobSize],
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

export default DistanceSlider2;

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    slider: {
        height: 44,
        width: 220,
        backgroundColor: "#fff",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "flex-start",
        elevation: 9,
        shadowColor: "rgba(0,0,0,0.50)",
        shadowOpacity: 0.10,
        shadowRadius: 5,
        overflow: "hidden",
    },
    track: {
        position: "absolute",
        left: 20,
        right: 20,
        height: 6,
        backgroundColor: "rgba(0,0,0,0.1)",
        borderRadius: 3,
    },
    knob: {
        position: "absolute",
        left: 4,
        width: 37,
        height: 37,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: COLORS.primary,
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    knobText: {
        ...FONTS.fontSemiBold,
        fontSize: 10,
    },
});
