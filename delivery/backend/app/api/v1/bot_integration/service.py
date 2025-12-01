"""
Service module for Telegram Bot Integration
Provides business logic for bot-related operations
"""
import secrets
from datetime import datetime
from sqlalchemy.orm import Session
from ....models.bot import BotApiKey
from ....models.user import User
from ....models.product import Product as ProductModel
from ....models.order import Order as OrderModel


def generate_api_key() -> str:
    """
    Generate a secure API key
    """
    return secrets.token_urlsafe(32)


def create_bot_api_key(
    db: Session,
    name: str,
    permissions: str = "read"
) -> BotApiKey:
    """
    Create a new bot API key with specified permissions
    """
    api_key = generate_api_key()
    
    bot_key = BotApiKey(
        name=name,
        api_key=api_key,
        permissions=permissions
    )
    
    db.add(bot_key)
    db.commit()
    db.refresh(bot_key)
    
    # Return a copy without the sensitive key for security
    bot_key_copy = BotApiKey(
        id=bot_key.id,
        name=bot_key.name,
        api_key=api_key,  # Include the key in return for creation
        is_active=bot_key.is_active,
        permissions=bot_key.permissions,
        created_at=bot_key.created_at,
        updated_at=bot_key.updated_at
    )
    
    return bot_key_copy


def get_customer_data(
    db: Session,
    customer_id: int = None,
    limit: int = 50,
    offset: int = 0
) -> list:
    """
    Get customer data based on permissions
    Only returns read-only information
    """
    query = db.query(User.id, User.email, User.full_name, User.is_active, User.created_at)
    
    if customer_id:
        query = query.filter(User.id == customer_id)
    
    customers = query.offset(offset).limit(limit).all()
    
    # Convert to dictionaries for JSON serialization
    return [
        {
            "id": customer.id,
            "email": customer.email,
            "full_name": customer.full_name,
            "is_active": customer.is_active,
            "created_at": customer.created_at
        }
        for customer in customers
    ]


def get_product_data(
    db: Session,
    product_id: int = None,
    category: str = None,
    limit: int = 50,
    offset: int = 0
) -> list:
    """
    Get product data based on permissions
    """
    query = db.query(ProductModel)
    
    if product_id:
        query = query.filter(ProductModel.id == product_id)
    
    if category:
        query = query.filter(ProductModel.category == category)
    
    products = query.offset(offset).limit(limit).all()
    
    # Convert to dictionaries for JSON serialization
    return [
        {
            "id": product.id,
            "title": product.title,
            "description": product.description,
            "price": product.price,
            "discount_price": product.discount_price,
            "is_active": product.is_active,
            "is_featured": product.is_featured,
            "category": product.category,
            "image_url": product.image_url,
            "created_at": product.created_at,
            "updated_at": product.updated_at
        }
        for product in products
    ]


def get_order_data(
    db: Session,
    order_id: int = None,
    user_id: int = None,
    status: str = None,
    limit: int = 50,
    offset: int = 0
) -> list:
    """
    Get order data based on permissions
    """
    query = db.query(OrderModel)
    
    if order_id:
        query = query.filter(OrderModel.id == order_id)
    
    if user_id:
        query = query.filter(OrderModel.user_id == user_id)
    
    if status:
        query = query.filter(OrderModel.status == status)
    
    orders = query.offset(offset).limit(limit).all()
    
    # Convert to dictionaries for JSON serialization
    return [
        {
            "id": order.id,
            "user_id": order.user_id,
            "full_name": order.full_name,
            "email": order.email,
            "phone": order.phone,
            "status": order.status,
            "subtotal": order.subtotal,
            "shipping_cost": order.shipping_cost,
            "tax": order.tax,
            "discount": order.discount,
            "total": order.total,
            "created_at": order.created_at,
            "updated_at": order.updated_at
        }
        for order in orders
    ]


def get_api_key_usage_statistics(db: Session, api_key_id: int) -> dict:
    """
    Get statistics about API key usage
    """
    bot_key = db.query(BotApiKey).filter(BotApiKey.id == api_key_id).first()
    
    if not bot_key:
        return None
    
    return {
        "id": bot_key.id,
        "name": bot_key.name,
        "is_active": bot_key.is_active,
        "permissions": bot_key.permissions,
        "created_at": bot_key.created_at,
        "updated_at": bot_key.updated_at,
        "last_used_at": bot_key.last_used_at
    }