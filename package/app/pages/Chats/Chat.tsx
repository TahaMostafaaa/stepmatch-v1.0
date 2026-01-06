import React, { useEffect, useRef, useState } from 'react';
import { 
    Image, 
    ScrollView, 
    Text, 
    TouchableOpacity, 
    View,
    ActivityIndicator 
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import Header from '../../layout/Header';
import matchingContext from '../../context/matchingContext';
import chatContext from '../../context/chatContext';
import { MatchInfo } from '../../api/matching.types';
import { Conversation } from '../../api/chat.types';
import ProfileDetailsSheet from '../ProfileDetailsSheet';

/**
 * Format timestamp for display
 */
const formatMessageTime = (timestamp: string | null): string => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffHours < 1) {
        return 'Just now';
    } else if (diffHours < 24) {
        return `${diffHours} ${diffHours === 1 ? 'Hour' : 'Hours'} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} ${diffDays === 1 ? 'Day' : 'Days'} ago`;
    } else {
        return `${diffWeeks} ${diffWeeks === 1 ? 'Week' : 'Weeks'} ago`;
    }
};

const Chat = () => {
    
    const navigation = useNavigation<any>();

    const theme = useTheme();
    const { colors }: {colors : any} = theme; 

    // Get matches from matching context
    const {
        matches,
        matchesLoading,
        matchesError,
        loadMatches,
    } = React.useContext(matchingContext);

    // Get conversations from chat context
    const {
        conversations,
        conversationsLoading,
        conversationsError,
        loadConversations,
    } = React.useContext(chatContext);

    // Load data on mount
    useEffect(() => {
        loadMatches();
        loadConversations();
    }, []);

    // Profile sheet ref and selected match state
    const ProfileDetailsSheetRef = useRef<any>(null);
    const [selectedMatch, setSelectedMatch] = useState<MatchInfo | null>(null);

    // Handle match tap - open profile sheet
    const handleMatchPress = (match: MatchInfo) => {
        setSelectedMatch(match);
        ProfileDetailsSheetRef.current?.openSheet();
    };

    // Handle conversation tap - navigate to chat
    const handleConversationPress = (conversation: Conversation) => {
        navigation.navigate('SingleChat', {
            conversationId: conversation.id,
            participant: conversation.participant,
        });
    };

    return (
        <>
            <View 
                style={[GlobalStyleSheet.container,{
                    padding:0,
                    flex:1,
                    backgroundColor:colors.card
                }]}
            >
                <Header
                    title={'Chats'}
                    leftIcon={'back'}
                    rightIcon={'Notifaction'}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={GlobalStyleSheet.container}>
                        <View style={[GlobalStyleSheet.flexCenter]}>
                            <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>New Matches</Text>
                            {matches.length > 0 && (
                                <View
                                    style={{
                                        padding:12,
                                        paddingVertical:6,
                                        borderRadius:50,
                                        backgroundColor:theme.dark ? 'rgba(255,255,255,0.08)': 'rgba(0,0,0,0.08)'
                                    }}
                                >
                                    <Text style={[FONTS.fontBold,{fontSize:12,color:colors.text,lineHeight:12}]}>{matches.length}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    {/* Matches Loading State */}
                    {matchesLoading && (
                        <View style={{paddingVertical:20,alignItems:'center'}}>
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        </View>
                    )}
                    {/* Matches Empty State */}
                    {!matchesLoading && matches.length === 0 && (
                        <View style={{paddingVertical:20,paddingHorizontal:15}}>
                            <Text style={[FONTS.fontMedium,{fontSize:14,color:colors.text,textAlign:'center'}]}>
                                No matches yet. Keep swiping!
                            </Text>
                        </View>
                    )}
                    {/* Matches List */}
                    {!matchesLoading && matches.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingLeft:15,
                            }}
                        >
                            {matches.map((match: MatchInfo, index: number) => {
                                return(
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => handleMatchPress(match)}
                                        key={match.id || index}
                                        style={{
                                            alignItems:'center',
                                            marginRight:20,
                                        }}
                                    >
                                        <View
                                            style={{
                                                marginBottom:10,
                                            }}
                                        >
                                            <Image
                                                style={{
                                                    height:65,
                                                    width:65,
                                                    borderRadius:60,
                                                    backgroundColor: colors.borderColor,
                                                }}
                                                source={match.matched_user_image 
                                                    ? { uri: match.matched_user_image } 
                                                    : IMAGES.userPic
                                                }
                                            />
                                        </View>
                                        <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.title}]}>
                                            {match.matched_user_name || 'Match'}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    )}
                    <View style={[GlobalStyleSheet.container,{marginTop:5}]}>
                        <Text style={[FONTS.fontSemiBold,{fontSize:14,color:colors.text,textTransform:'capitalize'}]}>Recent</Text>
                    </View>
                    {/* Conversations Loading State */}
                    {conversationsLoading && (
                        <View style={{paddingVertical:20,alignItems:'center'}}>
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        </View>
                    )}
                    {/* Conversations Error State */}
                    {conversationsError && !conversationsLoading && (
                        <View style={{paddingVertical:20,paddingHorizontal:15}}>
                            <Text style={[FONTS.fontMedium,{fontSize:14,color:COLORS.danger,textAlign:'center'}]}>
                                {conversationsError}
                            </Text>
                            <TouchableOpacity 
                                onPress={loadConversations}
                                style={{marginTop:10,alignItems:'center'}}
                            >
                                <Text style={[FONTS.fontSemiBold,{fontSize:14,color:COLORS.primary}]}>
                                    Tap to retry
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {/* Conversations Empty State */}
                    {!conversationsLoading && !conversationsError && conversations.length === 0 && (
                        <View style={{paddingVertical:20,paddingHorizontal:15}}>
                            <Text style={[FONTS.fontMedium,{fontSize:14,color:colors.text,textAlign:'center'}]}>
                                No conversations yet. Start chatting with your matches!
                            </Text>
                        </View>
                    )}
                    {/* Conversations List */}
                    <View style={{marginBottom:80}}>
                        {conversations.map((conversation: Conversation, index: number) => {
                            const hasUnread = conversation.last_message && !conversation.last_message.is_own_message;
                            
                            return(
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => handleConversationPress(conversation)}
                                    key={conversation.id || index}
                                    style={{
                                        flexDirection:'row',
                                        paddingHorizontal:-15,
                                        marginHorizontal:15,
                                        alignItems:'center',
                                        borderBottomWidth:1,
                                        borderColor:colors.borderColor,
                                    }}
                                >
                                    <View
                                        style={{
                                            marginRight:12,
                                        }}
                                    >
                                        <Image
                                            style={{
                                                height:57,
                                                width:57,
                                                borderRadius:60,
                                                backgroundColor: colors.borderColor,
                                            }}
                                            source={conversation.participant.image_url 
                                                ? { uri: conversation.participant.image_url }
                                                : IMAGES.userPic
                                            }
                                        />
                                    </View>
                                    <View
                                        style={{
                                            paddingVertical:18,
                                            flex:1,
                                            paddingRight:15,
                                        }}
                                    >
                                        <Text style={[FONTS.fontSemiBold,{fontSize:16,color:theme.dark ? colors.title : '#191919'}]}>
                                            {conversation.participant.name}
                                        </Text>
                                        <Text 
                                            numberOfLines={1} 
                                            style={[FONTS.fontMedium,{
                                                fontSize: 14, 
                                                color: theme.dark ? colors.text : '#999999',
                                                fontWeight: hasUnread ? '600' : 'normal',
                                            }]}
                                        >
                                            {conversation.last_message 
                                                ? (conversation.last_message.is_own_message 
                                                    ? `You: ${conversation.last_message.content}` 
                                                    : conversation.last_message.content)
                                                : 'Start a conversation'
                                            }
                                        </Text>
                                    </View>
                                    <View style={{alignItems:'flex-end'}}>
                                        <Text style={[FONTS.fontSemiBold, {fontSize : 11,color:theme.dark ? colors.text : '#888888',marginBottom:8}]}>
                                            {formatMessageTime(conversation.last_message_at)}
                                        </Text>
                                        {conversation.last_message?.is_own_message ? 
                                            <Image
                                                style={{
                                                    width:16,
                                                    height:14,
                                                    marginTop:8
                                                }}
                                                resizeMode='contain'
                                                source={IMAGES.Check2}
                                            />
                                        :
                                            conversation.last_message && (
                                                <View
                                                    style={{
                                                        padding:6,
                                                        paddingVertical:4,
                                                        borderRadius:11,
                                                        backgroundColor:COLORS.primary,
                                                        alignItems:'center',
                                                        justifyContent:'center'
                                                    }}
                                                >   
                                                    <Text style={[FONTS.fontSemiBold,{fontSize:13,color:COLORS.white,lineHeight:13}]}>1</Text>
                                                </View>
                                            )
                                        }
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
            {/* Profile Details Sheet for viewing match profile */}
            <ProfileDetailsSheet 
                ref={ProfileDetailsSheetRef}
                matchData={selectedMatch}
            />
        </>
    );
};

export default Chat;
