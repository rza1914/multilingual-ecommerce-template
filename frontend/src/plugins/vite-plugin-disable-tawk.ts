import type { Plugin } from 'vite';

export default function disableTawkInDev(): Plugin {
  return {
    name: 'disable-tawk-in-dev',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html, { server }) {
        if (server) { // Only in development server
          return html
            .replace(/<script[^>]*tawk\.to[^>]*><\/script>/gi, 
              '<!-- Tawk.to disabled in development -->')
            .replace(/window\.Tawk_API[\s\S]*?tawk\.to/gi, 
              '/* Tawk.to blocked in dev */');
        }
        return html;
      },
    },
  };
}