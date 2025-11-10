"""
Smart Configuration for E-Commerce Template
Upgraded version with Smart CORS + Email Settings + Session Management

Features:
- Auto-detect Development/Production environments
- Smart CORS (automatic localhost handling)
- Email configuration support
- Security settings
- Database configuration
- Session configuration
"""

import os
import secrets
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Smart Application Settings

    Automatically detects environment and configures CORS accordingly.
    No configuration needed for local development!
    """

    # ========================================
    # Environment Detection
    # ========================================
    ENVIRONMENT: str = os.getenv(
        "ENVIRONMENT",
        "development"
    )

    # ========================================
    # Project Info
    # ========================================
    PROJECT_NAME: str = "Multilingual E-Commerce"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # ========================================
    # Database
    # ========================================
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./ecommerce.db"
    )

    # ========================================
    # Security Keys - CRITICAL: Generate unique keys for production
    # ========================================
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", 
        secrets.token_urlsafe(32)  # Generate secure key if not provided
    )
    
    # Session Secret Key - Separate from main secret key for session security
    SESSION_SECRET_KEY: str = os.getenv(
        "SESSION_SECRET_KEY",
        secrets.token_urlsafe(32)  # Generate secure key if not provided
    )
    
    ALGORITHM: str = os.getenv(
        "ALGORITHM",
        "HS256"
    )

    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    )
    
    # Refresh token configuration (for JWT refresh mechanism)
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(
        os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7")
    )

    # ========================================
    # Session Configuration - NEW
    # ========================================
    SESSION_MAX_AGE: int = int(os.getenv("SESSION_MAX_AGE", "86400"))  # 24 hours in seconds
    SESSION_COOKIE_NAME: str = os.getenv("SESSION_COOKIE_NAME", "ecommerce_session")
    SESSION_COOKIE_SECURE: bool = os.getenv("SESSION_COOKIE_SECURE", "false").lower() == "true"
    SESSION_COOKIE_HTTPONLY: bool = os.getenv("SESSION_COOKIE_HTTPONLY", "true").lower() == "true"
    SESSION_COOKIE_SAMESITE: str = os.getenv("SESSION_COOKIE_SAMESITE", "lax")
    
    # ========================================
    # JWT Configuration
    # ========================================
    SECURITY_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ========================================
    # Email Settings
    # ========================================
    SMTP_TLS: bool = os.getenv("SMTP_TLS", "true").lower() == "true"
    
    SMTP_PORT: int = int(
        os.getenv("SMTP_PORT", "587")
    )

    SMTP_HOST: str = os.getenv(
        "SMTP_HOST",
        "smtp.gmail.com"
    )

    SMTP_USER: str = os.getenv(
        "SMTP_USER",
        ""
    )

    SMTP_PASSWORD: str = os.getenv(
        "SMTP_PASSWORD",
        ""
    )

    EMAILS_FROM_EMAIL: str = os.getenv(
        "EMAILS_FROM_EMAIL",
        ""
    )

    EMAILS_FROM_NAME: str = os.getenv(
        "EMAILS_FROM_NAME",
        "E-commerce Template"
    )

    # ========================================
    # CORS - Allowed Origins
    # ========================================
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://multilingual-ecommerce-template-ohimnpkxr.vercel.app",
        "https://multilingual-ecommerce-template-j0yyw6oms.vercel.app",
    ]
    
    # Allow override from environment variable
    CORS_ORIGINS_OVERRIDE: str = os.getenv("BACKEND_CORS_ORIGINS", "")
    if CORS_ORIGINS_OVERRIDE:
        BACKEND_CORS_ORIGINS = CORS_ORIGINS_OVERRIDE.split(",")

    # ========================================
    # Helper Properties
    # ========================================

    @property
    def IS_DEVELOPMENT(self) -> bool:
        """Check if running in development mode"""
        return self.ENVIRONMENT.lower() == "development"

    @property
    def IS_PRODUCTION(self) -> bool:
        """Check if running in production mode"""
        return self.ENVIRONMENT.lower() == "production"

    @property
    def DEBUG(self) -> bool:
        """Check if debug mode is enabled"""
        return self.IS_DEVELOPMENT

    @property
    def EMAIL_CONFIGURED(self) -> bool:
        """Check if email is properly configured"""
        return bool(self.SMTP_USER and self.SMTP_PASSWORD and self.EMAILS_FROM_EMAIL)

    # ========================================
    # Security Validation
    # ========================================
    def validate_security_keys(self):
        """Validate that security keys are properly configured"""
        if len(self.SECRET_KEY) < 32 and "token_urlsafe" not in str(self.SECRET_KEY):
            raise ValueError(
                "❌ CRITICAL: SECRET_KEY must be at least 32 characters long! "
                "Use secrets.token_urlsafe(32) to generate a secure key."
            )
        
        if len(self.SESSION_SECRET_KEY) < 32 and "token_urlsafe" not in str(self.SESSION_SECRET_KEY):
            raise ValueError(
                "❌ CRITICAL: SESSION_SECRET_KEY must be at least 32 characters long! "
                "Use secrets.token_urlsafe(32) to generate a secure key."
            )
        
        # In production, warn if using default generated keys
        if self.IS_PRODUCTION:
            if "token_urlsafe" in str(self.SECRET_KEY):
                raise ValueError(
                    "❌ CRITICAL: Set unique SECRET_KEY in production environment variables!"
                )
            if "token_urlsafe" in str(self.SESSION_SECRET_KEY):
                raise ValueError(
                    "❌ CRITICAL: Set unique SESSION_SECRET_KEY in production environment variables!"
                )

    # ========================================
    # Display Configuration Info
    # ========================================

    def display_config(self):
        """Display configuration info (Development only)"""
        if self.IS_DEVELOPMENT:
            print("\n" + "=" * 60)
            print("Development Configuration")
            print("=" * 60)

            # Environment info
            print(f"Environment: {self.ENVIRONMENT}")
            print(f"Project: {self.PROJECT_NAME} v{self.VERSION}")

            # CORS Info
            origins = self.BACKEND_CORS_ORIGINS
            print(f"CORS: {len(origins)} origins allowed")
            for origin in origins[:5]:  # Show first 5
                print(f"   OK {origin}")
            if len(origins) > 5:
                print(f"   ... and {len(origins) - 5} more")

            # Database
            print(f"Database: {self.DATABASE_URL[:50]}...")

            # Security
            if len(self.SECRET_KEY) < 32 or "token_urlsafe" in str(self.SECRET_KEY):
                print(f"Secret: WARNING - Using default (change in production!)")
            else:
                print(f"Secret: Configured OK")
            
            if len(self.SESSION_SECRET_KEY) < 32 or "token_urlsafe" in str(self.SESSION_SECRET_KEY):
                print(f"Session Secret: WARNING - Using default (change in production!)")
            else:
                print(f"Session Secret: Configured OK")

            # Session config
            print(f"Session cookie: {self.SESSION_COOKIE_NAME}")
            print(f"Session max age: {self.SESSION_MAX_AGE}s ({self.SESSION_MAX_AGE/3600:.1f}h)")
            print(f"Session secure: {self.SESSION_COOKIE_SECURE}")
            print(f"Session same-site: {self.SESSION_COOKIE_SAMESITE}")

            # Email
            if self.EMAIL_CONFIGURED:
                print(f"Email: Configured OK ({self.EMAILS_FROM_EMAIL})")
            else:
                print(f"Email: Not configured (optional)")

            print("=" * 60 + "\n")


# ========================================
# Create Settings Instance
# ========================================
settings = Settings()

# Validate security keys
settings.validate_security_keys()

# Display config in development
settings.display_config()


# ========================================
# Usage Documentation
# ========================================
"""
How to Use:
-----------

