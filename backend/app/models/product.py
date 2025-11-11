from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True)
    discount = Column(Float, default=0.0)  # Discount percentage
    stock = Column(Integer, default=100)  # Stock quantity
    rating = Column(Float, default=0.0)  # Product rating
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    image_url = Column(String, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)  # Foreign key to Category
    tags = Column(String, nullable=True)
    
    # Multilingual fields
    title_en = Column(String, nullable=True)
    title_ar = Column(String, nullable=True)
    title_fa = Column(String, nullable=True)
    description_en = Column(Text, nullable=True)
    description_ar = Column(Text, nullable=True)
    description_fa = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="products")
    category_rel = relationship("Category", back_populates="products")  # Relationship to Category model
    translations = relationship("Translation", back_populates="product")  # Relationship to Translation model