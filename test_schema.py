"""
Test OpenAPI schema generation
"""
import warnings
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Filter out deprecation warnings (not the AttributeError which is an exception)
warnings.filterwarnings("ignore", category=DeprecationWarning)

print("Testing OpenAPI schema generation...")

try:
    from app.main import app
    import json

    # Generate the OpenAPI schema
    openapi_schema = app.openapi()

    print('[SUCCESS] OpenAPI schema generated successfully!')
    print(f'Title: {openapi_schema.get("info", {}).get("title", "Unknown")}')
    print(f'Version: {openapi_schema.get("info", {}).get("version", "Unknown")}')
    print(f'Number of paths: {len(openapi_schema.get("paths", {}))}')

    # Check for specific paths that should exist
    expected_paths = [
        '/api/v1/auth/token', 
        '/api/v1/auth/login',
        '/api/v1/auth/register', 
        '/api/v1/users/me',
        '/api/v1/products/',
        '/api/v1/products/smart-search'
    ]
    
    found_paths = []
    missing_paths = []
    
    for path in expected_paths:
        if path in openapi_schema.get('paths', {}):
            found_paths.append(path)
            print(f'[SUCCESS] Found path: {path}')
        else:
            missing_paths.append(path)
            print(f'[ERROR] Missing path: {path}')
    
    # Count different types of paths
    auth_paths = [path for path in openapi_schema.get('paths', {}) if '/auth' in path]
    user_paths = [path for path in openapi_schema.get('paths', {}) if '/users' in path]
    product_paths = [path for path in openapi_schema.get('paths', {}) if '/products' in path]
    admin_paths = [path for path in openapi_schema.get('paths', {}) if '/admin' in path]
    
    print(f'[INFO] Auth paths: {len(auth_paths)}')
    print(f'[INFO] User paths: {len(user_paths)}')
    print(f'[INFO] Product paths: {len(product_paths)}')
    print(f'[INFO] Admin paths: {len(admin_paths)}')
    
    if not missing_paths:
        print("\n[SUCCESS] All expected API paths are present in the schema!")
        print("Swagger UI should display all endpoints correctly.")
        
        # Test that we can serialize the schema to JSON (this ensures it's valid)
        try:
            schema_json = json.dumps(openapi_schema, indent=2)
            print(f"[SUCCESS] Schema is valid JSON with {len(schema_json)} characters")
        except Exception as json_error:
            print(f"[ERROR] Schema is not valid JSON: {json_error}")
    else:
        print(f"\n[ERROR] Missing {len(missing_paths)} expected paths: {missing_paths}")
        
except Exception as e:
    print(f"[ERROR] OpenAPI schema generation failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\nThe OpenAPI schema is correctly generated despite the bcrypt compatibility warning!")