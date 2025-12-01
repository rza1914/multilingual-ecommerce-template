from app.database import SessionLocal
from app.models.product import Product
from sqlalchemy.orm import Session
from datetime import datetime

def seed():
    db: Session = SessionLocal()
    try:
        count = db.query(Product).count()
        if count == 0:
            products = [
                Product(
                    title="Premium Headphones",
                    title_en="Premium Headphones",
                    title_fa="هدفون پرمیوم",
                    title_ar="سماعات بريميوم",
                    description="High-quality wireless headphones",
                    description_en=None,
                    description_fa=None,
                    description_ar=None,
                    price=199.99,
                    discount_price=149.99,
                    discount=0.0,
                    stock=50,
                    rating=4.8,
                    is_active=True,
                    is_featured=True,
                    image_url="https://via.placeholder.com/300",
                    category="electronics",
                    tags="wireless,noise-cancelling",
                    created_at=datetime.utcnow(),  # اضافه شده
                    updated_at=datetime.utcnow(),  # اضافه شده
                    owner_id=None  # اگر نیازه
                ),
                Product(
                    title="Smart Watch",
                    title_en="Smart Watch",
                    title_fa="ساعت هوشمند",
                    title_ar="ساعة ذكية",
                    description="Fitness tracking smartwatch",
                    description_en=None,
                    description_fa=None,
                    description_ar=None,
                    price=299.99,
                    stock=30,
                    rating=4.5,
                    is_active=True,
                    is_featured=True,
                    image_url="https://via.placeholder.com/300",
                    category="wearables",
                    tags="fitness,health",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                    owner_id=None
                )
            ]
            db.add_all(products)
            db.commit()
            print(f"Added {len(products)} sample products!")
        else:
            print(f"Database already has {count} products. Skipping seed.")
    except Exception as e:
        print(f"Seed error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()