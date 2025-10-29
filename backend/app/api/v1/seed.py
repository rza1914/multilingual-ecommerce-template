from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.product import Product

router = APIRouter()

@router.post("/demo-data")
def seed_demo_data(db: Session = Depends(get_db)):
    """Seed database with demo data"""
    
    try:
        # Check if already seeded
        if db.query(Product).count() > 0:
            return {"message": "Database already has products!", "count": db.query(Product).count()}
        
        # Products (without categories for now)
        products_data = [
            {
                "name": "Wireless Headphones",
                "name_fa": "هدفون بی‌سیم",
                "name_ar": "سماعات لاسلكية",
                "description": "High-quality wireless headphones",
                "description_fa": "هدفون با کیفیت بالا",
                "description_ar": "سماعات عالية الجودة",
                "price": 99.99,
                "stock": 50,
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
            },
            {
                "name": "Smart Watch",
                "name_fa": "ساعت هوشمند",
                "name_ar": "ساعة ذكية",
                "description": "Feature-rich smartwatch",
                "description_fa": "ساعت هوشمند پیشرفته",
                "description_ar": "ساعة ذكية متقدمة",
                "price": 199.99,
                "stock": 30,
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
            },
            {
                "name": "Designer Sunglasses",
                "name_fa": "عینک آفتابی دیزاینر",
                "name_ar": "نظارات شمسية مصممة",
                "description": "Stylish sunglasses with UV protection",
                "description_fa": "عینک آفتابی شیک با محافظت UV",
                "description_ar": "نظارات شمسية أنيقة",
                "price": 149.99,
                "stock": 25,
                "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
            },
            {
                "name": "Running Shoes",
                "name_fa": "کفش دویدن",
                "name_ar": "أحذية الجري",
                "description": "Comfortable running shoes",
                "description_fa": "کفش دویدن راحت",
                "description_ar": "أحذية جري مريحة",
                "price": 79.99,
                "stock": 40,
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
            },
            {
                "name": "Yoga Mat",
                "name_fa": "تشک یوگا",
                "name_ar": "سجادة يوغا",
                "description": "Non-slip yoga mat",
                "description_fa": "تشک یوگا ضد لغزش",
                "description_ar": "سجادة يوغا غير قابلة للانزلاق",
                "price": 29.99,
                "stock": 60,
                "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
            },
            {
                "name": "Plant Pot Set",
                "name_fa": "ست گلدان",
                "name_ar": "مجموعة أصص النباتات",
                "description": "Beautiful ceramic plant pots",
                "description_fa": "گلدان‌های سرامیکی زیبا",
                "description_ar": "أصص نباتات خزفية جميلة",
                "price": 39.99,
                "stock": 35,
                "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500",
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