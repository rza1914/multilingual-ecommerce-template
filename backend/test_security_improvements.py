"""
Test file for security improvements in the e-commerce platform
"""
import pytest
import secrets
from datetime import datetime, timedelta
from unittest.mock import Mock, patch
from jose import jwt
from pydantic import ValidationError

from app.config import settings
from app.core.security import (
    create_access_token, 
    create_refresh_token, 
    verify_refresh_token, 
    generate_csrf_token
)
from app.schemas.user import UserCreate
from app.schemas.product import ProductCreate


def test_secret_key_generation():
    """Test that the config automatically generates a secret key if not provided"""
    # This is tested by ensuring the settings object has a valid secret key
    assert settings.SECRET_KEY is not None
    assert len(settings.SECRET_KEY) >= 32  # Minimum security requirement


def test_access_token_creation():
    """Test that access tokens are created correctly"""
    data = {"sub": "123", "username": "testuser"}
    token = create_access_token(data=data)
    
    # Decode and verify the token
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert decoded["sub"] == "123"
    assert decoded["username"] == "testuser"
    
    # Check that token expires as expected
    expires = datetime.fromtimestamp(decoded["exp"])
    expected_expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    assert abs((expires - expected_expire).total_seconds()) < 5  # Allow 5 second variance


def test_refresh_token_creation():
    """Test that refresh tokens are created correctly"""
    data = {"sub": "123", "username": "testuser"}
    token = create_refresh_token(data=data)
    
    # Decode and verify the token
    decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert decoded["sub"] == "123"
    assert decoded["username"] == "testuser"
    assert decoded["type"] == "refresh"  # Verify token type
    
    # Check that token expires as expected (longer than access token)
    expires = datetime.fromtimestamp(decoded["exp"])
    expected_expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    assert abs((expires - expected_expire).total_seconds()) < 5  # Allow 5 second variance


def test_refresh_token_verification():
    """Test that refresh tokens can be verified"""
    data = {"sub": "123", "username": "testuser"}
    token = create_refresh_token(data=data)
    
    # Verify the token
    user_id = verify_refresh_token(token)
    assert user_id == "123"


def test_invalid_refresh_token():
    """Test that invalid refresh tokens are rejected"""
    # Create a malformed token
    invalid_token = "invalid.token.here"
    user_id = verify_refresh_token(invalid_token)
    assert user_id is None
    
    # Create a token with wrong type
    access_token = create_access_token(data={"sub": "123"})
    user_id = verify_refresh_token(access_token)  # Try to verify as refresh token
    assert user_id is None


def test_csrf_token_generation():
    """Test CSRF token generation"""
    token = generate_csrf_token()
    assert token is not None
    assert len(token) > 0
    assert token != generate_csrf_token()  # Tokens should be unique


def test_user_schema_validation():
    """Test user schema validation"""
    # Valid user data
    valid_user = UserCreate(
        email="test@example.com",
        username="testuser",
        full_name="Test User",
        password="ValidPass123!",
        is_active=True
    )
    assert valid_user.username == "testuser"
    assert valid_user.email == "test@example.com"
    
    # Test password validation - should raise error for weak password
    with pytest.raises(ValidationError):
        UserCreate(
            email="test@example.com",
            username="testuser",
            full_name="Test User",
            password="weak",  # Too weak
            is_active=True
        )
    
    # Test username validation - should raise error for invalid username
    with pytest.raises(ValidationError):
        UserCreate(
            email="test@example.com",
            username="ab",  # Too short
            full_name="Test User",
            password="ValidPass123!",
            is_active=True
        )
    
    # Test username with invalid characters
    with pytest.raises(ValidationError):
        UserCreate(
            email="test@example.com",
            username="test@user",  # Contains invalid character
            full_name="Test User",
            password="ValidPass123!",
            is_active=True
        )


def test_product_schema_validation():
    """Test product schema validation"""
    # Valid product data
    valid_product = ProductCreate(
        title="Test Product",
        description="A great product",
        price=99.99
    )
    assert valid_product.title == "Test Product"
    assert valid_product.price == 99.99
    
    # Test title validation
    with pytest.raises(ValidationError):
        ProductCreate(
            title="",  # Empty title
            price=99.99
        )
    
    # Test price validation
    with pytest.raises(ValidationError):
        ProductCreate(
            title="Test Product",
            price=-10  # Negative price
        )
    
    # Test price too high validation
    with pytest.raises(ValidationError):
        ProductCreate(
            title="Test Product",
            price=10000000  # Too high
        )


def test_security_token_expiry():
    """Test that tokens expire properly"""
    # Create an access token with very short expiry
    from app.core.security import create_access_token
    import time
    
    data = {"sub": "123"}
    token = create_access_token(data=data, expires_delta=timedelta(seconds=1))
    
    # Wait for token to expire
    time.sleep(2)
    
    # Verify that expired token can't be decoded (this will raise an exception)
    with pytest.raises(jwt.ExpiredSignatureError):
        jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


if __name__ == "__main__":
    pytest.main([__file__])