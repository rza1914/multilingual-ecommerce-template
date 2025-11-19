import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import FixedFloatingChatBot from './FixedFloatingChatBot';

// Mock AuthContext for unauthenticated user
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock useChatWidget hook
vi.mock('../hooks/useChatWidget', () => ({
  useChatWidget: () => ({
    // State
    isOpen: false,
    showAIActions: false,
    position: { bottom: '70px', right: '1.5rem' },
    isWidgetOffline: false,

    // Setters
    setIsOpen: vi.fn(),
    setShowAIActions: vi.fn(),
    setPosition: vi.fn(),

    // Methods
    handleSendMessage: vi.fn(),
    handleAIAction: vi.fn(),

    // Chat state from useChat hook
    messages: [],
    isConnected: true,
    isTyping: false,
    unreadCount: 0,
    error: null,
    sendMessage: vi.fn(),
    markAllAsRead: vi.fn(),

    // Refs
    chatContainerRef: { current: null },
  })
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));

// Mock DOMRect for getBoundingClientRect
class MockDOMRect {
  constructor(public x: number, public y: number, public width: number, public height: number) {}
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

describe('FixedFloatingChatBot Integration Tests - Unauthenticated User', () => {
  beforeEach(() => {
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
    // Clean up DOM elements
    document.querySelectorAll('header, .header, nav').forEach(el => el.remove());
  });

  it('renders with lock icon when user is not authenticated', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <FixedFloatingChatBot />
        </ThemeProvider>
      </MemoryRouter>
    );
    const chatButton = screen.getByRole('button', { name: /chat\.loginRequired/i });
    expect(chatButton).toBeInTheDocument();
  });
});