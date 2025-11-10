"""
ETag middleware for FastAPI
Provides ETag support for HTTP caching
"""
import hashlib
import json
from typing import Union
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, StreamingResponse


class ETAGMiddleware(BaseHTTPMiddleware):
    """
    ETag Middleware for FastAPI
    Adds ETag headers to responses and handles conditional requests
    """
    
    async def dispatch(self, request: Request, call_next):
        # Check for conditional requests before processing
        if_none_match = request.headers.get("if-none-match")
        
        # Process the request
        response = await call_next(request)
        
        # Only add ETag for successful GET/HEAD requests with body content
        if (
            response.status_code == 200
            and request.method in ["GET", "HEAD"]
            and hasattr(response, "body")
            and response.body
        ):
            # Calculate ETag based on response content
            etag = self._calculate_etag(response.body)
            
            # If client has same version (304 Not Modified)
            if if_none_match and if_none_match == etag:
                response = Response(status_code=304)
            
            # Add ETag header to response
            response.headers["ETag"] = etag

        # For JSON responses, handle appropriately
        elif (
            response.status_code == 200
            and request.method in ["GET", "HEAD"]
            and hasattr(response, "body_iterator")
        ):
            # Streaming responses (like JSON responses) need special handling
            etag = self._calculate_etag(str(response).__hash__().to_bytes(8, 'little'))
            if if_none_match and if_none_match == etag:
                response = Response(status_code=304)
            else:
                response.headers["ETag"] = etag

        return response

    def _calculate_etag(self, content: Union[bytes, str]) -> str:
        """
        Calculate ETag for content
        """
        if isinstance(content, str):
            content = content.encode('utf-8')
        
        # Use SHA1 for ETag calculation (strong ETag)
        return hashlib.sha1(content).hexdigest()


# Alternative implementation for JSON responses specifically
class JSONETagMiddleware(BaseHTTPMiddleware):
    """
    ETag Middleware specifically for JSON responses
    """
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        if (
            request.method in ["GET", "HEAD"]
            and response.status_code == 200
            and "application/json" in response.headers.get("content-type", "")
        ):
            # For JSON responses, we need to get the content before sending
            if hasattr(response, "body"):
                etag = self._calculate_etag(response.body)
                response.headers["ETag"] = etag
                
                # Check if ETag matches
                if_none_match = request.headers.get("if-none-match")
                if if_none_match and if_none_match == etag:
                    return Response(status_code=304)
            else:
                # Calculate based on some other factor if body isn't accessible
                content_hash = hash(str(response.headers))
                etag = self._calculate_etag(str(content_hash).encode('utf-8'))
                response.headers["ETag"] = etag

        return response

    def _calculate_etag(self, content: bytes) -> str:
        return hashlib.sha1(content).hexdigest()