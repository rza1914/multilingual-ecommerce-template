/**
 * Content Security Policy configuration for production
 * 
 * For production, a strict CSP is recommended that uses nonces or hashes
 * instead of 'unsafe-inline' and 'unsafe-eval'.
 * 
 * The actual implementation would involve:
 * 1. Generating a nonce on each page load on the backend
 * 2. Setting the nonce in the CSP header
 * 3. Adding the nonce to all script and style tags
 * 
 * This file contains the CSP configuration that would be used by your backend server.
 */

const productionCSP = {
  // For use with backend framework like Express.js, Fastify, etc.
  headers: {
    // Strict Content Security Policy for production
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'nonce-{{nonce_value}}'",  // Replace {{nonce_value}} with actual nonce
      // Alternative: use hashes if you have static scripts
      // "script-src 'self' 'sha256-abc123...'", 
      "style-src 'self' 'unsafe-inline'",  // Note: Tailwind CSS requires 'unsafe-inline' or content hashes
      // Alternative for strict style-src: generate hashes for all styles during build
      "img-src 'self' data: https: blob:",
      "font-src 'self' https: data:",
      "connect-src 'self' https://your-api-domain.com https://fonts.googleapis.com https://images.pexels.com",  // Replace with your actual API domains
      "frame-ancestors 'none'",  // Prevents embedding in iframes (clickjacking protection)
      "object-src 'none'",  // Prevents loading of plugins like Flash 
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
  
  // For development or testing, a more permissive policy might be used:
  developmentHeaders: {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' https: data:",
      "connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:* https://fonts.googleapis.com https://images.pexels.com",
      "frame-ancestors 'none'",
      "object-src 'none'"
    ].join('; '),
  }
};

// For strict CSP with Tailwind CSS, you would need to generate content hashes
// This example shows how to do it with build-time processing:
const strictProductionCSP = {
  headers: {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'nonce-{{nonce_value}}'",
      // Generate hashes for your specific CSS files during build
      "style-src 'self' 'sha256-abcdefghijklmnopqrstuvwxyz1234567890='",  // Example hash
      "img-src 'self' data: https: blob:",
      "font-src 'self' https: data:",
      "connect-src 'self' https://your-api-domain.com https://fonts.googleapis.com https://images.pexels.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  }
};

module.exports = { productionCSP, strictProductionCSP };