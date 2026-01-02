import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMonitoring } from './useMonitoring';
import { AIAction } from '../types/chat.types';
import { useAIChatWebSocket } from './useAIChatWebSocket'; // Import the new WebSocket hook

// Define screen size breakpoints
const SCREEN_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
};

export interface UseChatWidgetProps {
  // Optional props for customization
  positionStyle?: 'fixed' | 'floating'; // 'fixed' = fixed position, 'floating' = dynamic based on login button
}

export interface UseChatWidgetReturn {
  // State
  isOpen: boolean;
  showAIActions: boolean;
  position: { bottom: string; right: string };
  isWidgetOffline: boolean;

  // Methods
  setIsOpen: (isOpen: boolean) => void;
  setShowAIActions: (show: boolean) => void;
  setPosition: (pos: { bottom: string; right: string }) => void;
  handleSendMessage: (text: string) => void;
  handleAIAction: (action: AIAction) => void;

  // Chat state from useChat hook
  messages: any[];
  isConnected: boolean;
  isTyping: boolean;
  unreadCount: number;
  error: any;
  chatIsOffline: boolean; // from useChat
  sendMessage: (text: string) => void;
  markAllAsRead: () => void;

  // Refs
  chatContainerRef: React.RefObject<HTMLDivElement>;
}

