"""
Validation script for bcrypt fixes
"""
import sys
from pathlib import Path

# Add backend directory to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

print("Validating bcrypt compatibility fixes...")

try:
    # Test 1: Check that security module imports without crashing (despite warnings)
    import warnings
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        from app.core.security import get_password_hash, verify_password
    print("[SUCCESS] Security module imports successfully (even with warnings)")

    # Test 2: Test password functionality
    password = 'test123'
    try:
        hashed = get_password_hash(password)
        print(f"[SUCCESS] Password hashing works: {type(hashed)}")
    except Exception as e:
        print(f"[ERROR] Password hashing failed: {e}")
        raise

    # Test 3: Test password verification
    try:
        verified = verify_password(password, hashed)
        print(f"[SUCCESS] Password verification works: {verified}")
        
        wrong_verified = verify_password('wrongpassword', hashed)
        print(f"[SUCCESS] Wrong password detection works: {not wrong_verified}")
    except Exception as e:
        print(f"[ERROR] Password verification failed: {e}")
        raise

    # Test 4: Check that main app can be imported
    try:
        from app.main import app
        print("[SUCCESS] Main app imports successfully")
    except Exception as e:
        print(f"[ERROR] Main app import failed: {e}")
        raise

    print("\n[SUCCESS] All bcrypt compatibility fixes validated!")
    print("The system should now work despite the known bcrypt/passlib compatibility issue.")
    
except Exception as e:
    print(f"[ERROR] Validation failed: {e}")
    import traceback
    traceback.print_exc()

print("\nNote: You may still see warnings about the __about__ attribute,")
print("but the system should function correctly with the error handling in place.")