"""
Admin AI Settings API Endpoints
AI configuration management for administrators
"""

import json
import os
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...database import get_db
from ...models import user as user_models
from ...core.auth import get_current_admin_user
from ...schemas.ai_settings import AISettingsUpdate, AISettingsResponse

router = APIRouter(prefix="/admin/ai-settings", tags=["admin-ai-settings"])

# Path to AI settings file (simple file-based storage for now)
AI_SETTINGS_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "ai_settings.json")

# Default AI settings
DEFAULT_AI_SETTINGS = {
    "bot_name": "LuxBot",
    "selected_personality": "professional",
    "custom_prompt": "",
    "use_custom_prompt": False
}

# Personality system prompts
PERSONALITY_PROMPTS = {
    "professional": "You are a professional e-commerce assistant. Be formal, helpful, and focused on helping customers find the best products. Provide detailed product information and comparisons when asked.",
    "friendly": "You are a friendly and warm shopping assistant. Be casual, use emojis occasionally, and make the shopping experience fun and enjoyable. Treat customers like friends.",
    "expert": "You are an expert product advisor with deep knowledge. Provide technical details, specifications, and expert recommendations. Help customers make informed decisions based on their needs.",
    "concise": "You are a quick and efficient assistant. Keep responses short and to point. No unnecessary details - just the essential information customers need."
}


def load_ai_settings() -> Dict[str, Any]:
    """
    Load AI settings from file
    Returns default settings if file doesn't exist
    """
    try:
        if os.path.exists(AI_SETTINGS_FILE):
            with open(AI_SETTINGS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading AI settings: {e}")
    
    return DEFAULT_AI_SETTINGS.copy()


def save_ai_settings(settings: Dict[str, Any]) -> bool:
    """
    Save AI settings to file
    """
    try:
        with open(AI_SETTINGS_FILE, 'w', encoding='utf-8') as f:
            json.dump(settings, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving AI settings: {e}")
        return False


def get_active_system_prompt() -> str:
    """
    Get the currently active system prompt based on settings
    This function can be imported by the chatbot to get the current prompt
    """
    settings = load_ai_settings()
    
    if settings.get("use_custom_prompt") and settings.get("custom_prompt"):
        return settings["custom_prompt"]
    
    personality = settings.get("selected_personality", "professional")
    return PERSONALITY_PROMPTS.get(personality, PERSONALITY_PROMPTS["professional"])


def get_bot_name() -> str:
    """
    Get the current bot name
    This function can be imported by the chatbot
    """
    settings = load_ai_settings()
    return settings.get("bot_name", "LuxBot")


@router.get("", response_model=Dict[str, Any])
def get_ai_settings(
    current_admin: user_models.User = Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """
    Get current AI settings
    """
    settings = load_ai_settings()
    
    # Convert snake_case to camelCase for frontend
    return {
        "botName": settings.get("bot_name", "LuxBot"),
        "selectedPersonality": settings.get("selected_personality", "professional"),
        "customPrompt": settings.get("custom_prompt", ""),
        "useCustomPrompt": settings.get("use_custom_prompt", False)
    }


@router.put("", response_model=Dict[str, Any])
def update_ai_settings(
    settings_data: Dict[str, Any],
    current_admin: user_models.User = Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """
    Update AI settings
    """
    try:
        # Convert camelCase from frontend to snake_case
        settings = {
            "bot_name": settings_data.get("botName", "LuxBot")[:20],  # Limit name length
            "selected_personality": settings_data.get("selectedPersonality", "professional"),
            "custom_prompt": settings_data.get("customPrompt", "")[:2000],  # Limit prompt length
            "use_custom_prompt": settings_data.get("useCustomPrompt", False)
        }
        
        # Validate personality
        if settings["selected_personality"] not in PERSONALITY_PROMPTS:
            settings["selected_personality"] = "professional"
        
        # Save settings
        if not save_ai_settings(settings):
            raise HTTPException(
                status_code=500,
                detail="Failed to save AI settings"
            )
        
        return {
            "success": True,
            "message": "AI settings updated successfully",
            "botName": settings["bot_name"],
            "selectedPersonality": settings["selected_personality"],
            "customPrompt": settings["custom_prompt"],
            "useCustomPrompt": settings["use_custom_prompt"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating AI settings: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating AI settings: {str(e)}"
        )


@router.get("/personalities", response_model=Dict[str, Any])
def get_personalities(
    current_admin: user_models.User = Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """
    Get available AI personalities
    """
    return {
        "personalities": [
            {
                "id": key,
                "prompt": value
            }
            for key, value in PERSONALITY_PROMPTS.items()
        ]
    }


@router.get("/active-prompt", response_model=Dict[str, str])
def get_active_prompt(
    current_admin: user_models.User = Depends(get_current_admin_user)
) -> Dict[str, str]:
    """
    Get the currently active system prompt
    """
    return {
        "prompt": get_active_system_prompt(),
        "bot_name": get_bot_name()
    }