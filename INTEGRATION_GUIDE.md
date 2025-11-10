# Complete Integration & Deployment Guide for iShop E-commerce Platform

## Overview

This comprehensive guide consolidates all aspects of the iShop e-commerce platform integration and deployment, including the fixes for CORS issues, WebSocket connections, image handling, and production deployment on ishooop.org.

The platform includes:
- **Backend**: FastAPI with PostgreSQL database
- **Frontend**: React with Vite build tool
- **Real-time features**: WebSockets for inventory updates
- **Image handling**: Optimized image loading with fallbacks
- **Authentication**: JWT-based authentication system

## Architecture Summary

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Nginx       │    │    Backend      │
│   (React/Vite)  │◄──►│   (Reverse      │◄──►│   (FastAPI)     │
│                 │    │    Proxy)       │    │                 │
│  http://       │    │  https://       │    │ http://        │
│  localhost:5173 │    │  ishooop.org    │    │ localhost:8000  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                            ┌─────────────────┐
                                            │   Database      │
                                            │ (PostgreSQL)    │
                                            │                 │
                                            └─────────────────┘
```

## Quick Start for Development

### 1. Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python run_migrations.py

# Start the backend
python run.py
# Or with uvicorn: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## Production Deployment Steps

### 1. Server Preparation
Follow the server setup checklist in PRODUCTION_DEPLOYMENT_GUIDE.md:
- Install required packages (Python, Node.js, PostgreSQL, Redis, Nginx)
- Create dedicated users and directories
- Set up security hardening
- Configure the database

### 2. Environment Configuration
Set up production environment variables as per .env.production:
```bash
# Copy production environment file
cp backend/.env.production backend/.env

# Customize the environment variables:
# - SECRET_KEY: Strong random key (use `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
# - DATABASE_URL: PostgreSQL connection string
# - Environment-specific settings
```

### 3. Containerized Deployment (Recommended)
```bash
# Build and deploy with Docker Compose
docker-compose up --build -d

# Verify all services are running
docker-compose ps
docker-compose logs --tail=50 backend
docker-compose logs --tail=50 nginx
```

### 4. Nginx Configuration
The nginx.conf file in the repository provides SSL-ready configuration:
- Configured for HTTPS with proper security headers
- Separate server blocks for frontend and API
- WebSocket support for real-time features
- SSL termination handling

### 5. SSL Certificate Setup
```bash
# Obtain SSL certificate (if not already configured)
sudo certbot --nginx -d ishooop.org -d www.ishooop.org --agree-tos -m your-email@example.com

# Configure auto-renewal
echo "0 2 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## Key Features Verification

### 1. CORS Implementation
**Problem Solved**: Cross-Origin Resource Sharing issues between frontend (localhost:5173) and backend (localhost:8000)
**Solution Implemented**:
- Dynamic CORS configuration based on environment
- Secure origin validation
- Environment-specific allowed origins
- Proper credentials handling

**Verification**:
```bash
# Test CORS from frontend domain
curl -H "Origin: http://localhost:5173" -X OPTIONS http://localhost:8000/api/v1/products/
# Should return: Access-Control-Allow-Origin: http://localhost:5173
```

### 2. WebSocket Integration
**Problem Solved**: Real-time inventory updates and chat functionality
**Solution Implemented**:
- WebSocket endpoints for inventory updates
- Connection management with proper authentication
- Reconnection logic with exponential backoff
- Heartbeat/ping-pong mechanism for connection health

**Verification**:
```javascript
// Test WebSocket connection
const ws = new WebSocket('ws://localhost:8000/api/v1/ws/inventory?token=' + validToken);
ws.onopen = () => console.log('Connected to inventory updates');
ws.onmessage = (event) => console.log('Update received:', event.data);
```

### 3. Advanced Image Handling
**Problem Solved**: Pexels CDN timeout issues and image loading failures
**Solution Implemented**:
- Image proxy service to handle external images
- WebP format support with JPEG fallbacks
- Responsive image loading with srcset
- Progressive loading with blurred previews
- Error handling with fallback mechanisms

**Verification**:
```bash
# Test image proxy endpoint
curl -X GET "http://localhost:8000/api/v1/images/image?url=https://images.unsplash.com/photo-1505740420928-5e560c06d30e&width=300&height=300"
# Should return processed image with proper caching headers
```

## Performance Optimizations

### 1. Frontend Performance
- Code splitting for improved initial load times
- Bundle analysis with rollup-plugin-visualizer
- Image optimization with lazy loading
- Service worker for caching and offline support
- Environment-specific asset optimization

