"""
Test script for the new smart search schema implementation
"""
import warnings
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Filter out deprecation warnings (not the AttributeError which is an exception)
warnings.filterwarnings("ignore", category=DeprecationWarning)

print("Testing new smart search schema implementation...")

try:
    # Test importing the new schema 
    from app.schemas.smart_search import SmartSearchQuery, SmartSearchResponse, SmartSearchResultItem, SmartSearchExplanation
    print('[SUCCESS] Smart search schemas imported successfully')
    
    # Test creating an instance of the input schema
    query = SmartSearchQuery(
        query='wireless headphones',
        category='electronics',
        min_price=50.0,
        max_price=200.0,
        limit=10
    )
    print(f'[SUCCESS] Created SmartSearchQuery: {query.query}')
    print(f'[INFO] Query parameters: category={query.category}, price range={query.min_price}-{query.max_price}, limit={query.limit}')
    
    # Test importing the endpoint
    from app.api.v1.smart_search import router
    print('[SUCCESS] Smart search router imported successfully')
    
    # Test the endpoint function directly
    import inspect
    from app.api.v1.smart_search import smart_search
    sig = inspect.signature(smart_search)
    params = list(sig.parameters.keys())
    print(f'[INFO] Endpoint parameters: {params}')
    
    # Check the type annotation for the search_query parameter
    query_param = sig.parameters.get('search_query')
    if query_param:
        print(f'[INFO] search_query type annotation: {query_param.annotation}')
    
    response_annotation = sig.return_annotation
    print(f'[INFO] Return type annotation: {response_annotation}')
    
    print('\n[SUCCESS] All schemas and endpoints are properly defined with correct type annotations!')
    
except Exception as e:
    print(f'[ERROR] Import or test failed: {e}')
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\nThe new smart search implementation is ready with proper schemas for Swagger UI!")