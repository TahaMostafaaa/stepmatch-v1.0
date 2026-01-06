/**
 * Supabase Client Configuration
 * 
 * Initializes Supabase client with real-time capabilities for chat messaging.
 * Syncs authentication state with the app's JWT token storage.
 */

import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { ENV } from './env';
import { getAccessToken } from '../storage/secureStorage';

// Create Supabase client with custom auth handling
export const supabase: SupabaseClient = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY,
  {
    auth: {
      // Disable automatic session management since we handle tokens ourselves
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Set the authentication token for Supabase realtime connections
 * Must be called before subscribing to private channels
 */
export const setSupabaseAuth = async (): Promise<void> => {
  try {
    const token = await getAccessToken();
    if (token) {
      await supabase.realtime.setAuth(token);
      console.log('[SupabaseClient] Auth token set for realtime');
    } else {
      console.warn('[SupabaseClient] No auth token available for realtime');
    }
  } catch (error) {
    console.error('[SupabaseClient] Error setting auth token:', error);
  }
};

/**
 * Subscribe to a conversation channel for real-time messages
 * @param conversationId - The conversation UUID
 * @param onMessage - Callback when a new message is received
 * @param onTyping - Callback when typing indicator is received
 * @returns RealtimeChannel instance for cleanup
 */
export const subscribeToConversation = (
  conversationId: string,
  onMessage: (payload: any) => void,
  onTyping?: (payload: any) => void
): RealtimeChannel => {
  const channelName = `conversation:${conversationId}`;
  
  const channel = supabase
    .channel(channelName, {
      config: {
        private: true,
      },
    })
    .on('broadcast', { event: 'message_created' }, (payload) => {
      console.log('[SupabaseClient] Message received:', payload);
      onMessage(payload);
    });

  // Add typing listener if callback provided
  if (onTyping) {
    channel.on('broadcast', { event: 'typing' }, (payload) => {
      console.log('[SupabaseClient] Typing indicator received:', payload);
      onTyping(payload);
    });
  }

  channel.subscribe((status) => {
    console.log('[SupabaseClient] Channel subscription status:', status);
  });

  return channel;
};

/**
 * Broadcast typing indicator to a conversation channel
 * @param conversationId - The conversation UUID
 * @param userId - The current user's UUID
 * @param isTyping - Whether the user is typing
 */
export const broadcastTyping = async (
  conversationId: string,
  userId: string,
  isTyping: boolean
): Promise<void> => {
  const channelName = `conversation:${conversationId}`;
  
  try {
    await supabase.channel(channelName).send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: userId,
        is_typing: isTyping,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[SupabaseClient] Error broadcasting typing:', error);
  }
};

/**
 * Unsubscribe from a conversation channel
 * @param channel - The RealtimeChannel to unsubscribe from
 */
export const unsubscribeFromConversation = async (
  channel: RealtimeChannel
): Promise<void> => {
  try {
    await supabase.removeChannel(channel);
    console.log('[SupabaseClient] Unsubscribed from channel');
  } catch (error) {
    console.error('[SupabaseClient] Error unsubscribing:', error);
  }
};

export default supabase;


