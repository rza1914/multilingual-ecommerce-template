# Multilingual AI E-Commerce Platform - React 18 + FastAPI + PostgreSQL + DeepSeek AI

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
- Enhanced AI Integration with DeepSeek API
- Cross-Environment API Key Loading
- Server-Sent Events (SSE) Streaming
- Real-time Chat Interface

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
- DeepSeek + Groq + OpenAI + Gemini
- Server-Sent Events (SSE) Streaming
- Vector Search
- Image Recognition
- Natural Language Processing

## Installation
### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (or use SQLite for dev)
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings
python init_db.py  # Initialize the database
uvicorn app.main:app --reload
```

### Database Migration (if needed)
If you encounter database schema errors like `no such column: products.is_active`, run the migration script:

```bash
cd backend
python run_migration.py
```

This will:
1. Check your current database schema
2. Add any missing columns to the products table
3. Show you the updated schema

### First-Time Database Setup
For first-time setup, initialize the database:

```bash
cd backend
python init_db.py
```

This creates all required tables in the database.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Complete Installation (Root)
```bash
# Install all dependencies for both frontend and backend
npm run install-all

# Run both frontend and backend in development mode
npm run dev-all
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
DEEPSEEK_API_KEY=your-deepseek-api-key
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_GEMINI_API_KEY=your-google-gemini-api-key
SMTP_USER=email@domain.com
SMTP_PASSWORD=app-password
```

### Alternative Environment Files
The system supports multiple .env files with the following priority:
1. `.env.production` - For production environment
2. `.env.development` - For development environment
3. `.env` - Default/fallback environment

API keys can be specified in any of these files using these variable names:
- `DEEPSEEK_API_KEY` - Standard variable name
- `DEEPSEEK_API_KEY_PROD` - Production-specific variable
- `DEEPSEEK_API_KEY_DEV` - Development-specific variable

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

## Production Deployment

### Frontend Production Build
```bash
cd frontend
npm run build
# Output will be in the `dist` folder
```

### Backend Production Deployment
```bash
cd backend
# Set production environment variables
export DATABASE_URL=postgresql://user:pass@prod-db/db
export SECRET_KEY=your-production-secret-key
# Run without reload flag for production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Environment Variables (Production)

#### Frontend Environment Variables
```bash
VITE_API_URL=https://your-backend-domain.com/api/v1
VITE_WS_URL=wss://your-backend-domain.com
VITE_GROQ_API_KEY=your_production_groq_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TAWKTO_PROPERTY_ID=your_tawkto_property_id
VITE_TAWKTO_WIDGET_ID=your_tawkto_widget_id
```

#### Backend Environment Variables
```bash
DATABASE_URL=postgresql://user:pass@prod-db/db
SECRET_KEY=your-ultra-secure-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
SMTP_SERVER=smtp.gmail.com  # or your SMTP provider
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASSWORD=your_app_password
GROQ_API_KEY=your_production_groq_api_key
DEEPSEEK_API_KEY=your_production_deepseek_api_key
SENTRY_DSN=your_sentry_dsn  # Optional but recommended for error tracking
```

### Vercel Frontend Deployment
```bash
# Deploy to Vercel
vercel --prod --env VITE_API_URL=https://your-api.com/api/v1
```

### Render Backend Deployment
```bash
# Use the provided render.yaml file
# Update the environment variables in the Render dashboard
```

### Docker Production Deployment
```bash
# Build and run in production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Nginx Reverse Proxy Configuration (Recommended for Production)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (React app build files)
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
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
- Real-time ChatBot with SSE Streaming
- Image-Based Search
- Product Description Generation
- Trend Analysis
- Recommendation Engine
- Multi-Model AI Support (DeepSeek, Groq, OpenAI, Gemini)
- Cross-Environment API Key Management
- Enhanced Persian/Arabic Language Processing

## Multilingual & RTL Support
- Persian (fa) + Arabic (ar) + English (en) translations
- Advanced i18n with translation namespace support
- RTL layout for RTL languages
- Bidirectional UI components
- RTL-aware CSS
- Dynamic language switching
- Translation fallback system

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

## 🌐 Internationalization (i18n)

This project uses [i18next](https://www.i18next.com/) for internationalization with full RTL support for Persian.

### Features

- ✅ Nested translation keys with dot notation (`auth.validation.required`)
- ✅ TypeScript support with compile-time key validation
- ✅ RTL/LTR automatic switching
- ✅ Development-time missing key detection
- ✅ Language persistence in localStorage

### Quick Start

```typescript
import { useTranslation } from 'react-i18next';

function LoginForm() {
  const { t } = useTranslation();

  return (
    <form>
      <label>{t('auth.email')}</label>
      <button>{t('auth.login')}</button>
    </form>
  );
}
```

See [SETUP.md](./SETUP.md#i18n-configuration) for detailed configuration.

### UI Components

#### Cart Sidebar

The cart sidebar features a modern glassmorphism design:

- **Glass Effect**: Semi-transparent background with blur
- **Compact Layout**: Optimized spacing for better content density
- **Animations**: Smooth slide transitions
- **RTL/LTR**: Full bidirectional text support
- **Dark Mode**: Automatic theme adaptation
- **Accessibility**: Keyboard navigation and screen reader support

```jsx
import { CartSidebar } from ' @/components/cart';

<CartSidebar
  isOpen={isCartOpen}
  onClose={closeCart}
  items={cartItems}
  total={cartTotal}
  onUpdateQuantity={handleUpdateQuantity}
  onRemoveItem={handleRemoveItem}
  onCheckout={handleCheckout}
/>
```