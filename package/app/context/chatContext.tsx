/**
 * Chat Context
 * 
 * Context for managing chat state (conversations, messages, real-time)
 * Follows the same pattern as matchingContext
 */

import React, { createContext, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { chatApi } from '../api/chat.api';
import {
  Conversation,
  Message,
  Participant,
  RealtimeMessagePayload,
  RealtimeTypingPayload,
} from '../api/chat.types';
import {
  setSupabaseAuth,
  subscribeToConversation,
  unsubscribeFromConversation,
  broadcastTyping,
} from '../config/supabaseClient';
import { AuthContext } from '../auth/auth.context';

// Create context with default empty object (same as matchingContext)
const chatContext = createContext<any>({});

// ChatProvider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get current user from auth context
  const authContext = React.useContext(AuthContext);
  const currentUserId = authContext?.state?.user?.id;

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(null);

  // Messages state (keyed by conversation ID)
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState<Record<string, boolean>>({});

  // Typing indicators (keyed by conversation ID)
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Active subscription ref
  const activeChannelRef = useRef<RealtimeChannel | null>(null);
  const activeConversationIdRef = useRef<string | null>(null);

  // Sending state
  const [sendingMessage, setSendingMessage] = useState(false);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      console.log('[ChatContext] loadConversations called');
      setConversationsLoading(true);
      setConversationsError(null);
      const response = await chatApi.getConversations();
      setConversations(response.conversations || []);
      console.log('[ChatContext] loadConversations success:', {
        conversationsCount: response.conversations?.length || 0,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to load conversations. Please check your connection.';
      setConversationsError(errorMessage);
      console.error('[ChatContext] loadConversations error:', error);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string, limit: number = 50) => {
    try {
      console.log('[ChatContext] loadMessages called:', { conversationId, limit });
      setMessagesLoading(true);
      setMessagesError(null);
      const response = await chatApi.getMessages(conversationId, limit);
      
      // Messages come newest first, reverse for display (oldest at top)
      const orderedMessages = [...(response.messages || [])].reverse();
      
      setMessages((prev) => ({
        ...prev,
        [conversationId]: orderedMessages,
      }));
      setHasMoreMessages((prev) => ({
        ...prev,
        [conversationId]: response.has_more,
      }));
      console.log('[ChatContext] loadMessages success:', {
        messagesCount: response.messages?.length || 0,
        hasMore: response.has_more,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to load messages. Please try again.';
      setMessagesError(errorMessage);
      console.error('[ChatContext] loadMessages error:', error);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async (conversationId: string, limit: number = 50) => {
    try {
      const currentMessages = messages[conversationId] || [];
      if (messagesLoading || !hasMoreMessages[conversationId] || currentMessages.length === 0) {
        return;
      }

      // Get oldest message timestamp for pagination
      const oldestMessage = currentMessages[0];
      if (!oldestMessage) return;

      console.log('[ChatContext] loadMoreMessages called:', {
        conversationId,
        limit,
        before: oldestMessage.created_at,
      });

      setMessagesLoading(true);
      const response = await chatApi.getMessages(conversationId, limit, oldestMessage.created_at);
      
      // Prepend older messages (reversed for display)
      const olderMessages = [...(response.messages || [])].reverse();
      
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...olderMessages, ...(prev[conversationId] || [])],
      }));
      setHasMoreMessages((prev) => ({
        ...prev,
        [conversationId]: response.has_more,
      }));
      console.log('[ChatContext] loadMoreMessages success:', {
        newMessagesCount: response.messages?.length || 0,
        hasMore: response.has_more,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to load more messages.';
      setMessagesError(errorMessage);
      console.error('[ChatContext] loadMoreMessages error:', error);
    } finally {
      setMessagesLoading(false);
    }
  }, [messages, messagesLoading, hasMoreMessages]);

  // Send a message
  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (!content.trim() || sendingMessage) return;

    try {
      console.log('[ChatContext] sendMessage called:', {
        conversationId,
        contentLength: content.length,
      });
      setSendingMessage(true);

      // Optimistic update
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: currentUserId || '',
        sender_name: 'You',
        content: content.trim(),
        created_at: new Date().toISOString(),
        is_own_message: true,
      };

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), optimisticMessage],
      }));

      // Send to API
      const response = await chatApi.sendMessage(conversationId, content.trim());

      // Replace optimistic message with real one
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map((msg) =>
          msg.id === optimisticMessage.id ? response.message : msg
        ),
      }));

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                last_message: {
                  id: response.message.id,
                  conversation_id: conversationId,
                  sender_id: response.message.sender_id,
                  sender_name: response.message.sender_name,
                  content: response.message.content,
                  created_at: response.message.created_at,
                  is_own_message: true,
                },
                last_message_at: response.message.created_at,
              }
            : conv
        )
      );

      console.log('[ChatContext] sendMessage success:', {
        messageId: response.message.id,
      });
    } catch (error: any) {
      // Remove optimistic message on error
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).filter(
          (msg) => !msg.id.startsWith('temp-')
        ),
      }));

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to send message. Please try again.';
      console.error('[ChatContext] sendMessage error:', error);
      throw new Error(errorMessage);
    } finally {
      setSendingMessage(false);
    }
  }, [currentUserId, sendingMessage]);

  // Handle incoming real-time message
  const handleRealtimeMessage = useCallback((payload: RealtimeMessagePayload) => {
    const messageData = payload?.payload?.new;
    if (!messageData) return;

    const conversationId = messageData.conversation_id;
    
    // Don't add if it's our own message (already added optimistically)
    if (messageData.sender_id === currentUserId) return;

    console.log('[ChatContext] Received real-time message:', messageData);

    // Add to messages if we're viewing this conversation
    setMessages((prev) => {
      const existingMessages = prev[conversationId] || [];
      // Check if message already exists
      if (existingMessages.some((m) => m.id === messageData.id)) {
        return prev;
      }

      const newMessage: Message = {
        id: messageData.id,
        conversation_id: messageData.conversation_id,
        sender_id: messageData.sender_id,
        sender_name: '', // Will need to get from participant
        content: messageData.content,
        created_at: messageData.created_at,
        is_own_message: false,
      };

      return {
        ...prev,
        [conversationId]: [...existingMessages, newMessage],
      };
    });

    // Update conversation's last message
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            last_message: {
              id: messageData.id,
              conversation_id: conversationId,
              sender_id: messageData.sender_id,
              sender_name: conv.participant.name,
              content: messageData.content,
              created_at: messageData.created_at,
              is_own_message: false,
            },
            last_message_at: messageData.created_at,
          };
        }
        return conv;
      })
    );
  }, [currentUserId]);

  // Handle typing indicator
  const handleTypingIndicator = useCallback((payload: RealtimeTypingPayload) => {
    const typingData = payload?.payload;
    if (!typingData || typingData.user_id === currentUserId) return;

    const conversationId = activeConversationIdRef.current;
    if (!conversationId) return;

    console.log('[ChatContext] Received typing indicator:', typingData);

    if (typingData.is_typing) {
      setTypingUsers((prev) => ({ ...prev, [conversationId]: true }));

      // Clear previous timeout
      if (typingTimeoutRef.current[conversationId]) {
        clearTimeout(typingTimeoutRef.current[conversationId]);
      }

      // Auto-clear typing after 3 seconds
      typingTimeoutRef.current[conversationId] = setTimeout(() => {
        setTypingUsers((prev) => ({ ...prev, [conversationId]: false }));
      }, 3000);
    } else {
      setTypingUsers((prev) => ({ ...prev, [conversationId]: false }));
    }
  }, [currentUserId]);

  // Subscribe to a conversation for real-time updates
  const subscribeToChat = useCallback(async (conversationId: string) => {
    try {
      // Unsubscribe from previous if any
      if (activeChannelRef.current) {
        await unsubscribeFromConversation(activeChannelRef.current);
      }

      // Set auth token for Supabase
      await setSupabaseAuth();

      // Subscribe to new conversation
      const channel = subscribeToConversation(
        conversationId,
        handleRealtimeMessage,
        handleTypingIndicator
      );

      activeChannelRef.current = channel;
      activeConversationIdRef.current = conversationId;

      console.log('[ChatContext] Subscribed to conversation:', conversationId);
    } catch (error) {
      console.error('[ChatContext] Error subscribing to conversation:', error);
    }
  }, [handleRealtimeMessage, handleTypingIndicator]);

  // Unsubscribe from current conversation
  const unsubscribeFromChat = useCallback(async () => {
    if (activeChannelRef.current) {
      await unsubscribeFromConversation(activeChannelRef.current);
      activeChannelRef.current = null;
      activeConversationIdRef.current = null;
      console.log('[ChatContext] Unsubscribed from conversation');
    }
  }, []);

  // Send typing indicator
  const sendTypingIndicator = useCallback(async (conversationId: string, isTyping: boolean) => {
    if (!currentUserId) return;

    try {
      await broadcastTyping(conversationId, currentUserId, isTyping);
    } catch (error) {
      console.error('[ChatContext] Error sending typing indicator:', error);
    }
  }, [currentUserId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activeChannelRef.current) {
        unsubscribeFromConversation(activeChannelRef.current);
      }
      // Clear all typing timeouts
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  // Get messages for a specific conversation
  const getConversationMessages = useCallback(
    (conversationId: string): Message[] => {
      return messages[conversationId] || [];
    },
    [messages]
  );

  // Check if conversation has more messages to load
  const conversationHasMore = useCallback(
    (conversationId: string): boolean => {
      return hasMoreMessages[conversationId] ?? true;
    },
    [hasMoreMessages]
  );

  // Check if other user is typing in conversation
  const isUserTyping = useCallback(
    (conversationId: string): boolean => {
      return typingUsers[conversationId] || false;
    },
    [typingUsers]
  );

  // Context value (using useMemo like matchingContext)
  const contextValue = useMemo(
    () => ({
      // Conversations
      conversations,
      conversationsLoading,
      conversationsError,
      loadConversations,

      // Messages
      messages,
      messagesLoading,
      messagesError,
      loadMessages,
      loadMoreMessages,
      getConversationMessages,
      conversationHasMore,

      // Send message
      sendMessage,
      sendingMessage,

      // Real-time
      subscribeToChat,
      unsubscribeFromChat,
      sendTypingIndicator,
      isUserTyping,
    }),
    [
      conversations,
      conversationsLoading,
      conversationsError,
      loadConversations,
      messages,
      messagesLoading,
      messagesError,
      loadMessages,
      loadMoreMessages,
      getConversationMessages,
      conversationHasMore,
      sendMessage,
      sendingMessage,
      subscribeToChat,
      unsubscribeFromChat,
      sendTypingIndicator,
      isUserTyping,
    ]
  );

  return (
    <chatContext.Provider value={contextValue}>
      {children}
    </chatContext.Provider>
  );
};

export default chatContext;


