# backend/app/core/config.py
import os
from typing import Optional

class Settings:
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY")
    
    @property
    def groq_enabled(self) -> bool:
        return bool(self.GROQ_API_KEY)

settings = Settings()