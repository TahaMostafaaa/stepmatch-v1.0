import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, IMAGES, SIZES } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { useTheme } from "@react-navigation/native";
import matchingContext from "../../context/matchingContext";
import { ProfileCard as ProfileCardType } from "../../api/matching.types";
import AMatch from "../itsaMatch/AMatch";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = 0.25 * width;

const DiscoverScreen = ({ openProfileSheet } : any) => {

    const theme = useTheme();
    const { colors }: {colors : any} = theme;

    // Get matching context
    const {
        profiles,
        feedLoading,
        feedError,
        hasMore,
        loadFeed,
        loadMoreFeed,
        swipe,
        showMatchModal,
        matchData,
        closeMatchModal,
    } = React.useContext(matchingContext);

    const [index, setIndex] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [imageIndex, setImageIndex] = useState<{ [key: string]: number }>({});
    const [hasLoadedInitialFeed, setHasLoadedInitialFeed] = useState(false);
    const position = useRef(new Animated.ValueXY()).current;
    const nextScale = useRef(new Animated.Value(0.9)).current;
    const nextOpacity = useRef(new Animated.Value(0.6)).current;

    // Load feed on mount
    useEffect(() => {
        console.log('[DiscoverScreen] Component mounted, checking feed load:', {
            profilesCount: profiles.length,
            feedLoading,
            hasLoadedInitialFeed,
        });
        
        if (!hasLoadedInitialFeed && !feedLoading && profiles.length === 0) {
            console.log('[DiscoverScreen] Loading initial feed...');
            setHasLoadedInitialFeed(true);
            loadFeed(10);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    // Load more when approaching end
    useEffect(() => {
        if (index >= profiles.length - 2 && hasMore && !feedLoading && profiles.length > 0) {
            console.log('[DiscoverScreen] Approaching end, loading more profiles:', {
                index,
                profilesLength: profiles.length,
                hasMore,
            });
            loadMoreFeed(10);
        }
    }, [index, profiles.length, hasMore, feedLoading, loadMoreFeed]);

    // Handle pull to refresh
    const onRefresh = async () => {
        console.log('[DiscoverScreen] Pull to refresh triggered');
        setRefreshing(true);
        setIndex(0);
        setImageIndex({});
        setHasLoadedInitialFeed(false);
        await loadFeed(10);
        setRefreshing(false);
    };

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

    const forceSwipe = (direction : 'left' | 'right') => {
        const x = direction === "right" ? width : -width;
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: 250,
            useNativeDriver: true,
        }).start(() => onSwipeComplete(direction));
    };

    const onSwipeComplete = async (direction: 'left' | 'right') => {
        const currentProfile = profiles[index];
        if (!currentProfile) {
            console.warn('[DiscoverScreen] No current profile to swipe on');
            return;
        }

        const action = direction === 'right' ? 'like' : 'pass';
        console.log('[DiscoverScreen] Swipe complete:', {
            direction,
            action,
            profileId: currentProfile.id,
            profileName: currentProfile.name,
            currentIndex: index,
        });

        try {
            // Call swipe API
            console.log('[DiscoverScreen] Calling swipe API...');
            await swipe(currentProfile.id, action);
            console.log('[DiscoverScreen] Swipe API call successful');
            
            // Move to next card
            Animated.parallel([
                Animated.timing(nextScale, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(nextOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start(() => {
                position.setValue({ x: 0, y: 0 });
                setIndex((prev) => {
                    const newIndex = prev + 1 < profiles.length ? prev + 1 : prev;
                    console.log('[DiscoverScreen] Moving to next card:', { from: prev, to: newIndex });
                    setTimeout(() => {
                        nextScale.setValue(0.9);
                        nextOpacity.setValue(0.6);
                    }, 0);
                    return newIndex;
                });
            });
        } catch (error: any) {
            // Reset position on error
            console.error('[DiscoverScreen] Swipe error:', error);
            resetPosition();
            
            const errorMessage = error.message || 'Failed to record swipe. Please try again.';
            const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                                 errorMessage.toLowerCase().includes('timeout');
            
            Alert.alert(
                'Swipe Error',
                isNetworkError 
                    ? 'Network error. Please check your connection and try again.'
                    : errorMessage,
                [
                    { text: 'OK', style: 'default' },
                    {
                        text: 'Retry',
                        style: 'default',
                        onPress: () => {
                            // Retry the swipe
                            onSwipeComplete(direction);
                        },
                    },
                ]
            );
        }
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
        if (feedLoading && profiles.length === 0) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={[FONTS.fontMedium, { marginTop: 10, color: colors.text }]}>
                        Loading profiles...
                    </Text>
                </View>
            );
        }

        if (feedError && profiles.length === 0) {
            const isNetworkError = feedError.toLowerCase().includes('network') || 
                                   feedError.toLowerCase().includes('timeout') ||
                                   feedError.toLowerCase().includes('failed to fetch');
            const isAuthError = feedError.toLowerCase().includes('unauthorized') ||
                               feedError.toLowerCase().includes('401');
            
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={[FONTS.fontBold, { fontSize: 18, color: colors.title, marginBottom: 10 }]}>
                        {isAuthError ? 'Authentication Required' : 'Error Loading Feed'}
                    </Text>
                    <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.text, textAlign: 'center', marginBottom: 20 }]}>
                        {isNetworkError 
                            ? 'Unable to connect to the server. Please check your internet connection.'
                            : isAuthError
                            ? 'Please log in again to continue.'
                            : feedError}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('[DiscoverScreen] Retry button pressed');
                            loadFeed(10);
                        }}
                        disabled={feedLoading}
                        style={{
                            backgroundColor: feedLoading ? colors.borderColor : COLORS.primary,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 8,
                            opacity: feedLoading ? 0.6 : 1,
                        }}
                    >
                        {feedLoading ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <Text style={[FONTS.fontBold, { color: COLORS.white }]}>Retry</Text>
                        )}
                    </TouchableOpacity>
                </View>
            );
        }

        if (profiles.length === 0) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={[FONTS.fontBold, { fontSize: 18, color: colors.title, marginBottom: 10 }]}>
                        No More Profiles
                    </Text>
                    <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.text, textAlign: 'center' }]}>
                        Check back later for more potential matches!
                    </Text>
                </View>
            );
        }

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
                        opacity: 1,
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
                            height: null,
                            aspectRatio: 1 / 1.5,
                            borderRadius: 30,
                            overflow: "hidden",
                            backgroundColor: "#fff",
                            elevation: 8,
                            shadowColor: "rgba(0,0,0,0.3)",
                            ...cardStyle,
                        }, Platform.OS === 'ios' && {
                            aspectRatio: 1 / 1.4
                        }]}
                    >
                        <ProfileCard 
                            profile={profile} 
                            openProfileSheet={openProfileSheet}
                            imageIndex={imageIndex[profile.id] || 0}
                            onImageChange={(newIndex) => setImageIndex(prev => ({ ...prev, [profile.id]: newIndex }))}
                        />
                    </Animated.View>
                );
            })
            .reverse();
    };

    return (
        <>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View
                    style={[
                        GlobalStyleSheet.container,
                        { flex: 1, justifyContent: "center", alignItems: "center" },
                    ]}
                >
                    {renderProfiles()}

                    {/* Bottom Buttons */}
                    {profiles.length > 0 && index < profiles.length && (
                        <View
                            style={[{
                                position: "absolute",
                                bottom: 80,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 20,
                            }, Platform.OS === 'ios' && {
                                bottom: 70
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
                    )}
                </View>
            </ScrollView>

            {/* Match Modal */}
            {showMatchModal && matchData && (
                <AMatch matchData={matchData} onClose={closeMatchModal} />
            )}
        </>
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
const ProfileCard = ({ profile, openProfileSheet, imageIndex = 0, onImageChange }: { 
    profile: ProfileCardType; 
    openProfileSheet: () => void;
    imageIndex?: number;
    onImageChange?: (index: number) => void;
}) => {
    const currentImage = profile.images && profile.images.length > 0 
        ? profile.images[Math.min(imageIndex, profile.images.length - 1)]
        : null;

    const handleImagePress = () => {
        if (profile.images && profile.images.length > 1 && onImageChange) {
            const nextIndex = (imageIndex + 1) % profile.images.length;
            onImageChange(nextIndex);
        }
    };

    const displayName = profile.age 
        ? `${profile.name}, ${profile.age}`
        : profile.name;

    const distanceText = profile.distance_km !== null 
        ? `${profile.distance_km.toFixed(1)} km away`
        : 'Distance unknown';

    return (
        <>
            {currentImage ? (
                <Image
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                    source={{ uri: currentImage.image_url }}
                />
            ) : (
                <View style={{ width: "100%", height: "100%", backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[FONTS.fontBold, { color: COLORS.white, fontSize: 20 }]}>No Image</Text>
                </View>
            )}
            
            {/* Image indicator dots */}
            {profile.images && profile.images.length > 1 && (
                <View style={{
                    position: 'absolute',
                    top: 20,
                    left: 0,
                    right: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                }}>
                    {profile.images.map((_, idx) => (
                        <View
                            key={idx}
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: idx === imageIndex ? COLORS.white : 'rgba(255,255,255,0.5)',
                            }}
                        />
                    ))}
                </View>
            )}

            <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,.6)"]}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "60%",
                }}
            />
            <TouchableOpacity
                activeOpacity={1}
                onPress={handleImagePress}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
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
                    <Text style={[FONTS.fontBold, { fontSize: 24, color: "#fff", marginBottom: 4 }]}>
                        {displayName}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <Image
                            style={{ width: 14, height: 14 }}
                            source={IMAGES.pin2}
                            resizeMode="contain"
                        />
                        <Text style={[FONTS.fontMedium, { fontSize: 16, color: "#fff" }]}>
                            {distanceText}
                        </Text>
                    </View>
                    {profile.dance_styles && profile.dance_styles.length > 0 && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                            {profile.dance_styles.slice(0, 3).map((style, idx) => (
                                <View
                                    key={idx}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 12,
                                    }}
                                >
                                    <Text style={[FONTS.fontMedium, { fontSize: 12, color: "#fff" }]}>
                                        {style}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
                <TouchableOpacity
                    onPress={openProfileSheet}
                    activeOpacity={0.8}
                    style={[GlobalStyleSheet.headerBtn, { backgroundColor: 'rgba(255,255,255,0.30)' }]}
                >
                    <Image
                        style={{
                            height: 22,
                            width: 22,
                        }}
                        resizeMode='contain'
                        source={IMAGES.uparrow2}
                    />
                </TouchableOpacity>
            </View>
        </>
    );
};

export default DiscoverScreen;
