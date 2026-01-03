# Changelog

All notable changes to the Multilingual E-commerce Template will be documented in this file.

## [v1.0.3] - 2025-01-15

### 🐛 Fixed

- Fixed `no such column: products.is_active` database schema mismatch error
- Added database migration script to add missing columns to products table

### ✨ Added

- `backend/app/migrations/add_missing_columns.py` - Migration script for database schema updates
- `backend/run_migration.py` - Easy-to-use migration runner script
- `backend/seed_db.py` - Database seeding script with multilingual sample data

### 🛠️ Changed

- Updated products API with better error handling for missing columns
- Added graceful fallback when database schema doesn't match model

## [v1.0.1] - 2025-01-15

### 🐛 Fixed

- Fixed database connection issues
- Improved error handling in API endpoints

## [v1.0.0] - 2025-11-30

### 🎯 Initial Release - Production Ready

This is the initial production-ready release of the Multilingual E-commerce Template, featuring a complete set of functionalities for a modern e-commerce platform with multilingual and RTL support.

### ✨ Features

- **Multilingual Support**: Full i18n support with English, Persian, and Arabic
- **RTL/LTR Support**: Dynamic RTL/LTR layout switching with CSS optimization
- **Complete E-commerce Flow**:
  - Product browsing and search
  - Shopping cart functionality
  - Checkout process
  - Order management
  - User authentication and profiles
- **AI Integration**: Smart search and AI-powered chatbot
- **Admin Panel**: Complete administrative interface for product and order management
- **Responsive Design**: Mobile-first approach with adaptive layouts

### 🚀 Performance Optimizations

- **Bundle Size Reduction**: Main JavaScript bundle reduced by 81% (from ~600kB to ~110kB)
- **Code Splitting**: Route-based and component-based code splitting implemented
- **Image Optimization**: Lazy loading with intersection observer and progressive loading
- **Asset Optimization**: Preconnect hints for critical resources, font optimization
- **Caching Strategy**: Comprehensive service worker with multi-tier caching (static assets, images, API responses)

### 🛠️ Technical Improvements

- **Build Optimizations**: Terser minification with console.log removal, optimized chunking
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS, Vite, FastAPI
- **Testing**: Unit tests, integration tests, and E2E tests with Playwright
- **Accessibility**: Full ARIA compliance and keyboard navigation support

### 🔧 Bug Fixes

- Fixed multiple TypeScript warnings and unused imports
- Resolved image loading and fallback issues
- Fixed RTL layout inconsistencies
- Resolved authentication flow issues
- Fixed cart functionality edge cases

### 📋 Environment Variables Documentation

#### Frontend Environment Variables
```
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000
VITE_WS_PORT=8000
VITE_WS_PATH=/ws/chat
VITE_GROQ_API_KEY=your_groq_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TAWKTO_PROPERTY_ID=your_tawkto_property_id
VITE_TAWKTO_WIDGET_ID=your_tawkto_widget_id
```

#### Backend Environment Variables
```
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
GROQ_API_KEY=your_groq_api_key
SENTRY_DSN=your_sentry_dsn
```

### 📦 Deployment Instructions

#### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL database

#### Frontend Deployment
1. Install dependencies: `npm install`
2. Build for production: `npm run build`
3. Serve the `dist` folder with a web server

#### Backend Deployment
1. Install Python dependencies: `pip install -r requirements.txt`
2. Set up environment variables
3. Run database migrations
4. Start the application: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### 🆕 New Components Added
- ProductImage with optimized loading
- Enhanced service worker for caching
- LazyImage component for performance
- Improved chatbot with SSE support

### ⚠️ Breaking Changes
- None - this is the initial release

### 📈 Performance Metrics
- Initial bundle size: 110.10 kB (gzipped: 28.97 kB)
- Improved loading times by 60%+
- Enhanced caching with offline capabilities

## 2026-01-03

### Changed
- **Cart Sidebar UI Refinement**
  - Applied glassmorphism design (semi-transparent blurred background)
  - Made layout more compact (reduced padding and spacing)
  - Improved visual hierarchy with clear Header/Items/Footer sections
  - Added smooth slide-in/out animations
  - Enhanced RTL/LTR support using CSS logical properties
  - Added dark mode support
  - Improved accessibility (keyboard navigation, ARIA labels, focus states)
  - Added responsive design for mobile devices

### Architecture Decisions
- **i18n Strategy**: Decided to remove `flattenTranslations` and use native i18next nested key support
- Root cause identified: `flattenTranslations()` was losing deeply nested keys during processing

### Planned Changes
- Remove `flattenTranslations` function from `src/config/i18n.ts`
- Update i18n initialization to pass nested JSON directly
- Add TypeScript type definitions for translation keys (optional enhancement)

### Technical Details
- i18next natively supports `t('auth.validation.required')` syntax
- No custom flattening logic needed
- Configuration requires: `keySeparator: '.'` and `returnObjects: true`