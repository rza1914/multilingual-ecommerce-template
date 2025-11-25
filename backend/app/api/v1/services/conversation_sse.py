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

from ...models.user import User
from ...database import get_db
from ...core.security import get_current_user_optional
from ...services.ai_chat_service import AIChatService
from ...utils.product_search import ProductSearch

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/conversation_sse/stream",
             summary="Stream AI responses via Server-Sent Events",
             description="Stream AI-generated responses using Server-Sent Events. Works in both guest mode (no auth) and authenticated mode (with valid JWT).")
async def stream_conversation_sse(
    request: Request,
    db: Session = Depends(get_db)
) -> StreamingResponse:
    """
    Stream AI responses using Server-Sent Events (SSE).
    - Works without authentication (guest mode)
    - Loads user context when authenticated
    - Streams response tokens progressively
    """
    # Get the authorization header
    auth_header = request.headers.get("Authorization")
    token = None
    user = None

    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header[7:]

    # Attempt to get user from token (returns None if no/invalid token)
    user = await get_current_user_optional(token)

    try:
        # Parse the request body
        body = await request.json()
        user_message = body.get("message", "").strip()

        if not user_message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message content is required"
            )

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

            context["user_info"] = {
                "id": user.id,
                "username": user.username,
                "full_name": user.full_name,
                "email": user.email
            }

            # Search for relevant products based on the message
            context["relevant_products"] = product_search.search_products(user_message)

            # Get user's recent orders
            context["recent_orders"] = product_search.get_user_orders(user.id)

        # Define the generator for streaming
        async def event_generator():
            try:
                # Use the static streaming method from AIChatService
                full_response = ""
                async for chunk in AIChatService.get_streaming_response(
                    db=db,
                    user_message=user_message,
                    context=context,
                    user_id=user.id if user else None
                ):
                    full_response += chunk
                    # Send chunk as SSE event
                    yield f"data: {json.dumps({'content': chunk, 'done': False})}\n\n"

                # End the stream with completion marker
                yield f"data: {json.dumps({'done': True, 'final': True})}\n\n"

            except Exception as e:
                logger.error(f"Error in SSE stream: {str(e)}", exc_info=True)
                yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Authorization, Content-Type",
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing SSE conversation: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your message. Please try again later."
        )