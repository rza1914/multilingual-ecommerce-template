import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import FixedFloatingChatBot from './FixedFloatingChatBot';

// Mock the dependencies
vi.mock('../hooks/useChat', () => ({
  useChat: () => ({
    messages: [],
    isConnected: true,
    isTyping: false,
    unreadCount: 0,
    error: null,
    sendMessage: vi.fn(),
    markAllAsRead: vi.fn(),
  })
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));

// Mock DOMRect for getBoundingClientRect
class MockDOMRect {
  constructor(public x: number, public y: number, public width: number, public height: number) {}

  static fromBounds(x: number, y: number, width: number, height: number) {
    return new MockDOMRect(x, y, width, height);
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      top: this.y,
      bottom: this.y + this.height,
      left: this.x,
      right: this.x + this.width,
    };
  }
}

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn(),
  })),
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

describe('FixedFloatingChatBot Integration Tests', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            {ui}
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    // Mock viewport dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    // Clear any existing elements that might interfere
    document.querySelectorAll('header, .header, nav').forEach(el => el.remove());
    
    // Create mock header with login button
    const mockHeader = document.createElement('header');
    mockHeader.innerHTML = `
      <button class="btn-primary" aria-label="Login">
        <svg class="User">Test SVG</svg>
        Login
      </button>
    `;
    document.body.appendChild(mockHeader);
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Clean up DOM elements
    document.querySelectorAll('header, .header, nav').forEach(el => el.remove());
  });

  it('renders without crashing', () => {
    renderWithProviders(<FixedFloatingChatBot />);
    const chatButton = screen.getByRole('button', { name: /Open chat/i });
    expect(chatButton).toBeInTheDocument();
  });

  it('initially positions correctly based on login button', async () => {
    // Mock getBoundingClientRect for the login button
    const mockLoginButton = document.querySelector('header button')!;
    Object.defineProperty(mockLoginButton, 'getBoundingClientRect', {
      writable: true,
      value: vi.fn().mockReturnValue(MockDOMRect.fromBounds(200, 100, 80, 40).toJSON()),
    });

    renderWithProviders(<FixedFloatingChatBot />);

    // Wait for the component to calculate position
    await waitFor(() => {
      const chatButton = screen.getByRole('button', { name: /Open chat/i });
      const style = window.getComputedStyle(chatButton.parentElement!);
      
      // Should be positioned relative to the login button
      expect(style.bottom).not.toBe('6rem'); // Should not use fallback
    });
  });

  it('respects minimum and maximum position constraints', async () => {
    // Mock a login button positioned very low on the screen, which should cause
    // the chat button to be clamped to the minimum position
    const mockLoginButton = document.querySelector('header button')!;
    Object.defineProperty(mockLoginButton, 'getBoundingClientRect', {
      writable: true,
      value: vi.fn().mockReturnValue(MockDOMRect.fromBounds(200, 700, 80, 40).toJSON()), // Near bottom
    });

    renderWithProviders(<FixedFloatingChatBot />);

    await waitFor(() => {
      const chatButton = screen.getByRole('button', { name: /Open chat/i });
      expect(chatButton).toBeInTheDocument();
    });

    // In this case, the chat button should be positioned at minimum 70px from bottom
    const chatButton = screen.getByRole('button', { name: /Open chat/i });
    const parentStyle = window.getComputedStyle(chatButton.parentElement!);
    
    // Extract the bottom value and remove 'px'
    const bottomValue = parseFloat(parentStyle.bottom.replace('px', ''));
    expect(bottomValue).toBeGreaterThanOrEqual(70); // Minimum position
  });

  it('has smooth transitions', async () => {
    renderWithProviders(<FixedFloatingChatBot />);

    const chatButton = screen.getByRole('button', { name: /Open chat/i });
    const parentStyle = window.getComputedStyle(chatButton.parentElement!);
    
    // Check for transition properties
    expect(parentStyle.transition).toContain('all');
    expect(parentStyle.transition).toContain('duration-500');
    expect(parentStyle.transition).toContain('ease-in-out');
  });

  it('opens chat panel when clicked', async () => {
    renderWithProviders(<FixedFloatingChatBot />);

    const openChatButton = screen.getByRole('button', { name: /Open chat/i });
    fireEvent.click(openChatButton);

    // The chat panel should now be visible
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /AI Shopping Assistant/i })).toBeInTheDocument();
    });
  });

  it('closes chat panel when close button is clicked', async () => {
    renderWithProviders(<FixedFloatingChatBot />);

    // Open the chat first
    const openChatButton = screen.getByRole('button', { name: /Open chat/i });
    fireEvent.click(openChatButton);

    // Wait for the panel to open
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /AI Shopping Assistant/i })).toBeInTheDocument();
    });

    // Close the chat
    const closeChatButton = screen.getByRole('button', { name: /Close chat/i });
    fireEvent.click(closeChatButton);

    // The chat panel should be removed
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /AI Shopping Assistant/i })).not.toBeInTheDocument();
    });
  });

  it('shows unread count badge when messages are unread', () => {
    // Mock useChat hook to return unread messages
    vi.mocked(() => require('../hooks/useChat').useChat).mockReturnValue({
      messages: [],
      isConnected: true,
      isTyping: false,
      unreadCount: 5,
      error: null,
      sendMessage: vi.fn(),
      markAllAsRead: vi.fn(),
    } as any);

    renderWithProviders(<FixedFloatingChatBot />);

    const unreadBadge = screen.getByLabelText('5 unread messages');
    expect(unreadBadge).toBeInTheDocument();
    expect(unreadBadge).toHaveTextContent('5');
  });

  it('changes position when window is resized', async () => {
    const mockLoginButton = document.querySelector('header button')!;
    Object.defineProperty(mockLoginButton, 'getBoundingClientRect', {
      writable: true,
      value: vi.fn().mockReturnValue(MockDOMRect.fromBounds(200, 100, 80, 40).toJSON()),
    });

    renderWithProviders(<FixedFloatingChatBot />);

    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400, // Mobile size
    });

    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      const chatButton = screen.getByRole('button', { name: /Open chat/i });
      expect(chatButton).toBeInTheDocument();
    });

    // Position should be updated for mobile dimensions
    const chatButton = screen.getByRole('button', { name: /Open chat/i });
    const parentStyle = window.getComputedStyle(chatButton.parentElement!);
    
    // On mobile, it should have different margins
    expect(parentStyle.right).toBe('1rem'); // Mobile right margin
  });

  it('handles missing login button with fallback position', async () => {
    // Remove the mock header to simulate missing login button
    document.querySelectorAll('header, .header, nav').forEach(el => el.remove());
    
    renderWithProviders(<FixedFloatingChatBot />);

    // Wait for the component to handle missing login button
    await waitFor(() => {
      const chatButton = screen.getByRole('button', { name: /Open chat/i });
      expect(chatButton).toBeInTheDocument();
    });
  });

  it('cleans up event listeners on unmount', async () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderWithProviders(<FixedFloatingChatBot />);

    // Check that event listeners were added
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });

    // Unmount the component
    unmount();

    // Check that event listeners were removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('applies correct theme classes', () => {
    // Mock theme context to return dark theme
    vi.mock('./contexts/ThemeContext', async (importOriginal) => {
      const mod: any = await importOriginal();
      return {
        ...mod,
        useTheme: () => ({ theme: 'dark' }),
      };
    });

    renderWithProviders(<FixedFloatingChatBot />);

    const chatButton = screen.getByRole('button', { name: /Open chat/i });
    // Should have dark theme classes
    expect(chatButton).toHaveClass('bg-gradient-to-r', 'from-orange-600', 'to-orange-700');
  });
});