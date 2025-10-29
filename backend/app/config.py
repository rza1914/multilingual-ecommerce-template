"""
Smart Configuration for E-Commerce Template
Upgraded version with Smart CORS + Email Settings

Features:
- Auto-detect Development/Production environments
- Smart CORS (automatic localhost handling)
- Email configuration support
- Security settings
- Database configuration
"""

import os
from typing import List
from decouple import config


class Settings:
    """
    Smart Application Settings
    
    Automatically detects environment and configures CORS accordingly.
    No configuration needed for local development!
    """
    
    # ========================================
    # Environment Detection
    # ========================================
    ENVIRONMENT: str = config(
        "ENVIRONMENT", 
        default="development"
    )
    
    # ========================================
    # Database
    # ========================================
    DATABASE_URL: str = config(
        "DATABASE_URL", 
        default="sqlite:///./ecommerce.db"
    )
    
    # ========================================
    # Security
    # ========================================
    SECRET_KEY: str = config(
        "SECRET_KEY", 
        default="your-secret-key"
    )
    
    ALGORITHM: str = config(
        "ALGORITHM", 
        default="HS256"
    )
    
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config(
        "ACCESS_TOKEN_EXPIRE_MINUTES", 
        default=30, 
        cast=int
    )
    
    # ========================================
    # Email Settings
    # ========================================
    SMTP_TLS: bool = config(
        "SMTP_TLS", 
        default=True, 
        cast=bool
    )
    
    SMTP_PORT: int = config(
        "SMTP_PORT", 
        default=587, 
        cast=int
    )
    
    SMTP_HOST: str = config(
        "SMTP_HOST", 
        default="smtp.gmail.com"
    )
    
    SMTP_USER: str = config(
        "SMTP_USER", 
        default=""
    )
    
    SMTP_PASSWORD: str = config(
        "SMTP_PASSWORD", 
        default=""
    )
    
    EMAILS_FROM_EMAIL: str = config(
        "EMAILS_FROM_EMAIL", 
        default=""
    )
    
    EMAILS_FROM_NAME: str = config(
        "EMAILS_FROM_NAME", 
        default="E-commerce Template"
    )
    
    # ========================================
    # Smart CORS - Dynamic Origins
    # ========================================
    
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """
        Smart CORS Origins
        
        Development Mode (Automatic):
        - All localhost and 127.0.0.1 addresses allowed
        - Common ports: 3000, 5173, 8080, 4200
        - No configuration needed!
        
        Production Mode:
        - Reads from .env file: ALLOWED_ORIGINS
        - Example: ALLOWED_ORIGINS=https://myapp.com,https://www.myapp.com
        - If not configured, only HTTPS is allowed
        
        Returns:
            List[str]: List of allowed origins
        """
        
        # Check current environment
        env = self.ENVIRONMENT.lower()
        
        if env == "development":
            # Development: All localhost allowed
            return [
                # Vite (React, Vue, Svelte)
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                
                # Next.js, Create React App
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                
                # Angular
                "http://localhost:4200",
                "http://127.0.0.1:4200",
                
                # Vue CLI, Alternative
                "http://localhost:8080",
                "http://127.0.0.1:8080",
                
                # Custom / Alternative ports
                "http://localhost:8000",
                "http://127.0.0.1:8000",
                
                "http://localhost:8888",
                "http://127.0.0.1:8888",
            ]
        
        else:
            # Production: Read from environment
            origins_env = config(
                "ALLOWED_ORIGINS", 
                default=""
            )
            
            # Default production origins
            default_origins = [
                "https://multilingual-ecommerce-template-ohimnpkxr.vercel.app",
                "https://multilingual-ecommerce-template-j0yyw6oms.vercel.app",
                "https://multilingual-ecommerce-template.onrender.com",
                "http://localhost:5173",
                "http://localhost:3000",
            ]
            
            if origins_env:
                # Parse comma-separated string to list
                origins = [origin.strip() for origin in origins_env.split(",")]
                
                # Log configured origins
                print("🔒 Production CORS configured:")
                for origin in origins:
                    print(f"   ✅ {origin}")
                
                return origins
            
            else:
                # Production with default origins
                print("🔒 Production CORS using default origins:")
                for origin in default_origins:
                    print(f"   ✅ {origin}")
                
                return default_origins
    
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
    # Display Configuration Info
    # ========================================
    
    def display_config(self):
        """Display configuration info (Development only)"""
        if self.IS_DEVELOPMENT:
            print("\n" + "=" * 60)
            print("🔧 Development Configuration")
            print("=" * 60)
            
            # CORS Info
            origins = self.ALLOWED_ORIGINS
            print(f"📡 CORS: {len(origins)} origins allowed")
            for origin in origins[:3]:  # Show first 3
                print(f"   ✅ {origin}")
            if len(origins) > 3:
                print(f"   ... and {len(origins) - 3} more")
            
            # Database
            print(f"💾 Database: {self.DATABASE_URL[:50]}...")
            
            # Email
            if self.EMAIL_CONFIGURED:
                print(f"📧 Email: Configured ✅ ({self.EMAILS_FROM_EMAIL})")
            else:
                print(f"📧 Email: Not configured (optional)")
            
            # Security
            if self.SECRET_KEY == "your-secret-key":
                print(f"🔐 Secret: ⚠️  Using default (change in production!)")
            else:
                print(f"🔐 Secret: Configured ✅")
            
            print("=" * 60 + "\n")


# ========================================
# Create Settings Instance
# ========================================
settings = Settings()

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
   ALLOWED_ORIGINS=https://myshop.com,https://www.myshop.com
   DATABASE_URL=postgresql://user:pass@host:5432/db
   SECRET_KEY=<use-secrets.token_urlsafe(32)>
   
   # Email (Optional)
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAILS_FROM_EMAIL=noreply@myshop.com

3️⃣ Using in Code:
   from app.config import settings
   
   # Get CORS origins
   origins = settings.ALLOWED_ORIGINS
   
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
✅ Always change SECRET_KEY in production
✅ Use secrets.token_urlsafe(32) to generate SECRET_KEY

Security Best Practices:
-----------------------
- SECRET_KEY must be at least 32 characters and random
- In production, restrict ALLOWED_ORIGINS to your domains only
- Keep DATABASE_URL in .env (never commit to Git)
- Use App Password for SMTP_PASSWORD (not your actual password)
- Add .env to .gitignore

For Customers:
-------------
This configuration is smart and auto-detects the environment.
Customers just need to run the project - no setup required!
"""