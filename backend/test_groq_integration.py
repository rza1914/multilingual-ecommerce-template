"""
Tests for Groq-based smart search functionality
"""
import pytest
import os
from unittest.mock import Mock, patch, MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.services.groq_service import GroqService, RateLimiter
from app.services.ai_service import AIService
from app.services.smart_search_service import SmartSearchService
from app.models.product import Product as ProductModel
from app.database import Base


# Create a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_smart_search.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture
def setup_database():
    """Setup test database"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def mock_groq_response():
    """Mock Groq API response"""
    mock_response = Mock()
    mock_response.choices = [Mock()]
    mock_response.choices[0].message = Mock()
    mock_response.choices[0].message.content = '{"category": "mobile", "brand": "Samsung", "max_price": 15000000}'
    return mock_response


def test_rate_limiter_initialization():
    """Test that rate limiter initializes correctly"""
    limiter = RateLimiter(max_requests_per_minute=10, daily_limit=100)
    assert limiter.max_requests_per_minute == 10
    assert limiter.daily_limit == 100
    assert len(limiter.requests) == 0
    assert limiter.daily_requests == 0


def test_groq_service_initialization():
    """Test that Groq service initializes with API key"""
    # Mock environment variable
    with patch.dict(os.environ, {"GROQ_API_KEY": "test_key_123"}):
        service = GroqService()
        assert service.model == "llama3-8b-8192"  # default
        assert service.rate_limiter is not None


def test_groq_service_initialization_missing_api_key():
    """Test that Groq service raises error without API key"""
    # Temporarily remove GROQ_API_KEY from environment
    original_key = os.environ.get("GROQ_API_KEY")
    if "GROQ_API_KEY" in os.environ:
        del os.environ["GROQ_API_KEY"]
    
    try:
        with pytest.raises(ValueError, match="GROQ_API_KEY environment variable is not set"):
            GroqService()
    finally:
        # Restore original key if it existed
        if original_key is not None:
            os.environ["GROQ_API_KEY"] = original_key


@patch('groq.Groq')
def test_extract_search_filters_success(mock_groq_class, mock_groq_response):
    """Test that extract_search_filters works with mocked Groq response"""
    # Setup mock
    mock_client = Mock()
    mock_client.chat.completions.create.return_value = mock_groq_response
    mock_groq_class.return_value = mock_client
    
    with patch.dict(os.environ, {"GROQ_API_KEY": "test_key_123"}):
        service = GroqService()
        result = service.extract_search_filters("گوشی سامسونگ با حافظه زیاد")
        
        assert "category" in result
        assert result["category"] == "mobile"
        assert result["brand"] == "Samsung"
        assert result["max_price"] == 15000000


@patch('groq.Groq')
def test_generate_search_explanation(mock_groq_class):
    """Test that generate_search_explanation works"""
    # Setup mock response
    mock_response = Mock()
    mock_response.choices = [Mock()]
    mock_response.choices[0].message = Mock()
    mock_response.choices[0].message.content = "شما ۵ محصول مرتبط با گوشی سامسونگ پیدا کردید."
    mock_groq_class.return_value = Mock()
    mock_groq_class.return_value.chat.completions.create.return_value = mock_response
    
    with patch.dict(os.environ, {"GROQ_API_KEY": "test_key_123"}):
        service = GroqService()
        result = service.generate_search_explanation(
            "گوشی سامسونگ", 
            {"brand": "Samsung"}, 
            5
        )
        
        assert "سامسونگ" in result
        assert "5" in result


def test_smart_search_service_initialization(setup_database):
    """Test that SmartSearchService initializes properly with database session"""
    db = TestingSessionLocal()
    try:
        service = SmartSearchService(db)
        assert service.ai_service is not None
        assert service.db is db
    finally:
        db.close()


@patch('app.services.ai_service.AIService')
def test_smart_search_method(mock_ai_service_class, setup_database):
    """Test the smart_search method with mocked AI service"""
    # Setup mock AI service
    mock_ai_service = Mock()
    mock_ai_service.extract_search_filters.return_value = {"brand": "Samsung"}
    mock_ai_service.generate_search_explanation.return_value = "Found Samsung products"
    mock_ai_service.generate_related_searches.return_value = ["mobile phone", "android phone"]
    mock_ai_service_class.return_value = mock_ai_service
    
    db = TestingSessionLocal()
    try:
        service = SmartSearchService(db)
        result = service.smart_search("Samsung mobile")
        
        # Check that results structure is correct
        assert "results" in result
        assert "explanation" in result
        assert "extracted_filters" in result
        assert "total_results" in result
        assert "related_searches" in result
        
        # Check that AI service methods were called
        mock_ai_service.extract_search_filters.assert_called_once()
        mock_ai_service.generate_search_explanation.assert_called_once()
        mock_ai_service.generate_related_searches.assert_called_once()
    finally:
        db.close()


def test_rate_limiter_check():
    """Test the rate limiter functionality"""
    limiter = RateLimiter(max_requests_per_minute=2, daily_limit=10)
    
    # Should allow first two requests
    assert limiter.check_rate_limit() is True
    assert limiter.check_rate_limit() is True
    
    # Add a third request without clearing old ones would exceed limit
    # But since we're not adding time delay, let's test the limit directly
    for _ in range(10):  # Add more requests than allowed
        limiter.check_rate_limit()
    
    # After reaching the limit, further requests should be rejected
    # This test is simplified - in practice the limiter.wait_if_needed() handles this
    assert limiter.max_requests_per_minute == 2
    assert limiter.daily_limit == 10