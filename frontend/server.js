/**
 * Production server with CSP headers and nonce implementation
 * This server is meant to serve the built frontend with proper security headers
 */

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Generate a nonce for CSP
const generateNonce = () => {
  return crypto.randomBytes(16).toString('hex');
};

// CSP configuration
const getCspConfig = (nonce) => {
  if (isProduction) {
    // Production CSP with nonce
    return {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", `'nonce-${nonce}'`],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        fontSrc: ["'self'", "https:", "data:", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://api.ishooop.org", "https://ishooop.org"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    };
  } else {
    // Development CSP (more permissive for React DevTools, HMR, etc.)
    return {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https:", "data:", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "http://localhost:*", "http://127.0.0.1:*", "ws://localhost:*", "ws://127.0.0.1:*"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"]
      }
    };
  }
};

// Middleware to generate nonce and add CSP header
app.use((req, res, next) => {
  const nonce = generateNonce();
  res.locals.nonce = nonce; // Store nonce in res.locals for template engines
  
  // Generate CSP header with nonce
  const cspConfig = getCspConfig(nonce);
  const cspHeader = Object.entries(cspConfig.directives)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');

  res.setHeader('Content-Security-Policy', cspHeader);
  
  next();
});

// Use helmet for additional security headers (excluding CSP since we set it manually)
app.use(helmet({
  contentSecurityPolicy: false, // We're setting this manually above
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res) => {
    // Add any additional headers if needed
    if (isProduction) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }
  }
}));

// Handle all routes and serve index.html
// This allows React Router to handle client-side routing
app.get('*', (req, res) => {
  // Read the index.html file
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  // Read the file and serve it with proper CSP headers
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).send(err.message);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`CSP enforcement: ${isProduction ? 'ENABLED' : 'Development mode - CSP allows unsafe-eval/inline'}`);
  console.log(`Serving files from: ${path.join(__dirname, 'dist')}`);
});

module.exports = app;