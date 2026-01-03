#!/usr/bin/env python3
"""
Database Seeding Script
=======================
Populates the database with sample data for testing the multilingual e-commerce template.

Usage:
    cd backend
    python seed_db.py
"""

import sqlite3
import os
import sys
import random
from datetime import datetime, timedelta


def get_database_path():
    """Get the path to the SQLite database file"""
    # Check common locations for the database
    possible_paths = [
        "app.db",
        "./app.db",
        "backend/app.db",
        "../app.db",
        "database.db",
        "./database.db"
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            return path
    
    # Default path if none found
    return "app.db"


def create_tables(conn):
    """Create all required tables if they don't exist"""
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            full_name TEXT,
            is_active BOOLEAN DEFAULT 1,
            is_verified BOOLEAN DEFAULT 0,
            is_admin BOOLEAN DEFAULT 0,
            is_superuser BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create products table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL DEFAULT 0,
            discount_price REAL,
            discount REAL DEFAULT 0,
            stock INTEGER DEFAULT 0,
            rating REAL DEFAULT 0,
            is_active BOOLEAN DEFAULT 1,
            is_featured BOOLEAN DEFAULT 0,
            image_url TEXT,
            category TEXT,
            tags TEXT,
            title_en TEXT,
            title_ar TEXT,
            title_fa TEXT,
            description_en TEXT,
            description_ar TEXT,
            description_fa TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            owner_id INTEGER
        )
    """)
    
    # Create categories table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            name_en TEXT,
            name_ar TEXT,
            name_fa TEXT,
            slug TEXT UNIQUE,
            parent_id INTEGER,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_id) REFERENCES categories (id)
        )
    """)
    
    conn.commit()
    print("✅ Tables created/verified successfully")


def add_sample_categories(conn):
    """Add sample categories to the database"""
    cursor = conn.cursor()
    
    categories = [
        ("Electronics", "Electronics", "إلكترونيات", "الکترونیک"),
        ("Clothing", "Clothing", "ملابس", "پوشاک"),
        ("Home & Garden", "Home & Garden", "المنزل والحديقة", "خانه و باغ"),
        ("Sports", "Sports", "رياضة", "ورزشی"),
        ("Books", "Books", "كتب", "کتاب"),
        ("Toys", "Toys", "ألعاب", "اسباب‌بازی"),
        ("Health & Beauty", "Health & Beauty", "الصحة والجمال", "سلامت و زیبایی"),
        ("Automotive", "Automotive", "سيارات", "خودرو"),
        ("Food", "Food", "طعام", "غذا"),
        ("Jewelry", "Jewelry", "مجوهرات", "جواهرات"),
    ]
    
    for name, name_en, name_ar, name_fa in categories:
        cursor.execute("""
            INSERT OR IGNORE INTO categories (name, name_en, name_ar, name_fa, slug, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        """, (name, name_en, name_ar, name_fa, name.lower().replace(' & ', '-').replace(' ', '-')))
    
    conn.commit()
    print(f"✅ Added {len(categories)} sample categories")


