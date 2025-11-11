# Multilingual AI E-Commerce Platform - React 18 + FastAPI + PostgreSQL + Groq AI

**Live Demo:** https://multilingual-ecommerce-template.vercel.app  
**Admin Demo:** https://admin.multilingual-ecommerce-template.vercel.app  
**Demo Credentials:** `admin@demo.com` / `admin123`

## Features
- Full RTL Support (Persian + Arabic)
- AI Smart Search + Image Search + ChatBot
- Admin Dashboard with AI Insights
- JWT + Refresh Tokens + CSRF Protection
- PostgreSQL + Alembic Migrations
- Redis Caching + Rate Limiting
- Docker + Docker Compose Ready
- 7-Day Refresh Tokens
- Multi-language Product Descriptions

## Tech Stack
### Frontend
- React 18 + TypeScript
- Tailwind CSS + HeadlessUI
- i18next + RTL Support
- Vite + React Router v6
- Axios + React Hook Form

### Backend
- FastAPI + Python 3.10+
- SQLAlchemy + Alembic
- JWT + OAuth2
- bcrypt + Passlib
- Pydantic + PyJWT

### Database & Cache
- PostgreSQL (with SQLite fallback)
- Redis (optional)
- Session Management

### AI Services
- Groq + OpenAI + Gemini
- Vector Search
- Image Recognition
- Natural Language Processing

## Installation
### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (or use SQLite for dev)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings
alembic upgrade head
python create_admin.py
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Docker Setup
```bash
docker-compose build
docker-compose up
```

## API Documentation
Access interactive API docs at `/api/v1/docs`

## Environment Variables
### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost/db
SECRET_KEY=your-super-secret-key-here
SESSION_SECRET_KEY=your-session-secret-key-here
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_GEMINI_API_KEY=your-google-gemini-api-key
SMTP_USER=email@domain.com
SMTP_PASSWORD=app-password
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## Security Features
- CSRF Protection (Session-based)
- JWT with Refresh Tokens
- Password Hashing (bcrypt)
- Input Validation (Pydantic)
- Rate Limiting (AI services)
- Secure Session Management

## Performance Optimizations
- Redis Caching
- Frontend Code Splitting
- Database Indexing
- Async Endpoints
- ETag Support

## Deployment
### Vercel Frontend
````
vercel --build-env VITE_API_URL=https://your-api.com
```

### Render Backend
````
# Use provided render.yaml
```

### Docker Production
````
docker-compose -f docker-compose.prod.yml up
```

## Admin Panel Features
- Dashboard Analytics
- Product Management
- Order Tracking
- User Management
- AI-Powered Insights
- Revenue Charts
- Inventory Management

## AI Capabilities
- Smart Product Search
- ChatBot Support
- Image-Based Search
- Product Description Generation
- Trend Analysis
- Recommendation Engine

## RTL Support
- Persian (fa) + Arabic (ar) translations
- RTL layout for RTL languages
- Bidirectional UI components
- RTL-aware CSS

## File Structure
```
├── backend/          # FastAPI Backend
│   ├── app/          # Application modules
│   │   ├── api/      # API routes
│   │   ├── models/   # SQLAlchemy models
│   │   ├── schemas/  # Pydantic schemas
│   │   ├── services/ # Business logic
│   │   └── core/     # Core utilities
│   ├── alembic/      # Database migrations
│   └── requirements.txt
├── frontend/         # React Frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── contexts/   # React contexts
│   │   ├── hooks/      # Custom hooks
│   │   └── services/   # API services
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml
```

## Support
- Issues: https://github.com/yourusername/issues
- Email: support@yoursite.com

## License
Commercial License - Single Application