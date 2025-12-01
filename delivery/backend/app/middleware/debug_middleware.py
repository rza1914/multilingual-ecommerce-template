# backend/app/middleware/debug_middleware.py

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import logging

logger = logging.getLogger(__name__)

class DebugMiddleware(BaseHTTPMiddleware):
    """Debug middleware to inspect request scope"""
    
    async def dispatch(self, request: Request, call_next):
        logger.debug("=" * 60)
        logger.debug(f"🔍 Request: {request.method} {request.url.path}")
        logger.debug(f"🔍 Scope keys: {list(request.scope.keys())}")
        logger.debug(f"🔍 Has 'session' in scope: {'session' in request.scope}")
        
        if "session" in request.scope:
            logger.debug(f"✅ Session available: {type(request.scope['session'])}")
        else:
            logger.debug(f"❌ Session NOT in scope")
        
        # Call the next middleware
        response = await call_next(request)
        
        logger.debug(f"✅ Response: {response.status_code}")
        logger.debug("=" * 60)
        
        return response