### 2. Backend Performance
- Database connection pooling
- Redis for caching
- API rate limiting
- Efficient query optimization
- Asynchronous processing where appropriate

### 3. Image Optimization
- Multiple resolution variants served via srcset
- WebP format with fallbacks
- Low-quality placeholders for faster perceived loading
- CDN integration capabilities
- Image proxy for processing and optimization

## Security Considerations

### 1. Authentication & Authorization
- JWT-based token system
- Role-based access control
- Secure password hashing with bcrypt
- Session management
- CSRF protection

### 2. API Security
- Rate limiting to prevent abuse
- Input validation and sanitization
- SQL injection prevention
- Proper error message handling
- Secure headers configuration

### 3. Infrastructure Security
- SSL/TLS for encrypted communication
- Proper CORS configuration
- Firewall rules
- System monitoring
- Regular security updates

## Monitoring & Maintenance

### 1. Health Checks
- Backend health endpoint: `GET /health`
- Database connectivity check
- Application readiness status
- System health indicators

### 2. Logging
- Structured logging with severity levels
- Request/response logging
- Error logging with context
- Performance metrics
- Audit trails

### 3. Backup Strategy
- Automated daily database backups
- Backup verification scripts
- Retention policy (30 days)
- Encryption of backup data

## Troubleshooting Common Issues

### 1. CORS Issues
**Symptoms**: "Access to fetch at '...' has been blocked by CORS policy"
**Solutions**:
- Verify allowed origins match current domain
- Check that credentials setting is consistent
- Ensure preflight requests are handled properly
- Verify environment variables are set correctly

### 2. WebSocket Connection Problems
**Symptoms**: WebSocket fails to connect or keep connection alive
**Solutions**:
- Verify WebSocket endpoint path and authentication
- Check firewall settings allow WebSocket connections
- Ensure proxy configuration supports WebSocket upgrades
- Verify reconnection logic is functioning

### 3. Image Loading Failures
**Symptoms**: Images not loading or showing broken image icons
**Solutions**:
- Check image proxy endpoint is accessible
- Verify external image URLs are valid
- Confirm fallback image URLs are working
- Check CORS settings for image domains

### 4. Performance Issues
**Symptoms**: Slow page loads, unresponsive UI
**Solutions**:
- Enable caching with appropriate headers
- Optimize database queries
- Implement proper image sizing
- Add performance monitoring tools
- Profile and optimize bottlenecks

## Rollback Procedures

### 1. Application Rollback
```bash
# Using Docker
docker-compose rollback ishop-backend:last-known-good-version

# Using Git tags
git checkout v1.2.3  # previous stable version
docker-compose build --no-cache
docker-compose up -d
```

### 2. Database Rollback
```bash
# Using Alembic for migrations
alembic downgrade -1  # Roll back one migration
# Or to specific version: alembic downgrade <migration-id>
```

### 3. Configuration Rollback
Maintain configuration backups and use a configuration management system to easily revert to known good states.

## Deployment Checklist

### Pre-Deployment
- [ ] Code reviewed and tested
- [ ] Database migrations planned and tested
- [ ] Environment variables set securely
- [ ] SSL certificates ready
- [ ] Backup created before deployment
- [ ] Communication to stakeholders prepared

### During Deployment
- [ ] Deploy to staging first for final testing
- [ ] Monitor application health during deployment
- [ ] Verify all services are running
- [ ] Test key functionality manually
- [ ] Validate external dependencies

### Post-Deployment
- [ ] Monitor application logs
- [ ] Verify user access is restored
- [ ] Test all critical paths manually
- [ ] Update documentation if needed
- [ ] Notify team of successful deployment

## Performance Benchmarks

### Target Metrics
- **API Response Time**: < 500ms (95th percentile)
- **Image Loading Time**: < 2 seconds for first meaningful paint
- **Initial Page Load**: < 3 seconds over 3G connection
- **WebSocket Connection Time**: < 1 second
- **Database Query Time**: < 100ms for common queries

### Monitoring Commands
```bash
# API performance test
ab -n 100 -c 10 http://localhost:8000/api/v1/products/

# Load testing
weighttp -n 1000 -c 10 -t 2 http://localhost:8000/

# Memory usage monitoring
htop
# or
docker stats

# Application logs
docker-compose logs -f --tail=50 backend
```

This integration guide ensures that all components work together seamlessly, addressing the original CORS, WebSocket, and image handling issues while providing a robust foundation for production deployment on ishooop.org.