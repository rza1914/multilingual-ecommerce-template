from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)  # Foreign key to Product
    lang = Column(String, nullable=False)  # Language code (e.g., 'fa', 'nl', 'en', 'ar')
    name = Column(String, nullable=False)  # Translated name
    description = Column(Text, nullable=True)  # Translated description

    # Relationship to Product
    product = relationship("Product", back_populates="translations")