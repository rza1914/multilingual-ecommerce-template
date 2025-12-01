"""
Cache service module for the e-commerce application
Provides various caching strategies including in-memory and Redis caching
"""
import asyncio
import time
from typing import Any, Optional, Dict
from functools import wraps
from datetime import datetime, timedelta
import redis.asyncio as redis

# In-memory cache implementation
class InMemoryCache:
    def __init__(self, default_ttl: int = 300):  # 5 minutes default
        self._cache: Dict[str, tuple] = {}  # key -> (value, expiry_time)
        self.default_ttl = default_ttl

    def get(self, key: str) -> Optional[Any]:
        if key in self._cache:
            value, expiry = self._cache[key]
            if time.time() < expiry:
                return value
            else:
                # Remove expired item
                del self._cache[key]
        return None

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        ttl = ttl or self.default_ttl
        expiry = time.time() + ttl
        self._cache[key] = (value, expiry)

    def delete(self, key: str) -> bool:
        if key in self._cache:
            del self._cache[key]
            return True
        return False

    def clear(self) -> None:
        self._cache.clear()

    def cleanup_expired(self) -> int:
        """Remove expired entries and return count of removed items"""
        current_time = time.time()
        expired_keys = [
            key for key, (_, expiry) in self._cache.items()
            if current_time >= expiry
        ]
        
        for key in expired_keys:
            del self._cache[key]
        
        return len(expired_keys)

# Redis cache implementation
class RedisCache:
    def __init__(self, redis_url: str, default_ttl: int = 300):
        self.redis_url = redis_url
        self.default_ttl = default_ttl
        self._redis = None

    async def connect(self):
        self._redis = await redis.from_url(self.redis_url)
    
    async def close(self):
        if self._redis:
            await self._redis.aclose()

    async def get(self, key: str) -> Optional[Any]:
        if not self._redis:
            return None
        
        value = await self._redis.get(key)
        if value is not None:
            return value.decode('utf-8')
        return None

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        if not self._redis:
            return
        
        ttl = ttl or self.default_ttl
        await self._redis.setex(key, ttl, value)

    async def delete(self, key: str) -> bool:
        if not self._redis:
            return False
        
        result = await self._redis.delete(key)
        return result > 0

    async def clear_pattern(self, pattern: str) -> int:
        if not self._redis:
            return 0
        
        keys = await self._redis.keys(pattern)
        if keys:
            result = await self._redis.delete(*keys)
            return result
        return 0


# Cache decorator factory
def cached(ttl: int = 300, cache_key_func=None, cache_type: str = "memory"):
    """
    Cache decorator that caches function results
    
    Args:
        ttl: Time to live in seconds
        cache_key_func: Function to generate cache key from function arguments
        cache_type: Type of cache to use ("memory" or "redis")
    """
    def decorator(func):
        # Create appropriate cache based on type
        if cache_type == "memory":
            cache = InMemoryCache(default_ttl=ttl)
        else:
            # Placeholder for Redis - in real implementation you'd configure the URL
            cache = InMemoryCache(default_ttl=ttl)  # Fallback for now

        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            # Generate cache key
            if cache_key_func:
                key = cache_key_func(*args, **kwargs)
            else:
                # Default key generation
                key_parts = [func.__name__]
                if args:
                    key_parts.extend(str(arg) for arg in args)
                if kwargs:
                    key_parts.extend(f"{k}:{v}" for k, v in sorted(kwargs.items()))
                key = ":".join(key_parts)

            # Try to get from cache
            cached_result = cache.get(key)
            if cached_result is not None:
                return cached_result

            # Call function and cache result
            result = await func(*args, **kwargs)
            cache.set(key, result, ttl)
            return result

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            # Generate cache key
            if cache_key_func:
                key = cache_key_func(*args, **kwargs)
            else:
                # Default key generation
                key_parts = [func.__name__]
                if args:
                    key_parts.extend(str(arg) for arg in args)
                if kwargs:
                    key_parts.extend(f"{k}:{v}" for k, v in sorted(kwargs.items()))
                key = ":".join(key_parts)

            # Try to get from cache
            cached_result = cache.get(key)
            if cached_result is not None:
                return cached_result

            # Call function and cache result
            result = func(*args, **kwargs)
            cache.set(key, result, ttl)
            return result

        # Return appropriate wrapper based on function type
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


# ETag helper functions
def generate_etag(data: Any) -> str:
    """Generate an ETag for response data"""
    import hashlib
    
    # Convert data to string for hashing
    data_str = str(data)
    return hashlib.md5(data_str.encode()).hexdigest()


def check_etag_match(etag: str, request_headers: Dict[str, str]) -> bool:
    """Check if the provided ETag matches the If-None-Match header"""
    if_none_match = request_headers.get('if-none-match')
    if if_none_match and etag == if_none_match:
        return True
    return False