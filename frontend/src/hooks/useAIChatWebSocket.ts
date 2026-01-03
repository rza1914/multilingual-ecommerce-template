import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore'; // Relative import

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface WSState {
  isConnected: boolean;
  isConnecting: boolean;
  messages: ChatMessage[];
  error: string | null;
}

// Mock implementation of useAIChatWebSocket that simulates WebSocket functionality without actual WebSocket
export const useAIChatWebSocket = () => {
  const { token, user } = useAuthStore();
  const [state, setState] = useState<WSState>({
    isConnected: true, // Always connected in mock implementation
    isConnecting: false,
    messages: [],
    error: null
  });

  // Simulate sending a message to the backend via REST API instead of WebSocket
  const sendMessage = useCallback(async (content: string) => {
    try {
      // In the mock implementation, we'll simulate a response
      setState(prev => ({
        ...prev,
        isConnecting: true
      }));

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // Simulate a response from the AI
      const simulatedResponse = `This is a simulated response to: "${content}". In the full implementation, this would come from the AI service.`;

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: simulatedResponse,
        timestamp: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: (prev.messages.length + 1).toString(),
            role: 'user',
            content,
            timestamp: new Date().toISOString()
          },
          newMessage
        ],
        isConnecting: false,
        error: null
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to send message',
        isConnecting: false
      }));
    }
  }, [token]);

  return {
    ...state,
    sendMessage
  };
};