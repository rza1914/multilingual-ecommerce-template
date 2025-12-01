from sqlalchemy import Boolean, Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from ..database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    parent_id = Column(Integer, nullable=True)  # For hierarchical categories (can be implemented later)
    image_url = Column(String, nullable=True)

    # Multilingual fields
    name_en = Column(String, nullable=True)
    name_ar = Column(String, nullable=True)
    name_fa = Column(String, nullable=True)
    description_en = Column(Text, nullable=True)
    description_ar = Column(Text, nullable=True)
    description_fa = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())