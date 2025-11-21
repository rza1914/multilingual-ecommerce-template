# Startup Sequence Documentation for iShop E-commerce Platform

## Database Setup and Migrations

### Initial Database Setup

1. **Configure Database Connection**
   ```bash
   # For development, SQLite is used by default
   # For production, set DATABASE_URL in your environment
   export DATABASE_URL="postgresql://user:password@localhost/ishop_prod"
   ```

2. **Run Initial Migrations**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Activate virtual environment
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   
   # Run database migrations
   python run_migrations.py
   
   # Alternative: Use alembic directly
   alembic upgrade head
   ```

3. **Create Initial Admin User**
   ```bash
   # Create admin user (this will be done automatically on startup, but can be done manually)
   python create_admin.py
   
   # Or create with specific credentials
   python create_or_verify_admin.py
   ```

4. **Seed Initial Data (Optional)**
   ```bash
   python seed_data.py
   ```

### Database Migration Process

1. **Create New Migration**
   ```bash
   # Generate migration based on model changes
   alembic revision --autogenerate -m "Description of changes"
   ```

2. **Apply Migrations**
   ```bash
   # Apply all pending migrations
   alembic upgrade head
   ```

3. **Rollback Migrations**
   ```bash
   # Rollback to previous version
   alembic downgrade -1
   ```

## Backend Startup

### Development Mode
```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export ENVIRONMENT=development
export DATABASE_URL=sqlite:///./ecommerce.db

# Start the backend server
python run.py
# or
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate

# Install production dependencies
pip install -r requirements.txt

# Ensure environment variables are set
# (preferably from environment file or secure secrets)
export ENVIRONMENT=production
export DATABASE_URL=postgresql://user:password@localhost/ishop_prod
export SECRET_KEY=your-production-secret-key

# Run migrations
python run_migrations.py

# Start the server (using gunicorn for production)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Deployment
```bash
# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Frontend Development Server Startup

### Development Mode
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set environment variables for development
# .env.development file should be properly configured
cp .env.example .env.development

# Start the development server
npm run dev
# The app will be available at http://localhost:5173
```

### Production Build
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Serve the production build locally (for testing)
npm run preview

# The built app will be in the 'dist' directory
```

### Docker Build and Run
```bash
# Build the frontend container
docker build -t ishop-frontend .

# Run the frontend container
docker run -p 3000:3000 ishop-frontend
```

## Verification Tests

### 1. Backend Health Check
```bash
# Test API health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status": "healthy", "service": "ishop-backend", "version": "2.0.0", "environment": "development"}
```

### 2. Database Connection Test
```bash
# Test database connectivity
curl http://localhost:8000/api/v1/health/db

# Or check the main API endpoints
curl http://localhost:8000/api/v1/products/
```

### 3. WebSocket Connection Test
```javascript
// Test WebSocket connection in browser console
const ws = new WebSocket('ws://localhost:8000/api/v1/ws/inventory?token=your-token');

ws.onopen = () => console.log('WebSocket connected');
ws.onmessage = (event) => console.log('Message received:', event.data);
ws.onerror = (error) => console.error('WebSocket error:', error);
```

### 4. Image Proxy Test
```bash
# Test image proxy endpoint
curl -v http://localhost:8000/api/v1/images/image?url=https://images.unsplash.com/photo-1505740420928-5e560c06d30e
```

### 5. Frontend Functionality Test
- Visit http://localhost:5173
- Check browser console for errors
- Test product listing page
- Test WebSocket functionality
- Test image loading with fallbacks

## Common Issues and Solutions

### 1. CORS Errors
**Issue**: CORS error when connecting frontend to backend
**Solution**: 
- Check that the frontend URL is in the allowed origins list
- Verify environment variables are set correctly
- For development: Ensure VITE_API_URL is set to http://localhost:8000

### 2. Database Connection Issues
**Issue**: Cannot connect to database
**Solution**:
- Verify DATABASE_URL is set correctly
- Check that database server is running
- For PostgreSQL, ensure the database exists and user has permissions

### 3. Migration Issues
**Issue**: Migration errors
**Solution**:
- Run `alembic history` to see migration history
- Run `alembic current` to see current version
- If needed, stamp the current version: `alembic stamp head`

### 4. Frontend Build Issues
**Issue**: Frontend fails to build
**Solution**:
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clean npm cache: `npm cache clean --force`
- Check for dependency conflicts

### 5. WebSocket Connection Issues
**Issue**: WebSocket connections fail
**Solution**:
- Check that the WebSocket endpoints are accessible
- Verify authentication tokens are valid
- Ensure firewall/proxy allows WebSocket connections

### 6. Image Loading Issues
**Issue**: Images not loading or showing fallback
**Solution**:
- Verify image proxy endpoint is working
- Check CORS settings allow image domains
- Verify image URLs are valid
- Ensure image processing libraries are installed