"""
Database models for Telegram Bot Integration
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from ..database import Base


class BotApiKey(Base):
    """
    Model for managing API keys for Telegram bots
    """
    __tablename__ = "bot_api_keys"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)  # Name for identifying the bot
    api_key = Column(String, unique=True, index=True, nullable=False)  # The actual API key
    is_active = Column(Boolean, default=True)  # Whether this key is active
    permissions = Column(Text, default="read")  # Comma-separated list of permissions
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_used_at = Column(DateTime(timezone=True), nullable=True)  # Track when key was last used