from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from ...api.deps import get_current_user
from ...database import get_db
from ...schemas.user import User
from ...services.ai_chat_service import AIChatService
from ...utils.product_search import ProductSearch

router = APIRouter()

# Setup logging
logger = logging.getLogger(__name__)


@router.post("/message", 
             summary="Send a message to the AI chatbot",
             description="Process user message and return AI-generated response with relevant context from the database")
async def send_chat_message(
    request: Dict[str, str],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Handle a chat message from the user and return an AI-generated response.
    
    The endpoint:
    1. Authenticates the user with JWT
    2. Extracts the user message
    3. Queries the database for relevant context (products, orders, user info)
    4. Sends the message and context to the Groq AI service
    5. Returns the AI response
    """
    try:
        # Extract message from request
        message = request.get("message", "").strip()
        if not message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message content is required"
            )
        
        # Initialize services
        product_search = ProductSearch(db)
        ai_service = AIChatService(db, current_user.id)
        
        # Query database for context
        user_info = {
            "id": current_user.id,
            "username": current_user.username,
            "full_name": current_user.full_name,
            "email": current_user.email
        }
        
        # Search for relevant products based on the message
        relevant_products = product_search.search_products(message)
        
        # Get user's recent orders
        recent_orders = product_search.get_user_orders(current_user.id)
        
        # Build context for AI
        context = {
            "user_info": user_info,
            "recent_orders": recent_orders,
            "relevant_products": relevant_products,
        }
        
        # Generate AI response
        ai_response = await ai_service.get_chat_response(message, context)
        
        return {
            "response": ai_response,
            "context": context,
            "user_id": current_user.id,
            "success": True
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error (in production, use proper logging)
        logger.error(f"Error processing chat message: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your message. Please try again later."
        )