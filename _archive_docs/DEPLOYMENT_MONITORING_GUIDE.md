# Deployment and Monitoring Guide

## Overview
This guide provides instructions for deploying the multilingual e-commerce template and setting up monitoring for production applications. The template includes several built-in features to support production deployment and monitoring.

## Deployment

### 1. Frontend Deployment

#### Build Process
The frontend uses Vite for optimized production builds:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview the build locally (for testing)
npm run preview
```

The build process automatically:
- Creates optimized bundles with content hashes for cache-busting
- Enables code splitting for better loading performance
- Disables sourcemaps in production to reduce bundle size
- Generates a bundle analysis report (in `dist/bundle-analysis.html`)

#### Static Asset Hosting
The build output in the `dist/` folder contains all static assets that can be served by any static file server or CDN.

#### Recommended Hosting Options
1. **Vercel**: Supports Vite applications out of the box
2. **Netlify**: Supports SPA routing and custom headers
3. **AWS S3 + CloudFront**: For maximum performance and global distribution
4. **GitHub Pages**: For simple deployments

#### Required HTTP Headers
Ensure your hosting solution delivers these security headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{{nonce}}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https: data:; connect-src 'self' https://api.yourdomain.com https://your-backend-url.com; frame-ancestors 'none'; object-src 'none'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### 2. Backend Deployment

#### FastAPI Backend
The backend is built with FastAPI and can be deployed to:
- **Heroku**: Using the Python buildpack
- **Railway**: Platform for easy deployment
- **AWS Elastic Beanstalk**: Traditional hosting solution
- **Docker containers**: For more complex deployments

#### Environment Variables
Set the following environment variables for production:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
SECRET_KEY=your-super-secret-and-long-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Monitoring
MONITORING_ENABLED=true
MONITORING_ENDPOINT=https://your-monitoring-service.com/api/logs
```

#### Docker Deployment
The application can be containerized using Docker:

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### 3. Database Setup
- Migrate the database schema: `alembic upgrade head`
- Set up proper backup schedules
- Configure connection pooling for production traffic

## Monitoring Setup

### 1. Frontend Monitoring

#### Error Boundary Implementation
The application includes an ErrorBoundary component that:
- Catches JavaScript errors anywhere in the child component tree
- Logs errors to a central service
- Displays a fallback UI to users

#### Custom Monitoring Service
The `monitoring.ts` utility provides:
- Error tracking with context
- Performance metrics logging
- User session tracking
- Network error detection

#### Implementation Example
```tsx
// Wrap your application with error boundaries
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <YourApplication />
    </ErrorBoundary>
  );
}
```

#### Monitoring Endpoints
Configure the monitoring endpoint in your environment variables:
```env
REACT_APP_MONITORING_ENDPOINT=https://your-monitoring-service.com/api/logs
```

### 2. Backend Monitoring

#### FastAPI Middleware
The backend includes middleware for:
- Request logging
- Performance measurement
- Error tracking
- Security monitoring

#### Log Management
- Configure structured logging with JSON format
- Set up log rotation
- Forward logs to centralized system (ELK stack, DataDog, etc.)

### 3. Performance Monitoring

#### Frontend Performance
- Bundle size optimization using the visualizer plugin
- Core Web Vitals tracking
- User timing measurements

#### Backend Performance
- Database query optimization
- API response time monitoring
- Resource utilization tracking

## Security Considerations

### 1. Content Security Policy (CSP)
CSP headers are configured in `vite.config.ts` for both development and production with the following directives:
- `default-src 'self'` - Restrict to same origin
- `script-src` - Include nonce for dynamic scripts
- `style-src 'self' 'unsafe-inline'` - Allow inline styles (needed for Tailwind CSS)
- `connect-src` - Restrict API calls to specified domains

### 2. Authentication & Authorization
- JWT tokens for secure communication
- Proper session management
- Rate limiting for API endpoints

### 3. Input Validation
- Server-side validation for all inputs
- Sanitization of user-generated content
- Prevention of common vulnerabilities (XSS, CSRF, etc.)

## Scaling Recommendations

### 1. Horizontal Scaling
- Use load balancers to distribute traffic
- Implement stateless architecture where possible
- Use external session storage

### 2. Database Scaling
- Read replicas for read-heavy operations
- Connection pooling
- Database indexing optimization

### 3. Caching Strategies
- CDN for static assets
- API response caching
- Database query caching

## Troubleshooting

### 1. Common Deployment Issues
- **CSP Errors**: Verify all external resources are allowed in CSP headers
- **API Connectivity**: Check CORS settings and API endpoint configuration
- **Static Asset Loading**: Ensure proper MIME types are set

### 2. Monitoring Best Practices
- Set up alerts for critical errors
- Monitor performance metrics over time
- Track user adoption of new features

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Add your deployment commands here
```

This guide should be customized based on your specific hosting provider and security requirements. Always test deployments in a staging environment before pushing to production.