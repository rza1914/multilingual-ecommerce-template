# Deployment and Monitoring Guide

## Overview

This guide provides instructions for deploying the multilingual e-commerce template to production and setting up monitoring for optimal performance and security.

## Prerequisites

Before deploying, ensure you have:
- Node.js (v18 or higher)
- npm or yarn package manager
- A production server (Linux/Windows) or cloud platform (AWS, Azure, GCP)
- SSL certificate for HTTPS
- Domain name configured to point to your server

## Production Build

### 1. Frontend Build

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the production bundle
npm run build
```

This will create a `dist` directory with all the production assets.

### 2. Environment Configuration

Create a `.env.production` file in the frontend directory:

```env
VITE_API_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-websocket-domain.com
VITE_MONITORING_ENDPOINT=https://your-monitoring-domain.com/api/logs
VITE_APP_NAME=YourStore
```

## Server Setup

### 1. Using the Production Server

The template includes a production-ready Express server with CSP headers:

```bash
# At project root
npm install helmet express

# Build frontend
npm run build

# Start production server
npm run start:prod
```

### 2. Configuration Options

The server supports the following environment variables:

```bash
PORT=3000                 # Server port (default: 3000)
NODE_ENV=production       # Enables production optimizations
```

### 3. Reverse Proxy Setup (Nginx)

For production deployments, it's recommended to use a reverse proxy like Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

## Content Security Policy (CSP)

The application implements a strict CSP with nonce-based approach:

- All inline scripts are blocked by default
- Only scripts with valid nonces are allowed
- External resources must be from trusted domains
- WebSocket connections are restricted to specific origins

## Monitoring Setup

### 1. Frontend Monitoring

The application includes comprehensive client-side monitoring:

- **Error Tracking**: Unhandled errors and promise rejections
- **Performance Metrics**: Page load times, API call durations
- **User Behavior**: Key user interactions
- **Session Tracking**: Unique session IDs for debugging

### 2. Backend Monitoring

Configure your backend to handle the monitoring endpoints:

```javascript
// Example monitoring endpoint
app.post('/api/logs', (req, res) => {
  const logData = req.body;
  
  // Store logs in your preferred system (database, file, external service)
  storeLog(logData);
  
  res.status(200).json({ success: true });
});
```

### 3. External Monitoring Services

To integrate with services like Sentry, LogRocket, or similar:

```javascript
// In monitoring.ts, update the sendLog method to forward to external service
private async sendLog(data: LogData): Promise<void> {
  // Original logging
  try {
    await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Failed to send log to monitoring service:', error);
    this.pendingLogs.push(data);
  }

  // Forward to external service (example with Sentry)
  if (process.env.NODE_ENV === 'production') {
    // Report to external monitoring service
    // Example: Sentry.captureException(data.error || new Error(data.message));
  }
}
```

## Docker Deployment

### 1. Dockerfile

The project includes a Docker setup:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Switch back to root directory
WORKDIR /app

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### 2. Docker Commands

```bash
# Build the image
docker build -t multilingual-ecommerce-app .

# Run the container
docker run -p 3000:3000 -e NODE_ENV=production multilingual-ecommerce-app
```

### 3. Docker Compose

For production with database and other services:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VITE_API_URL=https://api.yourdomain.com
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /path/to/certs:/etc/ssl/certs
    depends_on:
      - frontend
    restart: unless-stopped
```

## Health Checks

The monitoring service provides health check endpoints:

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  const stats = monitoringService.getStats();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    pendingLogs: stats.pendingLogs,
    sessionId: stats.sessionId
  });
});
```

## Performance Optimization

### 1. Bundle Size

- Code splitting for better initial load times
- Lazy loading of components
- Tree shaking to remove unused code
- Image optimization with responsive formats

### 2. Caching Strategy

- Browser caching with appropriate headers
- CDN for static assets
- Server-side caching for API responses

### 3. Image Optimization

- Responsive images with multiple formats (WebP, AVIF)
- Lazy loading for below-the-fold images
- Placeholder images for faster perceived loading

## Security Best Practices

### 1. Authentication

- Secure JWT implementation
- HTTP-only cookies for token storage
- CSRF protection
- Rate limiting for authentication endpoints

### 2. Data Protection

- Input validation and sanitization
- SQL injection prevention
- XSS protection with CSP
- Secure payment processing integration

### 3. Regular Security Audits

- Dependency vulnerability scanning
- Security configuration reviews
- Penetration testing
- Code security reviews

## Troubleshooting

### Common Issues

1. **CSP Violations**:
   - Check the browser console for CSP error reports
   - Verify all scripts have proper nonces or are loaded via external files
   - Review the server configuration

2. **WebSocket Connection Issues**:
   - Ensure WebSocket endpoint is configured correctly
   - Check firewall and proxy settings
   - Verify SSL/HTTPS configuration

3. **Monitoring Not Working**:
   - Verify the monitoring endpoint is accessible
   - Check CORS configuration if calling external monitoring service
   - Review network connectivity

### Debugging Production Issues

```bash
# Enable more detailed logging in development-like mode
NODE_ENV=development npm run start:prod

# Monitor logs in real-time
tail -f logs/app.log

# Check system resources
htop
```

## Maintenance

### 1. Regular Updates

- Update dependencies regularly
- Apply security patches
- Monitor for vulnerabilities

### 2. Backup Strategy

- Regular database backups
- Code repository backups
- Configuration file backups

### 3. Monitoring and Alerts

- Set up alerts for critical errors
- Monitor performance metrics
- Track user engagement metrics
- Monitor resource usage