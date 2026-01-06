"""
AI Settings Schemas
Pydantic models for AI configuration
"""

from pydantic import BaseModel, Field
from typing import Optional


class AISettingsBase(BaseModel):
    """Base schema for AI settings"""
    bot_name: str = Field(default="LuxBot", max_length=20)
    selected_personality: str = Field(default="professional")
    custom_prompt: Optional[str] = Field(default=None, max_length=2000)
    use_custom_prompt: bool = Field(default=False)


class AISettingsUpdate(AISettingsBase):
    """Schema for updating AI settings"""
    pass


class AISettingsResponse(AISettingsBase):
    """Schema for AI settings response"""
    
    class Config:
        from_attributes = True