from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

# Keep enum for validation/reference
class OrderStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    # Shipping Information
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)
    country = Column(String, default="United States")

    # Order Details
    shipping_method = Column(String, nullable=False)  # standard, express, nextday
    payment_method = Column(String, nullable=False)   # card, cod

    # Pricing
    subtotal = Column(Float, nullable=False)
    shipping_cost = Column(Float, nullable=False)
    tax = Column(Float, nullable=False)
    discount = Column(Float, default=0)
    total = Column(Float, nullable=False)

    # Status - Changed from Enum to String
    status = Column(String, default="pending")

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))

    quantity = Column(Integer, nullable=False)
    price_at_time = Column(Float, nullable=False)  # Price when ordered (in case price changes later)

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
