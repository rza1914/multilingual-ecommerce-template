# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # ═══════════════════════════════════════════════════════════
    # PROJECT INFO
    # ═══════════════════════════════════════════════════════════
    PROJECT_NAME: str = "Multilingual E-Commerce API"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    
    # ═══════════════════════════════════════════════════════════
    # DATABASE
    # ═══════════════════════════════════════════════════════════
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    
    # ═══════════════════════════════════════════════════════════
    # CORS - 🔥 اینجا مهمه!
    # ═══════════════════════════════════════════════════════════
    @property
    def BACKEND_CORS_ORIGINS(self) -> List[str]:
        """
        CORS origins - می‌تونه از ENV بیاد یا hardcoded باشه
        """
        # اگه توی ENV تنظیم شده، از اونجا بخون
        env_origins = os.getenv("BACKEND_CORS_ORIGINS", "")
        if env_origins:
            # فرمت: "url1,url2,url3"
            return [origin.strip() for origin in env_origins.split(",")]
        
        # وگرنه از لیست پیش‌فرض استفاده کن
        return [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8080",
            "https://multilingual-ecommerce-template.vercel.app",
            "https://*.vercel.app",
        ]
    
    # ═══════════════════════════════════════════════════════════
    # SESSION
    # ═══════════════════════════════════════════════════════════
    SESSION_SECRET_KEY: str = os.getenv(
        "SESSION_SECRET_KEY", 
        "your-super-secret-key-change-in-production-please-make-it-long"
    )
    SESSION_COOKIE_NAME: str = "session"
    SESSION_MAX_AGE: int = 1209600  # 14 days
    SESSION_COOKIE_SECURE: bool = ENVIRONMENT == "production"
    SESSION_COOKIE_SAMESITE: str = "lax"
    
    # ═══════════════════════════════════════════════════════════
    # SECURITY
    # ═══════════════════════════════════════════════════════════
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "your-secret-key-for-jwt-tokens-change-this-in-production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        case_sensitive = True
        env_file = ".env"

# ═══════════════════════════════════════════════════════════
# SETTINGS INSTANCE
# ═══════════════════════════════════════════════════════════
settings = Settings()