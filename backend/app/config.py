from decouple import config

class Settings:
    DATABASE_URL: str = config("DATABASE_URL", default="sqlite:///./ecommerce.db")
    SECRET_KEY: str = config("SECRET_KEY", default="your-secret-key")
    ALGORITHM: str = config("ALGORITHM", default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30, cast=int)
    
    # CORS
    ALLOWED_ORIGINS: list = config("ALLOWED_ORIGINS", default="http://localhost:3000,http://localhost:5173", cast=lambda v: [i.strip() for i in v.split(",")])
    
    # Email
    SMTP_TLS: bool = config("SMTP_TLS", default=True, cast=bool)
    SMTP_PORT: int = config("SMTP_PORT", default=587, cast=int)
    SMTP_HOST: str = config("SMTP_HOST", default="smtp.gmail.com")
    SMTP_USER: str = config("SMTP_USER", default="")
    SMTP_PASSWORD: str = config("SMTP_PASSWORD", default="")
    EMAILS_FROM_EMAIL: str = config("EMAILS_FROM_EMAIL", default="")
    EMAILS_FROM_NAME: str = config("EMAILS_FROM_NAME", default="E-commerce Template")

settings = Settings()