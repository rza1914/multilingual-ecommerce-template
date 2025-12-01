from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import secrets
import logging

logger = logging.getLogger(__name__)

class CSRFMiddleware(BaseHTTPMiddleware):
    """
    CSRF Protection Middleware
    More robust implementation using session to store CSRF tokens

    Security Features:
    - Stores unique CSRF token in user session
    - Validates token on state-changing requests (POST, PUT, PATCH, DELETE)
    - Returns token in X-CSRF-Token header for API clients
    - Supports both header and form-data token submission

    CRITICAL DEPENDENCY: Requires SessionMiddleware to be executed BEFORE this middleware
    in the middleware stack.
    """

    SAFE_METHODS = {"GET", "HEAD", "OPTIONS", "TRACE"}
    
    def __init__(self, app):
        super().__init__(app)
        logger.info("CSRFMiddleware initialized")

    async def dispatch(self, request: Request, call_next):
        # Check if session is available in the request scope
        # SessionMiddleware adds session to request.scope
        if "session" not in request.scope:
            logger.error("CRITICAL: SessionMiddleware not installed or not in correct order!")
            logger.error("Fix: Ensure SessionMiddleware is added before CSRFMiddleware in main.py")
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "Server configuration error: SessionMiddleware not available",
                    "error_type": "middleware_ordering_error",
                    "fix": "Check middleware order in main.py - SessionMiddleware must execute before CSRFMiddleware"
                }
            )
        
        # Safely access the session from the request scope
        session = request.scope["session"]
        
        # Generate or retrieve CSRF token from session
        if "csrf_token" not in session:
            csrf_token = secrets.token_urlsafe(32)
            session["csrf_token"] = csrf_token
            logger.debug("Generated new CSRF token for session")
        else:
            csrf_token = session["csrf_token"]

        # Validate CSRF token for unsafe methods
        if request.method not in self.SAFE_METHODS:
            # Get token from header (preferred for APIs)
            request_csrf_token = request.headers.get("x-csrf-token") or request.headers.get("x-xsrf-token")

            # Check form data for token as well (for HTML forms)
            if not request_csrf_token:
                try:
                    content_type = request.headers.get("content-type", "").lower()
                    if "application/x-www-form-urlencoded" in content_type or \
                       "multipart/form-data" in content_type:
                        form_data = await request.form()
                        request_csrf_token = form_data.get("csrf_token") or form_data.get("_csrf_token")
                except Exception as form_error:
                    # Form parsing can fail for non-form requests, which is fine
                    logger.debug(f"Could not parse form data: {form_error}")
                    pass

            # Validate the CSRF token
            if not request_csrf_token:
                logger.warning(f"CSRF token missing in request for {request.url.path}")
                return JSONResponse(
                    status_code=403,
                    content={
                        "detail": "CSRF token missing in request header or form data",
                        "error_type": "csrf_token_missing",
                        "hint": "Include token in X-CSRF-Token header or csrf_token form field"
                    }
                )

            if request_csrf_token != csrf_token:
                logger.warning(f"CSRF token mismatch for {request.url.path}")
                return JSONResponse(
                    status_code=403,
                    content={
                        "detail": "CSRF token validation failed",
                        "error_type": "csrf_token_invalid",
                        "hint": "Token mismatch - obtain fresh token from GET request"
                    }
                )

            logger.debug(f"CSRF validation passed for {request.method} {request.url.path}")

        # Process the request
        response = await call_next(request)
        
        # Add CSRF token to response headers for API clients
        response.headers["X-CSRF-Token"] = csrf_token
        
        return response