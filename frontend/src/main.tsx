import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { registerServiceWorker } from './utils/serviceWorker'
import './config/i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

// Register service worker for offline capabilities and caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerServiceWorker()
  })
}
