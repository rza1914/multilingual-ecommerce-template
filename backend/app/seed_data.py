# backend/app/seed_data.py

from .database import SessionLocal, engine # یا هر جایی که SessionLocal و engine تعریف شده
from .models import Base, Product, Category, Translation # مدل‌های مربوط به seed

def seed_database():
    db = SessionLocal()
    try:
        # چک کردن اینکه آیا دیتابیس خالی است یا نه (اختیاری)
        if db.query(Product).count() > 0:
            print("Database already seeded.")
            return

        # اضافه کردن داده‌های نمونه
        # مثلاً:
        product1 = Product(name="iPhone 16 Pro", price=1299, currency="EUR", stock=50)
        product2 = Product(name="MacBook Pro M4", price=2399, currency="EUR", stock=30)

        db.add(product1)
        db.add(product2)

        # اضافه کردن ترجمه‌ها
        trans1_fa = Translation(product=product1, lang="fa", name="آیفون ۱۶ پرو", description="...")
        trans1_nl = Translation(product=product1, lang="nl", name="iPhone 16 Pro", description="...")

        trans2_fa = Translation(product=product2, lang="fa", name="مک‌بوک پرو ام۴", description="...")
        trans2_nl = Translation(product=product2, lang="nl", name="MacBook Pro M4", description="...")

        db.add(trans1_fa)
        db.add(trans1_nl)
        db.add(trans2_fa)
        db.add(trans2_nl)

        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()