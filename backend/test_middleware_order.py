# backend/test_middleware_order.py

import sys
import logging
from app.main import app

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def test_middleware_stack():
    """Test that middleware stack is correct"""
    
    logger.info("Inspecting middleware stack...")
    
    # Print all middleware in order
    middleware_stack = app.middleware_stack
    logger.info(f"Middleware stack type: {type(middleware_stack)}")
    
    # Try to access the middleware chain
    current = middleware_stack
    middleware_list = []
    
    while hasattr(current, 'app'):
        middleware_list.append(type(current).__name__)
        current = current.app
        # Add the current middleware too
        if not hasattr(current, 'app'):
            break
    
    # Add the last app (usually ServerErrorMiddleware)
    middleware_list.append(type(current).__name__)
    
    logger.info("Middleware execution order (first to last):")
    for i, mw in enumerate(middleware_list, 1):
        logger.info(f"  {i}. {mw}")
    
    # Verify SessionMiddleware comes before CSRFMiddleware in execution
    try:
        # Find indices - execution order is reversed from add order
        session_idx = -1
        csrf_idx = -1
        
        for i, mw in enumerate(middleware_list):
            if 'SessionMiddleware' in mw:
                session_idx = i
            elif 'CSRF' in mw:
                csrf_idx = i
        
        if session_idx != -1 and csrf_idx != -1:
            if session_idx > csrf_idx:  # Later in list means executed later
                logger.info("SessionMiddleware executes BEFORE CSRFMiddleware")
            else:
                logger.error("ERROR: SessionMiddleware executes AFTER CSRFMiddleware")
                logger.error(f"SessionMiddleware idx: {session_idx}, CSRF idx: {csrf_idx}")
        else:
            logger.error(f"ERROR: Middleware not found: SessionMiddleware={session_idx}, CSRF={csrf_idx}")
    except ValueError as e:
        logger.error(f"ERROR: Middleware not found: {e}")

if __name__ == "__main__":
    test_middleware_stack()