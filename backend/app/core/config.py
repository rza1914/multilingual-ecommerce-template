# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # ═══════════════════════════════════════════════════════════
    # PROJECT INFO
    # ═══════════════════════════════════════════════════════════
    PROJECT_NAME: str = "Multilingual E-Commerce API"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # ═══════════════════════════════════════════════════════════
    # DATABASE
    # ═══════════════════════════════════════════════════════════
    DATABASE_URL: str = "sqlite:///./ecommerce.db"
    
    # ═══════════════════════════════════════════════════════════
    # SECURITY
    # ═══════════════════════════════════════════════════════════
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # ← اضافه کن
    
    # ═══════════════════════════════════════════════════════════
    # SESSION
    # ═══════════════════════════════════════════════════════════
    SESSION_SECRET_KEY: str = "session-secret-key-change-in-production"
    SESSION_COOKIE_NAME: str = "ecommerce_session"
    SESSION_MAX_AGE: int = 86400
    SESSION_COOKIE_SECURE: bool = False
    SESSION_COOKIE_HTTPONLY: bool = True  # ← اضافه کن
    SESSION_COOKIE_SAMESITE: str = "lax"
    
    # ═══════════════════════════════════════════════════════════
    # CORS
    # ═══════════════════════════════════════════════════════════
    @property
    def ALL_CORS_ORIGINS(self) -> List[str]:
        origins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "https://multilingual-ecommerce-template.vercel.app",
            "https://multilingual-ecommerce-template-fom83s057.vercel.app",
            "https://multilingual-ecommerce-template-*.vercel.app",  # برای preview URLs
        ]
        # اگر محیط‌متغیر ست کردی (بهتره)
        frontend_url = os.getenv("FRONTEND_URL")
        if frontend_url:
            origins.append(frontend_url)
        return origins
    
    # ═══════════════════════════════════════════════════════════
    # EMAIL (Optional)
    # ═══════════════════════════════════════════════════════════
    SMTP_HOST: Optional[str] = None  # ← اضافه کن
    SMTP_PORT: Optional[int] = None  # ← اضافه کن
    SMTP_TLS: bool = True  # ← اضافه کن
    EMAILS_FROM_NAME: Optional[str] = None  # ← اضافه کن
    EMAILS_FROM_EMAIL: Optional[str] = None
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        # ✅ مهم: اجازه به فیلدهای extra
        extra = "allow"  # ← این رو اضافه کن یا تغییر بده

# ═══════════════════════════════════════════════════════════
# SETTINGS INSTANCE
# ═══════════════════════════════════════════════════════════
settings = Settings()