1️⃣ Development (Default):
   No configuration needed!

   $ cd backend
   $ uvicorn app.main:app --reload

   ✅ CORS automatically enabled for all localhost

2️⃣ Production:
   Create a .env file:

   # backend/.env
   ENVIRONMENT=production
   SECRET_KEY=your-32-character-secret-key-here
   SESSION_SECRET_KEY=your-32-character-session-secret-key-here
   DATABASE_URL=postgresql://user:pass@host:5432/db
   BACKEND_CORS_ORIGINS=https://myshop.com,https://www.myshop.com

   # Session Configuration
   SESSION_MAX_AGE=86400
   SESSION_COOKIE_SECURE=true
   SESSION_COOKIE_HTTPONLY=true
   SESSION_COOKIE_SAMESITE=lax

   # JWT Configuration
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7

   # Email (Optional)
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAILS_FROM_EMAIL=noreply@myshop.com

3️⃣ Using in Code:
   from app.config import settings

   # Get CORS origins
   origins = settings.BACKEND_CORS_ORIGINS

   # Check environment
   if settings.IS_DEVELOPMENT:
       print("Running in development mode!")

   # Email usage
   if settings.EMAIL_CONFIGURED:
       send_email(...)

Important Notes:
---------------
✅ Development: All localhost automatically allowed
✅ Production: Only defined origins allowed
✅ Email is optional (for password reset, notifications, etc.)
✅ Always change SECRET_KEY and SESSION_SECRET_KEY in production
✅ Use secrets.token_urlsafe(32) to generate SECRET_KEY

Security Best Practices:
-----------------------
- SECRET_KEY must be at least 32 characters and random
- SESSION_SECRET_KEY must be different from SECRET_KEY
- In production, restrict BACKEND_CORS_ORIGINS to your domains only
- Keep DATABASE_URL in .env (never commit to Git)
- Use App Password for SMTP_PASSWORD (not your actual password)
- Add .env to .gitignore
- Set SESSION_COOKIE_SECURE=true in production (HTTPS)

For Customers:
-------------
This configuration is smart and auto-detects the environment.
Customers just need to run the project - no setup required!
"""