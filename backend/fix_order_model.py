#!/usr/bin/env python3
"""
Fix Order model AttributeError by ensuring database schema is up to date
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal, Base
from app.models import order, user, product
from sqlalchemy import inspect, text

def check_order_columns():
    """Check what columns exist in orders table"""
    print("=" * 60)
    print("🔍 Checking Order Table Schema")
    print("=" * 60)
    
    inspector = inspect(engine)
    
    if 'orders' not in inspector.get_table_names():
        print("❌ Orders table does not exist!")
        return False
    
    columns = inspector.get_columns('orders')
    column_names = [col['name'] for col in columns]
    
    print(f"\n📋 Current columns in 'orders' table:")
    for col in columns:
        print(f"   - {col['name']}: {col['type']}")
    
    print(f"\n✅ Total columns: {len(column_names)}")
    
    # Check for required pricing columns
    required_columns = ['subtotal', 'shipping_cost', 'tax', 'discount', 'total']
    missing_columns = [col for col in required_columns if col not in column_names]
    
    if missing_columns:
        print(f"\n❌ Missing columns: {missing_columns}")
        return False
    else:
        print(f"\n✅ All required pricing columns exist!")
        return True

def recreate_database():
    """Drop and recreate all tables"""
    print("\n" + "=" * 60)
    print("🔧 Recreating Database Schema")
    print("=" * 60)
    
    try:
        # Drop all tables
        print("\n⚠️  Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        print("✅ Tables dropped")
        
        # Create all tables with current models
        print("\n📦 Creating tables from models...")
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created")
        
        # Verify
        print("\n🔍 Verifying...")
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"✅ Tables created: {', '.join(tables)}")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_order_creation():
    """Test creating an order with all fields"""
    print("\n" + "=" * 60)
    print("🧪 Testing Order Creation")
    print("=" * 60)
    
    db = SessionLocal()
    try:
        from app.models.order import Order, OrderStatus
        from app.models.user import User, UserRole
        from app.core.security import get_password_hash
        
        # Create test user if not exists
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            print("\n📝 Creating test user...")
            test_user = User(
                email="test@example.com",
                username="testuser",
                full_name="Test User",
                hashed_password=get_password_hash("password123"),
                role=UserRole.USER
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"✅ Test user created (ID: {test_user.id})")
        else:
            print(f"✅ Test user exists (ID: {test_user.id})")
        
        # Create test order
        print("\n📝 Creating test order...")
        test_order = Order(
            user_id=test_user.id,
            full_name="John Doe",
            email="john@example.com",
            phone="+1234567890",
            address="123 Main St",
            city="New York",
            state="NY",
            zip_code="10001",
            country="United States",
            shipping_method="standard",
            payment_method="card",
            subtotal=100.0,
            shipping_cost=10.0,
            tax=8.0,
            discount=5.0,
            total=113.0,  # subtotal + shipping + tax - discount
            status=OrderStatus.PENDING
        )
        db.add(test_order)
        db.commit()
        db.refresh(test_order)
        
        print(f"✅ Test order created (ID: {test_order.id})")
        print(f"   Subtotal: ${test_order.subtotal}")
        print(f"   Shipping: ${test_order.shipping_cost}")
        print(f"   Tax: ${test_order.tax}")
        print(f"   Discount: ${test_order.discount}")
        print(f"   Total: ${test_order.total}")
        
        # Test accessing total attribute
        print(f"\n🧪 Testing total attribute...")
        total = test_order.total
        print(f"✅ order.total = ${total}")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

def main():
    print("=" * 60)
    print("🔧 ORDER MODEL FIX TOOL")
    print("=" * 60)
    
    # Step 1: Check current schema
    schema_ok = check_order_columns()
    
    if not schema_ok:
        print("\n⚠️  Schema has issues!")
        response = input("\n❓ Recreate database? This will DELETE ALL DATA! (yes/no): ")
        
        if response.lower() == 'yes':
            if recreate_database():
                print("\n✅ Database recreated successfully!")
            else:
                print("\n❌ Failed to recreate database")
                return
        else:
            print("\n❌ Cannot continue with broken schema")
            return
    
    # Step 2: Test order creation
    if test_order_creation():
        print("\n" + "=" * 60)
        print("🎉 ALL TESTS PASSED!")
        print("=" * 60)
        print("\n✅ Order.total attribute works correctly")
        print("✅ Admin dashboard should work now")
        print("\nNext steps:")
        print("1. Restart backend: cd backend && python run.py")
        print("2. Visit: http://localhost:8000/docs")
        print("3. Test admin dashboard endpoints")
    else:
        print("\n" + "=" * 60)
        print("❌ TESTS FAILED")
        print("=" * 60)
        print("\nThe Order model still has issues.")
        print("Please check the error messages above.")

if __name__ == "__main__":
    main()
