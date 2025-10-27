from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...core.auth import get_current_active_user, get_current_admin_user
from ...database import get_db
from ...models.user import User
from ...models import order as order_models
from ...schemas import order as order_schemas

router = APIRouter()

@router.post("/", response_model=order_schemas.OrderResponse)
def create_order(
    order: order_schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Create a new order"""

    # Create order
    db_order = order_models.Order(
        user_id=current_user.id,
        full_name=order.full_name,
        email=order.email,
        phone=order.phone,
        address=order.address,
        city=order.city,
        state=order.state,
        zip_code=order.zip_code,
        country=order.country,
        shipping_method=order.shipping_method,
        payment_method=order.payment_method,
        subtotal=order.subtotal,
        shipping_cost=order.shipping_cost,
        tax=order.tax,
        discount=order.discount,
        total=order.total,
        status=order_models.OrderStatus.PENDING
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Create order items
    for item in order.items:
        db_item = order_models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_time=item.price_at_time
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_order)

    return db_order

@router.get("/", response_model=List[order_schemas.OrderListResponse])
def get_user_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 20
) -> Any:
    """Get all orders for current user"""

    orders = db.query(order_models.Order)\
        .filter(order_models.Order.user_id == current_user.id)\
        .order_by(order_models.Order.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

    # Add items count to each order
    result = []
    for order in orders:
        order_dict = {
            "id": order.id,
            "full_name": order.full_name,
            "total": order.total,
            "status": order.status,
            "created_at": order.created_at,
            "items_count": len(order.items)
        }
        result.append(order_dict)

    return result

@router.get("/{order_id}", response_model=order_schemas.OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get a specific order by ID"""

    order = db.query(order_models.Order)\
        .filter(order_models.Order.id == order_id)\
        .filter(order_models.Order.user_id == current_user.id)\
        .first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order

@router.put("/{order_id}/cancel", response_model=order_schemas.OrderResponse)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Cancel an order"""

    order = db.query(order_models.Order)\
        .filter(order_models.Order.id == order_id)\
        .filter(order_models.Order.user_id == current_user.id)\
        .first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status not in [order_models.OrderStatus.PENDING, order_models.OrderStatus.PROCESSING]:
        raise HTTPException(
            status_code=400,
            detail="Can only cancel pending or processing orders"
        )

    order.status = order_models.OrderStatus.CANCELLED
    db.commit()
    db.refresh(order)

    return order