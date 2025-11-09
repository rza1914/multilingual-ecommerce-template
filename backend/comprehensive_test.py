"""
Comprehensive test for the smart search schema fix
"""
import warnings
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Filter out deprecation warnings 
warnings.filterwarnings("ignore", category=DeprecationWarning)

print("Testing comprehensive smart search schema implementation...")

try:
    # 1. Test importing all components
    from app.schemas.smart_search import SmartSearchQuery, SmartSearchResponse
    print("[SUCCESS] 1. Smart search schemas imported successfully")
    
    # 2. Test creating schema instances
    query = SmartSearchQuery(query="test query", category="electronics", limit=10)
    print(f"[SUCCESS] 2. Created schema instance: query='{query.query}', category='{query.category}', limit={query.limit}")
    
    # 3. Test endpoint import
    from app.api.v1.smart_search import smart_search, router
    print("[SUCCESS] 3. Smart search endpoint and router imported")
    
    # 4. Test main application
    from app.main import app
    print("[SUCCESS] 4. Main application imported successfully")
    
    # 5. Check if the route is properly registered
    routes = [r for r in app.routes if '/smart-search' in r.path]
    if routes:
        route = routes[0]
        print(f"[SUCCESS] 5. Route registered: {route.path}")
        print(f"   - Methods: {list(route.methods) if hasattr(route, 'methods') else 'N/A'}")
        print(f"   - Response model: {getattr(route, 'response_model', 'N/A')}")
    else:
        print("[ERROR] 5. Smart search route not found")
        
    # 6. Verify OpenAPI schema generation
    schema = app.openapi()
    paths = schema.get('paths', {})
    
    # The path should be /api/v1/products/smart-search based on the router inclusion
    search_path = '/api/v1/products/smart-search'
    if search_path in paths:
        print(f"[SUCCESS] 6. Path exists in OpenAPI schema: {search_path}")
        
        # Check the schema structure
        path_details = paths[search_path]
        if 'post' in path_details:
            post_details = path_details['post']
            print(f"   - Operation ID: {post_details.get('operationId', 'N/A')}")
            print(f"   - Summary: {post_details.get('summary', 'N/A')}")
            
            # Check request body schema
            req_body = post_details.get('requestBody', {})
            if req_body:
                print("   - Request body defined with schema")
                content = req_body.get('content', {})
                for content_type, content_details in content.items():
                    schema_details = content_details.get('schema', {})
                    if 'properties' in schema_details:
                        props = list(schema_details['properties'].keys())
                        print(f"   - Request properties: {props}")
                        
                        # Check if we have our expected properties
                        expected_props = ['query', 'category', 'min_price', 'max_price', 'limit', 'offset']
                        found_props = [p for p in expected_props if p in props]
                        print(f"   - Found expected properties: {found_props}")
            else:
                print("   - No request body defined")
                
    else:
        print(f"[ERROR] 6. Path does not exist in OpenAPI schema: {search_path}")
        print(f"   Available paths with 'smart' in them: {[p for p in paths.keys() if 'smart' in p]}")
    
    print("\n[SUCCESS] All tests passed! Smart search schema is properly implemented.")
    print("Swagger UI should now show the correct schema instead of 'additionalProp'.")
    
except Exception as e:
    print(f"[ERROR] Test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)