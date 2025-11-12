"""
Demo data seeding script for multilingual e-commerce template
This script creates 10 demo products with English, Dutch, and Persian translations
"""

import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import Product
from app.models.user import User

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config import settings


def seed_demo_data():
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # Check if demo data already exists
        existing_products = db.query(Product).count()
        if existing_products > 0:
            print("Demo data already exists. Clearing existing data...")
            db.query(Product).delete()
            db.commit()

        # Create demo products with string categories
        demo_products = [
            {
                'title_en': 'Wireless Headphones',
                'title_nl': 'Draadloze hoofdtelefoon',
                'title_fa': 'هدفون بی‌سیم',
                'description_en': 'High-quality wireless headphones with noise cancellation.',
                'description_nl': 'Hoogwaardige draadloze hoofdtelefoon met geluidsisolatie.',
                'description_fa': 'هدفون بی‌سیم با کیفیت بالا و قابلیت حذف نویز.',
                'price': 129.99,
                'category': 'Electronics',  # Use string category instead of foreign key
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
                'category': 'Electronics',  # Use string category instead of foreign key
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
                'category': 'Books',  # Use string category instead of foreign key
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
                'category': 'Clothing',  # Use string category instead of foreign key
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
                'category': 'Electronics',  # Use string category instead of foreign key
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
                'category': 'Electronics',  # Use string category instead of foreign key
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
                'category': 'Clothing',  # Use string category instead of foreign key
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
                'category': 'Electronics',  # Use string category instead of foreign key
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
                'category': 'Clothing',  # Use string category instead of foreign key
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
                'category': 'Clothing',  # Use string category instead of foreign key
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
                category=product_data['category'],  # Use string category instead of foreign key
                image_url=product_data['image_url'],
                stock=50,
                is_active=True,
                is_featured=True
            )
            db.add(product)

        db.commit()
        print(f"Successfully created {len(demo_products)} demo products with multilingual support")

    except Exception as e:
        print(f"Error seeding demo data: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()