import React, { useRef, useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Header from '../../layout/Header';
import ProfileDetailsSheet from '../ProfileDetailsSheet';
import { BlurView } from 'expo-blur';
import matchingContext from '../../context/matchingContext';

const Likes = () => {

    const navigation = useNavigation<any>();

    const { colors }: {colors : any} = useTheme();

    // Get matching context
    const {
        matches,
        matchesLoading,
        matchesError,
        loadMatches,
        unmatch,
    } = React.useContext(matchingContext);

    // Load matches on mount
    useEffect(() => {
        loadMatches();
    }, []);

    const handleUnmatch = (matchId: string, matchName: string) => {
        Alert.alert(
            'Unmatch',
            `Are you sure you want to unmatch with ${matchName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unmatch',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await unmatch(matchId);
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to unmatch. Please try again.');
                        }
                    },
                },
            ]
        );
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
                    {matchesLoading && matches.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={[FONTS.fontMedium, { marginTop: 10, color: colors.text }]}>
                                Loading matches...
                            </Text>
                        </View>
                    ) : matchesError && matches.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100, paddingHorizontal: 20 }}>
                            <Text style={[FONTS.fontBold, { fontSize: 18, color: colors.title, marginBottom: 10 }]}>
                                Error Loading Matches
                            </Text>
                            <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.text, textAlign: 'center', marginBottom: 20 }]}>
                                {matchesError}
                            </Text>
                            <TouchableOpacity
                                onPress={() => loadMatches()}
                                style={{
                                    backgroundColor: COLORS.primary,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 8,
                                }}
                            >
                                <Text style={[FONTS.fontBold, { color: COLORS.white }]}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : matches.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100, paddingHorizontal: 20 }}>
                            <Text style={[FONTS.fontBold, { fontSize: 18, color: colors.title, marginBottom: 10 }]}>
                                No Matches Yet
                            </Text>
                            <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.text, textAlign: 'center' }]}>
                                Start swiping to find your dance partner!
                            </Text>
                        </View>
                    ) : (
                        <View
                            style={GlobalStyleSheet.container}
                        >
                            <View style={GlobalStyleSheet.row}>
                                {matches.map((match) => {
                                    return(
                                        <View
                                            style={[GlobalStyleSheet.col50,{marginBottom:10}]}
                                            key={match.id}
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
                                                onLongPress={() => handleUnmatch(match.id, match.matched_user_name || 'this match')}
                                            >
                                                {match.matched_user_image ? (
                                                    <Image
                                                        style={{
                                                            width:'100%',
                                                            height:'100%',
                                                            borderRadius:15,
                                                        }}
                                                        source={{ uri: match.matched_user_image }}
                                                    />
                                                ) : (
                                                    <View style={{
                                                        width:'100%',
                                                        height:'100%',
                                                        borderRadius:15,
                                                        backgroundColor: COLORS.primary,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Text style={[FONTS.fontBold, { color: COLORS.white, fontSize: 20 }]}>
                                                            {match.matched_user_name?.charAt(0).toUpperCase() || '?'}
                                                        </Text>
                                                    </View>
                                                )}
                                                <TouchableOpacity
                                                    onPress={() => navigation.navigate('SingleChat', {
                                                        data: {
                                                            name: match.matched_user_name || 'Match',
                                                            image: match.matched_user_image || IMAGES.likedPic5,
                                                            id: match.matched_user_id,
                                                        }
                                                    })}
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
                                                        intensity={40}
                                                        tint="light"
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
                                                            {match.matched_user_name || 'Match'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    )}
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