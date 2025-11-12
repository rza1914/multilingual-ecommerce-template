from app.database import SessionLocal
from app.models.user import User
from app.models.product import Product
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import random

def create_test_users():
    """Create test users"""
    db = SessionLocal()

    # Check if test users already exist
    existing_user = db.query(User).filter(User.email == "testuser@example.com").first()
    if existing_user:
        print("[OK] Test users already exist!")
        db.close()
        return

    # Create regular test user
    test_user = User(
        email="testuser@example.com",
        username="testuser",
        full_name="Test User",
        hashed_password=get_password_hash("test123"),
        role=UserRole.USER
    )
    db.add(test_user)

    # Create another test user
    test_user2 = User(
        email="john@example.com",
        username="john",
        full_name="John Doe",
        hashed_password=get_password_hash("john123"),
        role=UserRole.USER
    )
    db.add(test_user2)

    db.commit()
    print("[OK] Test users created successfully!")
    print("   - testuser@example.com / test123")
    print("   - john@example.com / john123")

    db.close()

def create_sample_products():
    """Create sample products"""
    db = SessionLocal()

    # Check if products exist
    existing = db.query(Product).first()
    if existing:
        print("[OK] Sample products already exist!")
        db.close()
        return

    sample_products = [
        {
            "title": "Wireless Headphones",
            "description": "Premium wireless headphones with noise cancellation",
            "price": 149.99,
            "category": "Electronics",  # Using string category instead of foreign key
            "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
        },
        {
            "title": "Smart Watch",
            "description": "Feature-rich smartwatch with fitness tracking",
            "price": 299.99,
            "category": "Electronics",  # Using string category instead of foreign key
            "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
        },
        {
            "title": "Laptop Stand",
            "description": "Ergonomic aluminum laptop stand",
            "price": 49.99,
            "category": "Electronics",  # Using string category instead of foreign key
            "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"
        },
        {
            "title": "Running Shoes",
            "description": "Comfortable running shoes for all terrains",
            "price": 89.99,
            "category": "Sports",  # Using string category instead of foreign key
            "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
        },
        {
            "title": "Coffee Maker",
            "description": "Automatic coffee maker with timer",
            "price": 79.99,
            "category": "Home",  # Using string category instead of foreign key
            "image_url": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500"
        },
        {
            "title": "Backpack",
            "description": "Water-resistant travel backpack",
            "price": 59.99,
            "category": "Clothing",  # Using string category instead of foreign key
            "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
        },
        {
            "title": "Desk Lamp",
            "description": "LED desk lamp with adjustable brightness",
            "price": 34.99,
            "category": "Home",  # Using string category instead of foreign key
            "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"
        },
        {
            "title": "Yoga Mat",
            "description": "Non-slip yoga mat with carrying strap",
            "price": 29.99,
            "category": "Sports",  # Using string category instead of foreign key
            "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
        },
    ]

    for product_data in sample_products:
        product = Product(**product_data, owner_id=1)  # Adding a default owner_id
        db.add(product)

    db.commit()
    print(f"[OK] {len(sample_products)} sample products created!")

    db.close()

def create_sample_orders():
    """Create sample orders for testing"""
    db = SessionLocal()

    # Check if orders exist
    existing = db.query(Order).first()
    if existing:
        print("[OK] Sample orders already exist!")
        db.close()
        return

    # Get test users
    users = db.query(User).filter(User.role == UserRole.USER).all()
    if not users:
        print("[ERROR] No test users found. Create users first.")
        db.close()
        return

    # Get products
    products = db.query(Product).all()
    if not products:
        print("[ERROR] No products found. Create products first.")
        db.close()
        return

    statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

    # Create 10 sample orders
    for i in range(10):
        user = random.choice(users)
        order_date = datetime.utcnow() - timedelta(days=random.randint(0, 30))

        # Random order items
        num_items = random.randint(1, 3)
        selected_products = random.sample(products, min(num_items, len(products)))

        subtotal = 0
        order_items = []

        for product in selected_products:
            quantity = random.randint(1, 3)
            subtotal += product.price * quantity
            order_items.append({
                "product": product,
                "quantity": quantity,
                "price": product.price
            })

        shipping_cost = 10.0
        tax = subtotal * 0.08
        total = subtotal + shipping_cost + tax

        order = Order(
            user_id=user.id,
            full_name=user.full_name or "Test Customer",
            email=user.email,
            phone="+1 (555) 000-0000",
            address="123 Test Street",
            city="Test City",
            state="CA",
            zip_code="12345",
            country="USA",
            shipping_method=random.choice(["standard", "express", "nextday"]),
            payment_method=random.choice(["card", "cash"]),
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            discount=0,
            total=total,
            status=random.choice(statuses),
            created_at=order_date
        )

        db.add(order)
        db.flush()

        # Add order items
        for item_data in order_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data["product"].id,
                quantity=item_data["quantity"],
                price_at_time=item_data["price"]
            )
            db.add(order_item)

    db.commit()
    print("[OK] 10 sample orders created!")

    db.close()

def main():
    print("Creating test data...\n")

    create_test_users()
    create_sample_products()
    create_sample_orders()

    print("\n[SUCCESS] All test data created successfully!")
    print("\nTest Credentials:")
    print("   Admin:  admin@example.com / admin123")
    print("   User 1: testuser@example.com / test123")
    print("   User 2: john@example.com / john123")
    print("\nReady for testing!")

if __name__ == "__main__":
    main()
