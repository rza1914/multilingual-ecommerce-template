// frontend/src/services/inventory-websocket-service.ts (Mock implementation without WebSocket)

// Service to handle inventory functionality (without WebSocket)
export class InventoryWebSocketService {
  private static instance: InventoryWebSocketService;

  private constructor() {}

  public static getInstance(): InventoryWebSocketService {
    if (!InventoryWebSocketService.instance) {
      InventoryWebSocketService.instance = new InventoryWebSocketService();
    }
    return InventoryWebSocketService.instance;
  }

  // Initialize the service (no-op in mock implementation)
  public initialize() {
    // No initialization needed in mock implementation
  }

  // Get current connection state (mock implementation)
  public getConnectionState(token: string | null) {
    // Return mock connection state
    return {
      isConnected: true,
      isConnecting: false,
      isReconnecting: false,
      lastUpdate: new Date().toISOString(),
      error: null,
      inventoryUpdates: [],
      connect: () => {},
      disconnect: () => {},
      sendHeartbeat: () => {}
    };
  }

  // Broadcast inventory update (mock implementation)
  public async broadcastInventoryUpdate(
    token: string,
    product_id: number,
    new_stock: number,
    change_type: string,
    product_name: string
  ): Promise<any> {
    // In the mock implementation, we just simulate the API call
    console.log(`Mock broadcast inventory update for product ${product_id}: ${change_type}, new stock: ${new_stock}`);

    // Return a mock response
    return {
      success: true,
      message: `Mock inventory update broadcast for product ${product_id}`,
      connections_affected: 0
    };
  }
}

// Create a singleton instance
export const inventoryWebSocketService = InventoryWebSocketService.getInstance();