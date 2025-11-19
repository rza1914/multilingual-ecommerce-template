// frontend/src/hooks/useInventoryWebSocket.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface InventoryUpdate {
  productId: number;
  productName: string;
  newStock: number;
  changeType: 'restock' | 'decrease' | 'new';
  timestamp: string;
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  lastUpdate: string | null;
  error: string | null;
}

export const useInventoryWebSocket = (token: string | null) => {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    lastUpdate: null,
    error: null
  });
  
  const [inventoryUpdates, setInventoryUpdates] = useState<InventoryUpdate[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;
  const reconnectInterval = 5000; // 5 seconds
  const heartbeatInterval = 30000; // 30 seconds

  // WebSocket URL construction using environment variables
  const getWebSocketUrl = useCallback(() => {
    const protocol = import.meta.env.VITE_WS_URL?.startsWith('https') ? 'wss:' : 'ws:';
    const baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    const port = import.meta.env.VITE_WS_PORT || '8000';
    const path = import.meta.env.VITE_WS_PATH || '/ws/inventory';

    // Handle both full URL and just domain formats (remove token from URL)
    let wsUrl;
    if (baseUrl.startsWith('ws://') || baseUrl.startsWith('wss://')) {
      wsUrl = `${baseUrl}${path}`;
    } else {
      // Construct URL from protocol, host and port
      const host = baseUrl.replace(/^https?:\/\//, '');
      wsUrl = `${protocol}//${host}${port !== '80' && port !== '443' ? ':' + port : ''}${path}`;
    }

    return wsUrl;
  }, []);

  // Send heartbeat to keep connection alive
  const sendHeartbeat = useCallback(() => {
    if (wsRef.current && state.isConnected) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      } catch (error) {
        console.warn('Failed to send heartbeat:', error);
      }
    }
  }, [state.isConnected]);

  // Clean up connections and intervals
  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!token) {
      setState(prev => ({ 
        ...prev, 
        error: 'Authentication token required' 
      }));
      return;
    }

    if (state.isConnecting || state.isReconnecting) {
      return; // Prevent multiple simultaneous connections
    }

    setState(prev => ({ 
      ...prev, 
      isConnecting: true, 
      error: null,
      isReconnecting: false
    }));

    try {
      const wsUrl = getWebSocketUrl();
      console.log('Connecting to WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({
          isConnected: true,
          isConnecting: false,
          isReconnecting: false,
          lastUpdate: new Date().toISOString(),
          error: null
        }));
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection

        // Send authentication token as first message after connection
        if (token) {
          const authMessage = {
            type: 'authenticate',
            token: token
          };
          ws.send(JSON.stringify(authMessage));
          console.log('🔒 Inventory WebSocket authentication token sent via message');
        }

        // Start heartbeat interval
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        heartbeatIntervalRef.current = setInterval(sendHeartbeat, heartbeatInterval);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'pong') {
            // Heartbeat response - connection is healthy
            return;
          }
          
          if (data.type === 'inventory_update') {
            const update: InventoryUpdate = {
              productId: data.productId,
              productName: data.productName,
              newStock: data.newStock,
              changeType: data.changeType,
              timestamp: data.timestamp
            };
            
            setInventoryUpdates(prev => [update, ...prev.slice(0, 99)]); // Keep last 100 updates
            setState(prev => ({ ...prev, lastUpdate: new Date().toISOString() }));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          isConnecting: false,
          isReconnecting: false
        }));
        
        // Clear heartbeat interval
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
        
        // Attempt to reconnect if not a normal closure (1000) and not exceeding max attempts
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts && token) {
          reconnectAttemptsRef.current += 1;
          setState(prev => ({ 
            ...prev, 
            isReconnecting: true,
            error: `Connection lost. Reconnecting (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`
          }));
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          // Exponential backoff: each attempt waits longer, max 30 seconds
          const delay = Math.min(reconnectInterval * Math.pow(1.5, reconnectAttemptsRef.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (event.code === 1000) {
          // Normal closure
          console.log('WebSocket connection closed normally');
        } else {
          setState(prev => ({ 
            ...prev, 
            error: 'Connection failed. Maximum retry attempts reached.'
          }));
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({ 
          ...prev, 
          error: 'WebSocket connection error occurred',
          isConnecting: false 
        }));
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to establish WebSocket connection',
        isConnecting: false 
      }));
    }
  }, [token, getWebSocketUrl, sendHeartbeat]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Normal closure requested by client'); // 1000 = normal closure
      wsRef.current = null;
    }
    
    setState(prev => ({ 
      isConnected: false, 
      isConnecting: false, 
      isReconnecting: false, 
      lastUpdate: prev.lastUpdate,
      error: null 
    }));
    
    reconnectAttemptsRef.current = 0;
  }, []);

  // Effect to handle connection lifecycle
  useEffect(() => {
    if (token) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [token, connect, disconnect, cleanup]);

  // Effect to handle page visibility for connection management
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && token && !state.isConnected && !state.isConnecting) {
        // Try to reconnect if page becomes visible and we're not connected
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, state.isConnected, state.isConnecting, connect]);

  return {
    ...state,
    inventoryUpdates,
    connect,
    disconnect,
    sendHeartbeat
  };
};