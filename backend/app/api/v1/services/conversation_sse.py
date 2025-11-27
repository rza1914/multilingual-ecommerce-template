"""
SSE Conversation Streaming Endpoint
Implements guest-mode + authenticated-mode chatbot functionality
"""
from typing import Optional, Dict, Any, AsyncGenerator
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
import asyncio
import json
import logging
from starlette.responses import StreamingResponse

from app.models.user import User
from app.database import get_db
from app.core.security import get_current_user_optional
from app.services.ai_chat_service import AIChatService
from app.utils.product_search import ProductSearch
from app.config import settings
from app.schemas.chatbot import ChatMessageRequest

router = APIRouter()
logger = logging.getLogger(__name__)

# Keep original routes that include the conversation_sse path component
@router.post("/conversation_sse/message")
async def send_message(
    request: ChatMessageRequest,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """ارسال پیام به چت‌بات (non-streaming)"""
    try:
        response_content = ""
        async for chunk in AIChatService.get_streaming_response(
            db=db,
            user_message=request.message,
            context={"user_info": None, "recent_orders": [], "relevant_products": [], "inventory_status": "active"},
            user_id=None
        ):
            # استخراج محتوای chunk
            response_content += chunk

        return {
            "success": True,
            "response": response_content,
            "conversation_id": request.conversation_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")

@router.get("/conversation_sse/stream")
async def stream_message(
    message: str,
    conversation_id: str = None,
    request: Request = None,
    db: Session = Depends(get_db)
):
    """Stream پاسخ چت‌بات با استفاده از Server-Sent Events"""
    print(f"SSE REQUEST: method={request.method} accept={request.headers.get('accept')} url={request.url}")
    try:
        user_message = message.strip()

        if not user_message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message content is required"
            )

        # Get the authorization header
        auth_header = request.headers.get("Authorization")
        token = None
        user = None

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]

        # Attempt to get user from token (returns None if no/invalid token)
        user = await get_current_user_optional(token)

        # Initialize context with default values
        context = {
            "user_info": None,
            "recent_orders": [],
            "relevant_products": [],
            "inventory_status": "active"
        }

        if user:
            # Load user-specific context
            product_search = ProductSearch(db)

            # Ensure all user info is properly encoded as Unicode strings
            context["user_info"] = {
                "id": user.id,
                "username": str(user.username) if user.username else "",
                "full_name": str(user.full_name) if user.full_name else "",
                "email": str(user.email) if user.email else ""
            }

            # Search for relevant products based on the message
            context["relevant_products"] = product_search.search_products(user_message)

            # Get user's recent orders
            context["recent_orders"] = product_search.get_user_orders(user.id)

        async def generate():
            try:
                # ارسال اولین chunk برای اطمینان از اتصال - با رمزنگاری صحیح
                yield f"data: {json.dumps({'status': 'connected'}, ensure_ascii=False)}\n\n"

                # ارسال پیام به سرویس AI
                full_response = ""
                async for chunk in AIChatService.get_streaming_response(
                    db=db,
                    user_message=user_message,
                    context=context,
                    user_id=user.id if user else None
                ):
                    full_response += chunk
                    # اطمینان از فرمت صحیح SSE و رمزنگاری UTF-8
                    sse_data = json.dumps({"content": chunk}, ensure_ascii=False)
                    yield f"data: {sse_data}\n\n"

                # ارسال سیگنال پایان - به فرمتی که فرانت‌اند انتظار دارد
                yield f"data: [DONE]\n\n"
            except Exception as e:
                # ارسال خطا در فرمت صحیح SSE و رمزنگاری UTF-8
                error_data = json.dumps({"error": str(e)}, ensure_ascii=False)
                yield f"data: {error_data}\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",  # تغییر از text/plain به text/event-stream
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",  # در محیط پروداکشن باید محدود شود
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your message. Please try again later."
        )

@router.get("/health")
async def health_check():
    """بررسی سلامت سرویس چت‌بات"""
    try:
        # Check if API key is properly configured
        api_key = settings.deepseek_api_key  # Use the property that ensures loading from any .env file
        if not api_key:
            return {
                "status": "unhealthy",
                "error": "No API key configured"
            }

        return {
            "status": "healthy",
            "provider": "deepseek",
            "message": "Chatbot service is ready"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }