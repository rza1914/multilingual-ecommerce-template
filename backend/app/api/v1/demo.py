from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product, Category
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/demo-reset")
def reset_demo_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Reset demo data - clears all products and creates new demo products
    Available only in demo environment
    """
    # Only allow admin users to reset demo data
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to reset demo data")
    
    try:
        # Clear existing products
        db.query(Product).delete()
        
        # Create demo categories if they don't exist
        electronics_category = db.query(Category).filter(Category.name_en == "Electronics").first()
        if not electronics_category:
            electronics_category = Category(
                name="Electronics",
                name_en="Electronics",
                name_nl="Elektronica", 
                name_fa="الکترونیک",
                description="Electronic devices and accessories",
                description_en="Electronic devices and accessories",
                description_nl="Elektronische apparaten en accessoires",
                description_fa="دستگاه‌های الکترونیکی و لوازم جانبی",
            )
            db.add(electronics_category)
        
        books_category = db.query(Category).filter(Category.name_en == "Books").first()
        if not books_category:
            books_category = Category(
                name="Books",
                name_en="Books",
                name_nl="Boeken",
                name_fa="کتاب‌ها",
                description="Books and literature",
                description_en="Books and literature",
                description_nl="Boeken en literatuur",
                description_fa="کتاب‌ها و ادبیات",
            )
            db.add(books_category)
        
        clothing_category = db.query(Category).filter(Category.name_en == "Clothing").first()
        if not clothing_category:
            clothing_category = Category(
                name="Clothing",
                name_en="Clothing",
                name_nl="Kleding",
                name_fa="پوشاک",
                description="Clothing and apparel",
                description_en="Clothing and apparel",
                description_nl="Kleding en kledingstukken",
                description_fa="پوشاک و لباس",
            )
            db.add(clothing_category)
        
        db.commit()
        
        # Refresh category IDs
        db.refresh(electronics_category)
        db.refresh(books_category)
        db.refresh(clothing_category)
        
        # Create demo products
        demo_products = [
            {
                'title_en': 'Wireless Headphones',
                'title_nl': 'Draadloze hoofdtelefoon',
                'title_fa': 'هدفون بی‌سیم',
                'description_en': 'High-quality wireless headphones with noise cancellation.',
                'description_nl': 'Hoogwaardige draadloze hoofdtelefoon met geluidsisolatie.',
                'description_fa': 'هدفون بی‌سیم با کیفیت بالا و قابلیت حذف نویز.',
                'price': 129.99,
                'category_id': electronics_category.id,
                'image_url': 'https://placehold.co/600x400/3b82f6/FFFFFF?text=Headphones'
            },
            {
                'title_en': 'Smart Watch',
                'title_nl': 'Slimme horloge',
                'title_fa': 'ساعت هوشمند',
                'description_en': 'Advanced smartwatch with health monitoring features.',
                'description_nl': 'Geavanceerde smartwatch met gezondheidsmonitoringfuncties.',
                'description_fa': 'ساعت هوشمند پیشرفته با قابلیت‌های مانیتورینگ سلامت.',
                'price': 249.99,
                'category_id': electronics_category.id,
                'image_url': 'https://placehold.co/600x400/ef4444/FFFFFF?text=Smartwatch'
            },
            {
                'title_en': 'Programming Book',
                'title_nl': 'Programmeren Boek',
                'title_fa': 'کتاب برنامه‌نویسی',
                'description_en': 'Comprehensive guide to modern programming techniques.',
                'description_nl': 'Uitgebreide gids voor moderne programmeertechnieken.',
                'description_fa': 'راهنمای جامع تکنیک‌های برنامه‌نویسی مدرن.',
                'price': 49.99,
                'category_id': books_category.id,
                'image_url': 'https://placehold.co/600x400/10b981/FFFFFF?text=Book'
            },
            {
                'title_en': 'Running Shoes',
                'title_nl': 'Hardloopschoenen',
                'title_fa': 'کفش دویدن',
                'description_en': 'Comfortable running shoes for all terrains.',
                'description_nl': 'Comfortabele hardloopschoenen voor alle terreinen.',
                'description_fa': 'کفش‌های دویدن راحت برای تمام زمینه‌ها.',
                'price': 89.99,
                'category_id': clothing_category.id,
                'image_url': 'https://placehold.co/600x400/8b5cf6/FFFFFF?text=Shoes'
            },
            {
                'title_en': 'Bluetooth Speaker',
                'title_nl': 'Bluetooth Speaker',
                'title_fa': 'اسپیکر بلوتوثی',
                'description_en': 'Portable speaker with excellent sound quality.',
                'description_nl': 'Draagbare luidspreker met uitstekende geluidskwaliteit.',
                'description_fa': 'اسپیکر قابل حمل با کیفیت صدای عالی.',
                'price': 79.99,
                'category_id': electronics_category.id,
                'image_url': 'https://placehold.co/600x400/f97316/FFFFFF?text=Speaker'
            },
            {
                'title_en': 'Coffee Maker',
                'title_nl': 'Koffiemachine',
                'title_fa': 'ماشین آلات قهوه',
                'description_en': 'Automatic coffee maker with programmable settings.',
                'description_nl': 'Automatische koffiemachine met programmeerbare instellingen.',
                'description_fa': 'ماشین قهوه خودکار با تنظیمات قابل برنامه‌ریزی.',
                'price': 119.99,
                'category_id': electronics_category.id,
                'image_url': 'https://placehold.co/600x400/06b6d4/FFFFFF?text=Coffee'
            },
            {
                'title_en': 'Backpack',
                'title_nl': 'Rugzak',
                'title_fa': 'کوله پشتی',
                'description_en': 'Durable backpack for hiking and travel.',
                'description_nl': 'Duurzame rugzak voor wandelen en reizen.',
                'description_fa': 'کوله پشتی مقاوم برای کوهنوردی و مسافرت.',
                'price': 59.99,
                'category_id': clothing_category.id,
                'image_url': 'https://placehold.co/600x400/84cc16/FFFFFF?text=Backpack'
            },
            {
                'title_en': 'Wireless Mouse',
                'title_nl': 'Draadloze Muis',
                'title_fa': 'ماوس بی‌سیم',
                'description_en': 'Ergonomic wireless mouse with long battery life.',
                'description_nl': 'Ergonomische draadloze muis met lange batterijduur.',
                'description_fa': 'ماوس بی‌سیم ارگونومیک با عمر باتری طولانی.',
                'price': 39.99,
                'category_id': electronics_category.id,
                'image_url': 'https://placehold.co/600x400/ec4899/FFFFFF?text=Mouse'
            },
            {
                'title_en': 'Yoga Mat',
                'title_nl': 'Yogamat',
                'title_fa': 'فرش یوگا',
                'description_en': 'Non-slip yoga mat for all types of exercises.',
                'description_nl': 'Anti-slip yogamat voor alle soorten oefeningen.',
                'description_fa': 'فرش یوگا ضد لغزش برای تمام انواع تمرینات.',
                'price': 29.99,
                'category_id': clothing_category.id,
                'image_url': 'https://placehold.co/600x400/f59e0b/FFFFFF?text=Yoga'
            },
            {
                'title_en': 'Sun Glasses',
                'title_nl': 'Zonnebril',
                'title_fa': 'عینک آفتابی',
                'description_en': 'UV protection sunglasses with polarized lenses.',
                'description_nl': 'UV-beschermende zonnebril met gepolariseerde lenzen.',
                'description_fa': 'عینک آفتابی با محافظت از UV و لنزهای قطبی.',
                'price': 89.99,
                'category_id': clothing_category.id,
                'image_url': 'https://placehold.co/600x400/64748b/FFFFFF?text=Glasses'
            }
        ]
        
        for product_data in demo_products:
            product = Product(
                title=product_data['title_en'],
                title_en=product_data['title_en'],
                title_nl=product_data['title_nl'],
                title_fa=product_data['title_fa'],
                description=product_data['description_en'],
                description_en=product_data['description_en'],
                description_nl=product_data['description_nl'],
                description_fa=product_data['description_fa'],
                price=product_data['price'],
                category_id=product_data['category_id'],
                image_url=product_data['image_url'],
                stock=50,
                is_active=True,
                is_featured=True
            )
            db.add(product)
        
        db.commit()
        return {"message": f"Successfully reset demo data with {len(demo_products)} products"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error resetting demo data: {str(e)}")