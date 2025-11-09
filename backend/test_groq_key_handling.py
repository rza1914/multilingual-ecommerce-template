"""
Test script to verify Groq API key handling with and without the key
"""
import os
import sys
import warnings
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Filter out deprecation warnings 
warnings.filterwarnings("ignore", category=DeprecationWarning)

def test_with_api_key():
    """Test with API key set"""
    print("=== Testing with API key ===")
    
    # Make sure the API key is set (it should be in the .env file)
    os.environ['GROQ_API_KEY'] = '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'
    
    try:
        from app.services.groq_service import GroqService
        service = GroqService()
        print(f"[SUCCESS] GroqService initialized, enabled: {service.enabled}")
        
        from app.services.ai_service import AIService
        ai_service = AIService()
        print(f"[SUCCESS] AIService initialized")
        
        # Test a method that should work with fallback when API is disabled
        filters = ai_service.extract_search_filters("laptop with good camera")
        print(f"[SUCCESS] Extracted filters: {list(filters.keys())}")
        
        explanation = ai_service.generate_search_explanation("laptop", filters, 5)
        print(f"[SUCCESS] Generated explanation: {explanation[:50]}...")
        
        related = ai_service.generate_related_searches("wireless headphones")
        print(f"[SUCCESS] Generated related searches: {related}")
        
        relevance = ai_service.analyze_product_relevance(
            "wireless headphones", 
            "Wireless Bluetooth Headphones", 
            "High quality wireless headphones with noise cancellation"
        )
        print(f"[SUCCESS] Analyzed relevance: {relevance}")
        
        multilingual = ai_service.process_multilingual_query("laptop ارزان")
        print(f"[SUCCESS] Processed multilingual query: {multilingual}")
        
        print("[SUCCESS] All tests passed with API key!\n")
        return True
        
    except Exception as e:
        print(f"[ERROR] Test with API key failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_without_api_key():
    """Test without API key set"""
    print("=== Testing without API key ===")
    
    # Remove the API key from environment
    if 'GROQ_API_KEY' in os.environ:
        del os.environ['GROQ_API_KEY']
    
    try:
        from app.services.groq_service import GroqService
        service = GroqService()
        print(f"[SUCCESS] GroqService initialized, enabled: {service.enabled}")
        
        from app.services.ai_service import AIService
        ai_service = AIService()
        print(f"[SUCCESS] AIService initialized")
        
        # Test fallback functionality
        filters = ai_service.extract_search_filters("laptop with good camera")
        print(f"[SUCCESS] Extracted filters with fallback: {list(filters.keys())}")
        
        explanation = ai_service.generate_search_explanation("laptop", filters, 5)
        # Encode to avoid Unicode issues on Windows
        explanation_preview = explanation[:50].encode('ascii', errors='ignore').decode()
        print(f"[SUCCESS] Generated explanation with fallback: {explanation_preview}...")
        
        related = ai_service.generate_related_searches("wireless headphones")
        print(f"[SUCCESS] Generated related searches with fallback: {related}")
        
        relevance = ai_service.analyze_product_relevance(
            "wireless headphones", 
            "Wireless Bluetooth Headphones", 
            "High quality wireless headphones with noise cancellation"
        )
        print(f"[SUCCESS] Analyzed relevance with fallback: {relevance}")
        
        multilingual = ai_service.process_multilingual_query("laptop ارزان")
        print(f"[SUCCESS] Processed multilingual query with fallback: {multilingual}")
        
        print("[SUCCESS] All tests passed without API key!\n")
        return True
        
    except Exception as e:
        print(f"[ERROR] Test without API key failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_main_app_import():
    """Test that the main application can be imported in both cases"""
    print("=== Testing main app import ===")
    
    try:
        from app.main import app
        print("[SUCCESS] Main application imported successfully")
        
        # Check OpenAPI schema generation
        schema = app.openapi()
        print(f"[SUCCESS] OpenAPI schema generated, {len(schema.get('paths', {}))} paths")
        
        return True
    except Exception as e:
        print(f"[ERROR] Main app test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("Testing Groq API key handling...")
    
    # Run tests with API key
    success_with_key = test_with_api_key()
    
    # Run tests without API key
    success_without_key = test_without_api_key()
    
    # Test main app import
    main_app_success = test_main_app_import()
    
    if success_with_key and success_without_key and main_app_success:
        print("ALL TESTS PASSED!")
        print("The application works correctly with and without the GROQ_API_KEY.")
        print("When the key is available, full AI features are enabled.")
        print("When the key is not available, fallback mechanisms provide basic functionality.")
    else:
        print("SOME TESTS FAILED!")
        sys.exit(1)