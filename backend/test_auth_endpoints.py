"""
Authentication Endpoints Test Script
Tests all auth endpoints to verify they're working
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_auth_endpoints():
    print("=" * 60)
    print("AUTHENTICATION ENDPOINTS TEST")
    print("=" * 60)
    print()
    
    # Test 1: Check available auth endpoints
    print("📋 Available Auth Endpoints:")
    print("   POST /api/v1/auth/token   - OAuth2 token endpoint")
    print("   POST /api/v1/auth/login   - Login endpoint (alias)")
    print("   POST /api/v1/auth/register - Register new user")
    print("   GET  /api/v1/auth/me      - Get current user (deprecated)")
    print("   GET  /api/v1/users/me     - Get current user (correct)")
    print()
    
    # Test 2: Login with /token endpoint
    print("1. Testing /auth/token endpoint...")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/token",
            data={
                "username": "admin",
                "password": "admin123"
            }
        )
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print(f"   ✅ /auth/token works!")
            print(f"   Token: {token[:20]}...")
            return token
        else:
            print(f"   ❌ Failed: {response.text}")
            return None
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return None
    
    print()

def test_login_endpoint():
    print("2. Testing /auth/login endpoint (NEW)...")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data={
                "username": "admin",
                "password": "admin123"
            }
        )
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print(f"   ✅ /auth/login works!")
            print(f"   Token: {token[:20]}...")
            return token
        else:
            print(f"   ❌ Failed: {response.text}")
            return None
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return None
    
    print()

def test_get_current_user(token):
    print("3. Testing /users/me endpoint...")
    try:
        response = requests.get(
            f"{BASE_URL}/users/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            user = response.json()
            print(f"   ✅ /users/me works!")
            print(f"   User: {user.get('username')} ({user.get('email')})")
            print(f"   Role: {user.get('role')}")
            print(f"   Is Admin: {user.get('role') == 'admin'}")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()

def test_wrong_credentials():
    print("4. Testing with wrong credentials...")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data={
                "username": "wrong",
                "password": "wrong"
            }
        )
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 401:
            print(f"   ✅ Correctly rejects invalid credentials")
        else:
            print(f"   ❌ Unexpected response: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()

def test_register_endpoint():
    print("5. Testing /auth/register endpoint...")
    try:
        import random
        random_num = random.randint(1000, 9999)
        
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json={
                "email": f"testuser{random_num}@example.com",
                "username": f"testuser{random_num}",
                "full_name": "Test User",
                "password": "testpass123"
            }
        )
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            user = response.json()
            print(f"   ✅ Registration works!")
            print(f"   New user: {user.get('username')}")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()

if __name__ == "__main__":
    print()
    
    # Run tests
    token = test_auth_endpoints()
    
    if token:
        test_login_endpoint()
        test_get_current_user(token)
        test_wrong_credentials()
        test_register_endpoint()
    else:
        print("⚠️  Could not get token, skipping remaining tests")
        print()
        print("Common issues:")
        print("  1. Backend not running")
        print("  2. Admin user doesn't exist - run: python create_admin.py")
        print("  3. Wrong port - make sure backend is on port 8000")
    
    print("=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)
    print()
    print("Summary of Auth Endpoints:")
    print()
    print("For Login (both work):")
    print("  POST /api/v1/auth/token  - OAuth2 standard")
    print("  POST /api/v1/auth/login  - Friendly alias")
    print()
    print("Format:")
    print("  Content-Type: application/x-www-form-urlencoded")
    print("  Body: username=<email>&password=<password>")
    print()
    print("For Current User:")
    print("  GET /api/v1/users/me")
    print("  Headers: Authorization: Bearer <token>")
    print()
