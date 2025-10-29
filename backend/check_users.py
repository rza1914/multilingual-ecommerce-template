"""
Simple script to check users in database
"""
from app.database import SessionLocal
from app.models.user import User

def check_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print("\n" + "="*60)
        print("📋 Users in database:")
        print("="*60)
        
        if not users:
            print("❌ No users found in database!")
            return
        
        for user in users:
            print(f"\nID: {user.id}")
            print(f"Email: {user.email}")
            print(f"Username: {getattr(user, 'username', 'N/A')}")
            print(f"Role: {user.role}")
            print(f"Active: {user.is_active}")
            print(f"Created: {getattr(user, 'created_at', 'N/A')}")
            print("-" * 40)
        
        admin_users = db.query(User).filter(User.role == "admin").all()
        print(f"\n👑 Total admin users: {len(admin_users)}")
        
        if admin_users:
            print("Admin accounts:")
            for admin in admin_users:
                print(f"  ✅ {admin.email} (ID: {admin.id})")
        else:
            print("  ❌ No admin users found!")
            print("\n💡 Tip: Run create_admin.py to create an admin user")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_users()
