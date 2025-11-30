import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { UserConfig, ConfigEnv } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
// FIX: ایمپورت path برای تعریف مسیر مستعار
import path from 'path'

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
      // Add CSP headers for development
      headers: getCSPHeaders(isDev),
    },
    build: {
      // Optimize build for production
      sourcemap: false, // Disable sourcemaps in production to reduce size
      cssCodeSplit: true, // Enable CSS code splitting
      minify: 'terser',
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
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Split vendor code into separate chunks
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('@headlessui') || id.includes('@heroicons') || id.includes('lucide-react')) {
                return 'ui-vendor';
              }
              if (id.includes('axios') || id.includes('zod')) {
                return 'utils-vendor';
              }
              if (id.includes('i18next') || id.includes('react-i18next')) {
                return 'i18n-vendor';
              }
              // Common modules in a separate chunk
              return 'vendor';
            }
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log statements for production
          drop_debugger: true,
        },
        format: {
          comments: false, // Remove comments for production
        },
      },
    },
    define: {
      global: 'globalThis',
    },
    // FIX: اضافه کردن بخش resolve با مسیر مستعار @
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/types/product': path.resolve(__dirname, './src/types/product.types'),
        '@/types/product.types': path.resolve(__dirname, './src/types/product.types'),
      },
    },
  };
})