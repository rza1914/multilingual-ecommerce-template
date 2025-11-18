import { useEffect, useRef, useState, useCallback } from 'react';

interface Message {
  text: string;
  from: 'user' | 'ai';
  timestamp: number;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOffline, setIsOffline] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  
  // FIX: Changed key from 'token' to 'auth_token' to match localStorage
  const getToken = () => localStorage.getItem('auth_token');

  const connect = useCallback(() => {
    const token = getToken();
    
    if (!token) {
      console.log('No auth_token available, skipping WebSocket connection');
      setIsOffline(true);
      setConnectionStatus('disconnected');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.CONNECTING || wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Connection already in progress or open.');
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    setConnectionStatus('connecting');
    setIsOffline(true);

    const wsUrl = `ws://localhost:8000/ws/chat/1?token=${token}&client_id=client_${Date.now()}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected successfully');
      setConnectionStatus('connected');
      setIsOffline(false);
      reconnectAttempts.current = 0;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chat_message') {
          setMessages(prev => [...prev, { 
            text: data.message || data.content, // Handle both 'message' and 'content' keys
            from: 'ai', 
            timestamp: Date.now() 
          }]);
        } else if (data.type === 'error') {
          console.error('AI Error from WS:', data.message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
      setConnectionStatus('disconnected');
      setIsOffline(true);
      wsRef.current = null;
      
      if (event.code !== 1000 && reconnectAttempts.current < 5) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current++;
        
        console.log(`Attempting to reconnect (${reconnectAttempts.current}/5) in ${delay / 1000} seconds...`);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      } else if (reconnectAttempts.current >= 5) {
        console.error('Max reconnection attempts reached. Stopping.');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
      setIsOffline(true);
    };
  }, []);

  // FIX: Defined the sendMessage function that was missing
  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const messageData = {
        type: 'chat_message',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      wsRef.current.send(JSON.stringify(messageData));
      
      setMessages(prev => [...prev, { 
        text: message, 
        from: 'user', 
        timestamp: Date.now() 
      }]);
    } else {
      console.error('Cannot send message, WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
      }
    };
  }, [connect]);

  return { 
    messages, 
    sendMessage, // FIX: Now correctly defined and exported
    isOffline, 
    connectionStatus,
    reconnect: connect
  };
};