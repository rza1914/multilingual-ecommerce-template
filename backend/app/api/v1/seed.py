# app/api/v1/seed.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.db.session import get_db
from app.models.product import Product
from app.models.user import User

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/seed")
def create_seed_data(db: Session = Depends(get_db)):
    """Seed database with demo data"""
    try:
        # Check if already seeded
        if db.query(Product).first():
            return {
                "status": "skipped",
                "message": "Database already seeded"
            }
        
        # Create products
        products = [
            Product(
                name="Laptop Pro 2024",
                description="High-performance laptop for professionals",
                price=1299.99,
                category="Electronics",
                stock=10,
                image_url="https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
                is_active=True
            ),
            Product(
                name="Wireless Mouse",
                description="Ergonomic wireless mouse with long battery life",
                price=29.99,
                category="Electronics",
                stock=50,
                image_url="https://images.unsplash.com/photo-1527814050087-3793815479db",
                is_active=True
            ),
            Product(
                name="Office Chair",
                description="Comfortable ergonomic office chair",
                price=199.99,
                category="Furniture",
                stock=25,
                image_url="https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
                is_active=True
            ),
            Product(
                name="Coffee Maker",
                description="Automatic drip coffee maker",
                price=89.99,
                category="Home",
                stock=30,
                image_url="https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6",
                is_active=True
            ),
        ]
        
        db.add_all(products)
        
        # Create admin user
        admin = User(
            email="admin@example.com",
            username="admin",
            full_name="Admin User",
            hashed_password=pwd_context.hash("admin123"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        
        # Create regular user
        user = User(
            email="user@example.com",
            username="user",
            full_name="Regular User",
            hashed_password=pwd_context.hash("user123"),
            role="user",
            is_active=True
        )
        db.add(user)
        
        db.commit()
        
        return {
            "status": "success",
            "message": "Database seeded successfully",
            "products_created": len(products),
            "users_created": 2
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))