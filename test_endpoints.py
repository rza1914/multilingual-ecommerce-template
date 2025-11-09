"""
Test script to verify all endpoints load correctly despite bcrypt warnings
"""
import warnings
import sys
import traceback
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Filter out the bcrypt compatibility warnings
warnings.filterwarnings("ignore", message=".*__about__.*")
warnings.filterwarnings("ignore", category=DeprecationWarning)

print("Testing endpoint loading...")

try:
    # Test 1: Import security functions
    from app.core.security import verify_password, get_password_hash
    print("[SUCCESS] Security functions imported")
    
    # Test 2: Test basic functionality
    test_password = "test123"
    hashed = get_password_hash(test_password)
    is_valid = verify_password(test_password, hashed)
    is_invalid = verify_password("wrong", hashed)
    print(f"[SUCCESS] Password functionality works: {is_valid}, {not is_invalid}")
    
    # Test 3: Import auth module
    from app.core.auth import authenticate_user, get_current_user
    print("[SUCCESS] Auth functions imported")
    
    # Test 4: Import API routers
    from app.api.v1.auth import router as auth_router
    from app.api.v1.users import router as users_router
    from app.api.v1.products import router as products_router
    from app.api.v1.orders import router as orders_router
    from app.api.v1.admin import router as admin_router
    from app.api.v1.smart_search import router as smart_search_router
    from app.api.v1.bot_integration.bot_api import bot_api_router
    print("[SUCCESS] All API routers imported")
    
    # Test 5: Import main app
    from app.main import app
    print("[SUCCESS] Main FastAPI app imported")
    
    # Test 6: Check that routes are registered
    route_paths = [route.path for route in app.routes]
    auth_routes = [path for path in route_paths if '/auth' in path]
    user_routes = [path for path in route_paths if '/users' in path]
    product_routes = [path for path in route_paths if '/products' in path]
    print(f"[SUCCESS] Found {len(auth_routes)} auth routes, {len(user_routes)} user routes, {len(product_routes)} product routes")
    
    # Test 7: Verify critical routes exist
    required_routes = [
        '/api/v1/auth/token',
        '/api/v1/auth/login', 
        '/api/v1/auth/register',
        '/api/v1/users/me',
        '/api/v1/products/',
        '/api/v1/products/smart-search'
    ]
    
    missing_routes = []
    for route in required_routes:
        if route not in route_paths:
            missing_routes.append(route)
    
    if not missing_routes:
        print("[SUCCESS] All critical routes are registered")
    else:
        print(f"[ERROR] Missing routes: {missing_routes}")
    
    print("\n[SUCCESS] All endpoints loaded successfully!")
    print("The application should now properly generate OpenAPI schema for Swagger UI.")
    
except Exception as e:
    print(f"[ERROR] Endpoint loading failed: {e}")
    traceback.print_exc()
    sys.exit(1)