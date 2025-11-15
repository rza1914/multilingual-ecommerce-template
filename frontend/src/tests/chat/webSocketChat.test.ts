import { connectChat, sendChatMessage, closeChat, isChatConnected } from '../../services/chatService';

// Mock WebSocket
class MockWebSocket {
  static instances: MockWebSocket[] = [];
  readyState: number;
  onopen: ((this: WebSocket, ev: Event) => any) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent<any>) => any) | null = null;
  onerror: ((this: WebSocket, ev: Event) => any) | null = null;
  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
  send: jest.Mock = jest.fn();
  close: jest.Mock = jest.fn();

  constructor(public url: string) {
    MockWebSocket.instances.push(this);
    this.readyState = WebSocket.CONNECTING;
  }

  static OPEN = WebSocket.OPEN;
  static CONNECTING = WebSocket.CONNECTING;
  static CLOSING = WebSocket.CLOSING;
  static CLOSED = WebSocket.CLOSED;

  triggerOpen() {
    this.readyState = WebSocket.OPEN;
    if (this.onopen) {
      this.onopen(new Event('open'));
    }
  }

  triggerMessage(data: any) {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
    }
  }

  triggerClose(code: number = 1000, reason: string = '', wasClean: boolean = true) {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason, wasClean }));
    }
  }

  triggerError() {
    if (this.onerror) {
      this.onerror(new Event('error'));
    }
  }
}

// Mock the global WebSocket
Object.defineProperty(window, 'WebSocket', {
  value: MockWebSocket,
  writable: true,
});

// Mock TokenStorage
jest.mock('../../utils/tokenStorage', () => ({
  default: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    migrate: jest.fn(),
    getRefresh: jest.fn(),
    setRefresh: jest.fn(),
    removeRefresh: jest.fn(),
  },
  TokenStorage: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    migrate: jest.fn(),
    getRefresh: jest.fn(),
    setRefresh: jest.fn(),
    removeRefresh: jest.fn(),
  },
  TOKEN_KEYS: {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    ACCESS_TOKEN: 'access_token',
    USER: 'user'
  }
}));

const TokenStorageModule = require('../../utils/tokenStorage');
const TokenStorage = TokenStorageModule.default;

