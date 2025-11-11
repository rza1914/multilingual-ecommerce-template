# backend/app/seed_data.py

from .database import SessionLocal, engine
from .models import Base, Product, Category, Translation

def seed_database():
    db = SessionLocal()
    try:
        # Check if database is already seeded (optional)
        if db.query(Product).count() > 0:
            print("Database already seeded.")
            return

        # Create sample categories
        electronics_category = Category(name="Electronics", description="Electronic devices and gadgets")
        db.add(electronics_category)
        db.commit()  # Commit to get the ID

        # Add sample products
        product1 = Product(
            title="iPhone 16 Pro", 
            description="Latest iPhone with advanced features",
            price=1299.0, 
            stock=50,
            category_id=electronics_category.id,
            owner_id=1  # Assuming a default user exists
        )
        product2 = Product(
            title="MacBook Pro M4", 
            description="Powerful laptop with M4 chip",
            price=2399.0, 
            stock=30,
            category_id=electronics_category.id,
            owner_id=1  # Assuming a default user exists
        )

        db.add(product1)
        db.add(product2)
        db.commit()  # Commit to get the product IDs

        # Add sample translations for product 1
        trans1_fa = Translation(
            product_id=product1.id, 
            lang="fa", 
            name="آیفون ۱۶ پرو", 
            description="..."
        )
        trans1_nl = Translation(
            product_id=product1.id, 
            lang="nl", 
            name="iPhone 16 Pro", 
            description="..."
        )

        # Add sample translations for product 2
        trans2_fa = Translation(
            product_id=product2.id, 
            lang="fa", 
            name="مک‌بوک پرو ام۴", 
            description="..."
        )
        trans2_nl = Translation(
            product_id=product2.id, 
            lang="nl", 
            name="MacBook Pro M4", 
            description="..."
        )

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