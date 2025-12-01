from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    is_active: bool = True
    is_featured: bool = False
    image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None


class Product(ProductBase):
    id: int
    owner_id: Optional[int] = None  # ✅ Fixed!
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
