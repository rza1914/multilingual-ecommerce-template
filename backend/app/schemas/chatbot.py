from pydantic import BaseModel
from typing import Optional

class ChatMessageRequest(BaseModel):
    message: str
    conversation_id: str
    provider: Optional[str] = None