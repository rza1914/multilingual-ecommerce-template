"""
Test authentication flow step by step
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_step_by_step():
    print("\n" + "="*70)
    print("🧪 STEP-BY-STEP AUTHENTICATION TEST")
    print("="*70)
    
    # Step 1: Check server
    print("\n📡 Step 1: Checking server...")
    try:
        response = requests.get("http://localhost:8000/", timeout=3)
        if response.status_code == 200:
            print("✅ Server is running!")
        else:
            print(f"⚠️  Server returned status {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        print("   Make sure server is running: python -m uvicorn app.main:app --reload")
        return
    
    # Step 2: Login
    print("\n🔑 Step 2: Attempting login...")
    print("   Email: admin@test.com")
    print("   Password: admin123")
    
    try:
        # Try with form data (OAuth2)
        response = requests.post(
            f"{BASE_URL}/auth/token",
            data={
                "username": "admin@test.com",
                "password": "admin123"
            },
            timeout=5
        )
        
        print(f"   Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print(f"✅ Login successful!")
            print(f"   Token: {token[:50]}...")
        else:
            print(f"❌ Login failed!")
            print(f"   Response: {response.text}")
            return
            
    except Exception as e:
        print(f"❌ Login request failed: {e}")
        return
    
    # Step 3: Test /auth/me
    print("\n👤 Step 3: Testing /auth/me...")
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        
        print(f"   Response status: {response.status_code}")
        
        if response.status_code == 200:
            user = response.json()
            print(f"✅ Auth successful!")
            print(f"   User: {user.get('email')}")
            print(f"   Role: {user.get('role')}")
        else:
            print(f"❌ Auth failed!")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    # Step 4: Test /users/me
    print("\n👥 Step 4: Testing /users/me...")
    try:
        response = requests.get(
            f"{BASE_URL}/users/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        
        print(f"   Response status: {response.status_code}")
        
        if response.status_code == 200:
            user = response.json()
            print(f"✅ Success!")
            print(f"   User: {user.get('email')}")
            print(f"   Role: {user.get('role')}")
        else:
            print(f"❌ Failed!")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    # Step 5: Test admin endpoint
    print("\n🔐 Step 5: Testing admin endpoint /users...")
    try:
        response = requests.get(
            f"{BASE_URL}/users",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        
        print(f"   Response status: {response.status_code}")
        
        if response.status_code == 200:
            users = response.json()
            print(f"✅ Admin access successful!")
            print(f"   Total users: {len(users)}")
        elif response.status_code == 403:
            print(f"❌ Forbidden! User is not admin")
            print(f"   Response: {response.text}")
        else:
            print(f"❌ Failed!")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    print("\n" + "="*70)
    print("✅ Test completed!")
    print("="*70 + "\n")

if __name__ == "__main__":
    try:
        test_step_by_step()
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
