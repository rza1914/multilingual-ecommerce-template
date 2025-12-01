# README2.md - Development & CORS Fix Guide

## Quick Status
- Backend: http://localhost:8000 (✓ alive)
- Frontend: http://localhost:5173
- CORS: **CONFIGURED** → Working via FastAPI CORSMiddleware

## Fix Applied
```diff
# Backend CORS is already properly configured in backend/app/main.py:
- FastAPI CORSMiddleware with allow_origins=settings.BACKEND_CORS_ORIGINS
- Origins include: http://localhost:5173, http://localhost:3000, http://127.0.0.1:5173
- Credentials allowed: allow_credentials=True
- Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
- Headers: ["*"] with exposed headers for pagination
```

## Run Instructions
1. Backend: `cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
2. Frontend: `cd frontend && npm run dev`

## Verification
```bash
curl -H "Origin: http://localhost:5173" -X OPTIONS http://localhost:8000/api/v1/products/
```

## Security Notes
- Never log VITE_ vars in prod.
- Use Vite proxy OR backend CORS — not both.
- Backend CORS configuration is environment-aware (development vs production)
- Production configurations restrict origins to specific domains only

## Pending Tasks
- [ ] Add HTTPS in production
- [ ] Write e2e tests with Playwright
- [ ] Verify all API endpoints are accessible from frontend
- [ ] Implement error boundaries for network failures