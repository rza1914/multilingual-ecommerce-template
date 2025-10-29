import asyncio
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.product import Product
from app.models.category import Category
from app.models.user import User
from app.core.security import get_password_hash

# Sample data
categories_data = [
    {"name": "Electronics", "name_fa": "Electronics", "name_ar": "Electronics"},
    {"name": "Fashion", "name_fa": "Fashion", "name_ar": "Fashion"},
    {"name": "Home & Garden", "name_fa": "Home & Garden", "name_ar": "Home & Garden"},
    {"name": "Sports", "name_fa": "Sports", "name_ar": "Sports"},
]

products_data = [
    {
        "name": "Wireless Headphones",
        "name_fa": "Wireless Headphones",
        "name_ar": "Wireless Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "description_fa": "High-quality wireless headphones with noise cancellation",
        "description_ar": "High-quality wireless headphones with noise cancellation",
        "price": 99.99,
        "stock": 50,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "category_name": "Electronics"
    },
    {
        "name": "Smart Watch",
        "name_fa": "Smart Watch",
        "name_ar": "Smart Watch",
        "description": "Feature-rich smartwatch with fitness tracking",
        "description_fa": "Feature-rich smartwatch with fitness tracking",
        "description_ar": "Feature-rich smartwatch with fitness tracking",
        "price": 199.99,
        "stock": 30,
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        "category_name": "Electronics"
    },
    {
        "name": "Designer Sunglasses",
        "name_fa": "Designer Sunglasses",
        "name_ar": "Designer Sunglasses",
        "description": "Stylish sunglasses with UV protection",
        "description_fa": "Stylish sunglasses with UV protection",
        "description_ar": "Stylish sunglasses with UV protection",
        "price": 149.99,
        "stock": 25,
        "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
        "category_name": "Fashion"
    },
    {
        "name": "Running Shoes",
        "name_fa": "Running Shoes",
        "name_ar": "Running Shoes",
        "description": "Comfortable running shoes for all terrains",
        "description_fa": "Comfortable running shoes for all terrains",
        "description_ar": "Comfortable running shoes for all terrains",
        "price": 79.99,
        "stock": 40,
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        "category_name": "Sports"
    },
    {
        "name": "Yoga Mat",
        "name_fa": "Yoga Mat",
        "name_ar": "Yoga Mat",
        "description": "Non-slip yoga mat for comfortable workouts",
        "description_fa": "Non-slip yoga mat for comfortable workouts",
        "description_ar": "Non-slip yoga mat for comfortable workouts",
        "price": 29.99,
        "stock": 60,
        "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
        "category_name": "Sports"
    },
    {
        "name": "Plant Pot Set",
        "name_fa": "Plant Pot Set",
        "name_ar": "Plant Pot Set",
        "description": "Beautiful ceramic plant pots for home decoration",
        "description_fa": "Beautiful ceramic plant pots for home decoration",
        "description_ar": "Beautiful ceramic plant pots for home decoration",
        "price": 39.99,
        "stock": 35,
        "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500",
        "category_name": "Home & Garden"
    },
]

def seed_database():
    db = SessionLocal()
    try:
        # Create categories
        print("Creating categories...")
        categories = {}
        for cat_data in categories_data:
            category = db.query(Category).filter(Category.name == cat_data["name"]).first()
            if not category:
                category = Category(**cat_data)
                db.add(category)
                db.commit()
                db.refresh(category)
            categories[cat_data["name"]] = category.id

        print(f"Created {len(categories)} categories")

        # Create products
        print("Creating products...")
        for prod_data in products_data:
            category_name = prod_data.pop("category_name")
            prod_data["category_id"] = categories[category_name]

            product = db.query(Product).filter(Product.name == prod_data["name"]).first()
            if not product:
                product = Product(**prod_data)
                db.add(product)

        db.commit()
        print(f"Created {len(products_data)} products")

        # Create demo admin user
        print("Creating demo admin user...")
        admin = db.query(User).filter(User.email == "admin@demo.com").first()
        if not admin:
            admin = User(
                email="admin@demo.com",
                username="admin",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
                is_superuser=True
            )
            db.add(admin)
            db.commit()
            print("Demo admin created: admin@demo.com / admin123")

        print("\n✅ Database seeded successfully!")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Seeding database...")
    seed_database()