describe('WebSocket Chat Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    MockWebSocket.instances = [];

    // Clear any previous WebSocket state
    (TokenStorage.get as jest.Mock).mockReturnValue('mock-token');
  });

  afterEach(() => {
    // Clean up all WebSocket instances
    MockWebSocket.instances.forEach(ws => {
      if (ws.readyState !== WebSocket.CLOSED) {
        ws.triggerClose();
      }
    });
    closeChat();
  });

  describe('connectChat', () => {
    test('should establish WebSocket connection with correct URL', () => {
      // Arrange
      const mockToken = 'test-token-123';
      const mockUserId = { id: 123 };
      (TokenStorage.get as jest.Mock).mockReturnValue(mockToken);

      // Act
      connectChat(
        mockToken,
        () => {},
        () => {}
      );

      // Assert
      expect(MockWebSocket.instances).toHaveLength(1);
      const ws = MockWebSocket.instances[0];
      expect(ws.url).toContain('/api/v1/chat/123');
      expect(ws.url).not.toContain('?token=');
      expect(ws.url).toContain('ws://'); // Should replace http with ws
    });

    test('should call onMessage callback when receiving message from WebSocket', () => {
      // Arrange
      const mockToken = 'test-token';
      const mockUserId = { id: 123 };
      (TokenStorage.get as jest.Mock).mockReturnValue(mockToken);
      
      const onMessageMock = jest.fn();
      const onErrorMock = jest.fn();

      // Act
      connectChat(mockToken, onMessageMock, onErrorMock);
      
      // Simulate WebSocket opening and receiving a message
      const ws = MockWebSocket.instances[0];
      ws.triggerOpen();

      const mockMessage = {
        type: 'chat_message',
        content: 'Hello from AI',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      ws.triggerMessage(mockMessage);

      // Assert
      expect(onMessageMock).toHaveBeenCalledWith({
        role: 'assistant',
        content: 'Hello from AI',
        timestamp: expect.any(Date)
      });
    });

    test('should call onError callback when receiving error message from WebSocket', () => {
      // Arrange
      const mockToken = 'test-token';
      const mockUserId = { id: 123 };
      (TokenStorage.get as jest.Mock).mockReturnValue(mockToken);
      
      const onMessageMock = jest.fn();
      const onErrorMock = jest.fn();

      // Act
      connectChat(mockToken, onMessageMock, onErrorMock);
      
      // Simulate WebSocket opening and receiving an error message
      const ws = MockWebSocket.instances[0];
      ws.triggerOpen();

      const mockErrorMessage = {
        type: 'error',
        message: 'Test error message'
      };
      ws.triggerMessage(mockErrorMessage);

      // Assert
      expect(onErrorMock).toHaveBeenCalledWith('Test error message');
    });

    test('should call onError callback when WebSocket connection fails', () => {
      // Arrange
      const mockToken = 'test-token';
      (TokenStorage.get as jest.Mock).mockReturnValue(mockToken);
      
      const onMessageMock = jest.fn();
      const onErrorMock = jest.fn();

      // Act
      connectChat(mockToken, onMessageMock, onErrorMock);
      
      // Simulate WebSocket error
      const ws = MockWebSocket.instances[0];
      ws.triggerError();

      // Assert
      expect(onErrorMock).toHaveBeenCalledWith('خطا در اتصال چت');
    });
  });

  describe('sendChatMessage', () => {
    test('should send message via WebSocket when connected', () => {
      // Arrange
      const mockToken = 'test-token';
      (TokenStorage.get as jest.Mock).mockReturnValue(mockToken);

      // Connect first
      connectChat(mockToken, () => {}, () => {});

      // Open the WebSocket connection
      const ws = MockWebSocket.instances[0];
      ws.triggerOpen();

      // Act
      sendChatMessage('Hello, AI!');

      // Assert
      expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ content: 'Hello, AI!' }));
    });

    test('should throw error when WebSocket is not connected', () => {
      // Act & Assert
      expect(() => sendChatMessage('Hello')).toThrow('اتصال چت برقرار نیست');
    });

    test('should throw error when WebSocket is still connecting', () => {
      // Arrange
      const mockToken = 'test-token';
      (TokenStorage.get as jest.Mock).mockReturnValue(mockToken);

      // Connect (but don't trigger open event)
      connectChat(mockToken, () => {}, () => {});

      // Act & Assert
      expect(() => sendChatMessage('Hello')).toThrow('WebSocket is still connecting, please wait');
    });
  });

  describe('closeChat', () => {
    test('should close WebSocket connection if open', () => {
      // Arrange
      const mockToken = 'test-token';
      (TokenStorage.get as jest.Mock).mockReturnValue(mockToken);

      // Connect and open
      connectChat(mockToken, () => {}, () => {});
      const ws = MockWebSocket.instances[0];
      ws.triggerOpen();

      // Act
      closeChat();

      // Assert
      expect(ws.close).toHaveBeenCalledWith(1000, 'Closing chat connection');
    });

    test('should not error when closing without active connection', () => {
      // Act & Assert (should not throw)
      expect(() => closeChat()).not.toThrow();
    });
  });

  describe('isChatConnected', () => {
    test('should return true when WebSocket is connected', () => {
      // Arrange
      const mockToken = 'test-token';
      (TokenStorage.get as jest.Mock).mockReturnValue(mockToken);

      connectChat(mockToken, () => {}, () => {});

      const ws = MockWebSocket.instances[0];
      ws.triggerOpen();

      // Act & Assert
      expect(isChatConnected()).toBe(true);
    });

    test('should return false when WebSocket is not connected', () => {
      // Arrange - No WebSocket connection established

      // Act & Assert
      expect(isChatConnected()).toBe(false);
    });

    test('should return false when WebSocket connection is closed', () => {
      // Arrange
      const mockToken = 'test-token';
      (TokenStorage.get as jest.Mock).mockReturnValue(mockToken);

      connectChat(mockToken, () => {}, () => {});

      const ws = MockWebSocket.instances[0];
      ws.triggerOpen(); // Open first
      expect(isChatConnected()).toBe(true); // Should be connected

      ws.triggerClose(); // Then close

      // Act & Assert
      expect(isChatConnected()).toBe(false);
    });
  });

  describe('Reconnection Logic', () => {
    test('should attempt to reconnect on unclean close', () => {
      // Arrange
      jest.useFakeTimers();
      const mockToken = 'test-token';
      (TokenStorage.get as jest.Mock).mockReturnValue(mockToken);

      const onMessageMock = jest.fn();
      const onErrorMock = jest.fn();
      connectChat(mockToken, onMessageMock, onErrorMock);

      const ws1 = MockWebSocket.instances[0];
      ws1.triggerOpen();

      // Act: Close with unclean disconnect (not wasClean)
      ws1.triggerClose(1006, '', false);

      // Fast-forward time to trigger reconnection attempt
      jest.advanceTimersByTime(2000);

      // Assert: New WebSocket instance should be created
      expect(MockWebSocket.instances).toHaveLength(2);
      jest.useRealTimers();
    });

    test('should not attempt reconnection on clean close', () => {
      // Arrange
      jest.useFakeTimers();
      const mockToken = 'test-token';
      (TokenStorage.get as jest.Mock).mockReturnValue(mockToken);

      const onMessageMock = jest.fn();
      const onErrorMock = jest.fn();
      connectChat(mockToken, onMessageMock, onErrorMock);

      const ws1 = MockWebSocket.instances[0];
      ws1.triggerOpen();

      // Act: Close with clean disconnect (wasClean = true)
      ws1.triggerClose(1000, '', true);

      // Fast-forward time
      jest.advanceTimersByTime(10000);

      // Assert: No new WebSocket instance should be created
      expect(MockWebSocket.instances).toHaveLength(1);
      jest.useRealTimers();
    });
  });
});