"""
Product Schemas
===============
Pydantic schemas for product-related request/response validation.
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


# ============================================================================
# BASE SCHEMAS
# ============================================================================

class ProductBase(BaseModel):
    """Base product schema with common fields."""
    title: str = Field(..., min_length=1, max_length=255, description="Product title")
    description: Optional[str] = Field(None, description="Product description")
    price: float = Field(..., gt=0, description="Product price")
    discount_price: Optional[float] = Field(None, ge=0, description="Discounted price")
    discount: Optional[float] = Field(0, ge=0, le=100, description="Discount percentage")
    stock: Optional[int] = Field(0, ge=0, description="Stock quantity")
    category: Optional[str] = Field(None, max_length=100, description="Product category")
    image_url: Optional[str] = Field(None, max_length=500, description="Product image URL")
    tags: Optional[str] = Field(None, max_length=500, description="Comma-separated tags")
    is_active: Optional[bool] = Field(True, description="Is product active")
    is_featured: Optional[bool] = Field(False, description="Is product featured")
    
    # Multilingual fields
    title_en: Optional[str] = Field(None, max_length=255, description="English title")
    title_ar: Optional[str] = Field(None, max_length=255, description="Arabic title")
    title_fa: Optional[str] = Field(None, max_length=255, description="Persian title")
    description_en: Optional[str] = Field(None, description="English description")
    description_ar: Optional[str] = Field(None, description="Arabic description")
    description_fa: Optional[str] = Field(None, description="Persian description")


# ============================================================================
# REQUEST SCHEMAS
# ============================================================================

class ProductCreate(ProductBase):
    """Schema for creating a new product."""
    pass


class ProductUpdate(BaseModel):
    """Schema for updating a product. All fields optional."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    discount_price: Optional[float] = Field(None, ge=0)
    discount: Optional[float] = Field(None, ge=0, le=100)
    stock: Optional[int] = Field(None, ge=0)
    category: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = Field(None, max_length=500)
    tags: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    
    # Multilingual fields
    title_en: Optional[str] = Field(None, max_length=255)
    title_ar: Optional[str] = Field(None, max_length=255)
    title_fa: Optional[str] = Field(None, max_length=255)
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    description_fa: Optional[str] = None


# ============================================================================
# RESPONSE SCHEMAS
# ============================================================================

class ProductResponse(ProductBase):
    """Schema for product response."""
    id: int
    rating: Optional[float] = Field(None, ge=0, le=5)
    status: Optional[str] = None
    owner_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "title": "Wireless Headphones",
                "description": "Premium wireless headphones with noise cancellation",
                "price": 149.99,
                "discount_price": 129.99,
                "discount": 13,
                "stock": 50,
                "rating": 4.5,
                "category": "Electronics",
                "is_active": True,
                "is_featured": True,
                "image_url": "https://example.com/headphones.jpg",
                "title_en": "Wireless Headphones",
                "title_fa": "هدفون بی‌سیم",
                "title_ar": "سماعات لاسلكية",
                "created_at": "2025-01-15T10:00:00Z"
            }
        }
    )


class ProductListResponse(BaseModel):
    """Schema for paginated product list response."""
    items: List[ProductResponse]
    total: int
    page: int
    page_size: int
    pages: int
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "items": [],
                "total": 100,
                "page": 1,
                "page_size": 20,
                "pages": 5
            }
        }
    )


# ============================================================================
# SEARCH SCHEMAS
# ============================================================================

class ProductSearchQuery(BaseModel):
    """Schema for product search parameters."""
    q: Optional[str] = Field(None, description="Search query")
    category: Optional[str] = Field(None, description="Filter by category")
    min_price: Optional[float] = Field(None, ge=0, description="Minimum price")
    max_price: Optional[float] = Field(None, ge=0, description="Maximum price")
    is_featured: Optional[bool] = Field(None, description="Filter featured products")
    in_stock: Optional[bool] = Field(None, description="Filter in-stock products")
    sort_by: Optional[str] = Field("created_at", description="Sort field")
    sort_order: Optional[str] = Field("desc", description="Sort order (asc/desc)")
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(20, ge=1, le=100, description="Items per page")


# ============================================================================
# CATEGORY SCHEMAS
# ============================================================================

class CategoryResponse(BaseModel):
    """Schema for category response."""
    name: str
    count: int
    
    model_config = ConfigDict(from_attributes=True)