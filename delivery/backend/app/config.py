"""
Configuration for Multilingual E-Commerce Backend
"""
import os
import secrets
from typing import List
from pydantic_settings import BaseSettings
from pathlib import Path
from dotenv import load_dotenv

# Force load all possible .env files
for env_file in [".env.production", ".env.development", ".env"]:
    env_path = Path(__file__).parent.parent.parent / env_file
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Project info
    PROJECT_NAME: str = "Multilingual E-Commerce"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "sqlite:///./ecommerce.db"
    )

    # Security keys
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", secrets.token_urlsafe(32)
    )
    SESSION_SECRET_KEY: str = os.getenv(
        "SESSION_SECRET_KEY", secrets.token_urlsafe(32)
    )
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")

    # JWT settings
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    )
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(
        os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7")
    )

    # Email settings (optional)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "")
    EMAILS_FROM_NAME: str = os.getenv("EMAILS_FROM_NAME", "E-commerce Template")

    # CORS origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://multilingual-ecommerce-template-ohimnpkxr.vercel.app",
        "https://multilingual-ecommerce-template-j0yyw6oms.vercel.app",
    ]
    # Allow override from env
    CORS_ORIGINS_OVERRIDE: str = os.getenv("BACKEND_CORS_ORIGINS", "")
    if CORS_ORIGINS_OVERRIDE:
        BACKEND_CORS_ORIGINS = CORS_ORIGINS_OVERRIDE.split(",")

    # Session configuration
    SESSION_MAX_AGE: int = int(os.getenv("SESSION_MAX_AGE", "86400"))
    SESSION_COOKIE_NAME: str = os.getenv("SESSION_COOKIE_NAME", "ecommerce_session")
    SESSION_COOKIE_SECURE: bool = os.getenv("SESSION_COOKIE_SECURE", "false").lower() == "true"
    SESSION_COOKIE_HTTPONLY: bool = os.getenv("SESSION_COOKIE_HTTPONLY", "true").lower() == "true"
    SESSION_COOKIE_SAMESITE: str = os.getenv("SESSION_COOKIE_SAMESITE", "lax")

    # DeepSeek AI service configuration
    DEEPSEEK_API_KEY: str = ""

    @property
    def deepseek_api_key(self) -> str:
        key = (
            os.getenv("DEEPSEEK_API_KEY_PROD") or
            os.getenv("DEEPSEEK_API_KEY_DEV") or
            os.getenv("DEEPSEEK_API_KEY") or
            self.DEEPSEEK_API_KEY or
            ""
        )
        if not key:
            raise ValueError("DEEPSEEK_API_KEY not found in any .env file or environment")
        return key

    DEEPSEEK_BASE_URL: str = (
        os.getenv("DEEPSEEK_BASE_URL_PROD") or
        os.getenv("DEEPSEEK_BASE_URL_DEV") or
        os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
    )
    DEEPSEEK_MODEL: str = (
        os.getenv("DEEPSEEK_MODEL_PROD") or
        os.getenv("DEEPSEEK_MODEL_DEV") or
        os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
    )
    DEEPSEEK_RATE_LIMIT_PER_MINUTE: int = int(
        os.getenv("DEEPSEEK_RATE_LIMIT_PER_MINUTE_PROD") or
        os.getenv("DEEPSEEK_RATE_LIMIT_PER_MINUTE_DEV") or
        os.getenv("DEEPSEEK_RATE_LIMIT_PER_MINUTE", "30")
    )
    DEEPSEEK_DAILY_LIMIT: int = int(
        os.getenv("DEEPSEEK_DAILY_LIMIT_PROD") or
        os.getenv("DEEPSEEK_DAILY_LIMIT_DEV") or
        os.getenv("DEEPSEEK_DAILY_LIMIT", "1000")
    )

    # Helper properties
    @property
    def IS_DEVELOPMENT(self) -> bool:
        return self.ENVIRONMENT.lower() == "development"

    @property
    def IS_PRODUCTION(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    @property
    def DEBUG(self) -> bool:
        return self.IS_DEVELOPMENT

    @property
    def EMAIL_CONFIGURED(self) -> bool:
        return bool(self.SMTP_USER and self.SMTP_PASSWORD and self.EMAILS_FROM_EMAIL)

    @property
    def DEEPSEEK_CONFIGURED(self) -> bool:
        """Check if DeepSeek API key is properly configured"""
        return bool(self.DEEPSEEK_API_KEY)

    # Validation
    def validate_security_keys(self):
        if len(self.SECRET_KEY) < 32 and "token_urlsafe" not in self.SECRET_KEY:
            raise ValueError(
                "❌ CRITICAL: SECRET_KEY must be at least 32 characters long! Use secrets.token_urlsafe(32)."
            )
        if len(self.SESSION_SECRET_KEY) < 32 and "token_urlsafe" not in self.SESSION_SECRET_KEY:
            raise ValueError(
                "❌ CRITICAL: SESSION_SECRET_KEY must be at least 32 characters long! Use secrets.token_urlsafe(32)."
            )
        if self.IS_PRODUCTION:
            if "token_urlsafe" in self.SECRET_KEY:
                raise ValueError("❌ CRITICAL: Set unique SECRET_KEY in production!")
            if "token_urlsafe" in self.SESSION_SECRET_KEY:
                raise ValueError("❌ CRITICAL: Set unique SESSION_SECRET_KEY in production!")

    # Display for development
    def display_config(self):
        if self.IS_DEVELOPMENT:
            print("\n" + "=" * 60)
            print("Development Configuration")
            print("=" * 60)
            print(f"Environment: {self.ENVIRONMENT}")
            print(f"Project: {self.PROJECT_NAME} v{self.VERSION}")
            print(f"CORS: {len(self.BACKEND_CORS_ORIGINS)} origins allowed")
            for origin in self.BACKEND_CORS_ORIGINS[:5]:
                print(f"   OK {origin}")
            if len(self.BACKEND_CORS_ORIGINS) > 5:
                print(f"   ... and {len(self.BACKEND_CORS_ORIGINS) - 5} more")
            print(f"Database: {self.DATABASE_URL[:50]}...")
            print(f"Secret: {'WARNING' if len(self.SECRET_KEY) < 32 or 'token_urlsafe' in self.SECRET_KEY else 'OK'}")
            print(f"Session Secret: {'WARNING' if len(self.SESSION_SECRET_KEY) < 32 or 'token_urlsafe' in self.SESSION_SECRET_KEY else 'OK'}")
            print(f"Session cookie: {self.SESSION_COOKIE_NAME}")
            print(f"Session max age: {self.SESSION_MAX_AGE}s ({self.SESSION_MAX_AGE/3600:.1f}h)")
            print(f"Session secure: {self.SESSION_COOKIE_SECURE}")
            print(f"Session same-site: {self.SESSION_COOKIE_SAMESITE}")
            if self.EMAIL_CONFIGURED:
                print(f"Email: Configured OK ({self.EMAILS_FROM_EMAIL})")
            else:
                print("Email: Not configured (optional)")
            print("=" * 60 + "\n")

# Instantiate settings
settings = Settings()
settings.validate_security_keys()
settings.display_config()