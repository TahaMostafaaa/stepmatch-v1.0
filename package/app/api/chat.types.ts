/**
 * Chat API Types
 * 
 * TypeScript interfaces for chat-related API requests and responses.
 */

// ================== Core Types ==================

/**
 * Participant information for a conversation
 */
export interface Participant {
  id: string;
  name: string;
  image_url: string | null;
}

/**
 * Last message preview for conversation list
 */
export interface LastMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
  is_own_message: boolean;
}

/**
 * Conversation summary for list view
 */
export interface Conversation {
  id: string;
  match_id: string;
  participant: Participant;
  last_message: LastMessage | null;
  last_message_at: string | null;
  created_at: string;
}

/**
 * Full message object
 */
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
  is_own_message: boolean;
}

// ================== API Responses ==================

/**
 * GET /chat/conversations response
 */
export interface ConversationsResponse {
  conversations: Conversation[];
  total_count: number;
}

/**
 * GET /chat/conversations/{id}/messages response
 */
export interface MessagesResponse {
  conversation: {
    id: string;
    match_id: string;
    participant: Participant;
    created_at: string;
  };
  messages: Message[];
  total_count: number;
  has_more: boolean;
}

/**
 * POST /chat/conversations/{id}/messages request
 */
export interface SendMessageRequest {
  content: string;
}

/**
 * POST /chat/conversations/{id}/messages response
 */
export interface SendMessageResponse {
  success: boolean;
  message: Message;
}

/**
 * POST /chat/conversations/{id}/typing request
 */
export interface TypingRequest {
  is_typing: boolean;
}

/**
 * POST /chat/conversations/{id}/typing response
 */
export interface TypingResponse {
  success: boolean;
  conversation_id: string;
}

// ================== Real-time Types ==================

/**
 * Real-time message_created event payload
 */
export interface RealtimeMessagePayload {
  payload: {
    new: {
      id: string;
      conversation_id: string;
      sender_id: string;
      content: string;
      created_at: string;
    };
  };
}

/**
 * Real-time typing event payload
 */
export interface RealtimeTypingPayload {
  payload: {
    user_id: string;
    is_typing: boolean;
    timestamp: string;
  };
}

// ================== Navigation Params ==================

/**
 * SingleChat screen navigation params
 */
export interface SingleChatParams {
  conversationId: string;
  participant: Participant;
}


