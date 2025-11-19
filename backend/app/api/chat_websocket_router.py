# backend/app/api/chat_websocket_router.py
"""
WebSocket endpoints for chat functionality in iShop E-commerce Platform
"""

import json
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from .websocket_manager import manager
from ..database import SessionLocal
from ..services.ai_chat_service import AIChatService

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, status, Depends
from ..core.security import get_current_user_from_token  # Updated import
from ..models.user import User  # Import User model

router = APIRouter()
logger = logging.getLogger(__name__)

def get_db():
    """
    Create a new database session for the WebSocket connection
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.websocket("/ws/chat/{chat_id}")
async def websocket_chat_endpoint(
    websocket: WebSocket,
    chat_id: str,
    token: str = Query(...),  # token required in query
    current_user: User = Depends(get_current_user_from_token)  # This will validate token
):
    """
    WebSocket endpoint for chat functionality with token validation and AI integration
    """
    logger.info(f"🔵 WebSocket connection attempt for chat {chat_id} for user: {current_user.id if hasattr(current_user, 'id') else 'Unknown'}")

    try:
        # At this point, the token is validated and current_user is available
        user_id = current_user.id if hasattr(current_user, 'id') else current_user.get('id')
        logger.info(f"✅ Token validated for user {user_id}")

        # قبول کردن اتصال
        await websocket.accept()
        logger.info(f"✅ WebSocket accepted for chat {chat_id}")

        # اضافه کردن به manager
        await manager.connect(websocket, chat_id)
        logger.info(f"✅ Added to manager for chat {chat_id}")

        # ارسال پیام خوش‌آمدگویی فوری
        welcome_msg = {
            "type": "welcome",
            "message": f"Connected to chat {chat_id}",
            "timestamp": datetime.utcnow().isoformat()
        }
        await websocket.send_text(json.dumps(welcome_msg))
        logger.info(f"✅ Welcome message sent to chat {chat_id}")

        try:
            # حلقه اصلی برای دریافت پیام‌ها
            while True:
                data = await websocket.receive_text()
                logger.info(f"📨 Received message in chat {chat_id}: {data}")

                # Parse the incoming message to extract the actual text content
                try:
                    message_data = json.loads(data)
                    user_message = message_data.get("content", data)  # Fallback to the raw data if it's not JSON
                except json.JSONDecodeError:
                    # If data is not JSON, treat it as the message content
                    user_message = data

                # Use a new database session to interact with the AI service
                db_gen = get_db()
                db = next(db_gen)

                try:
                    # Create AI service instance with the authenticated user's ID
                    ai_service = AIChatService(db, user_id=int(user_id))  # <-- از user_id واقعی استفاده شد

                    # Generate AI response
                    ai_response = await ai_service.get_chat_response(
                        user_message,
                        {
                            "user_info": {"id": int(user_id), "username": "websocket_user", "full_name": "WebSocket User", "email": "websocket@example.com"},
                            "recent_orders": [],
                            "relevant_products": [],
                            "inventory_status": "available"
                        }
                    )

                    # Send AI response back to the client
                    response_msg = {
                        "type": "chat_message",
                        "content": ai_response,
                        "sender": "ai",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                    await websocket.send_text(json.dumps(response_msg))
                    logger.info(f"📤 Sent AI response to chat {chat_id}")

                except Exception as e:
                    logger.error(f"❌ Error in AI service for chat {chat_id}: {e}")
                    # Send error message to client
                    error_msg = {
                        "type": "chat_message",
                        "content": "Sorry, I'm having trouble processing your request right now. Please try again later.",
                        "sender": "ai",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                    await websocket.send_text(json.dumps(error_msg))

                finally:
                    # Close the DB session
                    next(db_gen, None)  # This triggers the finally block in get_db()

        except WebSocketDisconnect:
            logger.info(f"🔴 WebSocket disconnected for chat {chat_id}")
        except Exception as e:
            logger.error(f"❌ Error in message loop for chat {chat_id}: {e}")
            # If there's an exception in the message loop, the WebSocket will be closed
            raise

    except Exception as e:
        logger.error(f"❌ Unexpected error in WebSocket for chat {chat_id}: {e}")
        # Don't re-raise here as it may cause a 1011 error; let the finally block handle cleanup
    finally:
        # قطع اتصال از manager
        try:
            manager.disconnect(websocket, chat_id)
        except Exception as e:
            logger.error(f"❌ Error during cleanup for chat {chat_id}: {e}")
        logger.info(f"🔴 Cleanup completed for chat {chat_id}")