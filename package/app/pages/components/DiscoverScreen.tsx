import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, IMAGES, SIZES } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { useTheme } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = 0.25 * width;


const profiles = [
  { id: 1, name: "Emily, 24", location: "Bali, Indonesia", image: IMAGES.likedPic1 },
  { id: 2, name: "Sophia, 22", location: "Bangkok, Thailand", image: IMAGES.likedPic2 },
  { id: 3, name: "Ava, 26", location: "Delhi, India", image: IMAGES.likedPic3 },
  { id: 4, name: "Mia, 25", location: "Goa, India", image: IMAGES.likedPic4 },
];

const DiscoverScreen = ({ openProfileSheet } : any) => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme;


    const [index, setIndex] = useState(0);
    const position = useRef(new Animated.ValueXY()).current;
    const nextScale = useRef(new Animated.Value(0.9)).current;
    const nextOpacity = useRef(new Animated.Value(0.6)).current;

    const rotate = position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ["-12deg", "0deg", "12deg"],
        extrapolate: "clamp",
    });

    // --- Inside DiscoverScreen ---
    const likeButtonBg = position.x.interpolate({
        inputRange: [0, SWIPE_THRESHOLD],
        outputRange: [COLORS.primary, "#BF7DEF"],
        extrapolate: "clamp",
    });

    const likeIconTint = position.x.interpolate({
        inputRange: [0, SWIPE_THRESHOLD],
        outputRange: [COLORS.white, COLORS.white],
        extrapolate: "clamp",
    });

    // Default white until left swipe starts, then turns red
    const nopeButtonBg = position.x.interpolate({
        inputRange: [-SWIPE_THRESHOLD, 0],
        outputRange: ["#E11E1E", COLORS.white],
        extrapolate: "clamp",
    });

    const nopeIconTint = position.x.interpolate({
        inputRange: [-SWIPE_THRESHOLD, 0],
        outputRange: [COLORS.white, COLORS.success],
        extrapolate: "clamp",
    });

    const panResponder = useRef(
        PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event(
            [null, { dx: position.x, dy: position.y }],
            { useNativeDriver: false }
        ),
        onPanResponderRelease: (_, { dx }) => {
            if (dx > SWIPE_THRESHOLD) {
            forceSwipe("right");
            } else if (dx < -SWIPE_THRESHOLD) {
            forceSwipe("left");
            } else {
            resetPosition();
            }
        },
        })
    ).current;

    const forceSwipe = (direction : any) => {
        const x = direction === "right" ? width : -width;
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: 250,
            useNativeDriver: true,
        }).start(() => onSwipeComplete());
    };

    const onSwipeComplete = () => {
            Animated.parallel([
            Animated.timing(nextScale, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(nextOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start(() => {
            position.setValue({ x: 0, y: 0 });
            nextScale.setValue(0.9);
            nextOpacity.setValue(0.6);
            setIndex((prev) => (prev + 1 < profiles.length ? prev + 1 : 0));
        });
    };

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 6,
            useNativeDriver: true,
        }).start();
    };

    const handleLike = () => forceSwipe("right");
    const handleNope = () => forceSwipe("left");

    const renderProfiles = () => {
        return profiles
        .map((profile, i) => {
            if (i < index) return null;
            const isCurrent = i === index;
            const cardStyle = isCurrent
            ? {
                transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate },
                ],
                }
            : {
                transform: [{ scale: nextScale }],
                opacity: nextOpacity,
                };

            return (
            <Animated.View
                key={profile.id}
                {...(isCurrent ? panResponder.panHandlers : {})}
                style={[{
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    height:null,
                    aspectRatio:1/ 1.5,
                    borderRadius: 30,
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    elevation: 8,
                    shadowColor: "rgba(0,0,0,0.3)",
                    ...cardStyle,
                },Platform.OS === 'ios' && {
                    aspectRatio:1/1.4
                }]}
            >
                <ProfileCard profile={profile} openProfileSheet={openProfileSheet} />
            </Animated.View>
            );
        })
        .reverse();
    };

    return (
        <View
            style={[
                GlobalStyleSheet.container,
                { flex: 1, justifyContent: "center", alignItems: "center" },
            ]}
        >
            {renderProfiles()}

            {/* Bottom Buttons */}
            <View
                style={[{
                position: "absolute",
                    bottom: 80,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 20,
                },,Platform.OS === 'ios' && {
                    bottom:70
                }]}
            >
                 {/* Nope Button (Left Swipe Highlight Only) */}
                <AnimatedActionButton
                    label="Nope"
                    icon={IMAGES.close2}
                    bgColor={nopeButtonBg}
                    tintColor={nopeIconTint}
                    onPress={handleNope}
                    theme={theme}
                />

                {/* Like Button (Right Swipe Highlight Only) */}
                <AnimatedActionButton
                    label="Like"
                    icon={IMAGES.heart2}
                    bgColor={likeButtonBg}
                    tintColor={likeIconTint}
                    onPress={handleLike}
                    theme={theme}
                />
            </View>
        </View>
    );
};


const AnimatedActionButton = ({ label, icon, onPress, bgColor, tintColor,theme }: any) => (
  <View style={{ alignItems: "center", gap: 2 }}>
    <Animated.View
      style={{
        height: 60,
        width: 60,
        borderRadius: 50,
        backgroundColor: bgColor,
        shadowColor: "rgba(0,0,0,0.22)",
        elevation: 9,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Animated.Image
          style={{ height: 26, width: 26, tintColor: tintColor }}
          resizeMode="contain"
          source={icon}
        />
      </TouchableOpacity>
    </Animated.View>
    <Text style={[FONTS.fontBold, { fontSize: 16, color:theme.dark ? '#fff': "#000" }]}>{label}</Text>
  </View>
);


// Profile Card Component
const ProfileCard = ({ profile, openProfileSheet } : any) => (
    <>
        <Image
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            source={profile.image}
        />
        <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,.4)"]}
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "100%",
            }}
        />
        <View
            style={{
                position: "absolute",
                bottom: 10,
                left: 0,
                right: 0,
                flexDirection: "row",
                alignItems: "flex-end",
                padding: 25,
            }}
        >
            <View style={{ flex: 1 }}>
                <Text style={[FONTS.fontBold, { fontSize: 24, color: "#fff" }]}>
                    {profile.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Image
                        style={{ width: 14, height: 14 }}
                        source={IMAGES.pin2}
                        resizeMode="contain"
                    />
                    <Text style={[FONTS.fontMedium, { fontSize: 16, color: "#fff" }]}>
                        {profile.location}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={openProfileSheet}
                activeOpacity={0.8}
                style={[GlobalStyleSheet.headerBtn,{backgroundColor:'rgba(255,255,255,0.30)'}]}
            >
                <Image
                    style={{
                        height:22,
                        width:22,
                    }}
                    resizeMode='contain'
                    source={IMAGES.uparrow2}
                />
            </TouchableOpacity>
        </View>
    </>
);

export default DiscoverScreen;
