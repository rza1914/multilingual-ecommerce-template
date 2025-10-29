#!/usr/bin/env python3
"""
Quick test to verify the critical fixes are working
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_cors_headers():
    """Test CORS preflight request"""
    print("🔍 Testing CORS preflight (OPTIONS request)...")
    try:
        response = requests.options(
            f"{BASE_URL}/auth/login",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type,Authorization"
            }
        )
        print(f"   Status: {response.status_code}")
        print(f"   CORS Headers: {dict(response.headers)}")
        
        # Check for required CORS headers
        if "access-control-allow-origin" in response.headers:
            print("   ✅ CORS headers present")
            return True
        else:
            print("   ❌ CORS headers missing")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_health_endpoint():
    """Test if backend is running"""
    print("\n🏥 Testing backend health...")
    try:
        response = requests.get(f"http://localhost:8000/health")
        if response.status_code == 200:
            print(f"   ✅ Backend is healthy: {response.json()}")
            return True
        else:
            print(f"   ❌ Backend returned: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Backend not responding: {e}")
        return False

def test_login_endpoint_exists():
    """Test if login endpoint exists (will return 422 without data, which is OK)"""
    print("\n🔐 Testing login endpoint existence...")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            headers={
                "Origin": "http://localhost:5173",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        )
        # 422 (Unprocessable Entity) means endpoint exists but needs data
        # 404 would mean endpoint doesn't exist
        if response.status_code == 422:
            print(f"   ✅ Login endpoint exists (returns 422 without data - expected)")
            return True
        elif response.status_code == 404:
            print(f"   ❌ Login endpoint NOT FOUND (404)")
            return False
        else:
            print(f"   ℹ️  Login endpoint returned: {response.status_code}")
            return True
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_login_with_credentials():
    """Test actual login with credentials"""
    print("\n🔑 Testing login with credentials...")
    print("   (This will fail if no admin user exists - run create_admin.py)")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data={
                "username": "admin@example.com",  # Email as username
                "password": "admin123"
            },
            headers={
                "Origin": "http://localhost:5173",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        )
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                print(f"   ✅ Login successful! Token received.")
                print(f"   Token type: {data.get('token_type')}")
                return True
            else:
                print(f"   ❌ Login response missing token: {data}")
                return False
        elif response.status_code == 401:
            print(f"   ⚠️  Invalid credentials (create admin user first)")
            return False
        else:
            print(f"   ❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("=" * 60)
    print("🧪 CRITICAL FIXES VERIFICATION TEST")
    print("=" * 60)
    
    results = {
        "Backend Health": test_health_endpoint(),
        "CORS Headers": test_cors_headers(),
        "Login Endpoint": test_login_endpoint_exists(),
        "Authentication": test_login_with_credentials(),
    }
    
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    all_critical_passed = results["Backend Health"] and results["CORS Headers"] and results["Login Endpoint"]
    
    print("\n" + "=" * 60)
    if all_critical_passed:
        print("🎉 ALL CRITICAL FIXES VERIFIED!")
        print("   Backend is ready for frontend connection.")
        if not results["Authentication"]:
            print("\n   ⚠️  Note: Create admin user with: python create_admin.py")
    else:
        print("⚠️  SOME TESTS FAILED")
        print("   Please check the backend is running on port 8000")
        print("   Run: cd backend && python run.py")
    print("=" * 60)

if __name__ == "__main__":
    main()
