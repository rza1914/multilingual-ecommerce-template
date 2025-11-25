import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface SSEChatState {
  isConnected: boolean;
  messages: ChatMessage[];
  error: string | null;
  isReceiving: boolean;
}

export const useAIChatSSE = () => {
  const { token } = useAuthStore();
  const [state, setState] = useState<SSEChatState>({
    isConnected: false,
    messages: [],
    error: null,
    isReceiving: false
  });

  const sendMessage = useCallback(async (content: string) => {
    if (state.isReceiving) return; // Don't send if already receiving

    // Add user message to state
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isReceiving: true,
      isConnected: true
    }));

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const url = `${baseUrl}/api/v1/services/conversation_sse/stream`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: content })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantMessageId = Date.now().toString();

      // Initialize assistant message
      setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString()
          }
        ]
      }));

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Split buffer into lines
        const lines = buffer.split('\n');
        // Keep last incomplete line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;

          // SSE format: data: {content}
          if (line.startsWith('data: ')) {
            try {
              const jsonData = line.slice(6); // Remove 'data: ' prefix
              const parsedData = JSON.parse(jsonData);

              if (parsedData.content) {
                // Append content to the assistant message
                setState(prev => {
                  const newMessages = [...prev.messages];
                  const lastMessage = newMessages[newMessages.length - 1];

                  if (lastMessage.id === assistantMessageId) {
                    lastMessage.content += parsedData.content;
                  }

                  return {
                    ...prev,
                    messages: newMessages
                  };
                });
              }

              if (parsedData.done === true) {
                // Stream is complete
                setState(prev => ({ ...prev, isReceiving: false }));
                break; // Exit the inner loop
              }

              if (parsedData.error) {
                setState(prev => ({
                  ...prev,
                  error: parsedData.error,
                  isReceiving: false
                }));
                break; // Exit the inner loop
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
              console.log('Problematic line:', line);
            }
          }
        }
      }

      // Close the reader
      reader.releaseLock();

      // Ensure isReceiving is set to false when stream ends
      setState(prev => ({ ...prev, isReceiving: false }));

    } catch (error) {
      console.error('Error sending message via SSE:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message',
        isReceiving: false
      }));
    }
  }, [token, state.isReceiving]);

  return {
    ...state,
    sendMessage
  };
};