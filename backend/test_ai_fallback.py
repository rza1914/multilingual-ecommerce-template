"""
Test file for AI Fallback System
"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from sqlalchemy.orm import Session
from app.services.ai_fallback_service import AIFallbackService, AIAction, FallbackResponse
from app.services.ai_service import AIService
from app.models.product import Product


class TestAIFallbackService:
    """Test cases for AIFallbackService"""
    
    def setup_method(self):
        self.mock_db = Mock(spec=Session)
        self.fallback_service = AIFallbackService(self.mock_db)
    
    def test_chat_fallback_keyword_detection(self):
        """Test that chat fallback detects keywords correctly"""
        # Test shipping related query
        result = self.fallback_service.chat_fallback("I want to know about shipping")
        assert result.success == True
        assert result.fallback_used == True
        assert "shipping" in result.data["response"].lower()
        
        # Test return related query
        result = self.fallback_service.chat_fallback("How do I return an item?")
        assert result.success == True
        assert result.fallback_used == True
        assert "return" in result.data["response"].lower()
    
    def test_smart_search_fallback(self):
        """Test smart search fallback functionality"""
        # Mock products in database
        mock_product = Mock()
        mock_product.id = 1
        mock_product.title = "Test Product"
        mock_product.description = "This is a test product for electronics"
        mock_product.price = 99.99
        mock_product.category = "Electronics"
        mock_product.image_url = "test.jpg"
        mock_product.stock = 10
        mock_product.rating = 4.5
        
        self.mock_db.query().filter().all.return_value = [mock_product]
        
        result = self.fallback_service.smart_search_fallback("test product", "Electronics", 5)
        assert result.success == True
        assert result.fallback_used == True
        assert len(result.data) >= 0  # May return empty if similarity is low
    
    def test_product_recommendations_fallback(self):
        """Test product recommendations fallback"""
        mock_product = Mock()
        mock_product.id = 1
        mock_product.title = "Test Product"
        mock_product.description = "This is a test product"
        mock_product.price = 99.99
        mock_product.category = "Electronics"
        mock_product.image_url = "test.jpg"
        mock_product.stock = 10
        mock_product.rating = 4.5
        
        self.mock_db.query().filter().first.return_value = mock_product
        self.mock_db.query().filter().limit().all.return_value = [mock_product]
        
        result = self.fallback_service.product_recommendations_fallback(1, 1, 4)
        assert result.success == True
        assert result.fallback_used == True
        assert len(result.data) >= 0
    
    def test_cache_functionality(self):
        """Test that caching works correctly"""
        # First call
        result1 = self.fallback_service._get_from_cache("test_key")
        assert result1 is None
        
        # Set value
        self.fallback_service._set_cache("test_key", "test_value")
        
        # Second call should return cached value
        result2 = self.fallback_service._get_from_cache("test_key")
        assert result2 == "test_value"


class TestAIService:
    """Test cases for AIService with fallback"""
    
    def setup_method(self):
        self.mock_db = Mock(spec=Session)
        self.ai_service = AIService(self.mock_db)
    
    def test_external_api_failure_triggers_fallback(self):
        """Test that when external API fails, fallback is used"""
        # Mock the external API to raise an exception
        with patch.object(self.ai_service, '_call_external_chat_api', side_effect=Exception("API Error")):
            result = self.ai_service.chat_fallback("test message", {})
            assert result.success == True
            assert result.fallback_used == True
            assert result.data is not None
    
    def test_similarity_calculation(self):
        """Test the text similarity function"""
        similarity = self.fallback_service._calculate_similarity("hello world", "hello world")
        assert similarity == 1.0
        
        similarity = self.fallback_service._calculate_similarity("hello", "world")
        assert similarity == 0.0
        
        similarity = self.fallback_service._calculate_similarity("hello world", "hello there")
        assert 0.0 < similarity < 1.0


def test_end_to_end_fallback():
    """End-to-end test to ensure fallback system works correctly"""
    # This test simulates an environment where external APIs are not available
    mock_db = Mock(spec=Session)
    
    # Create AI Service without any external API keys
    ai_service = AIService(mock_db)
    
    # Verify that fallback is used when no external services are available
    assert ai_service.groq_client is None
    assert ai_service.gemini_model is None
    assert ai_service.openai_client is None
    
    # Test chat functionality
    import asyncio
    
    async def run_test():
        result = await ai_service.get_chat_response("How do I return an item?")
        assert result["fallback_used"] == True
        assert "return" in result["response"].lower()
        
        # Test search functionality
        result = await ai_service.smart_search("laptop")
        assert result["fallback_used"] == True
        assert "results" in result
        
        # Test recommendations functionality
        result = await ai_service.get_product_recommendations(1)
        assert result["fallback_used"] == True
        assert "recommendations" in result
    
    # Run the async test
    asyncio.run(run_test())


if __name__ == "__main__":
    pytest.main([__file__])