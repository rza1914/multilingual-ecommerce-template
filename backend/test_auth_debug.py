"""
Debug Script for 401 Authentication Issues
This script helps identify authentication problems step by step
"""

import sys
import requests
from app.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import create_access_token, get_password_hash
from datetime import timedelta

BASE_URL = "http://localhost:8000"

def print_section(title):
    print("\n" + "=" * 60)
    print(f"🔍 {title}")
    print("=" * 60)

def check_admin_user_exists():
    """Check if admin user exists in database"""
    print_section("Step 1: Check Admin User in Database")
    
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
        if admin:
            print(f"✅ Admin user found:")
            print(f"   ID: {admin.id}")
            print(f"   Email: {admin.email}")
            print(f"   Username: {admin.username}")
            print(f"   Role: {admin.role}")
            print(f"   Is Active: {admin.is_active}")
            return admin
        else:
            print("❌ No admin user found!")
            print("   Creating admin user...")
            
            admin = User(
                email="admin@test.com",
                username="admin",
                hashed_password=get_password_hash("admin123"),
                full_name="Admin User",
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print(f"✅ Admin user created:")
            print(f"   Email: admin@test.com")
            print(f"   Username: admin")
            print(f"   Password: admin123")
            return admin
    finally:
        db.close()

def test_login(email, password):
    """Test login endpoint"""
    print_section(f"Step 2: Test Login with {email}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/token",
            data={
                "username": email,  # OAuth2 uses 'username' field
                "password": password
            }
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            print(f"   Access Token: {data['access_token'][:50]}...")
            print(f"   Token Type: {data['token_type']}")
            return data['access_token']
        else:
            print(f"❌ Login failed!")
            print(f"   Error: {response.json()}")
            return None
    except Exception as e:
        print(f"❌ Error connecting to server: {e}")
        print("   Make sure the server is running on http://localhost:8000")
        return None

def test_token_manually(user_id):
    """Create token manually and test it"""
    print_section("Step 3: Create Token Manually")
    
    from app.config import settings
    
    token = create_access_token(
        data={"sub": str(user_id)},
        expires_delta=timedelta(minutes=30)
    )
    print(f"✅ Token created: {token[:50]}...")
    return token

def test_me_endpoint(token):
    """Test /api/v1/auth/me endpoint"""
    print_section("Step 4: Test /auth/me Endpoint")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            user = response.json()
            print("✅ Authentication successful!")
            print(f"   User ID: {user['id']}")
            print(f"   Email: {user['email']}")
            print(f"   Username: {user['username']}")
            print(f"   Role: {user['role']}")
            return True
        else:
            print(f"❌ Authentication failed!")
            print(f"   Error: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_users_me_endpoint(token):
    """Test /api/v1/users/me endpoint"""
    print_section("Step 5: Test /users/me Endpoint")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/users/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            user = response.json()
            print("✅ Authentication successful!")
            print(f"   User ID: {user['id']}")
            print(f"   Email: {user['email']}")
            print(f"   Username: {user['username']}")
            print(f"   Role: {user['role']}")
            return True
        else:
            print(f"❌ Authentication failed!")
            print(f"   Error: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_admin_endpoint(token):
    """Test admin-only endpoint"""
    print_section("Step 6: Test Admin Endpoint (/users list)")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/users",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            users = response.json()
            print(f"✅ Admin access successful!")
            print(f"   Total users: {len(users)}")
            return True
        else:
            print(f"❌ Admin access failed!")
            print(f"   Error: {response.json()}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("\n" + "🔧" * 30)
    print("Authentication Debug Tool")
    print("🔧" * 30)
    
    # Step 1: Check/Create admin user
    admin = check_admin_user_exists()
    if not admin:
        print("\n❌ Could not create admin user. Exiting.")
        return
    
    # Step 2: Test login
    token = test_login("admin@test.com", "admin123")
    if not token:
        print("\n❌ Login failed. Trying manual token creation...")
        token = test_token_manually(admin.id)
    
    # Step 3: Test /auth/me
    test_me_endpoint(token)
    
    # Step 4: Test /users/me
    test_users_me_endpoint(token)
    
    # Step 5: Test admin endpoint
    test_admin_endpoint(token)
    
    # Final summary
    print_section("Summary")
    print("✅ If all tests passed, authentication is working correctly!")
    print("❌ If tests failed, check the error messages above.")
    print("\n📝 Common Issues:")
    print("   1. Server not running - Run: uvicorn app.main:app --reload")
    print("   2. Wrong token format - Use: Bearer <token>")
    print("   3. Token expired - Login again to get new token")
    print("   4. User not admin - Check user role in database")
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
