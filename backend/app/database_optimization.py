"""
Database optimization script
This script adds appropriate indexes to improve query performance
"""
from sqlalchemy import Index
from app.database import Base


def add_indexes():
    """
    Add indexes to improve database query performance
    """
    # Users table indexes
    Index('idx_users_email', Base.registry._class_registry['User'].email, unique=True)
    Index('idx_users_username', Base.registry._class_registry['User'].username, unique=True)
    Index('idx_users_created_at', Base.registry._class_registry['User'].created_at)
    Index('idx_users_role', Base.registry._class_registry['User'].role)

    # Products table indexes  
    Index('idx_products_title', Base.registry._class_registry['Product'].title)
    Index('idx_products_category', Base.registry._class_registry['Product'].category)
    Index('idx_products_price', Base.registry._class_registry['Product'].price)
    Index('idx_products_is_active', Base.registry._class_registry['Product'].is_active)
    Index('idx_products_is_featured', Base.registry._class_registry['Product'].is_featured)
    Index('idx_products_owner_id', Base.registry._class_registry['Product'].owner_id)
    Index('idx_products_created_at', Base.registry._class_registry['Product'].created_at)

    # Orders table indexes
    Index('idx_orders_user_id', Base.registry._class_registry['Order'].user_id)
    Index('idx_orders_created_at', Base.registry._class_registry['Order'].created_at)
    Index('idx_orders_status', Base.registry._class_registry['Order'].status)

    # OrderItems table indexes
    Index('idx_order_items_order_id', Base.registry._class_registry['OrderItem'].order_id)
    Index('idx_order_items_product_id', Base.registry._class_registry['OrderItem'].product_id)

    # Bot API Keys table indexes
    Index('idx_bot_api_keys_name', Base.registry._class_registry['BotApiKey'].name)
    Index('idx_bot_api_keys_api_key', Base.registry._class_registry['BotApiKey'].api_key, unique=True)
    Index('idx_bot_api_keys_user_id', Base.registry._class_registry['BotApiKey'].user_id)