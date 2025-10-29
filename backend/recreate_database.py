"""
Recreate database with correct schema
This script drops all tables and recreates them with the updated Product model
"""
import os
from app.database import Base, engine
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.core.security import get_password_hash
from app.database import SessionLocal

def recreate_database():
    print("\n" + "="*60)
    print("🔄 Recreating Database with New Schema")
    print("="*60)
    
    # Check if database file exists
    db_path = "ecommerce.db"
    if os.path.exists(db_path):
        print(f"\n⚠️  Database file exists: {db_path}")
        response = input("Do you want to DELETE it and start fresh? (yes/no): ")
        if response.lower() != 'yes':
            print("❌ Aborted. Database not modified.")
            return
        
        # Close any open connections
        engine.dispose()
        
        # Delete database file
        try:
            os.remove(db_path)
            print(f"✅ Deleted: {db_path}")
            
            # Delete journal files if they exist
            for ext in ['-shm', '-wal']:
                journal_file = f"{db_path}{ext}"
                if os.path.exists(journal_file):
                    os.remove(journal_file)
                    print(f"✅ Deleted: {journal_file}")
        except Exception as e:
            print(f"❌ Error deleting database: {e}")
            return
    
    # Create all tables
    print("\n🔨 Creating tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return
    
    # Create admin user
    print("\n👤 Creating admin user...")
    db = SessionLocal()
    try:
        from app.models.user import UserRole
        
        admin = User(
            email="admin@test.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            role=UserRole.ADMIN,
            is_active=True
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print("✅ Admin user created!")
        print(f"   Email: admin@test.com")
        print(f"   Username: admin")
        print(f"   Password: admin123")
        
    except Exception as e:
        print(f"❌ Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()
    
    # Create sample products
    print("\n📦 Creating sample products...")
    db = SessionLocal()
    try:
        sample_products = [
            {
                "title": "Premium Laptop",
                "title_en": "Premium Laptop",
                "title_ar": "لابتوب متميز",
                "title_fa": "لپ‌تاپ پرمیوم",
                "description": "High-performance laptop for professionals",
                "description_en": "High-performance laptop for professionals",
                "description_ar": "لابتوب عالي الأداء للمحترفين",
                "description_fa": "لپ‌تاپ با کارایی بالا برای حرفه‌ای‌ها",
                "price": 1299.99,
                "discount": 10.0,
                "stock": 50,
                "rating": 4.5,
                "category": "Electronics",
                "is_active": True,
                "is_featured": True,
                "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
            },
            {
                "title": "Wireless Headphones",
                "title_en": "Wireless Headphones",
                "title_ar": "سماعات لاسلكية",
                "title_fa": "هدفون بی‌سیم",
                "description": "Premium noise-cancelling headphones",
                "description_en": "Premium noise-cancelling headphones",
                "description_ar": "سماعات متميزة لإلغاء الضوضاء",
                "description_fa": "هدفون پرمیوم با حذف نویز",
                "price": 199.99,
                "discount": 15.0,
                "stock": 100,
                "rating": 4.8,
                "category": "Electronics",
                "is_active": True,
                "is_featured": True,
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
            },
            {
                "title": "Smart Watch",
                "title_en": "Smart Watch",
                "title_ar": "ساعة ذكية",
                "title_fa": "ساعت هوشمند",
                "description": "Fitness tracker with heart rate monitor",
                "description_en": "Fitness tracker with heart rate monitor",
                "description_ar": "متتبع اللياقة مع مراقب معدل ضربات القلب",
                "description_fa": "ردیاب تناسب اندام با سنجش ضربان قلب",
                "price": 299.99,
                "discount": 20.0,
                "stock": 75,
                "rating": 4.3,
                "category": "Electronics",
                "is_active": True,
                "is_featured": False,
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
            }
        ]
        
        for product_data in sample_products:
            product = Product(**product_data)
            db.add(product)
        
        db.commit()
        print(f"✅ Created {len(sample_products)} sample products!")
        
    except Exception as e:
        print(f"❌ Error creating products: {e}")
        db.rollback()
    finally:
        db.close()
    
    print("\n" + "="*60)
    print("✅ Database Recreation Complete!")
    print("="*60)
    print("\n📋 Summary:")
    print("   - Database: ecommerce.db")
    print("   - Admin user: admin@test.com / admin123")
    print("   - Sample products: 3")
    print("\n🚀 Next Steps:")
    print("   1. Start backend: uvicorn app.main:app --reload")
    print("   2. Start frontend: npm run dev")
    print("   3. Test: http://localhost:5173")
    print("\n" + "="*60)

if __name__ == "__main__":
    recreate_database()
