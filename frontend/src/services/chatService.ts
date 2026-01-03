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

// REST API implementation instead of WebSocket
let onMessageCallbacks: ((msg: ChatMessage) => void)[] = [];
let onErrorCallbacks: ((err: string) => void)[] = [];

/**
 * Connect to chat service (REST API implementation)
 * @param token - Auth token for API authentication
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
  // Add callbacks to the lists
  onMessageCallbacks.push(onMessage);
  onErrorCallbacks.push(onError);

  // In a REST implementation, we don't maintain a persistent connection
  // Instead, we just validate the connection parameters
  if (!userId) {
    onError('User ID not provided');
    return;
  }

  console.log(`✅ REST API chat service connected for user: ${userId}`);
};

/**
 * Send a message via REST API
 * @param message - The message to send
 * @param token - Auth token for API authentication
 */
export const sendChatMessage = async (message: string, token: string) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/v1/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Format the response as a chat message
    const formattedMessage: ChatMessage = {
      role: 'assistant',
      content: data.response,
      timestamp: new Date()
    };

    // Call all registered onMessage callbacks
    onMessageCallbacks.forEach(callback => callback(formattedMessage));

    return data;
  } catch (error) {
    console.error('❌ Error sending message via REST API:', error);

    // Call all registered onError callbacks
    onErrorCallbacks.forEach(callback => callback('Failed to send message'));
    throw error;
  }
};

/**
 * Close the chat connection
 */
export const closeChat = () => {
  // Clear all callbacks
  onMessageCallbacks = [];
  onErrorCallbacks = [];
  console.log('✅ Chat connection closed');
};

/**
 * Check if chat service is available (always true in REST implementation)
 */
export const isChatConnected = (): boolean => {
  // In a REST implementation, we're always "connected" since each request is independent
  return true;
};

export default {
  connectChat,
  sendChatMessage,
  closeChat,
  isChatConnected
};