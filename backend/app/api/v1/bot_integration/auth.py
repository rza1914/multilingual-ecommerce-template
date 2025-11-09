"""
Authentication module for Telegram Bot Integration
Handles bot API key verification and permissions
"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func
from ....database import get_db
from ....models.bot import BotApiKey


security = HTTPBearer()


def get_bot_api_key(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> BotApiKey:
    """
    Verify the bot API key from the Authorization header
    """
    api_key = credentials.credentials

    # Query the database for the API key
    bot_key = db.query(BotApiKey).filter(
        BotApiKey.api_key == api_key,
        BotApiKey.is_active == True
    ).first()

    if not bot_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive API key",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last used timestamp
    bot_key.last_used_at = func.now()
    db.commit()

    return bot_key


def require_permission(permission: str):
    """
    Dependency to check if a bot has a specific permission
    """
    def check_permission(
        bot_key: BotApiKey = Depends(get_bot_api_key)
    ) -> BotApiKey:
        permissions = bot_key.permissions.split(",") if bot_key.permissions else []
        if permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Bot does not have required permission: {permission}"
            )
        return bot_key
    return check_permission