def add_sample_products(conn):
    """Add sample products to the database"""
    cursor = conn.cursor()
    
    # Sample products with multilingual titles and descriptions
    products = [
        # Electronics
        {
            "title": "Wireless Bluetooth Headphones",
            "title_en": "Wireless Bluetooth Headphones",
            "title_ar": "سماعات بلوتوث لاسلكية",
            "title_fa": "هدفون بلوتوث بی‌سیم",
            "description": "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
            "description_en": "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
            "description_ar": "سماعات لاسلكية متميزة مع إلغاء الضوضاء النشط وعمر بطارية 30 ساعة.",
            "description_fa": "هدفون بی‌سیم با کیفیت بالا با قابلیت حذف نویز فعال و ۳۰ ساعت عمر باتری.",
            "price": 149.99,
            "discount_price": 129.99,
            "discount": 13.3,
            "stock": 50,
            "rating": 4.5,
            "is_active": True,
            "is_featured": True,
            "image_url": "https://picsum.photos/id/1/400/400",
            "category": "Electronics",
            "tags": "audio, wireless, headphones"
        },
        {
            "title": "Smart Watch Pro",
            "title_en": "Smart Watch Pro",
            "title_ar": "ساعة ذكية برو",
            "title_fa": "ساعت هوشمند پرو",
            "description": "Advanced smartwatch with health monitoring, GPS, and 7-day battery.",
            "description_en": "Advanced smartwatch with health monitoring, GPS, and 7-day battery.",
            "description_ar": "ساعة ذكية متقدمة مع مراقبة الصحة ونظام GPS وبطارية تدوم 7 أيام.",
            "description_fa": "ساعت هوشمند پیشرفته با نظارت بر سلامت، GPS و ۷ روز عمر باتری.",
            "price": 299.99,
            "discount_price": None,
            "discount": 0,
            "stock": 30,
            "rating": 4.7,
            "is_active": True,
            "is_featured": True,
            "image_url": "https://picsum.photos/id/2/400/400",
            "category": "Electronics",
            "tags": "wearable, fitness, tech"
        },
        {
            "title": "4K Ultra HD Smart TV 55\"",
            "title_en": "4K Ultra HD Smart TV 55\"",
            "title_ar": "تلفزيون ذكي 4K مقاس 55 بوصة",
            "title_fa": "تلویزیون هوشمند ۵۵ اینچ 4K",
            "description": "Crystal clear 4K display with smart features and built-in streaming apps.",
            "description_en": "Crystal clear 4K display with smart features and built-in streaming apps.",
            "description_ar": "شاشة 4K واضحة مع ميزات ذكية وتطبيقات البث المدمجة.",
            "description_fa": "نمایشگر 4K با کیفیت کریستالی با قابلیت‌های هوشمند و برنامه‌های استریم داخلی.",
            "price": 699.99,
            "discount_price": 599.99,
            "discount": 14.3,
            "stock": 15,
            "rating": 4.8,
            "is_active": True,
            "is_featured": False,
            "image_url": "https://picsum.photos/id/3/400/400",
            "category": "Electronics",
            "tags": "tv, smart, 4k"
        },
        # Clothing
        {
            "title": "Premium Cotton T-Shirt",
            "title_en": "Premium Cotton T-Shirt",
            "title_ar": "تيشيرت قطني ممتاز",
            "title_fa": "تی‌شرت نخی ممتاز",
            "description": "Soft and comfortable 100% cotton t-shirt, available in multiple colors.",
            "description_en": "Soft and comfortable 100% cotton t-shirt, available in multiple colors.",
            "description_ar": "تيشيرت قطني 100% ناعم ومريح، متوفر بألوان متعددة.",
            "description_fa": "تی‌شرت نرم و راحت ۱۰۰٪ نخ، در رنگ‌های متعدد موجود است.",
            "price": 24.99,
            "discount_price": None,
            "discount": 0,
            "stock": 200,
            "rating": 4.3,
            "is_active": True,
            "is_featured": False,
            "image_url": "https://picsum.photos/id/4/400/400",
            "category": "Clothing",
            "tags": "clothing, tshirt, cotton"
        },
        {
            "title": "Winter Jacket - Waterproof",
            "title_en": "Winter Jacket - Waterproof",
            "title_ar": "جاكيت شتوي مقاوم للماء",
            "title_fa": "کاپشن زمستانی ضدآب",
            "description": "Warm and waterproof winter jacket with thermal insulation.",
            "description_en": "Warm and waterproof winter jacket with thermal insulation.",
            "description_ar": "جاكيت شتوي دافئ ومقاوم للماء مع عزل حراري.",
            "description_fa": "کاپشن زمستانی گرم و ضدآب با عایق حرارتی.",
            "price": 149.99,
            "discount_price": 129.99,
            "discount": 13.3,
            "stock": 60,
            "rating": 4.6,
            "is_active": True,
            "is_featured": True,
            "image_url": "https://picsum.photos/id/5/400/400",
            "category": "Clothing",
            "tags": "jacket, winter, waterproof"
        },
        # Home & Garden
        {
            "title": "Smart LED Desk Lamp",
            "title_en": "Smart LED Desk Lamp",
            "title_ar": "مصباح مكتب LED ذكي",
            "title_fa": "چراغ مطالعه LED هوشمند",
            "description": "Adjustable LED desk lamp with touch control and multiple brightness levels.",
            "description_en": "Adjustable LED desk lamp with touch control and multiple brightness levels.",
            "description_ar": "مصباح مكتب LED قابل للتعديل مع تحكم باللمس ومستويات سطوع متعددة.",
            "description_fa": "چراغ مطالعه LED قابل تنظیم با کنترل لمسی و سطوح روشنایی متعدد.",
            "price": 39.99,
            "discount_price": None,
            "discount": 0,
            "stock": 70,
            "rating": 4.4,
            "is_active": True,
            "is_featured": False,
            "image_url": "https://picsum.photos/id/6/400/400",
            "category": "Home & Garden",
            "tags": "lighting, desk, led"
        },
        # Sports
        {
            "title": "Yoga Mat - Premium",
            "title_en": "Yoga Mat - Premium",
            "title_ar": "سجادة يوغا ممتازة",
            "title_fa": "مت یوگا پریمیوم",
            "description": "Non-slip yoga mat with alignment lines and carrying strap.",
            "description_en": "Non-slip yoga mat with alignment lines and carrying strap.",
            "description_ar": "سجادة يوغا مانعة للانزلاق مع خطوط محاذاة وحزام حمل.",
            "description_fa": "مت یوگا ضد لغزش با خطوط تراز و بند حمل.",
            "price": 34.99,
            "discount_price": 29.99,
            "discount": 14.3,
            "stock": 100,
            "rating": 4.5,
            "is_active": True,
            "is_featured": False,
            "image_url": "https://picsum.photos/id/7/400/400",
            "category": "Sports",
            "tags": "yoga, fitness, exercise"
        },
        # Books
        {
            "title": "The Art of Programming",
            "title_en": "The Art of Programming",
            "title_ar": "فن البرمجة",
            "title_fa": "هنر برنامه‌نویسی",
            "description": "Comprehensive guide to modern programming techniques and best practices.",
            "description_en": "Comprehensive guide to modern programming techniques and best practices.",
            "description_ar": "دليل شامل لتقنيات البرمجة الحديثة وأفضل الممارسات.",
            "description_fa": "راهنمای جامع تکنیک‌های برنامه‌نویسی مدرن و بهترین روش‌ها.",
            "price": 49.99,
            "discount_price": None,
            "discount": 0,
            "stock": 80,
            "rating": 4.7,
            "is_active": True,
            "is_featured": True,
            "image_url": "https://picsum.photos/id/8/400/400",
            "category": "Books",
            "tags": "programming, computer science, guide"
        },
        # Health & Beauty
        {
            "title": "Organic Face Moisturizer",
            "title_en": "Organic Face Moisturizer",
            "title_ar": "مرطب وجه عضوي",
            "title_fa": "مرطوب‌کننده صورت ارگانیک",
            "description": "Natural organic moisturizer for all skin types.",
            "description_en": "Natural organic moisturizer for all skin types.",
            "description_ar": "مرطب عضوي طبيعي لجميع أنواع البشرة.",
            "description_fa": "مرطوب‌کننده ارگانیک طبیعی برای انواع پوست.",
            "price": 34.99,
            "discount_price": 29.99,
            "discount": 14.3,
            "stock": 85,
            "rating": 4.6,
            "is_active": True,
            "is_featured": False,
            "image_url": "https://picsum.photos/id/9/400/400",
            "category": "Health & Beauty",
            "tags": "skincare, organic, beauty"
        },
        # Food
        {
            "title": "Organic Coffee Beans 1kg",
            "title_en": "Organic Coffee Beans 1kg",
            "title_ar": "حبوب قهوة عضوية 1 كجم",
            "title_fa": "دانه قهوه ارگانیک ۱ کیلویی",
            "description": "Premium organic Arabica coffee beans, freshly roasted.",
            "description_en": "Premium organic Arabica coffee beans, freshly roasted.",
            "description_ar": "حبوب قهوة أرابيكا عضوية ممتازة، محمصة طازجة.",
            "description_fa": "دانه‌های قهوه عربیکا ارگانیک ممتاز، تازه برشته شده.",
            "price": 24.99,
            "discount_price": None,
            "discount": 0,
            "stock": 150,
            "rating": 4.8,
            "is_active": True,
            "is_featured": True,
            "image_url": "https://picsum.photos/id/10/400/400",
            "category": "Food",
            "tags": "coffee, organic, beverage"
        }
    ]
    
    for product in products:
        cursor.execute("""
            INSERT OR IGNORE INTO products (
                title, title_en, title_ar, title_fa,
                description, description_en, description_ar, description_fa,
                price, discount_price, discount, stock, rating,
                is_active, is_featured, image_url, category, tags
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            product["title"], product["title_en"], product["title_ar"], product["title_fa"],
            product["description"], product["description_en"], product["description_ar"], product["description_fa"],
            product["price"], product["discount_price"], product["discount"], product["stock"], product["rating"],
            product["is_active"], product["is_featured"], product["image_url"], product["category"], product["tags"]
        ))
    
    conn.commit()
    print(f"✅ Added {len(products)} sample products")


def add_sample_admin_users(conn):
    """Add sample admin users to the database"""
    cursor = conn.cursor()
    
    # Hash a simple password for testing (in real app, use proper hashing)
    import hashlib
    def hash_password(password):
        return hashlib.sha256(password.encode()).hexdigest()
    
    # Add admin users
    admin_users = [
        ("admin@shop.com", hash_password("admin123"), "Admin User", True, True, True),
        ("superadmin@shop.com", hash_password("admin123"), "Super Admin", True, True, True),
        ("manager@shop.com", hash_password("admin123"), "Manager", True, True, False)
    ]
    
    for email, password_hash, full_name, is_active, is_verified, is_admin in admin_users:
        cursor.execute("""
            INSERT OR IGNORE INTO users (
                email, hashed_password, full_name, is_active, is_verified, is_admin, is_superuser
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (email, password_hash, full_name, is_active, is_verified, is_admin, is_admin))
    
    conn.commit()
    print(f"✅ Added {len(admin_users)} sample admin users")


def run_seeding():
    """Main seeding function"""
    print("="*60)
    print("🌱 Database Seeding Script")
    print("="*60)
    
    db_path = get_database_path()
    print(f"\n📂 Database path: {db_path}")
    
    if not os.path.exists(db_path):
        print(f"⚠ Database file does not exist: {db_path}")
        print("   Creating new database...")
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        
        # Create tables if they don't exist
        create_tables(conn)
        
        # Add sample data
        add_sample_categories(conn)
        add_sample_products(conn)
        add_sample_admin_users(conn)
        
        # Close connection
        conn.close()
        
        print("\n" + "="*60)
        print("✅ Database seeding completed successfully!")
        print("   Admin credentials:")
        print("   - admin@shop.com / admin123")
        print("   - superadmin@shop.com / admin123")
        print("   - manager@shop.com / admin123")
        print("="*60)
        return True
        
    except sqlite3.Error as e:
        print(f"\n❌ SQLite Error: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected Error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = run_seeding()
    sys.exit(0 if success else 1)