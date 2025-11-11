from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.product import Product
from app.seed_data import seed_database  # Import the seed function

router = APIRouter()

@router.post("/demo-data")
def seed_demo_data(db: Session = Depends(get_db)):
    """Seed database with demo data"""
    
    try:
        # Check if already seeded
        if db.query(Product).count() > 0:
            return {"message": "Database already has products!", "count": db.query(Product).count()}
        
        # Products
        products_data = [
            {
                "title": "Wireless Headphones",
                "title_fa": "هدفون بی‌سیم",
                "description": "High-quality wireless headphones with noise cancellation",
                "description_en": "High-quality wireless headphones with noise cancellation",
                "description_fa": "هدفون بی‌سیم با کیفیت بالا و حذف نویز",
                "description_ar": "سماعات لاسلكية عالية الجودة مع إلغاء الضوضاء",
                "price": 99.99,
                "stock": 50,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                "category": "Electronics",
                "is_featured": True,
            },
            {
                "title": "Smart Watch",
                "title_fa": "ساعت هوشمند",
                "description": "Feature-rich smartwatch with fitness tracking",
                "description_en": "Feature-rich smartwatch with fitness tracking",
                "description_fa": "ساعت هوشمند با امکانات ردیابی تناسب اندام",
                "description_ar": "ساعة ذكية غنية بالميزات مع تتبع اللياقة البدنية",
                "price": 199.99,
                "stock": 30,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
                "category": "Electronics",
                "is_featured": True,
            },
            {
                "title": "Designer Sunglasses",
                "title_fa": "عینک آفتابی دیزاینر",
                "description": "Stylish sunglasses with UV protection",
                "description_en": "Stylish sunglasses with UV protection",
                "description_fa": "عینک آفتابی شیک با محافظت از اشعه UV",
                "description_ar": "نظارات شمسية أنيقة مع حماية من الأشعة فوق البنفسجية",
                "price": 149.99,
                "discount_price": 119.99,
                "discount": 20,
                "stock": 25,
                "rating": 4.3,
                "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
                "category": "Fashion",
            },
            {
                "title": "Running Shoes",
                "title_fa": "کفش دویدن",
                "description": "Comfortable running shoes for all terrains",
                "description_en": "Comfortable running shoes for all terrains",
                "description_fa": "کفش دویدن راحت برای تمام سطوح",
                "description_ar": "أحذية جري مريحة لجميع التضاريس",
                "price": 79.99,
                "stock": 40,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                "category": "Sports",
                "is_featured": True,
            },
            {
                "title": "Yoga Mat",
                "title_fa": "تشک یوگا",
                "description": "Non-slip yoga mat for comfortable workouts",
                "description_en": "Non-slip yoga mat for comfortable workouts",
                "description_fa": "تشک یوگا ضد لغزش برای تمرینات راحت",
                "description_ar": "سجادة يوغا غير قابلة للانزلاق لتمارين مريحة",
                "price": 29.99,
                "stock": 60,
                "rating": 4.4,
                "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
                "category": "Sports",
            },
            {
                "title": "Plant Pot Set",
                "title_fa": "ست گلدان",
                "description": "Beautiful ceramic plant pots for home decoration",
                "description_en": "Beautiful ceramic plant pots for home decoration",
                "description_fa": "گلدان‌های سرامیکی زیبا برای تزئین خانه",
                "description_ar": "أصص نباتات خزفية جميلة لتزيين المنزل",
                "price": 39.99,
                "stock": 35,
                "rating": 4.2,
                "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500",
                "category": "Home & Garden",
            },
        ]
        
        for prod_data in products_data:
            product = Product(**prod_data)
            db.add(product)
        
        db.commit()
        
        return {
            "message": "✅ Demo data seeded successfully!",
            "products": len(products_data)
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seed")
def seed_full_database():
    """Seed database with complete data set"""
    try:
        seed_database()
        return {"message": "Database seeded successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))