export const useChatWidget = (props: UseChatWidgetProps = {}): UseChatWidgetReturn => {
  const { user } = useAuth();
  const { logError, logInfo } = useMonitoring();
  const positionStyle = props.positionStyle || 'fixed';

  const [isOpen, setIsOpen] = useState(false);
  const [showAIActions, setShowAIActions] = useState(false);
  const [position, setPosition] = useState({ bottom: '70px', right: '1.5rem' });
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const hasInitialized = useRef(false); // To prevent multiple initializations

  // Use the new AI Chat WebSocket hook
  const { messages, isConnected, sendMessage: sendAIChatMessage, error: aiChatError } = useAIChatWebSocket();

  // Additional state for the chat widget functionality
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<any>(null);
  const chatIsOffline = !isConnected; // Derive from WebSocket connection state

  // Handle sending a message using the new AI chat hook
  const handleSendMessage = useCallback((text: string) => {
    sendAIChatMessage(text);
  }, [sendAIChatMessage]);

  // Function to mark all messages as read
  const markAllAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  }, [isOpen, unreadCount, markAllAsRead]);

  // Handle AI action
  const handleAIAction = useCallback((action: AIAction) => {
    setShowAIActions(false);

    // Add the AI message directly without waiting for WebSocket
    setTimeout(() => {
      // For this example, just add directly to state
      // In the real useChat hook, this would be handled by the WebSocket response
    }, 100);

    // Update unread count if chat is closed
    if (!isOpen) {
      // Update in the hook
    }
  }, [isOpen]);

  // Find login button in the DOM (for floating position style)
  const findLoginButtonPosition = useCallback((): HTMLElement | null => {
    if (positionStyle !== 'floating') {
      return null; // Only find login button if using floating positioning
    }

    // Try various selectors to find the login button
    const selectorOptions = [
      'header button:has(svg[class*="User"])',  // SVG with User class
      'header button:has(svg[class*="LogOut"])',  // SVG with LogOut class
      'header .btn-primary',  // Primary button in header
      'header [aria-label*="login" i], header [aria-label*="auth" i]',  // ARIA labels
      '.header button',  // General header buttons
      'nav button',  // In navigation
      '[data-testid="login-button"]',  // Test ID (if available)
      '[data-testid="auth-button"]',  // Auth button test ID
      'button.login',  // Login class
      'button.auth'  // Auth class
    ];

    // Try to find login button using different selectors
    for (const selector of selectorOptions) {
      try {
        const button = document.querySelector<HTMLElement>(selector);
        if (button) {
          // Additional verification that this is an actual login button
          const textContent = button.textContent?.toLowerCase() || '';
          const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';

          if (
            textContent.includes('login') ||
            textContent.includes('ورود') ||
            textContent.includes('sign') ||
            ariaLabel.includes('login') ||
            ariaLabel.includes('auth') ||
            button.classList.contains('login') ||
            button.classList.contains('auth') ||
            button.classList.contains('btn-primary')
          ) {
            return button;
          }
        }
      } catch (e) {
        // Ignore selector errors and try the next option
        continue;
      }
    }

    // If individual selectors don't work, try manual iteration
    const allButtons = document.querySelectorAll<HTMLElement>('header button, .header button, nav button');
    for (const button of allButtons) {
      // Check for login-related text or common login button patterns
      const textContent = button.textContent?.toLowerCase() || '';
      const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';

      if (
        textContent.includes('login') ||
        textContent.includes('ورود') ||
        textContent.includes('sign') ||
        ariaLabel.includes('login') ||
        ariaLabel.includes('auth') ||
        button.classList.contains('login') ||
        button.classList.contains('auth') ||
        button.classList.contains('btn-primary')
      ) {
        // Additional check: if it's in the header and looks like an auth button
        const header = document.querySelector('header');
        if (header && header.contains(button)) {
          // Check if it's one of the auth-related buttons
          if (button.querySelector('svg[class*="User"]') ||
              button.querySelector('svg[class*="LogOut"]') ||
              button.classList.contains('btn-primary')) {
            return button;
          }
        }
      }
    }

    return null; // Login button not found
  }, [positionStyle]);

  // Validation function to ensure calculatedBottom is a valid number
  const validatePosition = (calculatedBottom: number) => {
    if (typeof calculatedBottom !== 'number' || isNaN(calculatedBottom)) {
      console.error('calculatedBottom must be a valid number');
      return 70; // Default value
    }
    return calculatedBottom;
  };

  // Calculate the chat button position - FIXED at exactly 70px from bottom for fixed style
  const calculateFixedChatButtonPosition = useCallback((): { bottom: string, right: string } => {
    // Fixed position at exactly 70px from bottom
    const calculatedBottom = 70;
    const viewportWidth = window.innerWidth;

    // Set appropriate right position based on screen size
    let rightPosition = '1.5rem'; // Default
    if (viewportWidth < SCREEN_BREAKPOINTS.MOBILE) {
      rightPosition = '1rem'; // Less right margin on mobile
    } else if (viewportWidth < SCREEN_BREAKPOINTS.TABLET) {
      rightPosition = '1.25rem'; // Medium right margin on tablet
    }

    logInfo('Fixed AI chat button position', {
      bottom: calculatedBottom,
      right: rightPosition,
      viewportWidth,
      userId: user?.id
    });

    // Validate the calculatedBottom value
    validatePosition(calculatedBottom);

    // Return fixed position - no dependency on login button
    if (viewportWidth < SCREEN_BREAKPOINTS.MOBILE) {
      return {
        bottom: `calc(70px + env(safe-area-inset-bottom, 0px))`,
        right: rightPosition
      }; // Mobile with safe area support
    } else if (viewportWidth < SCREEN_BREAKPOINTS.TABLET) {
      return {
        bottom: `calc(70px + env(safe-area-inset-bottom, 0px))`,
        right: rightPosition
      }; // Tablet with safe area support
    } else {
      return {
        bottom: `calc(70px + env(safe-area-inset-bottom, 0px))`,
        right: rightPosition
      }; // Desktop with safe area support
    }
  }, [user?.id, logInfo]);

  // Calculate the chat button position based on the login button position (for floating style)
  const calculateFloatingChatButtonPosition = useCallback((): { bottom: string, right: string } => {
    const loginButton = findLoginButtonPosition();

    if (loginButton) {
      const rect = loginButton.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate position 20px below the login button
      let calculatedBottom = viewportHeight - rect.bottom + 20; // 20px below the login button

      // Apply constraints based on screen size
      if (viewportWidth < SCREEN_BREAKPOINTS.MOBILE) {
        // On mobile, use smaller margins
        calculatedBottom = Math.max(60, calculatedBottom); // Minimum 60px on mobile
        calculatedBottom = Math.min(viewportHeight - 80, calculatedBottom); // Maximum leaving space at bottom
      } else if (viewportWidth < SCREEN_BREAKPOINTS.TABLET) {
        // On tablet
        calculatedBottom = Math.max(70, calculatedBottom); // Minimum 70px on tablet
        calculatedBottom = Math.min(viewportHeight - 90, calculatedBottom);
      } else {
        // On desktop
        calculatedBottom = Math.max(70, calculatedBottom); // Minimum 70px on desktop
        calculatedBottom = Math.min(viewportHeight - 100, calculatedBottom); // Maximum leaving space at bottom
      }

      // Set appropriate right position based on screen size
      let rightPosition = '1.5rem'; // Default
      if (viewportWidth < SCREEN_BREAKPOINTS.MOBILE) {
        rightPosition = '1rem'; // Less right margin on mobile
      } else if (viewportWidth < SCREEN_BREAKPOINTS.TABLET) {
        rightPosition = '1.25rem'; // Medium right margin on tablet
      }

      logInfo('Calculated floating chat button position', {
        bottom: calculatedBottom,
        right: rightPosition,
        viewportWidth,
        viewportHeight,
        loginButtonRect: rect
      });

      return {
        bottom: `${calculatedBottom}px`,
        right: rightPosition
      };
    } else {
      // Fallback positioning with responsive values
      const viewportWidth = window.innerWidth;
      logInfo('Using fallback chat button position', {
        viewportWidth,
        userId: user?.id
      });

      if (viewportWidth < SCREEN_BREAKPOINTS.MOBILE) {
        return { bottom: '4rem', right: '1rem' }; // Mobile fallback
      } else if (viewportWidth < SCREEN_BREAKPOINTS.TABLET) {
        return { bottom: '5rem', right: '1.25rem' }; // Tablet fallback
      } else {
        return { bottom: '6rem', right: '1.5rem' }; // Desktop fallback
      }
    }
  }, [user?.id, logInfo, findLoginButtonPosition]);

  // Calculate position based on style
  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    let mounted = true;

    const updatePosition = () => {
      if (!mounted) return;

      const newPosition = positionStyle === 'floating'
        ? calculateFloatingChatButtonPosition()
        : calculateFixedChatButtonPosition();
      setPosition(newPosition);
    };

    // Initial calculation
    updatePosition();

    // Set up event listeners for position changes
    const handleResize = () => {
      updatePosition();
    };

    const handleScroll = () => {
      // Use requestAnimationFrame to batch scroll updates for performance
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Use ResizeObserver to watch for changes in the login button's size/position
    // This ensures we update position when the header changes
    if (positionStyle === 'floating' && typeof ResizeObserver !== 'undefined') {
      const loginButton = findLoginButtonPosition();
      if (loginButton) {
        resizeObserverRef.current = new ResizeObserver(() => {
          updatePosition();
        });
        resizeObserverRef.current.observe(loginButton);
      }
    }

    // Poll for login button in case it's loaded asynchronously (with performance improvement)
    let pollInterval: number | undefined;

    // Only start polling if using floating position and we haven't found the login button yet
    if (positionStyle === 'floating' && !findLoginButtonPosition()) {
      pollInterval = window.setInterval(() => {
        const currentLoginButton = findLoginButtonPosition();
        if (currentLoginButton) {
          updatePosition();
          // Stop polling once we find the login button
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = undefined;
          }
        }
      }, 1000); // Reduced polling frequency for performance
    }

    // Cleanup function
    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(pollInterval);

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [positionStyle, calculateFixedChatButtonPosition, calculateFloatingChatButtonPosition, findLoginButtonPosition]); // Empty dependency array since we're using the hasInitialized ref

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle error from AI chat webSocket
  useEffect(() => {
    if (aiChatError) {
      setError(aiChatError);
      logError(`AI Chat WebSocket error: ${aiChatError}`, { userId: user?.id });
    }
  }, [aiChatError, user?.id, logError]);

  // Show error if connection fails
  useEffect(() => {
    if (error) {
      console.error('Chat error:', error);
      logError(`Chat connection error: ${error}`, { userId: user?.id });
    }
  }, [error, user?.id, logError]);

  // Log isOffline state changes
  useEffect(() => {
    logInfo('ChatWidget isOffline state changed', { isWidgetOffline: chatIsOffline, userId: user?.id });
  }, [chatIsOffline, user?.id, logInfo]);

  return {
    // State from this hook
    isOpen,
    showAIActions,
    position,
    isWidgetOffline: chatIsOffline,

    // Setters
    setIsOpen,
    setShowAIActions,
    setPosition,

    // Methods
    handleSendMessage,
    handleAIAction,

    // Chat state from useAIChatWebSocket hook
    messages,
    isConnected,
    isTyping,
    unreadCount,
    error,
    chatIsOffline,
    sendMessage: handleSendMessage, // Use the same function
    markAllAsRead,

    // Refs
    chatContainerRef,
  };
};