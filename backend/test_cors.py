"""
CORS Configuration Test Script
Tests if backend properly accepts requests from frontend
"""

import requests

def test_cors():
    print("=" * 60)
    print("CORS CONFIGURATION TEST")
    print("=" * 60)
    print()
    
    backend_url = "http://localhost:8000"
    frontend_origin = "http://localhost:5173"
    
    # Test 1: Preflight OPTIONS request
    print("1. Testing Preflight OPTIONS Request...")
    try:
        response = requests.options(
            f"{backend_url}/api/v1/products",
            headers={
                "Origin": frontend_origin,
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "content-type,authorization"
            }
        )
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin', 'NOT SET')}")
        print(f"   Access-Control-Allow-Credentials: {response.headers.get('Access-Control-Allow-Credentials', 'NOT SET')}")
        print(f"   Access-Control-Allow-Methods: {response.headers.get('Access-Control-Allow-Methods', 'NOT SET')}")
        print(f"   Access-Control-Allow-Headers: {response.headers.get('Access-Control-Allow-Headers', 'NOT SET')}")
        
        if response.headers.get('Access-Control-Allow-Origin') == frontend_origin:
            print("   ✅ CORS headers are correctly set!")
        else:
            print("   ❌ CORS headers missing or incorrect!")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    print()
    
    # Test 2: Actual GET request with Origin header
    print("2. Testing GET Request with Origin Header...")
    try:
        response = requests.get(
            f"{backend_url}/api/v1/products",
            headers={"Origin": frontend_origin}
        )
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin', 'NOT SET')}")
        
        if response.headers.get('Access-Control-Allow-Origin'):
            print("   ✅ GET request allowed from frontend!")
        else:
            print("   ❌ CORS headers not present in response!")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    print()
    
    # Test 3: Health check endpoint
    print("3. Testing Health Endpoint...")
    try:
        response = requests.get(
            f"{backend_url}/health",
            headers={"Origin": frontend_origin}
        )
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.json()}")
        print(f"   Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin', 'NOT SET')}")
        
        if response.status_code == 200:
            print("   ✅ Backend is responding!")
        else:
            print("   ❌ Backend health check failed!")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    print()
    
    # Test 4: Check current CORS configuration
    print("4. Current Backend Configuration:")
    print(f"   Backend URL: {backend_url}")
    print(f"   Frontend Origin: {frontend_origin}")
    print(f"   Expected CORS Header: Access-Control-Allow-Origin: {frontend_origin}")
    print()
    
    print("=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)
    print()
    print("If tests passed (✅):")
    print("  - CORS is configured correctly")
    print("  - Frontend should be able to make requests")
    print("  - Try refreshing your browser")
    print()
    print("If tests failed (❌):")
    print("  1. Make sure backend is running: python -m uvicorn app.main:app --reload")
    print("  2. Restart backend server to apply CORS changes")
    print("  3. Check backend/.env has: ALLOWED_ORIGINS=http://localhost:5173,...")
    print("  4. Clear browser cache and try again")
    print()

if __name__ == "__main__":
    test_cors()
