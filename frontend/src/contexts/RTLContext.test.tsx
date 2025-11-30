import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RTLProvider, useRTL } from './RTLContext';
import { BrowserRouter } from 'react-router-dom';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      on: vi.fn(),
      changeLanguage: vi.fn(),
    }
  })
}));

// Mock the i18n object
const mockI18n = {
  language: 'en',
  on: vi.fn(),
  changeLanguage: vi.fn(),
};

// Component to test the hook
const TestComponent = () => {
  const { isRTL, direction, toggleRTL } = useRTL();
  
  return (
    <div>
      <div data-testid="direction">{direction}</div>
      <div data-testid="isRTL">{isRTL ? 'true' : 'false'}</div>
      <button data-testid="toggle-btn" onClick={toggleRTL}>Toggle RTL</button>
    </div>
  );
};

// Wrapper component
const renderWithProviders = (language = 'en') => {
  mockI18n.language = language;
  
  return render(
    <BrowserRouter>
      <RTLProvider>
        <TestComponent />
      </RTLProvider>
    </BrowserRouter>
  );
};

describe('RTLContext', () => {
  beforeEach(() => {
    // Reset document direction before each test
    document.documentElement.dir = 'ltr';
    document.body.className = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should provide correct initial values for LTR language', () => {
    renderWithProviders('en');
    
    expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
    expect(screen.getByTestId('isRTL')).toHaveTextContent('false');
  });

  it('should provide correct initial values for RTL language', () => {
    renderWithProviders('fa'); // Persian as RTL example
    
    expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
    expect(screen.getByTestId('isRTL')).toHaveTextContent('true');
  });

  it('should toggle RTL correctly', () => {
    renderWithProviders('en');
    
    expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
    expect(screen.getByTestId('isRTL')).toHaveTextContent('false');
    
    // Toggle RTL
    screen.getByTestId('toggle-btn').click();
    
    expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
    expect(screen.getByTestId('isRTL')).toHaveTextContent('true');
    
    // Toggle back to LTR
    screen.getByTestId('toggle-btn').click();
    
    expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
    expect(screen.getByTestId('isRTL')).toHaveTextContent('false');
  });

  it('should update document direction when language changes', () => {
    renderWithProviders('en');
    
    // Initially LTR
    expect(document.documentElement.dir).toBe('ltr');
    
    // Simulate language change to RTL
    const event = new CustomEvent('languageChanged', { detail: 'fa' });
    document.dispatchEvent(event);
    
    expect(document.documentElement.dir).toBe('rtl');
    
    // Simulate language change back to LTR
    const event2 = new CustomEvent('languageChanged', { detail: 'en' });
    document.dispatchEvent(event2);
    
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('should add/remove RTL class to body correctly', () => {
    renderWithProviders('fa'); // Start with RTL
    
    expect(document.body.classList.contains('rtl')).toBe(true);
    
    // Toggle to LTR
    screen.getByTestId('toggle-btn').click();
    
    expect(document.body.classList.contains('rtl')).toBe(false);
    
    // Toggle back to RTL
    screen.getByTestId('toggle-btn').click();
    
    expect(document.body.classList.contains('rtl')).toBe(true);
  });

  it('should throw error when useRTL is used outside of RTLProvider', () => {
    const TestWithoutProvider = () => {
      useRTL(); // This should throw an error
      return <div>Test</div>;
    };

    expect(() => {
      render(
        <BrowserRouter>
          <TestWithoutProvider />
        </BrowserRouter>
      );
    }).toThrow('useRTL must be used within an RTLProvider');
  });
});