# Content Security Policy (CSP) Implementation Guide

## Overview

This document details the Content Security Policy (CSP) implementation for the multilingual e-commerce template. CSP is a security standard that helps prevent various types of attacks, including Cross-Site Scripting (XSS) and data injection attacks.

## Implementation Approach

The CSP is implemented using a **nonce-based approach** for production environments:

- **Development**: Permissive CSP allowing inline scripts and eval for React DevTools and Hot Module Replacement (HMR)
- **Production**: Strict CSP using nonces for dynamically generated scripts

## Server-Side Implementation

The production CSP is enforced by the Express server (`frontend/server.js`):

1. Generates a unique cryptographic nonce for each HTTP request
2. Sets the CSP header with the nonce value
3. Serves the React application with appropriate security headers

## CSP Directives

### Production Directives:
```
default-src 'self'
script-src 'self' 'nonce-[GENERATED_NONCE]'
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
img-src 'self' data: blob: https:
font-src 'self' https: data: https://fonts.gstatic.com
connect-src 'self' https://api.ishooop.org https://ishooop.org
frame-ancestors 'none'
object-src 'none'
base-uri 'self'
form-action 'self'
```

### Development Directives:
```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval'
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
img-src 'self' data: https:
font-src 'self' https: data: https://fonts.gstatic.com
connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*
frame-ancestors 'none'
object-src 'none'
```

## Running in Production

To run with CSP enforcement:

```bash
# Build the frontend
npm run build

# Start the production server
npm run start:prod
```

## Security Benefits

- Prevents XSS attacks by restricting script execution sources
- Blocks malicious content injection
- Prevents framing attacks
- Provides defense against other code injection vulnerabilities