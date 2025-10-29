from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.product import Product
from app.models.category import Category

router = APIRouter()

@router.post("/demo-data")
def seed_demo_data(db: Session = Depends(get_db)):
    """Seed database with demo data"""
    
    try:
        # Check if already seeded
        if db.query(Product).count() > 0:
            return {"message": "Database already has products!", "count": db.query(Product).count()}
        
        # Categories
        categories_data = [
            {"name": "Electronics", "name_fa": "الکترونیک", "name_ar": "إلكترونيات"},
            {"name": "Fashion", "name_fa": "مد و پوشاک", "name_ar": "أزياء"},
            {"name": "Home & Garden", "name_fa": "خانه و باغ", "name_ar": "المنزل والحديقة"},
            {"name": "Sports", "name_fa": "ورزش", "name_ar": "رياضة"},
        ]
        
        categories = {}
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.add(category)
            db.flush()
            categories[cat_data["name"]] = category.id
        
        # Products
        products_data = [
            {
                "name": "Wireless Headphones", "name_fa": "هدفون بی‌سیم", "name_ar": "سماعات لاسلكية",
                "description": "High-quality wireless headphones", "description_fa": "هدفون با کیفیت", "description_ar": "سماعات عالية",
                "price": 99.99, "stock": 50, "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                "category_id": categories["Electronics"]
            },
            {
                "name": "Smart Watch", "name_fa": "ساعت هوشمند", "name_ar": "ساعة ذكية",
                "description": "Feature-rich smartwatch", "description_fa": "ساعت هوشمند", "description_ar": "ساعة ذكية",
                "price": 199.99, "stock": 30, "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
                "category_id": categories["Electronics"]
            },
            {
                "name": "Designer Sunglasses", "name_fa": "عینک آفتابی", "name_ar": "نظارات شمسية",
                "description": "Stylish sunglasses", "description_fa": "عینک شیک", "description_ar": "نظارات أنيقة",
                "price": 149.99, "stock": 25, "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
                "category_id": categories["Fashion"]
            },
            {
                "name": "Running Shoes", "name_fa": "کفش دویدن", "name_ar": "أحذية الجري",
                "description": "Comfortable shoes", "description_fa": "کفش راحت", "description_ar": "أحذية مريحة",
                "price": 79.99, "stock": 40, "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                "category_id": categories["Sports"]
            },
            {
                "name": "Yoga Mat", "name_fa": "تشک یوگا", "name_ar": "سجادة يوغا",
                "description": "Non-slip yoga mat", "description_fa": "تشک ضد لغزش", "description_ar": "سجادة يوغا",
                "price": 29.99, "stock": 60, "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
                "category_id": categories["Sports"]
            },
            {
                "name": "Plant Pot Set", "name_fa": "ست گلدان", "name_ar": "مجموعة أصص",
                "description": "Beautiful plant pots", "description_fa": "گلدان زیبا", "description_ar": "أصص جميلة",
                "price": 39.99, "stock": 35, "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500",
                "category_id": categories["Home & Garden"]
            },
        ]
        
        for prod_data in products_data:
            product = Product(**prod_data)
            db.add(product)
        
        db.commit()
        
        return {"message": "✅ Seeded successfully!", "categories": len(categories_data), "products": len(products_data)}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))