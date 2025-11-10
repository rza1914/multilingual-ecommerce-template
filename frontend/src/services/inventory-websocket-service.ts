// frontend/src/services/inventory-websocket-service.ts
import { useInventoryWebSocket } from '../hooks/useInventoryWebSocket';

// Service to handle inventory WebSocket functionality
export class InventoryWebSocketService {
  private static instance: InventoryWebSocketService;
  private connectFn: typeof useInventoryWebSocket | null = null;

  private constructor() {}

  public static getInstance(): InventoryWebSocketService {
    if (!InventoryWebSocketService.instance) {
      InventoryWebSocketService.instance = new InventoryWebSocketService();
    }
    return InventoryWebSocketService.instance;
  }

  // Initialize the service with the hook function
  public initialize(connectFn: typeof useInventoryWebSocket) {
    this.connectFn = connectFn;
  }

  // Get current connection state
  public getConnectionState(token: string | null) {
    if (!this.connectFn) {
      throw new Error('InventoryWebSocketService not initialized');
    }
    return this.connectFn(token);
  }

  // Broadcast inventory update (server-side only, but can be called from here)
  public async broadcastInventoryUpdate(
    token: string,
    product_id: number,
    new_stock: number,
    change_type: string,
    product_name: string
  ): Promise<any> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/ws/broadcast-inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id,
        new_stock,
        change_type,
        product_name,
      }),
    });

    return response.json();
  }
}

// Create a singleton instance
export const inventoryWebSocketService = InventoryWebSocketService.getInstance();