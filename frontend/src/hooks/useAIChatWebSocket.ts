import { useEffect, useRef, useState, useCallback } from 'react';
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

let globalSocket: WebSocket | null = null;
let heartbeatInterval: NodeJS.Timeout | null = null;

export const useAIChatWebSocket = () => {
  const { token, user } = useAuthStore(); // یا useContext یا localStorage
  const socketRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState<WSState>({
    isConnected: false,
    isConnecting: false,
    messages: [],
    error: null
  });

  // Function to send heartbeat to keep connection alive
  const startHeartbeat = useCallback(() => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }

    heartbeatInterval = setInterval(() => {
      if (globalSocket?.readyState === WebSocket.OPEN) {
        globalSocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws';
    const url = `${wsProtocol}://${baseUrl.replace(/^https?:\/\//, '')}/ws/chat`;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('AI Chat WebSocket Connected');
      startHeartbeat(); // Start heartbeat when connected

      // ارسال توکن (اگر موجود بود) یا guest mode
      const authMsg = {
        type: 'authenticate',
        token: token || 'guest'
      };
      ws.send(JSON.stringify(authMsg));

      setState(prev => ({ ...prev, isConnected: true, isConnecting: false, error: null }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'pong') {
          // Heartbeat response, no action needed
          return;
        }
        if (data.role) {
          setState(prev => ({
            ...prev,
            messages: [...prev.messages, data]
          }));
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    ws.onclose = (event) => {
      console.log('AI Chat WebSocket Disconnected:', event.code, event.reason);
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }

      setState(prev => ({ ...prev, isConnected: false }));

      // Auto-reconnect after 3 seconds
      setTimeout(connect, 3000);
    };

    ws.onerror = (error) => {
      console.error('AI Chat WebSocket Error:', error);
      setState(prev => ({ ...prev, error: 'WebSocket connection error' }));
    };

    socketRef.current = ws;
    globalSocket = ws;
  }, [token, startHeartbeat]);

  useEffect(() => {
    connect();

    // وقتی token تغییر کرد → reconnect با توکن جدید
    if (globalSocket && token) {
      globalSocket.close();
      setTimeout(connect, 500);
    }

    return () => {
      if (globalSocket) {
        globalSocket.close(1000, 'Closing connection');
      }
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
    };
  }, [token, connect]);

  const sendMessage = (content: string) => {
    if (globalSocket?.readyState === WebSocket.OPEN) {
      globalSocket.send(JSON.stringify({
        type: 'message',
        content,
        token: token || 'guest'
      }));
    } else {
      console.error('Cannot send message: WebSocket is not connected');
    }
  };

  return {
    ...state,
    sendMessage
  };
};