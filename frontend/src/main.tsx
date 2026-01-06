import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { registerServiceWorker } from './utils/serviceWorker'
import i18n from './config/i18n'
import { verifyTranslationKeys } from './utils/verifyTranslations'
import './index.css'

// Get root element
const container = document.getElementById('root')!;
let root;

// Show loading state immediately while i18n initializes
const loadingElement = <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">Loading translations...</div>;

// Create root and render loading element first
root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    {loadingElement}
  </React.StrictMode>,
);

console.log('MAIN: Checking i18n initialization status...');
// Check if i18n is already initialized (it should be from config/i18n.ts)
if (i18n.isInitialized) {
  console.log('MAIN: i18n already initialized. Proceeding with app render.');
  // Run verification after initialization
  setTimeout(() => {
    console.log('Running translation verification...');
    verifyTranslationKeys();
  }, 100); // Small delay to ensure resources are fully loaded

  // Render the main app using the SAME root instance
  root.render(
    <React.StrictMode>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </I18nextProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
} else {
  // If not initialized, initialize it then render
  console.log('MAIN: i18n not initialized, calling init()...');
  i18n.init().then(() => {
    console.log('MAIN: i18n.init() resolved successfully. App will now render.');

    // Run verification after initialization
    setTimeout(() => {
      console.log('Running translation verification...');
      verifyTranslationKeys();
    }, 100); // Small delay to ensure resources are fully loaded

    // Re-render the main app using the SAME root instance (no new createRoot call)
    root.render(
      <React.StrictMode>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </I18nextProvider>
        </BrowserRouter>
      </React.StrictMode>,
    );
  }).catch(err => {
    console.error('MAIN: i18n.init() failed with error:', err);
    // Re-use the same root instance
    root.render(
      <React.StrictMode>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-red-500">
            Error loading application translations. Please refresh.
          </div>
        </BrowserRouter>
      </React.StrictMode>
    );
  });
}

// Register service worker for offline capabilities and caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerServiceWorker()
  })
}

export {};
