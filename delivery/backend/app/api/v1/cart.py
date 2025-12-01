from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...database import get_db
from ...core.auth import get_current_active_user
from ...models.user import User
from ...services.cart_suggestion_service import CartSuggestionService

router = APIRouter(prefix="/cart", tags=["cart"])


@router.post("/suggestions",
             summary="Get smart cart suggestions",
             description="Get cross-sell, bundle, and up-sell suggestions based on items in the cart")
async def get_cart_suggestions(
    request_data: Dict[str, Any],
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get smart suggestions based on the items in the user's cart.
    
    The endpoint:
    1. Takes a list of cart items
    2. Analyzes the cart content
    3. Provides cross-sell, bundle, and up-sell suggestions
    4. Returns suggestions with AI-generated reasoning
    """
    try:
        # Validate required fields
        required_fields = ["cart_items"]
        for field in required_fields:
            if field not in request_data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Missing required field: {field}"
                )
        
        cart_items = request_data.get("cart_items", [])
        
        # Initialize the suggestion service
        suggestion_service = CartSuggestionService(db, current_user.id)
        
        # Get suggestions
        suggestions = suggestion_service.get_suggestions(cart_items)
        
        return suggestions
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error
        print(f"Error processing cart suggestions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing cart suggestions"
        )