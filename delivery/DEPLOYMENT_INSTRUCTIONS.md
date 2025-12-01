# Deployment Instructions - Multilingual E-commerce Template v1.0.0

## Overview
This package contains a complete multilingual e-commerce platform with:

- **Backend**: FastAPI application (Python)
- **Frontend**: React application (built, ready for serving)

## Prerequisites

### Backend (Python Server)
- Python 3.9+
- PostgreSQL database
- Redis server (optional, for caching)

### Frontend (Static Files)
- Web server (Nginx, Apache, etc.) or hosting service (Vercel, Netlify, etc.)

## Backend Deployment

### 1. Set up Environment
1. Navigate to the backend directory
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 2. Configure Environment Variables
Create a `.env` file based on `.env.example` and set your values:
```bash
cp .env.example .env
# Edit .env with your settings
```

Essential environment variables:
- `DATABASE_URL=postgresql://user:password@localhost/dbname`
- `SECRET_KEY=your-very-secure-secret-key`
- `GROQ_API_KEY=your-groq-api-key`
- `SMTP_USER=your-smtp-user`
- `SMTP_PASSWORD=your-smtp-password`

### 3. Set up Database
Run database migrations:
```bash
alembic upgrade head
```

### 4. Create Admin User
```bash
python create_admin.py
```

### 5. Start the Backend Server
```bash
python run.py
# or
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Frontend Deployment

### Option 1: Static File Hosting
The frontend is already built (in `frontend_dist` folder) and ready to be served by any web server:

1. Copy all files from `frontend_dist` to your web server's document root
2. Configure your web server to serve `index.html` for all routes (SPA configuration)

### Option 2: CDN/Cloud Hosting
Upload the contents of the `frontend_dist` folder to your CDN or cloud storage provider.

### Web Server Configuration Example (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Serve frontend assets
    location / {
        alias /path/to/frontend_dist/;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy WebSocket connections
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Environment Configuration

### Frontend Environment Variables
Update your frontend environment to point to your backend:
- `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.com/api/v1`)

### Backend Environment Variables
Configure your backend with production settings in `.env`:
- `DATABASE_URL`: Production database connection string
- `SECRET_KEY`: Secure production secret key
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time
- `FRONTEND_URL`: Your frontend domain for CORS

## SSL/HTTPS Setup

For production, enable HTTPS:
1. Obtain SSL certificate (Let's Encrypt, commercial CA, etc.)
2. Configure your web server (Nginx/Apache) for SSL termination
3. Update all environment URLs to use HTTPS

## Performance Optimization

### Backend
- Use a production ASGI server like Gunicorn with multiple workers
- Configure database connection pooling
- Enable Redis caching for frequently accessed data
- Set up proper logging

### Frontend
- Enable gzip/brotli compression on your web server
- Configure proper caching headers for static assets
- Use a CDN for static assets

## Running in Production

### Using Gunicorn (Recommended)
```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Using Docker (Optional)
A docker-compose file is provided for containerized deployment.

## Support & Troubleshooting

For support, documentation, and troubleshooting, please refer to:
- README.md: General project information
- CHANGELOG.md: Version history and changes
- Official documentation at [project website]

## Security Considerations

- Change all default passwords and API keys
- Use strong, unique secret keys
- Implement proper firewall rules
- Regular security updates
- Monitor logs for suspicious activity