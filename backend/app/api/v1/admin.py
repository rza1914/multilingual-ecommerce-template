from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Form, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta

from ...database import get_db
from ...models import user as user_models, product as product_models, order as order_models
from ...core.auth import get_current_admin_user
from ...schemas.admin import (
    DashboardStatsResponse,
    RevenueChartData,
    TopProductResponse,
    RecentOrderResponse
)

router = APIRouter()

# ============================================================
# HELPER FUNCTIONS - Safe type conversions to prevent errors
# ============================================================

def safe_float(value, default: float = 0.0) -> float:
    """
    Safely convert a value to float.
    Handles None, Decimal, and other numeric types.

    Args:
        value: The value to convert (can be None, Decimal, int, float)
        default: Default value if conversion fails

    Returns:
        float: The converted value or default
    """
    if value is None:
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default

def safe_int(value, default: int = 0) -> int:
    """
    Safely convert a value to integer.

    Args:
        value: The value to convert
        default: Default value if conversion fails

    Returns:
        int: The converted value or default
    """
    if value is None:
        return default
    try:
        return int(value)
    except (TypeError, ValueError):
        return default

def safe_str(value, default: str = "") -> str:
    """
    Safely convert a value to string.

    Args:
        value: The value to convert
        default: Default value if conversion fails

    Returns:
        str: The converted value or default
    """
    if value is None:
        return default
    return str(value)


@router.get("/dashboard/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: user_models.User = Depends(get_current_admin_user)
):
    """
    Get comprehensive dashboard statistics for admin panel.

    Returns:
        - Total revenue (all time)
        - Recent revenue (last 30 days)
        - Total orders count
        - Total users count
        - Total products count
        - Revenue chart data (last 7 days)
        - Orders by status breakdown
        - Top selling products
        - Recent orders list
    """
    try:
        # ========================================
        # 1. TOTAL REVENUE - All time
        # ========================================
        total_revenue_query = db.query(
            func.sum(order_models.Order.total)
        ).scalar()

        # Safe conversion - prevents TypeError when no orders exist
        total_revenue = safe_float(total_revenue_query)

        # ========================================
        # 2. RECENT REVENUE - Last 30 days
        # ========================================
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)

        recent_revenue_query = db.query(
            func.sum(order_models.Order.total)
        ).filter(
            order_models.Order.created_at >= thirty_days_ago
        ).scalar()

        recent_revenue = safe_float(recent_revenue_query)

        # ========================================
        # 3. COUNTS - Orders, Users, Products
        # ========================================
        total_orders = safe_int(db.query(func.count(order_models.Order.id)).scalar())
        total_users = safe_int(db.query(func.count(user_models.User.id)).scalar())
        total_products = safe_int(db.query(func.count(product_models.Product.id)).count())

        # ========================================
        # 4. REVENUE CHART - Last 7 days
        # ========================================
        seven_days_ago = datetime.utcnow() - timedelta(days=7)

        daily_revenue_query = db.query(
            func.date(order_models.Order.created_at).label('date'),
            func.sum(order_models.Order.total).label('revenue'),
            func.count(order_models.Order.id).label('orders')
        ).filter(
            order_models.Order.created_at >= seven_days_ago
        ).group_by(
            func.date(order_models.Order.created_at)
        ).order_by(
            func.date(order_models.Order.created_at)
        ).all()

        # Build revenue chart with safe conversions
        revenue_chart = []
        for row in daily_revenue_query:
            chart_item = {
                "date": str(row.date) if row.date else datetime.utcnow().date().isoformat(),
                "revenue": safe_float(row.revenue),
                "orders": safe_int(row.orders)
            }
            revenue_chart.append(chart_item)

        # ========================================
        # 5. ORDERS BY STATUS
        # ========================================
        orders_by_status_query = db.query(
            order_models.Order.status,
            func.count(order_models.Order.id).label('count')
        ).group_by(
            order_models.Order.status
        ).all()

        # Safe conversion - status might be string or enum
        status_counts = {}
        for status_val, count in orders_by_status_query:
            status_key = safe_str(status_val, "unknown")
            status_counts[status_key] = safe_int(count)

        # ========================================
        # 6. TOP SELLING PRODUCTS - Top 5
        # ========================================
        # Note: This assumes OrderItem model exists with product relationship
        top_products = []
        try:
            # Join orders, order_items, and products to get top selling products
            top_products_query = db.query(
                product_models.Product.id,
                product_models.Product.title.label('name'),  # Using title as name
                product_models.Product.price,
                func.sum(order_models.OrderItem.quantity).label('total_sold')
            ).join(
                order_models.OrderItem, order_models.OrderItem.product_id == product_models.Product.id
            ).join(
                order_models.Order, order_models.Order.id == order_models.OrderItem.order_id
            ).group_by(
                product_models.Product.id, product_models.Product.title, product_models.Product.price
            ).order_by(
                desc('total_sold')
            ).limit(5).all()

            for product in top_products_query:
                top_products.append({
                    "id": product.id,
                    "name": safe_str(product.name, "Unknown Product"),
                    "price": safe_float(product.price),
                    "total_sold": safe_int(product.total_sold)
                })
        except Exception as e:
            # If OrderItem doesn't exist or query fails, return empty list
            # This prevents the entire endpoint from failing
            print(f"Warning: Could not fetch top products: {e}")
            top_products = []

        # ========================================
        # 7. RECENT ORDERS - Last 10
        # ========================================
        recent_orders_query = db.query(order_models.Order).order_by(
            desc(order_models.Order.created_at)
        ).limit(10).all()

        recent_orders = []
        for order in recent_orders_query:
            recent_orders.append({
                "id": order.id,
                "customer_name": safe_str(getattr(order, 'full_name', None), "Guest"),
                "total_amount": safe_float(order.total),
                "status": safe_str(order.status, "pending"),
                "created_at": order.created_at.isoformat() if order.created_at else datetime.utcnow().isoformat()
            })

        # ========================================
        # 8. BUILD RESPONSE
        # ========================================
        return {
            "success": True,
            "data": {
                "total_revenue": total_revenue,
                "recent_revenue": recent_revenue,
                "total_orders": total_orders,
                "total_users": total_users,
                "total_products": total_products,
                "revenue_chart": revenue_chart,
                "orders_by_status": status_counts,
                "top_products": top_products,
                "recent_orders": recent_orders
            }
        }

    except Exception as e:
        # Log the full error for debugging
        print(f"ERROR in get_dashboard_stats: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()

        # Return a meaningful error response
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": "Failed to fetch dashboard statistics",
                "error": str(e)
            }
        )

