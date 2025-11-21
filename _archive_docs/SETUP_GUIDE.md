# 🚀 Complete Setup Guide

This guide will walk you through setting up the development environment, CI/CD, and code quality tools for the Multilingual E-Commerce Template.

## 📋 Table of Contents

1. [Initial Setup](#initial-setup)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [CI/CD Configuration](#cicd-configuration)
5. [Pre-commit Hooks](#pre-commit-hooks)
6. [Code Quality Tools](#code-quality-tools)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🛠️ Initial Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**

Check versions:
```bash
node --version    # Should be 18.x or higher
npm --version
python --version  # Should be 3.10 or higher
git --version
```

### Clone Repository

```bash
git clone https://github.com/rza1914/multilingual-ecommerce-template.git
cd multilingual-ecommerce-template
```

---

## 🐍 Backend Setup

### 1. Create Virtual Environment

**Linux/Mac:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
```

**Windows:**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs:
- FastAPI, Uvicorn (web framework)
- SQLAlchemy (ORM)
- Authentication libraries
- **Testing tools**: pytest, pytest-cov, pytest-asyncio
- **Code quality**: black, flake8, mypy

### 3. Configure Environment

Create `.env` file in `backend/`:

```env
DATABASE_URL=sqlite:///./ecommerce.db
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Initialize Database

```bash
# Create admin user
python create_admin.py

# Create test data (optional)
python create_test_data.py
```

### 5. Run Backend Server

```bash
uvicorn app.main:app --reload
```

Server runs at: **http://localhost:8000**

API docs at: **http://localhost:8000/docs**

---

## ⚛️ Frontend Setup

### 1. Navigate to Frontend

```bash
cd ../frontend  # From backend directory
# OR
cd frontend     # From project root
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- React, TypeScript, Vite
- Tailwind CSS, Lucide icons
- **Testing tools**: Jest, React Testing Library
- **Code quality**: ESLint, Prettier, Husky, lint-staged

### 3. Configure Environment

Create `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

### 4. Setup Pre-commit Hooks

```bash
npx husky install
```

### 5. Run Frontend Server

```bash
npm run dev
```

Server runs at: **http://localhost:5173**

---

## 🔄 CI/CD Configuration

The project includes a complete GitHub Actions workflow that automatically:

### What It Does

✅ **Backend Tests**
- Runs pytest with coverage (minimum 70%)
- Checks code formatting with Black
- Lints code with Flake8

✅ **Frontend Tests**
- Runs npm tests with coverage (minimum 60%)
- Checks linting with ESLint
- Validates TypeScript types

✅ **Build**
- Builds frontend production bundle
- Verifies backend can start
- Uploads build artifacts

### Configuration Files

- `.github/workflows/test-and-deploy.yml` - Main CI/CD workflow
- `backend/pytest.ini` - Pytest configuration
- `backend/setup.cfg` - Flake8 and coverage settings
- `backend/pyproject.toml` - Black formatter settings
- `frontend/.prettierrc` - Prettier configuration

### Badges

Status badges in README.md show:
- ✅/❌ Tests passing/failing
- 📊 Code coverage percentage
- 🎨 Code style compliance

---

## 🪝 Pre-commit Hooks

Pre-commit hooks ensure code quality before commits are made.

### Setup

```bash
cd frontend
npm install  # Installs Husky automatically
npx husky install
```

### What Runs on Commit

**Frontend (automatic):**
- ESLint fixes issues
- Prettier formats code
- TypeScript type checking

**Backend (automatic):**
- Black checks formatting
- Flake8 checks for errors

### Manual Trigger

```bash
# Run pre-commit checks manually
git commit --dry-run
```

### Skip Hooks (NOT RECOMMENDED)

```bash
git commit --no-verify
```

---

## 🎨 Code Quality Tools

### Frontend Tools

#### ESLint (Linting)
```bash
cd frontend
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
```

#### Prettier (Formatting)
```bash
npm run format        # Format all files
```

#### TypeScript (Type Checking)
```bash
npm run type-check    # Check types
```

### Backend Tools

#### Black (Code Formatter)
```bash
cd backend
black app/            # Format code
black --check app/    # Check without changing
```

#### Flake8 (Linter)
```bash
flake8 app/                           # Check all files
flake8 app/ --statistics              # Show statistics
```

#### MyPy (Type Checker - Optional)
```bash
mypy app/             # Type checking
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Verbose output
pytest -v

# Run specific test
pytest tests/test_auth.py

# Generate HTML coverage report
pytest --cov=app --cov-report=html
# Open htmlcov/index.html in browser
```

**Coverage Requirements:** Minimum 70%

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# Run specific test
npm test -- ProductCard.test.tsx
```

**Coverage Requirements:** Minimum 60%

---

## 🧹 Cleanup Scripts

Clean temporary and unnecessary files.

### Linux/Mac

```bash
# Basic cleanup
./scripts/cleanup.sh

# Deep cleanup (includes node_modules, database)
./scripts/cleanup.sh --deep
```

### Windows

```cmd
# Basic cleanup
scripts\cleanup.bat

# Deep cleanup
scripts\cleanup-deep.bat
```

### What Gets Removed

- `__pycache__` directories
- `.pyc`, `.pyo`, `.pyd` files
- `node_modules` (deep cleanup only)
- Build directories (`dist`, `build`)
- Coverage reports
- Temporary markdown files
- Test/diagnostic scripts
- Log files

---

## 🐛 Troubleshooting

### Backend Issues

**Issue:** `ModuleNotFoundError`
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate      # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Issue:** Database errors
```bash
# Delete database and recreate
rm ecommerce.db
python create_admin.py
```

**Issue:** Port 8000 already in use
```bash
# Kill process on port 8000
# Linux/Mac:
lsof -ti:8000 | xargs kill -9
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend Issues

**Issue:** `Module not found`
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue:** ESLint/Prettier errors
```bash
# Fix automatically
npm run lint:fix
npm run format
```

**Issue:** Port 5173 already in use
```bash
# Vite will automatically use next available port
# Or specify port:
npm run dev -- --port 5174
```

### CI/CD Issues

**Issue:** Tests failing in CI but passing locally
- Ensure all dependencies are in `requirements.txt` / `package.json`
- Check environment variables
- Verify database setup in CI

**Issue:** Coverage below threshold
```bash
# Check coverage locally
pytest --cov=app --cov-report=term-missing
npm test -- --coverage

# Add tests to increase coverage
```

---

## 📚 Additional Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Pytest Docs**: https://docs.pytest.org/
- **Jest Docs**: https://jestjs.io/

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Backend server runs without errors
- [ ] Frontend server runs without errors
- [ ] Can login with test credentials
- [ ] API docs accessible at `/docs`
- [ ] All backend tests pass: `pytest`
- [ ] All frontend tests pass: `npm test`
- [ ] Linting passes: `flake8 app/` and `npm run lint`
- [ ] Pre-commit hooks work: make a test commit
- [ ] GitHub Actions workflow runs (after first push)

---

## 🎉 You're All Set!

Your development environment is now fully configured with:
- ✅ Backend and Frontend running
- ✅ CI/CD pipeline ready
- ✅ Pre-commit hooks active
- ✅ Code quality tools configured
- ✅ Tests passing

Happy coding! 🚀

---

Need help? Check [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue.
