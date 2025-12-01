"""
Security utilities for iShop E-commerce Platform
Provides enhanced security measures including secure CORS validation
"""

import re
from typing import List, Optional
from urllib.parse import urlparse


class SecureCORSValidator:
    """
    Enhanced CORS validation with additional security measures
    """
    
    def __init__(self, allowed_origins: List[str]):
        self.allowed_origins = allowed_origins
        self.compiled_patterns = self._compile_origin_patterns(allowed_origins)
    
    def _compile_origin_patterns(self, origins: List[str]) -> List[re.Pattern]:
        """Compile origin patterns for efficient matching"""
        patterns = []
        for origin in origins:
            # Remove leading/trailing whitespace
            origin = origin.strip()
            if origin == "*":
                continue  # Skip wildcard in pattern matching
            
            # Escape special regex characters except for protocol wildcards
            escaped_origin = re.escape(origin)
            # Convert escaped * back to regex pattern for protocol only
            escaped_origin = escaped_origin.replace(r'\*', '.*', 1)  # Only replace first * (for protocol)
            
            # Create pattern that matches origin exactly
            pattern = f"^{escaped_origin}$"
            try:
                patterns.append(re.compile(pattern, re.IGNORECASE))
            except re.error:
                # If pattern is invalid, skip it
                continue
        
        return patterns
    
    def is_origin_allowed(self, origin: str) -> bool:
        """
        Check if an origin is allowed using both exact match and pattern matching
        """
        if not origin:
            return False
            
        # Exact match check first (more efficient)
        if origin in self.allowed_origins:
            return True
            
        # Pattern matching for more flexible validation
        for pattern in self.compiled_patterns:
            if pattern.match(origin):
                return True
                
        return False
    
    def validate_origin_format(self, origin: str) -> bool:
        """
        Basic validation of origin format to prevent obvious malicious inputs
        """
        if not origin or len(origin) > 2048:  # Prevent extremely long origins
            return False
            
        try:
            parsed = urlparse(origin)
            if not parsed.scheme or not parsed.netloc:
                return False
                
            # Check for obvious malicious patterns
            if ".." in origin or "//" in origin[6:]:  # After the protocol part
                return False
                
            return True
        except Exception:
            return False


# Additional security headers middleware
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds security headers to responses
    """
    
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"  # Or "SAMEORIGIN" if you need frames
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response


# Function to create security configuration based on environment
def get_security_settings(environment: str = "development"):
    """
    Returns security settings based on environment
    """
    if environment.lower() == "production":
        return {
            "secure_cookies": True,
            "https_redirects": True,
            "strict_origin_checking": True,
        }
    else:
        return {
            "secure_cookies": False,
            "https_redirects": False,
            "strict_origin_checking": False,
        }


def setup_secure_cors(app, settings):
    """
    Apply secure CORS configuration to the FastAPI app
    """
    from fastapi.middleware.cors import CORSMiddleware
    import secrets
    
    # Use environment-appropriate origins
    if settings.IS_PRODUCTION:
        # Production: Use specific origins from environment
        allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS if origin.strip()]
    else:
        # Development: Allow common development origins
        allowed_origins = [
            "http://localhost:5173",    # Vite default
            "http://localhost:3000",    # Create React App default
            "http://127.0.0.1:5173",    # Alternative Vite
            "http://127.0.0.1:3000",    # Alternative CRA
            "http://localhost:8080",    # Alternative dev server
            "http://localhost:3001",    # Alternative CRA
            "http://127.0.0.1:8080",    # Alternative dev server
            "http://127.0.0.1:3001",    # Alternative CRA
            "https://ishooop.org",      # Production domain
            "https://www.ishooop.org",  # Production domain with www
        ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],  # More specific than "*"
        allow_headers=["*"],  # This is broad but necessary for flexibility
        allow_origin_regex=None,  # Disabled for security; use explicit origins only
        expose_headers=["X-CSRF-Token", "X-Request-ID", "X-Response-Time"],  # Expose custom headers
        max_age=86400,  # Cache preflight for 24 hours (max for most browsers)
    )


# Example usage in main application
def setup_secure_cors(app, settings):
    """
    Apply secure CORS and security headers to the FastAPI app
    """
    from fastapi.middleware.cors import CORSMiddleware
    
    # Use environment-appropriate origins
    if settings.IS_PRODUCTION:
        allowed_origins = settings.ALLOWED_ORIGINS
    else:
        # Development origins are defined in main.py
        allowed_origins = [
            "http://localhost:5173",
            "http://localhost:3000", 
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "https://ishooop.org",
            "https://www.ishooop.org",
        ]
    
    # Add security headers middleware first
    app.add_middleware(SecurityHeadersMiddleware)
    
    # Add CORSMiddleware with secure settings
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        max_age=86400,
    )
    
    return SecureCORSValidator(allowed_origins)


# Utility function to validate request headers for security
def validate_request_security_headers(request: Request) -> bool:
    """
    Validates that request headers don't contain obvious security threats
    """
    # Check for possible header injection attempts
    for header_name, header_value in request.headers.items():
        if "\n" in header_value or "\r" in header_value:
            return False  # Potential header injection
        if len(header_value) > 8192:  # Very large header values
            return False  # Potential DoS vector
            
    return True