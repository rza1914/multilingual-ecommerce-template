// frontend/src/hooks/useInventoryWebSocket.ts (Mock implementation without WebSocket)
import { useState, useEffect, useCallback } from 'react';

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
    isConnected: true, // Always connected in mock implementation
    isConnecting: false,
    isReconnecting: false,
    lastUpdate: null,
    error: null
  });

  const [inventoryUpdates, setInventoryUpdates] = useState<InventoryUpdate[]>([]);

  // Mock function to simulate connecting
  const connect = useCallback(() => {
    if (!token) {
      setState(prev => ({
        ...prev,
        error: 'Authentication token required'
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isConnected: true,
      isConnecting: false,
      isReconnecting: false,
      lastUpdate: new Date().toISOString(),
      error: null
    }));
  }, [token]);

  // Mock function to simulate disconnecting
  const disconnect = useCallback(() => {
    setState(prev => ({
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
      lastUpdate: prev.lastUpdate,
      error: null
    }));
  }, []);

  // Mock function to simulate sending heartbeat
  const sendHeartbeat = useCallback(() => {
    // In mock implementation, just log that heartbeat was sent
    console.log('Mock heartbeat sent');
  }, []);

  // Effect to handle connection lifecycle
  useEffect(() => {
    if (token) {
      connect();
    } else {
      disconnect();
    }
  }, [token, connect, disconnect]);

  // Simulate periodic inventory updates
  useEffect(() => {
    if (!state.isConnected) return;

    const interval = setInterval(() => {
      // Simulate random inventory updates
      if (Math.random() > 0.7) { // 30% chance of update
        const mockUpdate: InventoryUpdate = {
          productId: Math.floor(Math.random() * 1000),
          productName: `Product ${Math.floor(Math.random() * 100)}`,
          newStock: Math.floor(Math.random() * 50),
          changeType: ['restock', 'decrease', 'new'][Math.floor(Math.random() * 3)] as 'restock' | 'decrease' | 'new',
          timestamp: new Date().toISOString()
        };

        setInventoryUpdates(prev => [mockUpdate, ...prev.slice(0, 99)]); // Keep last 100 updates
        setState(prev => ({ ...prev, lastUpdate: new Date().toISOString() }));
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [state.isConnected]);

  return {
    ...state,
    inventoryUpdates,
    connect,
    disconnect,
    sendHeartbeat
  };
};