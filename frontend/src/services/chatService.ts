// Note: User data is passed as parameter instead of relying on TokenStorage

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatMessageResponse {
  response: string;
  context?: any;
  user_id?: number;
}

// WebSocket connection management
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const maxReconnects = 3;
const onMessageCallbacks: ((msg: ChatMessage) => void)[] = [];
const onErrorCallbacks: ((err: string) => void)[] = [];

/**
 * Connect to WebSocket chat server
 * @param token - Auth token for WebSocket authentication
 * @param userId - User ID to connect to the chat
 * @param onMessage - Callback for receiving messages
 * @param onError - Callback for receiving errors
 */
export const connectChat = (
  token: string,
  userId: number,
  onMessage: (msg: ChatMessage) => void,
  onError: (err: string) => void
) => {
  // Don't reconnect if already connected
  if (ws?.readyState === WebSocket.OPEN) return;

  // Validate input
  if (!userId) {
    onError('User ID not provided');
    return;
  }

  // Get the API base URL from environment or use default
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Replace http/https with ws/wss
  const wsUrl = apiUrl.replace(/^http/, 'ws');
  const url = `${wsUrl}/api/v1/chat/${userId}`; // Remove token from URL

  console.log(`🔌 Connecting to WebSocket: ${url}`);

  ws = new WebSocket(url);

  ws.onopen = () => {
    console.log('✅ WebSocket connected');
    reconnectAttempts = 0;

    // Send authentication token as first message after connection
    const authMessage = {
      type: 'authenticate',
      token: token,
      userId: userId
    };
    ws.send(JSON.stringify(authMessage));
    console.log('🔒 Authentication token sent via WebSocket message');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // Handle different message types from backend
      if (data.type === 'chat_message' && data.sender === 'ai') {
        // Format the AI response as a chat message
        const formattedMessage: ChatMessage = {
          role: 'assistant',
          content: data.content,
          timestamp: new Date(data.timestamp || Date.now())
        };

        onMessage(formattedMessage);
      } else if (data.type === 'typing') {
        // Handle typing indicators if needed
        console.log('💬 AI is typing...');
      } else if (data.type === 'error') {
        onError(data.message || 'خطای چت');
      } else if (data.type === 'welcome') {
        console.log('💬 Chat service connected:', data.message);
      }
    } catch (err) {
      console.error('❌ Invalid message format:', err);
      onError('پیام نامعتبر دریافت شد');
    }
  };

  ws.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
    onError('خطا در اتصال چت');
  };

  ws.onclose = (event) => {
    console.log('🔌 WebSocket closed', { code: event.code, reason: event.reason, wasClean: event.wasClean });

    // Attempt to reconnect if connection wasn't closed cleanly
    if (reconnectAttempts < maxReconnects && !event.wasClean) {
      console.log(`🔄 Attempting to reconnect... (${reconnectAttempts + 1}/${maxReconnects})`);
      setTimeout(() => {
        reconnectAttempts++;
        // Use the same token and userId that were originally passed to connectChat
        connectChat(token, userId, onMessage, onError);
      }, 2000 * reconnectAttempts); // Exponential backoff
    } else if (reconnectAttempts >= maxReconnects) {
      onError('تعداد تلاش‌های اتصال مجدد به حداکثر رسیده است');
    } else if (event.wasClean) {
      // Connection closed cleanly, don't try to reconnect
      console.log('✅ WebSocket connection closed cleanly');
    }
  };
};

/**
 * Send a message via WebSocket
 * @param message - The message to send
 */
export const sendChatMessage = (message: string) => {
  if (ws?.readyState === WebSocket.OPEN) {
    // Send message in the format expected by the backend
    const msgData = JSON.stringify({ content: message });
    ws.send(msgData);
    console.log('📤 Message sent via WebSocket:', message);
  } else if (ws?.readyState === WebSocket.CONNECTING) {
    console.warn('⚠️ WebSocket still connecting, message queued');
    // In a real implementation, we might want to queue messages
    // For now, we'll throw an error
    throw new Error('WebSocket is still connecting, please wait');
  } else {
    console.error('❌ WebSocket not connected');
    throw new Error('اتصال چت برقرار نیست');
  }
};

/**
 * Close the WebSocket connection
 */
export const closeChat = () => {
  if (ws) {
    console.log('🔌 Closing WebSocket connection');
    ws.close(1000, 'Closing chat connection');
    ws = null;
  }
  reconnectAttempts = 0;
};

/**
 * Check if WebSocket is currently connected
 */
export const isChatConnected = (): boolean => {
  return ws?.readyState === WebSocket.OPEN;
};

export default {
  connectChat,
  sendChatMessage,
  closeChat,
  isChatConnected
};