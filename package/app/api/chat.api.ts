/**
 * Chat API Functions
 * 
 * Typed API functions for chat endpoints.
 * Uses the central apiClient for requests.
 */

import apiClient from './apiClient';
import {
  ConversationsResponse,
  MessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  TypingRequest,
  TypingResponse,
} from './chat.types';

/**
 * Chat API object containing all chat endpoints
 */
export const chatApi = {
  /**
   * Get all conversations for the authenticated user
   * Sorted by most recent message
   * @returns ConversationsResponse with list of conversations
   * @throws 401 for unauthorized
   */
  getConversations: async (): Promise<ConversationsResponse> => {
    console.log('[ChatAPI] GET /chat/conversations called');
    try {
      const response = await apiClient.get<ConversationsResponse>('/chat/conversations');
      console.log('[ChatAPI] GET /chat/conversations response:', {
        status: response.status,
        conversationsCount: response.data?.conversations?.length || 0,
        totalCount: response.data?.total_count,
      });
      return response.data;
    } catch (error: any) {
      console.error('[ChatAPI] GET /chat/conversations error:', {
        url: '/chat/conversations',
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  /**
   * Get paginated messages for a conversation (newest first)
   * @param conversationId - UUID of the conversation
   * @param limit - Number of messages to return (1-100, default: 50)
   * @param before - ISO 8601 timestamp to get messages older than
   * @returns MessagesResponse with messages and pagination info
   * @throws 401 for unauthorized, 403 if not participant, 404 if not found
   */
  getMessages: async (
    conversationId: string,
    limit: number = 50,
    before?: string
  ): Promise<MessagesResponse> => {
    const params: { limit: number; before?: string } = {
      limit: Math.min(Math.max(limit, 1), 100), // Clamp between 1-100
    };
    if (before) {
      params.before = before;
    }

    const url = `/chat/conversations/${conversationId}/messages`;
    console.log('[ChatAPI] GET /chat/conversations/{id}/messages called:', {
      url,
      conversationId,
      params,
    });

    try {
      const response = await apiClient.get<MessagesResponse>(url, { params });
      console.log('[ChatAPI] GET /chat/conversations/{id}/messages response:', {
        status: response.status,
        messagesCount: response.data?.messages?.length || 0,
        totalCount: response.data?.total_count,
        hasMore: response.data?.has_more,
      });
      return response.data;
    } catch (error: any) {
      console.error('[ChatAPI] GET /chat/conversations/{id}/messages error:', {
        url,
        conversationId,
        params,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  /**
   * Send a message to a conversation
   * Message is automatically broadcast via real-time
   * @param conversationId - UUID of the conversation
   * @param content - Message content (1-2000 characters)
   * @returns SendMessageResponse with the created message
   * @throws 401 for unauthorized, 403 if not participant or inactive match, 404 if not found
   */
  sendMessage: async (
    conversationId: string,
    content: string
  ): Promise<SendMessageResponse> => {
    const requestBody: SendMessageRequest = { content };
    const url = `/chat/conversations/${conversationId}/messages`;

    console.log('[ChatAPI] POST /chat/conversations/{id}/messages called:', {
      url,
      conversationId,
      contentLength: content.length,
    });

    try {
      const response = await apiClient.post<SendMessageResponse>(url, requestBody);
      console.log('[ChatAPI] POST /chat/conversations/{id}/messages response:', {
        status: response.status,
        success: response.data?.success,
        messageId: response.data?.message?.id,
      });
      return response.data;
    } catch (error: any) {
      console.error('[ChatAPI] POST /chat/conversations/{id}/messages error:', {
        url,
        conversationId,
        contentLength: content.length,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  /**
   * Validate typing indicator permissions
   * Actual typing should be broadcast client-side via Supabase
   * @param conversationId - UUID of the conversation
   * @param isTyping - Whether the user is typing
   * @returns TypingResponse with conversation ID
   * @throws 401 for unauthorized, 403 if not participant, 404 if not found
   */
  validateTyping: async (
    conversationId: string,
    isTyping: boolean
  ): Promise<TypingResponse> => {
    const requestBody: TypingRequest = { is_typing: isTyping };
    const url = `/chat/conversations/${conversationId}/typing`;

    console.log('[ChatAPI] POST /chat/conversations/{id}/typing called:', {
      url,
      conversationId,
      isTyping,
    });

    try {
      const response = await apiClient.post<TypingResponse>(url, requestBody);
      console.log('[ChatAPI] POST /chat/conversations/{id}/typing response:', {
        status: response.status,
        success: response.data?.success,
      });
      return response.data;
    } catch (error: any) {
      console.error('[ChatAPI] POST /chat/conversations/{id}/typing error:', {
        url,
        conversationId,
        isTyping,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
};


