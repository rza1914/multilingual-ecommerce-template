#!/usr/bin/env python3
"""
Simple script to get a JWT token for testing
"""
import asyncio
import requests
from datetime import timedelta
from backend.app.core.security import create_access_token

# Create a token for the test user
async def get_test_token():
    # Create token for test user - using email as the sub (subject)
    data = {"sub": "user@test.com"}  # Using the email from check_and_create_users.py
    token = create_access_token(data, expires_delta=timedelta(hours=1))
    print(f"Generated test token: {token}")
    return token

if __name__ == "__main__":
    import os
    import sys
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
    
    token = asyncio.run(get_test_token())
    print(f"\nYou can use this token for testing: {token}")