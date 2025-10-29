from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from ...database import get_db
from ...models import user as user_models, product as product_models, order as order_models
from ...core.auth import get_current_admin_user

router = APIRouter()

@router.get("/dashboard/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: user_models.User = Depends(get_current_admin_user)
) -> Dict[str, Any]:
    """Get dashboard statistics for admin"""
    
    try:
        # Total users
        total_users = db.query(user_models.User).count()

        # Total products
        total_products = db.query(product_models.Product).count()

        # Total orders
        total_orders = db.query(order_models.Order).count()

        # Total revenue - using SQLAlchemy query with proper error handling
        try:
            total_revenue = db.query(func.sum(order_models.Order.total)).scalar() or 0
        except Exception as e:
            print(f"Warning: Could not calculate total revenue: {e}")
            total_revenue = 0

        # Orders by status
        orders_by_status = db.query(
            order_models.Order.status,
            func.count(order_models.Order.id)
        ).group_by(order_models.Order.status).all()

        status_counts = {str(status.value): count for status, count in orders_by_status}

        # Recent orders (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_orders_count = db.query(order_models.Order).filter(
            order_models.Order.created_at >= thirty_days_ago
        ).count()

        # Recent revenue (last 30 days)
        try:
            recent_revenue = db.query(func.sum(order_models.Order.total)).filter(
                order_models.Order.created_at >= thirty_days_ago
            ).scalar() or 0
        except Exception as e:
            print(f"Warning: Could not calculate recent revenue: {e}")
            recent_revenue = 0

        # Low stock products (not available - no stock field in Product model)
        low_stock_count = 0

        # New users (last 30 days)
        new_users_count = db.query(user_models.User).filter(
            user_models.User.created_at >= thirty_days_ago
        ).count()

        return {
            "total_users": total_users,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
            "orders_by_status": status_counts,
            "recent_orders_count": recent_orders_count,
            "recent_revenue": float(recent_revenue),
            "low_stock_count": low_stock_count,
            "new_users_count": new_users_count
        }
    except Exception as e:
        print(f"Error in get_dashboard_stats: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating dashboard statistics: {str(e)}"
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

    return orders

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
        ).all()

        # Format for chart
        chart_data = [
            {
                "date": str(date),
                "revenue": float(revenue or 0),
                "orders": orders
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
