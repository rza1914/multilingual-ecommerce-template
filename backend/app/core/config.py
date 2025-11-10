# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    # پروژه
    PROJECT_NAME: str = "Multilingual E-Commerce"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"

    # CORS - اینا رو حتماً اضافه کن
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://multilingual-ecommerce-template-ohimnpkxr.vercel.app",
        "https://multilingual-ecommerce-template-j multilingua l-ecommerce-template-j0yyw6oms.vercel.app",
    ]

    # امنیت
    SECRET_KEY: str
    SESSION_SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # سشن
    SESSION_MAX_AGE: int = 86400
    SESSION_COOKIE_NAME: str = "ecommerce_session"
    SESSION_COOKIE_SECURE: bool = False
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "lax"

    # دیتابیس
    DATABASE_URL: str = "sqlite:///./ecommerce.db"

    # ایمیل
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = 587
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None

    # AI
    GROQ_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    GOOGLE_GEMINI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"  # این خط مهمه!

# این خط رو حتماً اضافه کن
settings = Settings()