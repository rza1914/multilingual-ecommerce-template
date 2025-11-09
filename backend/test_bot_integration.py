"""
Tests for Telegram Bot Integration module
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.models.bot import BotApiKey
from app.api.v1.bot_integration.service import generate_api_key
import secrets


# Create a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_bot_integration.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture
def setup_database():
    """Setup test database"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def create_test_bot_key():
    """Create a test bot API key"""
    api_key = generate_api_key()
    bot_key = BotApiKey(
        name="Test Bot",
        api_key=api_key,
        permissions="read:customers,read:products,read:orders,read:stats",
        is_active=True
    )
    
    db = TestingSessionLocal()
    db.add(bot_key)
    db.commit()
    db.refresh(bot_key)
    
    yield api_key
    
    db.delete(bot_key)
    db.commit()
    db.close()


def test_get_customers_without_auth(setup_database):
    """Test that getting customers without auth returns 401"""
    response = client.get("/api/v1/bot/bot/customers/")
    assert response.status_code == 401


def test_get_customers_with_valid_auth(setup_database, create_test_bot_key):
    """Test that getting customers with valid auth works"""
    headers = {"Authorization": f"Bearer {create_test_bot_key}"}
    response = client.get("/api/v1/bot/bot/customers/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "bot_name" in data


def test_get_products_without_auth(setup_database):
    """Test that getting products without auth returns 401"""
    response = client.get("/api/v1/bot/bot/products/")
    assert response.status_code == 401


def test_get_products_with_valid_auth(setup_database, create_test_bot_key):
    """Test that getting products with valid auth works"""
    headers = {"Authorization": f"Bearer {create_test_bot_key}"}
    response = client.get("/api/v1/bot/bot/products/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "bot_name" in data


def test_get_orders_without_auth(setup_database):
    """Test that getting orders without auth returns 401"""
    response = client.get("/api/v1/bot/bot/orders/")
    assert response.status_code == 401


def test_get_orders_with_valid_auth(setup_database, create_test_bot_key):
    """Test that getting orders with valid auth works"""
    headers = {"Authorization": f"Bearer {create_test_bot_key}"}
    response = client.get("/api/v1/bot/bot/orders/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "bot_name" in data


def test_get_bot_stats_with_valid_auth(setup_database, create_test_bot_key):
    """Test that getting bot stats with valid auth works"""
    headers = {"Authorization": f"Bearer {create_test_bot_key}"}
    response = client.get("/api/v1/bot/bot/stats/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "bot_name" in data


def test_get_bot_permissions_with_valid_auth(setup_database, create_test_bot_key):
    """Test that getting bot permissions with valid auth works"""
    headers = {"Authorization": f"Bearer {create_test_bot_key}"}
    response = client.get("/api/v1/bot/bot/permissions/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "permissions" in data


def test_get_customers_with_insufficient_permissions(setup_database):
    """Test that getting customers with insufficient permissions returns 403"""
    # Create a bot key with no customer permissions
    api_key = generate_api_key()
    bot_key = BotApiKey(
        name="Test Bot No Permissions",
        api_key=api_key,
        permissions="read:products,read:orders",  # No read:customers permission
        is_active=True
    )
    
    db = TestingSessionLocal()
    db.add(bot_key)
    db.commit()
    db.refresh(bot_key)
    
    headers = {"Authorization": f"Bearer {api_key}"}
    response = client.get("/api/v1/bot/bot/customers/", headers=headers)
    assert response.status_code == 403
    
    db.delete(bot_key)
    db.commit()
    db.close()


def test_invalid_api_key(setup_database):
    """Test that invalid API key returns 401"""
    invalid_key = "invalid_api_key_12345"
    headers = {"Authorization": f"Bearer {invalid_key}"}
    response = client.get("/api/v1/bot/bot/customers/", headers=headers)
    assert response.status_code == 401