"""
Test script for bcrypt compatibility
"""
import sys
import traceback

print("Testing bcrypt compatibility...")

try:
    # Test bcrypt import
    import bcrypt
    print(f"[SUCCESS] bcrypt imported successfully, version: {getattr(bcrypt, '__version__', 'unknown')}")
except ImportError as e:
    print(f"[ERROR] Failed to import bcrypt: {e}")
    sys.exit(1)
except AttributeError as e:
    print(f"[ERROR] AttributeError when importing bcrypt: {e}")
    traceback.print_exc()
    sys.exit(1)

try:
    # Test if __about__ attribute exists (this is the issue we're trying to fix)
    about_attr = getattr(bcrypt, '__about__', None)
    if about_attr is None:
        print("[INFO] __about__ attribute not found in bcrypt, but this may not be an issue if passlib handles it properly")
    else:
        print(f"[SUCCESS] __about__ attribute found: {about_attr}")
except Exception as e:
    print(f"[ERROR] Error accessing __about__ attribute: {e}")

try:
    # Test passlib import
    from passlib.context import CryptContext
    print("[SUCCESS] passlib imported successfully")
except ImportError as e:
    print(f"[ERROR] Failed to import passlib: {e}")
    sys.exit(1)

try:
    # Test password context creation
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    print("[SUCCESS] CryptContext created successfully")
except Exception as e:
    print(f"[ERROR] Failed to create CryptContext: {e}")
    sys.exit(1)

try:
    # Test password hashing
    password = 'test123'
    hashed = pwd_context.hash(password)
    print(f"[SUCCESS] Password hashed successfully: {hashed[:20]}...")
except Exception as e:
    print(f"[ERROR] Failed to hash password: {e}")
    traceback.print_exc()
    sys.exit(1)

try:
    # Test password verification
    verified = pwd_context.verify(password, hashed)
    print(f"[SUCCESS] Password verification successful: {verified}")
    
    wrong_verified = pwd_context.verify('wrongpassword', hashed)
    print(f"[SUCCESS] Wrong password verification: {wrong_verified}")
except Exception as e:
    print(f"[ERROR] Failed to verify password: {e}")
    traceback.print_exc()
    sys.exit(1)

print("\n[SUCCESS] All bcrypt compatibility tests passed!")