@router.get("/dashboard/recent-orders")
def get_recent_orders(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
):
    """Get recent orders for admin dashboard"""

    orders = db.query(order_models.Order)\
        .order_by(order_models.Order.created_at.desc())\
        .limit(limit)\
        .all()

    # Convert to safe dictionary format
    result = []
    for order in orders:
        result.append({
            "id": order.id,
            "user_id": order.user_id,
            "full_name": safe_str(getattr(order, 'full_name', None), "N/A"),
            "email": safe_str(getattr(order, 'email', None), "N/A"),
            "total": safe_float(getattr(order, 'total', 0)),
            "status": safe_str(getattr(order, 'status', 'unknown'), "unknown"),
            "created_at": order.created_at.isoformat() if getattr(order, 'created_at', None) else None
        })

    return result

@router.get("/dashboard/revenue-chart")
def get_revenue_chart(
    days: int = 30,
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
):
    """Get revenue data for chart (last N days)"""

    try:
        start_date = datetime.utcnow() - timedelta(days=days)

        # Get orders grouped by date
        daily_revenue = db.query(
            func.date(order_models.Order.created_at).label('date'),
            func.sum(order_models.Order.total).label('revenue'),
            func.count(order_models.Order.id).label('orders')
        ).filter(
            order_models.Order.created_at >= start_date
        ).group_by(
            func.date(order_models.Order.created_at)
        ).order_by(
            func.date(order_models.Order.created_at)
        ).all()

        # Format for chart with safe conversions
        chart_data = [
            {
                "date": str(date) if date else datetime.utcnow().date().isoformat(),
                "revenue": safe_float(revenue),
                "orders": safe_int(orders)
            }
            for date, revenue, orders in daily_revenue
        ]

        return chart_data
    except Exception as e:
        print(f"Error in get_revenue_chart: {e}")
        import traceback
        traceback.print_exc()
        # Return empty data instead of failing
        return []

# ============================================
# Product Management Endpoints
# ============================================

