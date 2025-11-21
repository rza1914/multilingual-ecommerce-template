# ⚡ Quick Reference Guide

<div align="center">

![Quick](https://img.shields.io/badge/quick-reference-blue.svg)
![Copy](https://img.shields.io/badge/copy-paste-success.svg)
![Commands](https://img.shields.io/badge/commands-50+-orange.svg)

**Copy-Paste Ready Commands & Solutions**

[🚀 Quick Start](README_QUICK_START.md) · [📚 Full Documentation](COMPLETE_PROJECT_DOCUMENTATION.md) · [✅ Features](FEATURES_CHECKLIST.md)

</div>

---

## 📋 Table of Contents

- [🚀 Quick Setup](#-quick-setup)
- [🔧 Common Commands](#-common-commands)
- [📝 Code Snippets](#-code-snippets)
- [🐛 Troubleshooting](#-troubleshooting)
- [🔑 Test Credentials](#-test-credentials)
- [🌐 API Endpoints](#-api-endpoints)
- [⌨️ Keyboard Shortcuts](#-keyboard-shortcuts)
- [💡 Pro Tips](#-pro-tips)

---

## 🚀 Quick Setup

### ⏱️ 2-Minute Setup

```bash
# Clone repository
git clone https://github.com/rza1914/multilingual-ecommerce-template.git
cd multilingual-ecommerce-template

# Backend setup (Terminal 1)
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python create_admin.py
uvicorn app.main:app --reload

# Frontend setup (Terminal 2)
cd frontend
npm install
npm run dev
```

**Done! 🎉**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🔧 Common Commands

### Backend Commands

#### 🐍 Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Deactivate
deactivate
```

#### 📦 Package Management

```bash
# Install dependencies
pip install -r requirements.txt

# Upgrade pip
pip install --upgrade pip

# Freeze dependencies
pip freeze > requirements.txt

# Install single package
pip install package-name
```

#### 🚀 Run Backend

```bash
# Development mode (auto-reload)
uvicorn app.main:app --reload

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Custom port
uvicorn app.main:app --reload --port 8080

# Verbose logging
uvicorn app.main:app --reload --log-level debug
```

#### 🗄️ Database Commands

```bash
# Create admin user
python create_admin.py

# Create test data
python create_test_data.py

# Delete and recreate database
rm ecommerce.db
python create_admin.py

# Check database exists
ls -la ecommerce.db  # Linux/Mac
dir ecommerce.db     # Windows
```

#### 🧪 Testing Commands

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Verbose output
pytest -v

# Run specific test file
pytest tests/test_auth.py

# Run specific test function
pytest tests/test_auth.py::test_register_user

# Generate HTML coverage report
pytest --cov=app --cov-report=html
# Open htmlcov/index.html

# Show missing lines
pytest --cov=app --cov-report=term-missing

# Run in parallel (faster)
pytest -n auto
```

#### 🎨 Code Quality

```bash
# Format code with Black
black app/
black app/ --check  # Check without modifying

# Lint with Flake8
flake8 app/
flake8 app/ --statistics

# Type check with MyPy
mypy app/

# Run all quality checks
black app/ && flake8 app/ && pytest --cov=app
```

---

### Frontend Commands

#### 📦 Package Management

```bash
# Install dependencies
npm install

# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update packages
npm update

# Check for outdated packages
npm outdated

# Remove unused packages
npm prune
```

#### 🚀 Run Frontend

```bash
# Development mode
npm run dev

# Development with custom port
npm run dev -- --port 3000

# Production build
npm run build

# Preview production build
npm run preview

# Clean build
rm -rf dist && npm run build
```

#### 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Run specific test file
npm test -- ProductCard.test.tsx

# Update snapshots
npm test -- -u
```

#### 🎨 Code Quality

```bash
# Lint with ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format with Prettier
npm run format

# Type check TypeScript
npm run type-check

# Run all quality checks
npm run lint:fix && npm run format && npm run type-check
```

#### 🪝 Git Hooks

```bash
# Install Husky hooks
npx husky install

# Test pre-commit hook
git commit --dry-run

# Skip hooks (not recommended)
git commit --no-verify
```

---

### Git Commands

```bash
# Initialize repository
git init

# Clone repository
git clone <url>

# Check status
git status

# Stage changes
git add .
git add file.txt

# Commit changes
git commit -m "feat: add new feature"

# Push to remote
git push origin main

# Pull from remote
git pull origin main

# Create branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# View commit history
git log --oneline --graph --all

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
```

---

### Docker Commands

```bash
# Build image
docker build -t ecommerce-backend ./backend
docker build -t ecommerce-frontend ./frontend

# Run container
docker run -p 8000:8000 ecommerce-backend
docker run -p 80:80 ecommerce-frontend

# Docker Compose
docker-compose up -d          # Start in background
docker-compose down           # Stop containers
docker-compose logs -f        # View logs
docker-compose ps             # List containers
docker-compose restart        # Restart containers

# Clean up
docker system prune -a        # Remove unused images
```

---

## 📝 Code Snippets

### Backend Snippets

#### Create New API Endpoint

```python
# app/api/v1/example.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

@router.get("/example")
def get_example(db: Session = Depends(get_db)):
    """
    Example endpoint
    """
    return {"message": "Hello World"}
```

#### Add New Database Model

```python
# app/models/example.py
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class Example(Base):
    __tablename__ = "examples"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
```

#### Create Pydantic Schema

```python
# app/schemas/example.py
from pydantic import BaseModel, Field
from datetime import datetime

class ExampleBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None

class ExampleCreate(ExampleBase):
    pass

class ExampleResponse(ExampleBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
```

#### Write Test

```python
# tests/test_example.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_example():
    response = client.get("/api/v1/example")
    assert response.status_code == 200
    assert "message" in response.json()
```

---

### Frontend Snippets

#### Create New Component

```typescript
// src/components/Example.tsx
import React from 'react';

interface ExampleProps {
  title: string;
  description?: string;
}

export const Example: React.FC<ExampleProps> = ({ title, description }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
};
```

#### API Service Function

```typescript
// src/services/example.service.ts
import api from './api.service';

export const exampleService = {
  getAll: async () => {
    const response = await api.get('/example');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/example/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/example', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/example/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/example/${id}`);
    return response.data;
  }
};
```

#### Custom Hook

```typescript
// src/hooks/useExample.ts
import { useState, useEffect } from 'react';
import { exampleService } from '../services/example.service';

export const useExample = (id: number) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await exampleService.getById(id);
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
};
```

#### Component Test

```typescript
// src/components/__tests__/Example.test.tsx
import { render, screen } from '@testing-library/react';
import { Example } from '../Example';

describe('Example Component', () => {
  it('renders title correctly', () => {
    render(<Example title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<Example title="Test" description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
```

#### Legacy/Modern Toggle Component

```typescript
// src/components/legacy/LegacyWrapper.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LegacyWrapperProps {
  component: React.ComponentType<any>;
  legacyProps?: any;
  className?: string;
}

export const LegacyWrapper: React.FC<LegacyWrapperProps> = ({ 
  component: Component, 
  legacyProps = {},
  className = '' 
}) => {
  const { t } = useTranslation();
  const [useLegacy, setUseLegacy] = useState(true);
  
  const toggleLegacy = () => {
    setUseLegacy(!useLegacy);
  };
  
  return (
    <div className={`legacy-wrapper ${className}`}>
      {/* Toggle button between versions */}
      <div className="legacy-toggle">
        <button
          onClick={toggleLegacy}
          className={`toggle-btn ${useLegacy ? 'legacy-active' : 'new-active'}`}
        >
          {useLegacy ? t('common.use_legacy', 'Use Legacy Version') : t('common.use_new', 'Use New Version')}
        </button>
      </div>
      
      {/* Version notice */}
      {useLegacy ? (
        <div className="legacy-notice">
          <p>{t('common.legacy_notice', 'Using legacy version')}</p>
        </div>
      ) : (
        <div className="new-features">
          <p>{t('common.new_features', 'New features are active')}</p>
        </div>
      )}
      
      {/* Render the component */}
      <Component {...legacyProps} />
    </div>
  );
};
```

#### Using Legacy Wrapper in Components

```typescript
// Example usage in Header.tsx
import { LegacyWrapper } from './legacy/LegacyWrapper';
import { MultilingualChatBot } from './ai/multilingual/MultilingualChatBot';
import SmartChatBot from './ai/SmartChatBot';
import ChatWidget from './legacy/ChatWidget';

const Header: React.FC = () => {
  const [useLegacy, setUseLegacy] = useState(false);
  
  return (
    <header>
      {/* Toggle button */}
      <button 
        onClick={() => setUseLegacy(!useLegacy)}
        className="toggle-btn"
      >
        {useLegacy ? 'Use New' : 'Use Legacy'}
      </button>
      
      {/* Component rendering based on toggle */}
      {useLegacy ? (
        <LegacyWrapper 
          component={MultilingualChatBot} 
          legacyProps={{ useLegacy: true }} 
        />
      ) : (
        <SmartChatBot />
      )}
    </header>
  );
};
```

---

## 🐛 Troubleshooting

### Backend Issues

#### ❌ Port Already in Use

**Problem:**
```
ERROR: [Errno 48] Address already in use
```

**Solution:**
```bash
# Find process using port 8000
# Linux/Mac:
lsof -ti:8000
kill -9 $(lsof -ti:8000)

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port:
uvicorn app.main:app --reload --port 8080
```

---

#### ❌ Module Not Found Error

**Problem:**
```
ModuleNotFoundError: No module named 'app'
```

**Solution:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt

# If still failing, check you're in the right directory
pwd  # Should show .../backend
```

---

#### ❌ Database Errors

**Problem:**
```
sqlalchemy.exc.OperationalError: no such table
```

**Solution:**
```bash
# Delete and recreate database
rm ecommerce.db
python create_admin.py

# Or recreate with test data
python create_test_data.py
```

---

#### ❌ JWT Token Errors

**Problem:**
```
JWTError: Invalid token
```

**Solution:**
1. Check token expiration (default 30 minutes)
2. Verify `SECRET_KEY` in `.env` matches
3. Log out and log back in
4. Clear browser localStorage

```javascript
// Clear localStorage
localStorage.clear();
```

---

### Frontend Issues

#### ❌ Module Not Found

**Problem:**
```
Error: Cannot find module 'react'
```

**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install

# Or specific package
npm install react react-dom
```

---

#### ❌ API Connection Failed

**Problem:**
```
Network Error / CORS Error
```

**Solution:**
1. Check backend is running: http://localhost:8000
2. Verify `.env` file:
```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
```
3. Check CORS settings in `backend/app/main.py`

---

#### ❌ Build Errors

**Problem:**
```
Build failed with TypeScript errors
```

**Solution:**
```bash
# Fix TypeScript errors
npm run type-check

# Fix linting errors
npm run lint:fix

# Clean build
rm -rf dist
npm run build
```

---

#### ❌ Styling Not Applied

**Problem:**
Tailwind CSS classes not working

**Solution:**
```bash
# Restart dev server
# Press Ctrl+C and run:
npm run dev

# Check tailwind.config.js includes your files
# content: ["./src/**/*.{js,jsx,ts,tsx}"]
```

---

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `EADDRINUSE` | Port in use | Kill process or use different port |
| `CORS Error` | Backend CORS misconfigured | Check `allow_origins` in backend |
| `401 Unauthorized` | Token invalid/expired | Re-login to get new token |
| `404 Not Found` | Wrong endpoint | Check API docs at `/docs` |
| `422 Validation Error` | Invalid request data | Check request body format |
| `500 Server Error` | Backend error | Check backend logs |
| `Module not found` | Dependency missing | Run `npm install` or `pip install -r requirements.txt` |

---

## 🔑 Test Credentials

### Admin Account
```
Email: admin@example.com
Password: admin123
```

### Regular Users
```
Email: testuser@example.com
Password: test123

Email: john@example.com
Password: john123
```

### API Testing (cURL)

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get products (authenticated)
TOKEN="your-jwt-token-here"
curl -X GET http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer $TOKEN"

# Create product (admin)
curl -X POST http://localhost:8000/api/v1/admin/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name_en": "New Product",
    "price": 99.99,
    "stock_quantity": 100
  }'
```

---

## 🌐 API Endpoints

### Quick Endpoint Reference

#### Authentication
```bash
POST   /api/v1/auth/register     # Register user
POST   /api/v1/auth/login        # Login user
GET    /api/v1/auth/me           # Get current user (auth required)
```

#### Products
```bash
GET    /api/v1/products          # List products
GET    /api/v1/products/{id}     # Get product details
GET    /api/v1/products/search   # Search products (?q=query)
```

#### Orders
```bash
POST   /api/v1/orders            # Create order (auth required)
GET    /api/v1/orders            # Get user orders (auth required)
GET    /api/v1/orders/{id}       # Get order details (auth required)
PUT    /api/v1/orders/{id}/cancel # Cancel order (auth required)
```

#### Admin
```bash
GET    /api/v1/admin/dashboard/stats    # Dashboard stats (admin)
GET    /api/v1/admin/products           # List products (admin)
POST   /api/v1/admin/products           # Create product (admin)
PUT    /api/v1/admin/products/{id}      # Update product (admin)
DELETE /api/v1/admin/products/{id}      # Delete product (admin)
GET    /api/v1/admin/orders             # List orders (admin)
PUT    /api/v1/admin/orders/{id}/status # Update order status (admin)
```

### API Testing with HTTPie

```bash
# Install HTTPie
pip install httpie

# Login
http POST localhost:8000/api/v1/auth/login \
  email=admin@example.com password=admin123

# Get products
http GET localhost:8000/api/v1/products

# Create product (admin)
http POST localhost:8000/api/v1/admin/products \
  Authorization:"Bearer $TOKEN" \
  name_en="New Product" price:=99.99 stock_quantity:=100
```

---

## ⌨️ Keyboard Shortcuts

### VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+` ` | Toggle terminal |
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+P` | Quick file open |
| `Ctrl+Shift+F` | Search in files |
| `Ctrl+/` | Toggle comment |
| `Alt+Up/Down` | Move line up/down |
| `Ctrl+D` | Select next occurrence |
| `F2` | Rename symbol |
| `Ctrl+Shift+L` | Select all occurrences |

### Browser DevTools

| Shortcut | Action |
|----------|--------|
| `F12` | Open DevTools |
| `Ctrl+Shift+C` | Inspect element |
| `Ctrl+Shift+I` | Toggle DevTools |
| `Ctrl+R` | Reload page |
| `Ctrl+Shift+R` | Hard reload |
| `Ctrl+Shift+Delete` | Clear cache |

---

## 💡 Pro Tips

### Development Tips

#### 🚀 Faster Development

```bash
# Run backend and frontend in one terminal (Linux/Mac)
(cd backend && source venv/bin/activate && uvicorn app.main:app --reload) & \
(cd frontend && npm run dev) &

# Watch backend logs
tail -f backend/logs/app.log

# Auto-restart on file changes
nodemon --exec "uvicorn app.main:app" --watch app
```

#### 🧹 Quick Cleanup

```bash
# Backend cleanup
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type f -name "*.pyc" -delete

# Frontend cleanup
rm -rf node_modules dist

# Database cleanup
rm ecommerce.db
```

#### 📊 Database Management

```bash
# Install SQLite browser
# Ubuntu: sudo apt install sqlitebrowser
# Mac: brew install --cask db-browser-for-sqlite
# Windows: Download from sqlitebrowser.org

# Open database
sqlitebrowser ecommerce.db
```

#### 🔍 Debugging

```python
# Backend debugging
import pdb; pdb.set_trace()  # Add breakpoint

# Or use logging
import logging
logging.debug("Debug message")
```

```typescript
// Frontend debugging
debugger;  // Add breakpoint

// Or use console
console.log("Debug:", variable);
console.table(arrayOfObjects);
console.time("Timer");
// ... code ...
console.timeEnd("Timer");
```

### Performance Tips

#### Frontend Optimization

```typescript
// Lazy load components
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Memoize expensive computations
const total = useMemo(() =>
  items.reduce((sum, item) => sum + item.price, 0),
  [items]
);

// Debounce search input
const debouncedSearch = useDebouce(searchTerm, 500);
```

#### Backend Optimization

```python
# Use select_related to reduce queries
products = db.query(Product).options(
    selectinload(Product.category)
).all()

# Cache expensive computations
from functools import lru_cache

@lru_cache(maxsize=100)
def get_categories():
    return db.query(Category).all()
```

### Security Tips

```bash
# Generate secure secret key
python -c "import secrets; print(secrets.token_hex(32))"

# Check for security vulnerabilities
# Python
pip install safety
safety check

# Node.js
npm audit
npm audit fix
```

---

## 📚 Quick Links

### Documentation
- [Full Documentation](COMPLETE_PROJECT_DOCUMENTATION.md)
- [Features Checklist](FEATURES_CHECKLIST.md)
- [Quick Start Guide](README_QUICK_START.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Contributing Guide](CONTRIBUTING.md)

### External Resources
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org)

### Tools
- [Swagger UI](http://localhost:8000/docs)
- [ReDoc](http://localhost:8000/redoc)
- [Frontend Dev Server](http://localhost:5173)
- [Backend API](http://localhost:8000)

---

## 🎓 Learning Resources

### Tutorials

```bash
# Backend
# 1. Create a new endpoint
# 2. Add database model
# 3. Create Pydantic schema
# 4. Write tests
# 5. Document in Swagger

# Frontend
# 1. Create component
# 2. Add to router
# 3. Create API service
# 4. Add state management
# 5. Write tests
```

### Best Practices

✅ **DO:**
- Write tests for new features
- Use TypeScript for type safety
- Follow PEP 8 and Airbnb style guides
- Commit frequently with clear messages
- Document complex logic
- Handle errors gracefully

❌ **DON'T:**
- Commit directly to main
- Skip tests
- Hardcode sensitive data
- Ignore linting errors
- Leave console.logs in production
- Skip code reviews

---

## 🆘 Get Help

### Stuck? Try This Order:

1. **Check this Quick Reference** - You're here!
2. **Check Full Documentation** - [COMPLETE_PROJECT_DOCUMENTATION.md](COMPLETE_PROJECT_DOCUMENTATION.md)
3. **Check API Docs** - http://localhost:8000/docs
4. **Search Issues** - [GitHub Issues](https://github.com/rza1914/multilingual-ecommerce-template/issues)
5. **Ask for Help** - [GitHub Discussions](https://github.com/rza1914/multilingual-ecommerce-template/discussions)

---

<div align="center">

**⚡ Quick, Easy, Copy-Paste Ready ⚡**

[⬆ Back to Top](#-quick-reference-guide)

Made with ❤️ for developers

</div>
