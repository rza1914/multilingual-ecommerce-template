from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.api.v1 import api_router
from app.api.v1.websocket_endpoints import router as websocket_router  # Use the proper WebSocket endpoints with JWT auth
from app.core.config import settings

app = FastAPI(
    title="Multilingual E-Commerce API",
    version="2.0.0",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
)

# ═══════════════════════════════════════════════════════════
# MIDDLEWARE STACK
# ═══════════════════════════════════════════════════════════

# 1. SessionMiddleware (اول از همه!)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SESSION_SECRET_KEY,  # ✅ از .env
    session_cookie=settings.SESSION_COOKIE_NAME,
    max_age=settings.SESSION_MAX_AGE,
    https_only=settings.SESSION_COOKIE_SECURE,  # True در production
    same_site=settings.SESSION_COOKIE_SAMESITE,
)

# 2. CORS (بعد از Session)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,  # ✅ از config
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count", "X-Page-Count"],  # برای pagination
)

# ═══════════════════════════════════════════════════════════
# ROUTES
# ═══════════════════════════════════════════════════════════

app.include_router(api_router, prefix="/api/v1")
# Include WebSocket router with /ws prefix to match frontend expectations
app.include_router(websocket_router, prefix="/ws")  # Use the router with JWT authentication

# ═══════════════════════════════════════════════════════════
# HEALTH & ROOT
# ═══════════════════════════════════════════════════════════

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to Multilingual E-Commerce API",
        "docs": "/api/v1/docs",
        "version": "2.0.0",
    }

# ═══════════════════════════════════════════════════════════
# STARTUP EVENT
# ═══════════════════════════════════════════════════════════

@app.on_event("startup")
async def startup_event():
    print("=" * 60)
    print("🚀 Multilingual E-Commerce API v2.0.0")
    print(f"🌍 Environment: {settings.ENVIRONMENT}")
    print(f"📡 API Docs: http://127.0.0.1:8000/api/v1/docs")
    print(f"✅ CORS Origins: {len(settings.BACKEND_CORS_ORIGINS)} configured")
    print("=" * 60)