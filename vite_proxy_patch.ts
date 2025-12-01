// vite_proxy_patch.ts
// Patch for frontend/vite.config.ts to add proxy for development
// This helps avoid CORS issues during development by proxying API requests

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { UserConfig, ConfigEnv } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

// Function to create CSP headers based on environment
function getCSPHeaders(isDev: boolean) {
  if (isDev) {
    // In development, we need more permissive CSP to allow HMR and React DevTools
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https:",
        "font-src 'self' https: data: https://fonts.gstatic.com",
        "connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*",
        "frame-ancestors 'none'",
        "object-src 'none'"
      ].join('; '),
    };
  } else {
    // In production, use stricter CSP
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'nonce-{{nonce}}'", // Note: nonce would be injected by backend in real app
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Unsafe-inline needed for Tailwind CSS
        "img-src 'self' data: https:",
        "font-src 'self' https: data: https://fonts.gstatic.com",
        "connect-src 'self' https://api.yourdomain.com https://your-backend-url.com", // Replace with your actual API endpoints
        "frame-ancestors 'none'",
        "object-src 'none'"
      ].join('; '),
    };
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const isDev = mode === 'development';
  
  return {
    plugins: [
      react(),
      // Visualizer plugin to analyze bundle size
      visualizer({
        filename: './dist/bundle-analysis.html',
        open: false, // Don't automatically open the report
        gzipSize: true, // Show gzip size in the report
        brotliSize: true, // Show brotli size in the report
      })
    ],
    server: {
      host: true,
      strictPort: false,
      // Proxy API requests to avoid CORS issues in development
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: 'ws://localhost:8000',
          changeOrigin: true,
          secure: false,
          ws: true,
        }
      },
      // Add CSP headers for development
      headers: getCSPHeaders(isDev),
    },
    build: {
      // Optimize build for production
      sourcemap: false, // Disable sourcemaps in production to reduce size
      cssCodeSplit: true, // Enable CSS code splitting
      rollupOptions: {
        output: {
          // Use content hashes for cache-busting and better caching
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'assets/[name].[hash].[ext]';
            }
            return 'assets/[name].[hash].[ext]';
          },
        },
      },
    },
    define: {
      global: 'globalThis',
    }
  };
});