import requests
import sys
import os
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

def test_cors_configuration():
    print("Testing CORS configuration...")
    
    # Import the app to check the configuration
    from app.main import app, settings
    from app.config import Settings
    
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Is Production: {settings.IS_PRODUCTION}")
    print(f"Is Development: {settings.IS_DEVELOPMENT}")
    
    # Check allowed origins
    if settings.IS_PRODUCTION:
        allowed_origins = settings.ALLOWED_ORIGINS
    else:
        allowed_origins = [
            "http://localhost:5173",
            "http://localhost:3000", 
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "http://localhost:8080",
            "http://localhost:3001",
            "http://127.0.0.1:8080",
            "http://127.0.0.1:3001",
            "https://ishooop.org",
            "https://www.ishooop.org",
        ]
    
    print(f"Allowed origins: {allowed_origins}")
    
    # Test that important production domains are included
    if settings.IS_PRODUCTION:
        assert "https://ishooop.org" in allowed_origins or any("ishooop.org" in origin for origin in allowed_origins), "Production domain not found in allowed origins"
        assert "https://www.ishooop.org" in allowed_origins or any("www.ishooop.org" in origin for origin in allowed_origins), "Production www domain not found in allowed origins"
    
    # Test that development origins are included in development
    if settings.IS_DEVELOPMENT:
        assert "http://localhost:5173" in allowed_origins, "React Vite development origin not found"
        assert "https://ishooop.org" in allowed_origins, "Production domain should be allowed in development too"
    
    print("CORS configuration test passed!")
    
if __name__ == "__main__":
    test_cors_configuration()