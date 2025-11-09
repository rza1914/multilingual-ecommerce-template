"""
API routes for Telegram Bot Integration
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ....database import get_db
from .auth import get_bot_api_key, require_permission
from .service import (
    get_customer_data, get_product_data, get_order_data, 
    create_bot_api_key, get_api_key_usage_statistics
)
from ....models.bot import BotApiKey as BotApiKeyModel

router = APIRouter(prefix="/bot", tags=["bot_integration"])


@router.get("/customers/", 
           summary="Get customer data", 
           description="Retrieve customer information with read-only access. Requires 'read:customers' permission.")
def get_customers(
    customer_id: Optional[int] = Query(None, description="Filter by specific customer ID"),
    limit: int = Query(50, ge=1, le=100, description="Number of records to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    bot_key: BotApiKeyModel = Depends(require_permission("read:customers")),
    db: Session = Depends(get_db)
):
    """
    Get customer data for bot integration
    """
    try:
        customers = get_customer_data(db, customer_id, limit, offset)
        return {
            "data": customers,
            "total": len(customers),
            "limit": limit,
            "offset": offset,
            "bot_name": bot_key.name
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving customer data: {str(e)}"
        )


@router.get("/products/", 
           summary="Get product data", 
           description="Retrieve product information. Requires 'read:products' permission.")
def get_products(
    product_id: Optional[int] = Query(None, description="Filter by specific product ID"),
    category: Optional[str] = Query(None, description="Filter by product category"),
    limit: int = Query(50, ge=1, le=100, description="Number of records to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    bot_key: BotApiKeyModel = Depends(require_permission("read:products")),
    db: Session = Depends(get_db)
):
    """
    Get product data for bot integration
    """
    try:
        products = get_product_data(db, product_id, category, limit, offset)
        return {
            "data": products,
            "total": len(products),
            "limit": limit,
            "offset": offset,
            "bot_name": bot_key.name
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving product data: {str(e)}"
        )


@router.get("/orders/", 
           summary="Get order data", 
           description="Retrieve order information. Requires 'read:orders' permission.")
def get_orders(
    order_id: Optional[int] = Query(None, description="Filter by specific order ID"),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by order status"),
    limit: int = Query(50, ge=1, le=100, description="Number of records to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    bot_key: BotApiKeyModel = Depends(require_permission("read:orders")),
    db: Session = Depends(get_db)
):
    """
    Get order data for bot integration
    """
    try:
        orders = get_order_data(db, order_id, user_id, status_filter, limit, offset)
        return {
            "data": orders,
            "total": len(orders),
            "limit": limit,
            "offset": offset,
            "bot_name": bot_key.name
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving order data: {str(e)}"
        )


@router.get("/stats/",
           summary="Get API key usage statistics",
           description="Retrieve statistics about the current API key usage. Requires 'read:stats' permission.")
def get_bot_stats(
    bot_key: BotApiKeyModel = Depends(get_bot_api_key),
    db: Session = Depends(get_db)
):
    """
    Get usage statistics for the current bot API key
    """
    try:
        stats = get_api_key_usage_statistics(db, bot_key.id)
        if stats is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found"
            )
        
        return {
            "data": stats,
            "bot_name": bot_key.name
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving statistics: {str(e)}"
        )


@router.get("/permissions/",
           summary="Get bot permissions",
           description="Retrieve the permissions assigned to the current bot. Requires valid API key.")
def get_bot_permissions(
    bot_key: BotApiKeyModel = Depends(get_bot_api_key)
):
    """
    Get the permissions assigned to the current bot
    """
    try:
        permissions = bot_key.permissions.split(",") if bot_key.permissions else []
        
        return {
            "permissions": permissions,
            "is_active": bot_key.is_active,
            "name": bot_key.name
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving permissions: {str(e)}"
        )