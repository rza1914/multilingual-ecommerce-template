"""
Simple Authentication Diagnosis Tool
No server needed - checks database and token generation
"""

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import create_access_token, get_password_hash, verify_password
from app.core.auth import get_current_user
from app.config import settings
from datetime import timedelta
from jose import jwt
import sys

def print_header(text):
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)

def check_database():
    """Check database and users"""
    print_header("📊 DATABASE CHECK")
    
    db = SessionLocal()
    try:
        # Count users
        total_users = db.query(User).count()
        admin_users = db.query(User).filter(User.role == UserRole.ADMIN).count()
        regular_users = db.query(User).filter(User.role == UserRole.USER).count()
        
        print(f"Total Users: {total_users}")
        print(f"Admin Users: {admin_users}")
        print(f"Regular Users: {regular_users}")
        
        # List all users
        if total_users > 0:
            print("\n👥 All Users:")
            users = db.query(User).all()
            for user in users:
                print(f"\n  ID: {user.id}")
                print(f"  Email: {user.email}")
                print(f"  Username: {user.username}")
                print(f"  Role: {user.role}")
                print(f"  Is Active: {user.is_active}")
                print(f"  Created: {user.created_at}")
        
        return db.query(User).filter(User.role == UserRole.ADMIN).first()
        
    finally:
        db.close()

def check_config():
    """Check configuration"""
    print_header("⚙️  CONFIGURATION CHECK")
    
    print(f"SECRET_KEY: {settings.SECRET_KEY[:20]}... ({len(settings.SECRET_KEY)} chars)")
    print(f"ALGORITHM: {settings.ALGORITHM}")
    print(f"TOKEN_EXPIRE: {settings.ACCESS_TOKEN_EXPIRE_MINUTES} minutes")
    print(f"DATABASE_URL: {settings.DATABASE_URL}")
    
    # Check if using default secret
    if settings.SECRET_KEY == "your-secret-key":
        print("\n⚠️  WARNING: Using default SECRET_KEY!")
        print("   This is OK for development, but MUST be changed in production!")

def test_password_hashing():
    """Test password hashing"""
    print_header("🔐 PASSWORD HASHING TEST")
    
    test_password = "test123"
    hashed = get_password_hash(test_password)
    
    print(f"Plain Password: {test_password}")
    print(f"Hashed Password: {hashed[:50]}...")
    
    # Verify password
    is_valid = verify_password(test_password, hashed)
    print(f"Verification: {'✅ PASSED' if is_valid else '❌ FAILED'}")
    
    return is_valid

def test_token_generation(user_id):
    """Test JWT token generation"""
    print_header("🎫 TOKEN GENERATION TEST")
    
    # Create token
    token = create_access_token(
        data={"sub": str(user_id)},
        expires_delta=timedelta(minutes=30)
    )
    
    print(f"User ID: {user_id}")
    print(f"Generated Token: {token[:60]}...")
    print(f"Token Length: {len(token)} chars")
    
    # Decode token
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        print(f"\n✅ Token decoded successfully!")
        print(f"Payload: {payload}")
        
        # Check if user_id matches
        token_user_id = payload.get("sub")
        print(f"\nToken User ID: {token_user_id}")
        print(f"Expected User ID: {str(user_id)}")
        
        if token_user_id == str(user_id):
            print("✅ User ID matches!")
            return token
        else:
            print("❌ User ID mismatch!")
            return None
            
    except Exception as e:
        print(f"❌ Token decode failed: {e}")
        return None

def test_authentication_flow(admin_user):
    """Test complete authentication flow"""
    print_header("🔄 AUTHENTICATION FLOW TEST")
    
    print("Testing authentication with admin user...")
    print(f"Email: {admin_user.email}")
    print(f"Username: {admin_user.username}")
    
    # Test password
    test_password = "admin123"
    print(f"\nTesting password: {test_password}")
    
    is_valid = verify_password(test_password, admin_user.hashed_password)
    if is_valid:
        print("✅ Password verification PASSED")
    else:
        print("❌ Password verification FAILED")
        print("   The admin user might have a different password!")
        return False
    
    # Generate token
    token = test_token_generation(admin_user.id)
    
    if token:
        print("\n✅ Authentication flow is working correctly!")
        return token
    else:
        print("\n❌ Authentication flow has issues!")
        return None

def create_admin_if_needed():
    """Create admin user if doesn't exist"""
    print_header("👤 ADMIN USER CHECK")
    
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
        
        if admin:
            print(f"✅ Admin user exists: {admin.email}")
            return admin
        else:
            print("⚠️  No admin user found. Creating one...")
            
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
            
            print(f"✅ Admin user created!")
            print(f"   Email: admin@test.com")
            print(f"   Username: admin")
            print(f"   Password: admin123")
            print(f"   ID: {admin.id}")
            
            return admin
            
    finally:
        db.close()

def print_instructions(token):
    """Print usage instructions"""
    print_header("📖 HOW TO USE")
    
    print("1️⃣  Start your FastAPI server:")
    print("   cd backend")
    print("   python -m uvicorn app.main:app --reload")
    
    print("\n2️⃣  Login to get a token:")
    print("   POST http://localhost:8000/api/v1/auth/token")
    print("   Body (form-data):")
    print("     username: admin@test.com")
    print("     password: admin123")
    
    print("\n3️⃣  Use the token in requests:")
    print("   GET http://localhost:8000/api/v1/users/me")
    print("   Header:")
    print(f"     Authorization: Bearer <your_token>")
    
    if token:
        print("\n4️⃣  Test with curl:")
        print(f'   curl -H "Authorization: Bearer {token[:60]}..." http://localhost:8000/api/v1/auth/me')

def main():
    print("\n" + "🔧" * 35)
    print("        AUTHENTICATION DIAGNOSIS TOOL")
    print("🔧" * 35)
    
    # Run checks
    check_config()
    check_database()
    
    if not test_password_hashing():
        print("\n❌ Password hashing is broken!")
        sys.exit(1)
    
    admin = create_admin_if_needed()
    
    if not admin:
        print("\n❌ Could not create/find admin user!")
        sys.exit(1)
    
    token = test_authentication_flow(admin)
    
    # Final summary
    print_header("📋 SUMMARY")
    
    if token:
        print("✅ All checks PASSED!")
        print("✅ Authentication system is working correctly!")
        print("\n🎉 You can now:")
        print("   1. Start the server")
        print("   2. Login with: admin@test.com / admin123")
        print("   3. Use the token to access protected endpoints")
    else:
        print("❌ Some checks FAILED!")
        print("❌ Please fix the issues above before using the API")
    
    print_instructions(token)
    print("\n" + "=" * 70 + "\n")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
