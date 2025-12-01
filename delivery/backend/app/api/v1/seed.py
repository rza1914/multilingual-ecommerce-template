# app/api/v1/seed.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.database import get_db
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
        
        # Create products with correct field names
        products = [
            Product(
                title="Laptop Pro 2024",
                title_en="Laptop Pro 2024",
                title_ar="لابتوب برو 2024",
                title_fa="لپ‌تاپ پرو 2024",
                description="High-performance laptop for professionals",
                description_en="High-performance laptop for professionals",
                description_ar="لابتوب عالي الأداء للمحترفين",
                description_fa="لپ‌تاپ با کارایی بالا برای حرفه‌ای‌ها",
                price=1299.99,
                discount_price=1199.99,
                discount=8.0,
                category="Electronics",
                stock=10,
                rating=4.8,
                is_active=True,
                is_featured=True,
                image_url="https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
                tags="laptop,electronics,computers"
            ),
            Product(
                title="Wireless Mouse",
                title_en="Wireless Mouse",
                title_ar="ماوس لاسلكي",
                title_fa="ماوس بی‌سیم",
                description="Ergonomic wireless mouse with long battery life",
                description_en="Ergonomic wireless mouse with long battery life",
                description_ar="ماوس لاسلكي مريح مع عمر بطارية طويل",
                description_fa="ماوس بی‌سیم ارگونومیک با عمر باتری طولانی",
                price=29.99,
                discount_price=24.99,
                discount=17.0,
                category="Electronics",
                stock=50,
                rating=4.5,
                is_active=True,
                is_featured=True,
                image_url="https://images.unsplash.com/photo-1527814050087-3793815479db",
                tags="mouse,electronics,accessories"
            ),
            Product(
                title="Office Chair",
                title_en="Office Chair",
                title_ar="كرسي المكتب",
                title_fa="صندلی اداری",
                description="Comfortable ergonomic office chair",
                description_en="Comfortable ergonomic office chair",
                description_ar="كرسي مكتب مريح",
                description_fa="صندلی اداری راحت و ارگونومیک",
                price=199.99,
                category="Furniture",
                stock=25,
                rating=4.6,
                is_active=True,
                is_featured=True,
                image_url="https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
                tags="chair,furniture,office"
            ),
            Product(
                title="Coffee Maker",
                title_en="Coffee Maker",
                title_ar="صانعة القهوة",
                title_fa="قهوه‌ساز",
                description="Automatic drip coffee maker",
                description_en="Automatic drip coffee maker",
                description_ar="صانعة قهوة تقطير تلقائية",
                description_fa="قهوه‌ساز خودکار",
                price=89.99,
                discount_price=79.99,
                discount=11.0,
                category="Home",
                stock=30,
                rating=4.7,
                is_active=True,
                is_featured=True,
                image_url="https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6",
                tags="coffee,kitchen,home"
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
            "users_created": 2,
            "demo_credentials": {
                "admin": {"email": "admin@example.com", "password": "admin123"},
                "user": {"email": "user@example.com", "password": "user123"}
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))