# Deployment Guide - Multilingual E-Commerce Platform

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
  - [Docker Deployment](#docker-deployment)
  - [Vercel + Render Deployment](#vercel--render-deployment)
  - [VPS Deployment](#vps-deployment)
  - [AWS Deployment](#aws-deployment)
- [Database Migration](#database-migration)
- [SSL Certificate Setup](#ssl-certificate-setup)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

The multilingual e-commerce platform follows a microservice-like architecture with:

- **Frontend**: React/TypeScript application served via Vite/Vercel
- **Backend**: FastAPI Python application with PostgreSQL database
- **Database**: PostgreSQL (production) / SQLite (development)
- **Caching**: Redis (optional, for advanced features)
- **File Storage**: Local/Cloud storage for product images
- **CDN**: Content Delivery Network (for static assets)

## Prerequisites

### System Requirements
- **CPU**: 2+ cores
- **RAM**: 4GB+ (8GB recommended)
- **Storage**: 20GB+ available space
- **OS**: Linux/Unix preferred (Windows WSL also supported)

### Required Software
- **Docker** (version 20.10+) with Docker Compose
- **Node.js** (version 18+) for local builds
- **Python** (version 3.10+) for local builds
- **Git** (version 2.0+)

### Domain and SSL
- Valid domain name (example.com)
- SSL certificate (Let's Encrypt or paid CA)

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_db

# Security Settings
SECRET_KEY=replace_with_secure_random_32_character_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAILS_FROM_EMAIL=your-email@gmail.com
EMAILS_FROM_NAME="E-commerce Platform"

# AI API Keys (optional - required for AI features)
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key

# Application Settings
ENVIRONMENT=production
DEBUG=false
SERVER_HOST=0.0.0.0
SERVER_PORT=8000

# CORS Settings
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379
CACHE_TTL=600
```

### Frontend Environment Variables

Create `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com/api/v1
VITE_APP_NAME="Your Store Name"
VITE_SUPPORTED_LANGUAGES="en,fa,ar"
VITE_DEFAULT_LANGUAGE="en"
VITE_ENABLE_RTL=true
VITE_CURRENCY="USD"
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## Deployment Options

### Docker Deployment

#### Option 1: Simple Docker Compose

**docker-compose.yml**
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: ecommerce_db
      POSTGRES_USER: ecommerce_user
      POSTGRES_PASSWORD: secure_password_change_me
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ecommerce_user -d ecommerce_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache (optional)
  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgresql://ecommerce_user:secure_password_change_me@db:5432/ecommerce_db
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=your_production_secret_key
      - ENVIRONMENT=production
      - DEBUG=false
    ports:
      - "8000:8000"
    volumes:
      - ./backend/uploads:/app/uploads
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    command: >
      sh -c "python run_migrations.py &&
             uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4"

  # Frontend Application
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:8000/api/v1
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf

volumes:
  postgres_data:
  redis_data:
```

**Steps to Deploy:**

1. Navigate to project directory
```bash
cd /path/to/multilingual-ecommerce-template
```

2. Build and start containers
```bash
docker-compose up --build -d
```

3. Run database migrations
```bash
docker-compose exec backend alembic upgrade head
```

4. Create admin user (if needed)
```bash
docker-compose exec backend python create_admin.py
```

5. Check status
```bash
docker-compose ps
```

#### Option 2: Production Docker Compose with SSL

**docker-compose.prod.yml**
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl/cert.pem:/etc/ssl/certs/cert.pem
      - ./ssl/key.pem:/etc/ssl/private/key.pem
      - ./ssl/dhparam.pem:/etc/ssl/certs/dhparam.pem
      - static_volume:/var/www/static
      - media_volume:/var/www/media
    depends_on:
      - backend
      - frontend

  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: ecommerce_db
      POSTGRES_USER: ecommerce_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
    command: >
      postgres
      -c shared_buffers=256MB
      -c effective_cache_size=1GB
      -c maintenance_work_mem=64MB
      -c checkpoint_completion_target=0.9
      -c wal_buffers=16MB
      -c default_statistics_target=100
      -c random_page_cost=1.1
      -c effective_io_concurrency=200
      -c work_mem=4MB
      -c min_wal_size=1GB
      -c max_wal_size=4GB
      -c max_worker_processes=2
      -c max_parallel_workers_per_gather=1
      -c max_parallel_workers=2
      -c max_parallel_maintenance_workers=1
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ecommerce_user -d ecommerce_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --appendonly yes --save 900 1 300 10 60 10000
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    restart: always
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=${SECRET_KEY}
      - ENVIRONMENT=production
      - DEBUG=false
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASSWORD=${SMTP_PASSWORD}
      - EMAILS_FROM_EMAIL=${EMAILS_FROM_EMAIL}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - MAX_WORKERS=4
    volumes:
      - uploads_volume:/app/uploads
      - static_volume:/app/static
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1024M
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: always
    environment:
      - VITE_API_URL=/api
    volumes:
      - static_volume:/usr/share/nginx/html/static
    depends_on:
      - backend

  celery_worker:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    restart: always
    depends_on:
      - redis
      - db
    command: celery -A worker worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - REDIS_URL=redis://redis:6379
    volumes:
      - uploads_volume:/app/uploads

  celery_beat:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    restart: always
    depends_on:
      - redis
      - db
    command: celery -A worker beat --loglevel=info
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - REDIS_URL=redis://redis:6379
    volumes:
      - uploads_volume:/app/uploads

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  static_volume:
    driver: local
  media_volume:
    driver: local
  uploads_volume:
    driver: local
```

### Vercel + Render Deployment

#### Frontend on Vercel

1. Push code to GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/)
3. Import project from GitHub
4. Configure build settings:
   - Framework preset: Vite
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add environment variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api/v1
   ```
6. Deploy

#### Backend on Render

1. Create a Web Service in Render
2. Connect to GitHub repository
3. Configure deployment:
   - Runtime: Python
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:$PORT`
4. Add environment variables:
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=your_secret_key
   GROQ_API_KEY=your_groq_key
   ```
5. Enable Auto-Deploy

### VPS Deployment

#### Ubuntu/Debian Setup

1. Update system and install prerequisites:
```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv nodejs npm postgresql postgresql-contrib redis-server nginx supervisor certbot python3-certbot-nginx git curl
```

2. Create application directory:
```bash
sudo mkdir -p /opt/ecommerce
sudo chown $USER:$USER /opt/ecommerce
cd /opt/ecommerce
```

3. Clone repository:
```bash
git clone https://github.com/yourusername/multilingual-ecommerce-template.git .
```

4. Setup backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file with appropriate values
nano .env
```

5. Setup PostgreSQL:
```bash
sudo -u postgres psql
CREATE DATABASE ecommerce_db;
CREATE USER ecommerce_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;
\q
```

6. Run migrations:
```bash
source venv/bin/activate
alembic upgrade head
```

7. Setup Gunicorn:
```bash
pip install gunicorn
```

8. Create systemd service file:
```bash
sudo nano /etc/systemd/system/ecommerce-backend.service
```

**Service file content:**
```ini
[Unit]
Description=E-commerce Backend Gunicorn instance
After=network.target

[Service]
User=your-username
Group=www-data
WorkingDirectory=/opt/ecommerce/backend
EnvironmentFile=/opt/ecommerce/backend/.env
ExecStart=/opt/ecommerce/backend/venv/bin/gunicorn -w 4 -b 127.0.0.1:8000 --timeout 120 app.main:app
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

9. Enable and start service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ecommerce-backend
sudo systemctl start ecommerce-backend
```

10. Setup Nginx:
```bash
sudo nano /etc/nginx/sites-available/ecommerce
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        proxy_buffering off;
    }

    location /static/ {
        alias /opt/ecommerce/backend/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /uploads/ {
        alias /opt/ecommerce/backend/uploads/;
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

11. Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

12. Setup SSL with Let's Encrypt:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### Frontend Deployment (Static Build)

1. Build frontend:
```bash
cd /opt/ecommerce/frontend
npm install
npm run build
```

2. Configure Nginx for frontend:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Frontend (SPA)
    root /opt/ecommerce/frontend/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        proxy_buffering off;
    }

    # Static files
    location /static/ {
        alias /opt/ecommerce/backend/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /uploads/ {
        alias /opt/ecommerce/backend/uploads/;
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

### AWS Deployment

#### Using AWS ECS + RDS

1. **Create RDS PostgreSQL instance**:
   - Engine: PostgreSQL 15
   - Instance: db.t3.micro (or appropriate size)
   - Enable public access if needed during setup

2. **Create ECS cluster** using CloudFormation template:
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'ECS cluster for e-commerce platform'

Parameters:
  VpcId:
    Type: AWS::EC2::VPC::Id
    Description: VPC to launch resources in

Resources:
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: ecommerce-cluster

  TaskExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: ecs-tasks.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

  BackendTaskDefinition:
    Type: AWS::ECS::TaskDefinition
    Properties:
      Family: ecommerce-backend
      NetworkMode: awsvpc
      RequiresCompatibilities:
        - FARGATE
      Cpu: '512'
      Memory: '1024'
      ExecutionRoleArn: !GetAtt TaskExecutionRole.Arn
      ContainerDefinitions:
        - Name: backend
          Image: your-ecr-repo/ecommerce-backend:latest
          PortMappings:
            - ContainerPort: 8000
          Environment:
            - Name: DATABASE_URL
              Value: !Join ['', ['postgresql://', !Ref DBUsername, ':', !Ref DBPassword, '@', !GetAtt DBInstance.Endpoint.Address, ':5432/', !Ref DBName]]
            - Name: SECRET_KEY
              Value: !Ref SecretKey
          LogConfiguration:
            LogDriver: awslogs
            Options:
              awslogs-group: !Ref LogGroup
              awslogs-region: !Ref AWS::Region
              awslogs-stream-prefix: ecs

Outputs:
  ClusterName:
    Description: Name of the ECS cluster
    Value: !Ref ECSCluster
```

3. **Setup ECS service** with load balancer and auto scaling

## Database Migration

### Initial Setup
```bash
# Run in backend directory
source venv/bin/activate  # Activate virtual environment

# Run database migrations
alembic upgrade head

# Create initial admin user (if not done automatically)
python create_admin.py
```

### Production Migration Process
```bash
# 1. Create a backup
pg_dump -h localhost -U ecommerce_user ecommerce_db > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Run migration
alembic upgrade head

# 3. Verify migration
python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(engine)"
```

### Rollback Process
```bash
# Rollback to specific migration
alembic downgrade <previous_version>

# Or rollback one step
alembic downgrade -1
```

## SSL Certificate Setup

### Let's Encrypt (Auto-renewal)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Add to crontab for auto-renewal
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
```

### Custom SSL Certificate
```bash
# Place certificates in /etc/ssl/certs/ and /etc/ssl/private/
sudo cp your-cert.crt /etc/ssl/certs/cert.pem
sudo cp your-key.key /etc/ssl/private/key.pem

# Update Nginx configuration
sudo nginx -t && sudo systemctl reload nginx
```

## Monitoring and Logging

### Logging Configuration

#### Backend Logging
```python
# backend/logging_config.py
import logging
import sys
from pythonjsonlogger import jsonlogger

def setup_logging():
    # JSON formatter for production
    json_formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(name)s %(levelname)s %(filename)s %(lineno)d %(message)s',
        datefmt='%Y-%m-%dT%H:%M:%S',
    )
    
    # Console handler for development
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    ))
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(console_handler)
    
    # Add file handler in production
    if os.getenv('ENVIRONMENT') == 'production':
        file_handler = RotatingFileHandler(
            'logs/app.log',
            maxBytes=1024*1024*10,  # 10MB
            backupCount=5
        )
        file_handler.setFormatter(json_formatter)
        root_logger.addHandler(file_handler)

setup_logging()
```

#### Docker Logging
```yaml
# In docker-compose files
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Health Checks

#### API Health Endpoint
```bash
# Check backend health
curl -s http://localhost:8000/health | jq

# Expected response
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

#### Docker Health Checks
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Issues
**Problem**: Backend can't connect to database
**Solution**:
```bash
# Check if database is running
docker-compose exec db pg_isready

# Check connection string
docker-compose exec backend env | grep DATABASE_URL

# Test connection manually
docker-compose exec backend python -c "from sqlalchemy import create_engine; engine = create_engine('${DATABASE_URL}'); engine.connect()"
```

#### 2. Migration Errors
**Problem**: Migration fails with alembic errors
**Solution**:
```bash
# Check current migration status
alembic current

# Downgrade and upgrade if needed
alembic downgrade -1
alembic upgrade head

# If stuck, stamp to specific revision
alembic stamp head
```

#### 3. Frontend Build Issues
**Problem**: Frontend build fails
**Solution**:
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. Permission Issues
**Problem**: Permission denied errors
**Solution**:
```bash
# Set proper ownership for volumes
sudo chown -R $USER:$USER /opt/ecommerce

# For Docker, use specific user IDs
docker run --user $(id -u):$(id -g) ...
```

#### 5. SSL Certificate Issues
**Problem**: SSL certificate not working
**Solution**:
```bash
# Check certificate status
sudo certbot certificates

# Renew if needed
sudo certbot renew

# Verify Nginx configuration
sudo nginx -t
sudo systemctl reload nginx
```

### Diagnostic Scripts

#### System Status Check Script
```bash
#!/bin/bash
# check_system.sh

echo "=== System Status Check ==="
echo "Date: $(date)"
echo

echo "--- Docker Containers ---"
docker ps
echo

echo "--- Disk Space ---"
df -h
echo

echo "--- Memory Usage ---"
free -h
echo

echo "--- Backend Logs (last 20 lines) ---"
if [ -f docker-compose.yml ]; then
  docker-compose logs --tail=20 backend
else
  echo "Docker Compose not found"
fi
echo

echo "--- Database Connection ---"
if [ -f docker-compose.yml ]; then
  docker-compose exec -T db pg_isready || echo "Database not ready"
else
  echo "Docker Compose not found"
fi
```

#### Performance Monitoring Script
```bash
#!/bin/bash
# monitor_performance.sh

echo "=== Performance Monitor ==="
echo "Time: $(date)"
echo

echo "--- CPU Usage ---"
top -bn1 | head -n 5
echo

echo "--- Memory Usage ---"
free -m
echo

echo "--- Disk I/O ---"
iostat -x 1 3
echo

echo "--- Network Connections ---"
netstat -tuln | grep ":80\|:443\|:8000"
```

### Backup and Recovery

#### Database Backup
```bash
# PostgreSQL backup
pg_dump -h localhost -U ecommerce_user -d ecommerce_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -h localhost -U ecommerce_user -d ecommerce_db | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Docker backup
docker-compose exec db pg_dump -U ecommerce_user -d ecommerce_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Backup Recovery
```bash
# Restore from backup
psql -h localhost -U ecommerce_user -d ecommerce_db < backup_file.sql

# Docker restore
docker-compose exec -i db psql -U ecommerce_user -d ecommerce_db < backup_file.sql
```

This deployment guide provides comprehensive instructions for deploying the multilingual e-commerce platform across different environments with proper security, performance optimization, and monitoring.