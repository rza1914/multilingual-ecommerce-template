# Installation Guide

## Prerequisites
- Node.js 18+ with npm
- Python 3.10+
- PostgreSQL (for production) or SQLite (for development)
- Git

## Quick Start

### 1. Clone Repository
```
git clone https://github.com/username/template-name.git
cd template-name
```

### 2. Backend Setup
```
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
```

### 3. Configure Environment
```
cp .env.example .env
# Edit .env with your settings
```

### 4. Database Setup
```
alembic upgrade head
python create_admin.py
```

### 5. Frontend Setup
```
cd frontend
npm install
npm run dev
```

### 6. Run Application
Backend:
```
uvicorn app.main:app --reload
```

Frontend:
```
npm run dev
```

## Docker Deployment
```
docker-compose up --build
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key (32+ chars)
- `SESSION_SECRET_KEY`: Session encryption key
- `GROQ_API_KEY`: Groq API key for AI
- `OPENAI_API_KEY`: OpenAI API key
- `SMTP_*`: Email settings (optional)

### Frontend (.env)
- `VITE_API_URL`: Backend API URL
- `VITE_WS_URL`: WebSocket URL (optional)

## Admin Access
- Email: `admin@example.com`
- Password: `admin123`
- Change password after first login

## Troubleshooting
- Check that all environment variables are set
- Ensure PostgreSQL is running if using it
- Verify Redis is available if caching is enabled
- Check logs for specific error messages