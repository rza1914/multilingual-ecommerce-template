"""
Main API module for Telegram Bot Integration
Registers all the bot-related routes
"""
from fastapi import APIRouter
from .routes import router as bot_router

# Main router for bot integration API
bot_api_router = APIRouter()
bot_api_router.include_router(bot_router, prefix="/bot", tags=["bot"])