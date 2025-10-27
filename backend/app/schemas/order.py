from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from ..models.order import OrderStatus


# Order Item Schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price_at_time: float


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(OrderItemBase):
    id: int

    class Config:
        from_attributes = True


# Order Schemas
class OrderCreate(BaseModel):
    # Shipping Info
    full_name: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    zip_code: str
    country: str = "United States"

    # Order Details
    shipping_method: str
    payment_method: str

    # Pricing
    subtotal: float
    shipping_cost: float
    tax: float
    discount: float = 0
    total: float

    # Order Items
    items: List[OrderItemCreate]


class OrderResponse(BaseModel):
    id: int
    user_id: int

    # Shipping Info
    full_name: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    zip_code: str
    country: str

    # Order Details
    shipping_method: str
    payment_method: str

    # Pricing
    subtotal: float
    shipping_cost: float
    tax: float
    discount: float
    total: float

    # Status
    status: OrderStatus

    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Items
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    id: int
    full_name: str
    total: float
    status: OrderStatus
    created_at: datetime
    items_count: int

    class Config:
        from_attributes = True
