import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Image, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { useRoute, useTheme } from '@react-navigation/native';
import { RootStackParamList } from '../../Navigations/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import chatContext from '../../context/chatContext';
import { Message, Participant } from '../../api/chat.types';

type SingleChatScreenProps = NativeStackScreenProps<RootStackParamList, 'SingleChat'>;

/**
 * Format message timestamp for display
 */
const formatMessageTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const SingleChat = ({ navigation }: SingleChatScreenProps) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const route = useRoute<any>();

    // Get params from navigation
    const { conversationId, participant } = route.params as {
        conversationId: string;
        participant: Participant;
    };

    // Get chat context
    const {
        getConversationMessages,
        messagesLoading,
        messagesError,
        loadMessages,
        loadMoreMessages,
        conversationHasMore,
        sendMessage,
        sendingMessage,
        subscribeToChat,
        unsubscribeFromChat,
        sendTypingIndicator,
        isUserTyping,
    } = React.useContext(chatContext);

    // Local state
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Get messages for this conversation
    const messages: Message[] = getConversationMessages(conversationId);
    const hasMore = conversationHasMore(conversationId);
    const otherUserTyping = isUserTyping(conversationId);

    // Load messages and subscribe on mount
    useEffect(() => {
        loadMessages(conversationId);
        subscribeToChat(conversationId);

        return () => {
            unsubscribeFromChat();
        };
    }, [conversationId]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages.length]);

    // Handle typing indicator
    const handleTextChange = useCallback((text: string) => {
        setMessageText(text);

        // Send typing indicator
        if (text.length > 0 && !isTyping) {
            setIsTyping(true);
            sendTypingIndicator(conversationId, true);
        }

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            if (isTyping) {
                setIsTyping(false);
                sendTypingIndicator(conversationId, false);
            }
        }, 2000);
    }, [conversationId, isTyping, sendTypingIndicator]);

    // Handle send message
    const handleSendMessage = useCallback(async () => {
        if (!messageText.trim() || sendingMessage) return;

        const text = messageText.trim();
        setMessageText('');
        Keyboard.dismiss();

        // Stop typing indicator
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        if (isTyping) {
            setIsTyping(false);
            sendTypingIndicator(conversationId, false);
        }

        try {
            await sendMessage(conversationId, text);
        } catch (error: any) {
            console.error('Failed to send message:', error);
            // Could show a toast/alert here
        }
    }, [messageText, sendingMessage, conversationId, isTyping, sendMessage, sendTypingIndicator]);

    // Handle load more
    const handleLoadMore = useCallback(() => {
        if (!messagesLoading && hasMore) {
            loadMoreMessages(conversationId);
        }
    }, [messagesLoading, hasMore, conversationId, loadMoreMessages]);

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            {/* Header */}
            <View style={[GlobalStyleSheet.container, { paddingHorizontal: 10, paddingBottom: 0 }]}>
                <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    borderBottomWidth: 1, 
                    paddingBottom: 10, 
                    borderBottomColor: colors.borderColor 
                }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{ padding: 10 }}
                        >
                            <Image
                                style={[GlobalStyleSheet.image, { tintColor: colors.text }]}
                                source={IMAGES.arrowleftsolid}
                            />
                        </TouchableOpacity>
                        <View style={{ marginRight: 10 }}>
                            <Image
                                style={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: 60,
                                    backgroundColor: colors.borderColor,
                                }}
                                source={participant.image_url 
                                    ? { uri: participant.image_url }
                                    : IMAGES.userPic
                                }
                            />
                        </View>
                        <View>
                            <Text style={[FONTS.fontBold, { fontSize: 16, color: colors.title }]}>
                                {participant.name}
                            </Text>
                            {otherUserTyping && (
                                <Text style={[FONTS.fontMedium, { fontSize: 12, color: COLORS.primary }]}>
                                    typing...
                                </Text>
                            )}
                        </View>
                    </View>  
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ padding: 5, paddingHorizontal: 10 }}>
                            <Image
                                style={[GlobalStyleSheet.image, { tintColor: theme.dark ? colors.text : '#999999' }]}
                                source={IMAGES.Phone}
                            /> 
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Video')}
                            style={{ padding: 5 }}
                        >
                            <Image
                                style={[GlobalStyleSheet.image, { tintColor: theme.dark ? colors.text : '#999999' }]}
                                source={IMAGES.videocall}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5 }}>
                            <Image
                                style={[GlobalStyleSheet.image, { tintColor: theme.dark ? colors.text : '#999999' }]}
                                source={IMAGES.more}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Messages */}
            <KeyboardAvoidingView
                style={[GlobalStyleSheet.container, { padding: 0, flex: 1 }]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={{ flex: 1, backgroundColor: colors.card, paddingHorizontal: 15, marginTop: 15 }}>
                    <ScrollView 
                        ref={scrollViewRef}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                        onScroll={({ nativeEvent }) => {
                            // Load more when scrolled to top
                            if (nativeEvent.contentOffset.y <= 50 && hasMore && !messagesLoading) {
                                handleLoadMore();
                            }
                        }}
                        scrollEventThrottle={400}
                    >
                        {/* Loading indicator at top for load more */}
                        {messagesLoading && messages.length > 0 && (
                            <View style={{ paddingVertical: 10, alignItems: 'center' }}>
                                <ActivityIndicator size="small" color={COLORS.primary} />
                            </View>
                        )}

                        {/* Load more button */}
                        {hasMore && !messagesLoading && messages.length > 0 && (
                            <TouchableOpacity 
                                onPress={handleLoadMore}
                                style={{ paddingVertical: 10, alignItems: 'center' }}
                            >
                                <Text style={[FONTS.fontMedium, { color: COLORS.primary }]}>
                                    Load older messages
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Initial loading */}
                        {messagesLoading && messages.length === 0 && (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            </View>
                        )}

                        {/* Error state */}
                        {messagesError && !messagesLoading && (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[FONTS.fontMedium, { color: COLORS.danger, textAlign: 'center' }]}>
                                    {messagesError}
                                </Text>
                                <TouchableOpacity 
                                    onPress={() => loadMessages(conversationId)}
                                    style={{ marginTop: 10 }}
                                >
                                    <Text style={[FONTS.fontSemiBold, { color: COLORS.primary }]}>
                                        Tap to retry
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Empty state */}
                        {!messagesLoading && !messagesError && messages.length === 0 && (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[FONTS.fontMedium, { color: colors.text, textAlign: 'center' }]}>
                                    No messages yet.{'\n'}Say hello to {participant.name}!
                                </Text>
                            </View>
                        )}

                        {/* Messages list */}
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            {messages.map((message, index) => {
                                const showAvatar = !message.is_own_message && 
                                    (index === 0 || messages[index - 1]?.is_own_message);
                                const showTime = index === messages.length - 1 || 
                                    messages[index + 1]?.is_own_message !== message.is_own_message;

                                return (
                                    <View 
                                        key={message.id}
                                        style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}
                                    >
                                        {!message.is_own_message && showAvatar && (
                                            <Image
                                                style={{
                                                    height: 40,
                                                    width: 40,
                                                    borderRadius: 60,
                                                    marginBottom: showTime ? 30 : 10,
                                                    backgroundColor: colors.borderColor,
                                                }}
                                                source={participant.image_url 
                                                    ? { uri: participant.image_url }
                                                    : IMAGES.userPic
                                                }
                                            />
                                        )}
                                        <View
                                            style={[
                                                {
                                                    maxWidth: '75%',
                                                    marginBottom: 10,
                                                    marginLeft: !message.is_own_message && !showAvatar ? 50 : 0,
                                                },
                                                message.is_own_message
                                                    ? { marginLeft: 'auto', alignItems: 'flex-end' }
                                                    : { marginRight: 'auto', alignItems: 'flex-start' }
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    message.is_own_message
                                                        ? {
                                                            backgroundColor: '#EDEDED',
                                                            borderRadius: 15,
                                                            paddingHorizontal: 15,
                                                            paddingVertical: 10,
                                                        }
                                                        : {
                                                            backgroundColor: COLORS.primary,
                                                            borderRadius: 15,
                                                            paddingHorizontal: 15,
                                                            paddingVertical: 10,
                                                        }
                                                ]}
                                            >
                                                <Text style={{
                                                    ...FONTS.fontNunitoRegular,
                                                    fontSize: 15,
                                                    lineHeight: 20,
                                                    color: message.is_own_message ? COLORS.title : COLORS.white
                                                }}>
                                                    {message.content}
                                                </Text>
                                            </View>
                                            {showTime && (
                                                <Text style={{
                                                    ...FONTS.fontSemiBold,
                                                    fontSize: 11,
                                                    color: 'rgba(25,25,25,0.5)',
                                                    marginTop: 6
                                                }}>
                                                    {formatMessageTime(message.created_at)}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Typing indicator */}
                        {otherUserTyping && (
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: 10 }}>
                                <Image
                                    style={{
                                        height: 40,
                                        width: 40,
                                        borderRadius: 60,
                                        backgroundColor: colors.borderColor,
                                    }}
                                    source={participant.image_url 
                                        ? { uri: participant.image_url }
                                        : IMAGES.userPic
                                    }
                                />
                                <View style={{
                                    backgroundColor: COLORS.primary,
                                    borderRadius: 15,
                                    paddingHorizontal: 15,
                                    paddingVertical: 10,
                                }}>
                                    <Text style={{ color: COLORS.white, fontSize: 15 }}>...</Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {/* Input area */}
                    <View style={[GlobalStyleSheet.flexCenter, {
                        backgroundColor: colors.card,
                        paddingVertical: 15,
                        gap: 6
                    }]}>
                        <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        top: 15,
                                        left: 15
                                    }}
                                >
                                    <Image
                                        style={{
                                        tintColor: theme.dark ? colors.text : '#999999',
                                            width: 20,
                                            height: 20,
                                        }}
                                        source={IMAGES.happy}
                                    />
                                </TouchableOpacity>
                                <TextInput
                                    placeholder='Your Message'
                                    placeholderTextColor={colors.text}
                                value={messageText}
                                onChangeText={handleTextChange}
                                multiline
                                    style={[
                                        GlobalStyleSheet.inputBox, {
                                            ...FONTS.fontMedium,
                                        fontSize: 16,
                                        lineHeight: 20,
                                        color: colors.title,
                                        borderColor: theme.dark ? colors.borderColor : '#CDCDCD',
                                        paddingRight: 80,
                                        maxHeight: 100,
                                        },
                                    ]}
                                />
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        top: 15,
                                        right: 50
                                    }}
                                >
                                    <Image
                                        style={{
                                        tintColor: theme.dark ? colors.text : '#999999',
                                            width: 20,
                                            height: 20,
                                        resizeMode: 'contain'
                                        }}
                                        source={IMAGES.Camera}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        top: 15,
                                        right: 15
                                    }}
                                >
                                    <Image
                                        style={{
                                        tintColor: theme.dark ? colors.text : '#999999',
                                            width: 20,
                                            height: 20,
                                        resizeMode: 'contain'
                                        }}
                                        source={IMAGES.paperclipsolid}
                                    />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.6}
                            onPress={handleSendMessage}
                            disabled={!messageText.trim() || sendingMessage}
                            style={[GlobalStyleSheet.headerBtn, {
                                height: 50,
                                width: 50,
                                borderRadius: 15,
                                backgroundColor: (!messageText.trim() || sendingMessage) 
                                    ? `${COLORS.primary}80` 
                                    : COLORS.primary
                            }]}
                        >
                            {sendingMessage ? (
                                <ActivityIndicator size="small" color={colors.card} />
                            ) : (
                                <Image
                                    style={{
                                        tintColor: colors.card,
                                        width: 20,
                                        height: 20,
                                        resizeMode: 'contain'
                                    }}
                                    source={IMAGES.send}
                                />
                            )}
                            </TouchableOpacity>
                        </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SingleChat;
