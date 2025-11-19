from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from typing import Optional
from ...models.user import User  # Adjust import as needed
from ..websocket_manager import manager
from ..services.ai_chat_service import AIChatService
import uuid
import logging
import json

router = APIRouter()

async def get_current_user_optional(
    token: Optional[str] = Query("guest")  # default guest
):
    if not token or token == "guest" or token == "null":
        return None  # guest user
    # کد validate token موجود رو اینجا بذار
    from ..core.security import get_current_user_from_token
    try:
        user = get_current_user_from_token(token)
        return user
    except Exception:
        return None

@router.websocket("/ws/chat")
async def websocket_chat_endpoint(
    websocket: WebSocket,
    user: Optional[User] = Depends(get_current_user_optional),  # <-- Optional!
    token: Optional[str] = Query("guest")
):
    await websocket.accept()  # حالا همیشه accept می‌کنه

    session_id = f"guest_{uuid.uuid4().hex[:8]}" if not user else f"user_{user.id}"

    await manager.connect(websocket, session_id)

    # Send welcome message
    await websocket.send_text(json.dumps({"type": "welcome", "session_id": session_id, "user_type": "guest" if not user else "authenticated"}))

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data) if data.startswith("{") else {"content": data}

            # If message is authentication → upgrade session
            if message_data.get("type") == "authenticate" and message_data.get("token"):
                from ..core.security import get_current_user_from_token
                try:
                    new_user = get_current_user_from_token(message_data["token"])
                    if new_user:
                        new_session_id = f"user_{new_user.id}"
                        # Transfer history from old session to new session
                        # await manager.transfer_session(session_id, new_session_id)  # Implement this if needed
                        session_id = new_session_id
                        # Update the connection in the manager
                        await manager.update_session_id(websocket, session_id)
                        user = new_user  # Update the user in this connection's context
                except Exception:
                    # Invalid token, continue as guest
                    pass

            # Process message with AI
            content = message_data.get("content", "")
            ai_response = await AIChatService.get_response(content, user or {"id": "guest"})
            await websocket.send_text(json.dumps({
                "type": "message",
                "content": ai_response,
                "role": "assistant",
                "timestamp": str(uuid.uuid4())
            }))

    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        logging.info(f"WebSocket disconnected for session {session_id}")
    except Exception as e:
        logging.error(f"Error in WebSocket chat: {e}")
        manager.disconnect(websocket, session_id)