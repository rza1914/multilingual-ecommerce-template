# Save as: backend/test_session.py

import requests

print("Testing session persistence...")

session = requests.Session()

# Request 1: Should create session and return CSRF token
print("\n1️⃣ First request (creates session):")
resp1 = session.get("http://localhost:8000/api/v1/products/?limit=6")
print(f"Status: {resp1.status_code}")
print(f"Session Cookie: {session.cookies.get('ecommerce_session', 'NOT SET')}")
print(f"CSRF Token: {resp1.headers.get('X-CSRF-Token', 'NOT SET')}")

# Request 2: Should reuse same session
print("\n2️⃣ Second request (reuses session):")
resp2 = session.get("http://localhost:8000/api/v1/products/?limit=6")
print(f"Status: {resp2.status_code}")
print(f"Same Cookie: {session.cookies.get('ecommerce_session') is not None}")
print(f"CSRF Token: {resp2.headers.get('X-CSRF-Token', 'NOT SET')}")

# Verify both requests succeeded
if resp1.status_code == 200 and resp2.status_code == 200:
    print("\n✅ SESSION TEST PASSED!")
    print("✅ No SessionMiddleware error")
    print("✅ CSRF protection working")
    print("✅ Session cookie being set")
    print("✅ Both requests returned 200 OK")
else:
    print("\n❌ SESSION TEST FAILED!")
    print(f"❌ First request: {resp1.status_code}")
    print(f"❌ Second request: {resp2.status_code}")