@router.get("/products")
def get_all_products_admin(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
):
    """Get all products for admin (with search)"""

    query = db.query(product_models.Product)

    if search:
        query = query.filter(
            product_models.Product.title.ilike(f"%{search}%")
        )

    products = query.offset(skip).limit(limit).all()
    total = query.count()

    return {
        "products": products,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.post("/products")
def create_product_admin(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    image_url: str = Form(...),
    discount_price: Optional[float] = Form(None),
    is_active: bool = Form(True),
    is_featured: bool = Form(False),
    tags: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
):
    """Create a new product (admin only)"""

    new_product = product_models.Product(
        title=title,
        description=description,
        price=price,
        discount_price=discount_price,
        category=category,
        image_url=image_url,
        is_active=is_active,
        is_featured=is_featured,
        tags=tags,
        owner_id=current_admin.id
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@router.get("/products/{product_id}")
def get_product_admin(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
):
    """Get a single product for admin"""

    product = db.query(product_models.Product).filter(product_models.Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product

@router.put("/products/{product_id}")
def update_product_admin(
    product_id: int,
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    image_url: str = Form(...),
    discount_price: Optional[float] = Form(None),
    is_active: bool = Form(True),
    is_featured: bool = Form(False),
    tags: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
):
    """Update a product (admin only)"""

    product = db.query(product_models.Product).filter(product_models.Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.title = title
    product.description = description
    product.price = price
    product.discount_price = discount_price
    product.category = category
    product.image_url = image_url
    product.is_active = is_active
    product.is_featured = is_featured
    product.tags = tags

    db.commit()
    db.refresh(product)

    return product

@router.delete("/products/{product_id}")
def delete_product_admin(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
):
    """Delete a product (admin only)"""

    product = db.query(product_models.Product).filter(product_models.Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully", "id": product_id}

# ============================================
# Order Management Endpoints
# ============================================

@router.get("/orders")
def get_all_orders_admin(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
):
    """Get all orders for admin (with status filter)"""

    query = db.query(order_models.Order)

    if status:
        query = query.filter(order_models.Order.status == status)

    total = query.count()
    orders = query.order_by(order_models.Order.created_at.desc()).offset(skip).limit(limit).all()

    # Add items count to each order
    result = []
    for order in orders:
        order_dict = {
            "id": order.id,
            "user_id": order.user_id,
            "full_name": order.full_name,
            "email": order.email,
            "phone": order.phone,
            "address": order.address,
            "city": order.city,
            "state": order.state,
            "zip_code": order.zip_code,
            "country": order.country,
            "shipping_method": order.shipping_method,
            "payment_method": order.payment_method,
            "subtotal": order.subtotal,
            "shipping_cost": order.shipping_cost,
            "tax": order.tax,
            "discount": order.discount,
            "total": order.total,
            "status": order.status,
            "created_at": order.created_at,
            "updated_at": order.updated_at,
            "items_count": len(order.items)
        }
        result.append(order_dict)

    return {
        "orders": result,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/orders/{order_id}")
def get_order_admin(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
):
    """Get a specific order for admin"""

    order = db.query(order_models.Order).filter(order_models.Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order

@router.put("/orders/{order_id}/status")
def update_order_status_admin(
    order_id: int,
    status: str = Form(...),
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
):
    """Update order status (admin only)"""

    # Validate status
    valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    order = db.query(order_models.Order).filter(order_models.Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status
    db.commit()
    db.refresh(order)

    return order

@router.delete("/orders/{order_id}")
def delete_order_admin(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
):
    """Delete an order (admin only)"""

    order = db.query(order_models.Order).filter(order_models.Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(order)
    db.commit()

    return {"message": "Order deleted successfully", "id": order_id}


# ============================================
# Product Description Generation Endpoint
# ============================================

@router.post("/products/generate-description",
             summary="Generate AI product description",
             description="Generate SEO-friendly, engaging product descriptions using AI based on product specifications")
async def generate_product_description(
    request_data: Dict[str, Any],
    current_user: user_models.User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Generate a complete product description using AI based on product specifications.
    
    The endpoint:
    1. Takes product information (name, brand, category, specs, price)
    2. Uses AI to generate title, description, highlights, keywords, and meta description
    3. Returns the complete product content in the requested tone
    4. Supports different tones: professional, casual, sales, minimal
    """
    from ...services.product_description_service import ProductDescriptionService
    
    try:
        # Validate required fields
        required_fields = ["name", "brand", "category", "specs", "price"]
        for field in required_fields:
            if field not in request_data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Missing required field: {field}"
                )
        
        # Get tone from request or default to professional
        tone = request_data.get("tone", "professional")
        
        # Initialize the description service
        description_service = ProductDescriptionService()
        
        # Generate the description
        result = await description_service.generate_description(request_data, tone)
        
        return result
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error
        print(f"Error generating product description: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating the product description"
        )


# ============================================
# AI Insights Endpoint
# ============================================

@router.get("/ai-insights",
             summary="Get AI-powered insights for admin dashboard",
             description="Get sales forecast, alerts, and recommendations using AI analysis")
async def get_ai_insights(
    current_user: user_models.User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get AI-powered insights for the admin dashboard.
    
    The endpoint:
    1. Analyzes sales data from the database
    2. Runs AI algorithms to generate forecasts and recommendations
    3. Returns insights including sales forecast, alerts, and recommendations
    4. Includes confidence metrics and actionable insights
    """
    from ...services.ai_insights_service import AIInsightsService
    
    try:
        # Initialize the AI insights service
        insights_service = AIInsightsService(db)
        
        # Get insights
        insights = insights_service.get_insights()
        
        return insights
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error
        print(f"Error generating AI insights: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating AI insights"
        )
