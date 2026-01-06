"""
Database Seed Script
Generates realistic test data for the e-commerce platform

Usage:
    python -m seed.seed              # Run full seed
    python -m seed.seed --clear      # Clear existing data first
    python -m seed.seed --dry-run    # Preview without inserting
"""

import sys
import argparse
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import SessionLocal, engine
from app.models import User, Product, Order, OrderItem

from .data_generators import generate_users, generate_products, generate_orders
from .constants import RANDOM_SEED


def clear_data(db: Session) -> None:
    """
    Clear all existing data from seeded tables
    Order matters due to foreign key constraints
    """
    print("🗑️  Clearing existing data...")
    
    # Disable foreign key checks temporarily (PostgreSQL)
    try:
        db.execute(text("SET CONSTRAINTS ALL DEFERRED"))
    except Exception:
        pass  # SQLite doesn't support this
    
    # Delete in order of dependencies
    db.query(OrderItem).delete()
    db.query(Order).delete()
    db.query(Product).delete()
    db.query(User).delete()
    
    db.commit()
    print("✅ Data cleared successfully")

def seed_users(db: Session, count: int = 1000, admin_count: int = 5) -> list[int]:
    """
    Seed user records
    
    Returns:
        Tuple of (all_user_ids, admin_user_ids)
    """
    print(f"👤 Generating {count} users + {admin_count} admins...")
    
    users_data = generate_users(count=count, admin_count=admin_count)
    
    user_ids = []
    admin_ids = []
    
    for user_data in users_data:
        user = User(**user_data)
        db.add(user)
        db.flush()  # Get the ID
        user_ids.append(user.id)
        
        if user_data["role"] == "admin":
            admin_ids.append(user.id)
    
    db.commit()
    print(f"✅ Created {len(user_ids)} users ({len(admin_ids)} admins)")
    
    return user_ids, admin_ids


def seed_products(db: Session, count: int = 200, admin_ids: list[int] = None) -> list[dict]:
    """
    Seed product records
    
    Returns:
        List of product dicts with id and price for order generation
    """
    print(f"📦 Generating {count} products...")
    
    if admin_ids is None:
        admin_ids = [1]
    
    products_data = generate_products(count=count, admin_user_ids=admin_ids)
    
    product_info = []
    
    for product_data in products_data:
        product = Product(**product_data)
        db.add(product)
        db.flush()
        
        product_info.append({
            "id": product.id,
            "price": product_data["price"]
        })
    
    db.commit()
    print(f"✅ Created {len(product_info)} products")
    
    return product_info


def seed_orders(
    db: Session,
    count: int = 500,
    user_ids: list[int] = None,
    product_info: list[dict] = None
) -> None:
    """
    Seed order and order_item records
    """
    print(f"🛒 Generating {count} orders...")
    
    # Filter out admin users from order creation
    customer_ids = [uid for uid in user_ids if uid > 5] if user_ids else list(range(6, 1006))
    
    orders_data, items_data = generate_orders(
        count=count,
        user_ids=customer_ids,
        product_data=product_info
    )
    
    # Insert orders
    for order_data in orders_data:
        order_id = order_data.pop("id")  # Remove id, let DB assign
        order = Order(**order_data)
        db.add(order)
    
    db.flush()  # Ensure orders have IDs
    
    # Get actual order IDs (they should be sequential)
    orders = db.query(Order).order_by(Order.id).all()
    order_id_map = {i + 1: order.id for i, order in enumerate(orders)}
    
    # Insert order items with correct order IDs
    for item_data in items_data:
        original_order_id = item_data["order_id"]
        item_data["order_id"] = order_id_map.get(original_order_id, original_order_id)
        item = OrderItem(**item_data)
        db.add(item)
    
    db.commit()
    print(f"✅ Created {len(orders_data)} orders with {len(items_data)} items")


def run_seed(
    clear: bool = False,
    dry_run: bool = False,
    user_count: int = 1000,
    admin_count: int = 5,
    product_count: int = 200,
    order_count: int = 500
) -> None:
    """
    Main seed runner
    
    Args:
        clear: If True, clear existing data before seeding
        dry_run: If True, only show what would be created
        user_count: Number of regular users to create
        admin_count: Number of admin users to create
        product_count: Number of products to create
        order_count: Number of orders to create
    """
    print("="*50)
    print("🌱 E-Commerce Database Seed Script")
    print(f"   Random Seed: {RANDOM_SEED} (deterministic)")
    print("="*50)
    
    if dry_run:
        print("\n🔍 DRY RUN MODE - No data will be inserted\n")
        print(f"Would create:")
        print(f"  - {admin_count} admin users")
        print(f"  - {user_count} regular users")
        print(f"  - {product_count} products")
        print(f"  - {order_count} orders (with 1-5 items each)")
        print(f"  - Estimated {order_count * 2} order items")
        return
    
    db = SessionLocal()
    
    try:
        if clear:
            clear_data(db)
        
        # Seed in order of dependencies
        user_ids, admin_ids = seed_users(db, count=user_count, admin_count=admin_count)
        product_info = seed_products(db, count=product_count, admin_ids=admin_ids)
        seed_orders(db, count=order_count, user_ids=user_ids, product_info=product_info)
        
        print("\n" + "="*50)
        print("✅ Seeding completed successfully!")
        print("="*50)
        
        # Print summary
        print("\n📊 Summary:")
        print(f"   Users: {db.query(User).count()}")
        print(f"   Products: {db.query(Product).count()}")
        print(f"   Orders: {db.query(Order).count()}")
        print(f"   Order Items: {db.query(OrderItem).count()}")
        
        print("\n🔐 Admin Credentials:")
        print("   Email: admin1@luxstore.com")
        print("   Password: admin123")

        print("\n👤 Test User Credentials:")
        print("   Password for all users: user123")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error during seeding: {e}")
        raise
    finally:
        db.close()


def main():
    """CLI entry point"""
    parser = argparse.ArgumentParser(
        description="Seed the e-commerce database with test data"
    )
    parser.add_argument(
        "--clear", "-c",
        action="store_true",
        help="Clear existing data before seeding"
    )
    parser.add_argument(
        "--dry-run", "-d",
        action="store_true",
        help="Preview what would be created without inserting"
    )
    parser.add_argument(
        "--users", "-u",
        type=int,
        default=1000,
        help="Number of regular users to create (default: 1000)"
    )
    parser.add_argument(
        "--admins", "-a",
        type=int,
        default=5,
        help="Number of admin users to create (default: 5)"
    )
    parser.add_argument(
        "--products", "-p",
        type=int,
        default=200,
        help="Number of products to create (default: 200)"
    )
    parser.add_argument(
        "--orders", "-o",
        type=int,
        default=500,
        help="Number of orders to create (default: 500)"
    )
    
    args = parser.parse_args()
    
    run_seed(
        clear=args.clear,
        dry_run=args.dry_run,
        user_count=args.users,
        admin_count=args.admins,
        product_count=args.products,
        order_count=args.orders
    )


if __name__ == "__main__":
    main()