// frontend/src/tests/websocket.test.ts
import { useInventoryWebSocket } from '../hooks/useInventoryWebSocket';

// Mock WebSocket for testing
const mockWebSocket = {
  onopen: jest.fn(),
  onclose: jest.fn(),
  onmessage: jest.fn(),
  onerror: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
};

global.WebSocket = jest.fn(() => mockWebSocket) as any;

describe('useInventoryWebSocket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useInventoryWebSocket('test-token'));
    
    expect(result.current.isConnected).toBe(false);
    expect(result.current.isConnecting).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should attempt to connect when token is provided', () => {
    const { result } = renderHook(() => useInventoryWebSocket('test-token'));
    
    act(() => {
      // Simulate connection
      mockWebSocket.onopen();
    });
    
    expect(result.current.isConnected).toBe(true);
  });

  it('should handle connection errors', () => {
    const { result } = renderHook(() => useInventoryWebSocket('test-token'));
    
    const error = new Error('Connection failed');
    act(() => {
      mockWebSocket.onerror(error);
    });
    
    expect(result.current.error).toBe('Failed to establish WebSocket connection');
  });

  it('should process inventory updates', () => {
    const { result } = renderHook(() => useInventoryWebSocket('test-token'));
    
    const inventoryUpdate = {
      type: 'inventory_update',
      productId: 1,
      productName: 'Test Product',
      newStock: 10,
      changeType: 'restock',
      timestamp: new Date().toISOString(),
    };
    
    act(() => {
      // Simulate receiving a message
      mockWebSocket.onmessage({ data: JSON.stringify(inventoryUpdate) });
    });
    
    expect(result.current.inventoryUpdates).toHaveLength(1);
    expect(result.current.inventoryUpdates[0].productId).toBe(1);
  });
});