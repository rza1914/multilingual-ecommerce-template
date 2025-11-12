"""
Simple script to create or verify admin user
"""
from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def create_or_verify_admin():
    db = SessionLocal()
    try:
        print("\n" + "="*60)
        print("🔧 Admin User Creation/Verification")
        print("="*60)

        # Check for existing admin
        existing_admin = db.query(User).filter(User.role == "admin").first()

        if existing_admin:
            print(f"\n✅ Admin user already exists!")
            print(f"   Email: {existing_admin.email}")
            print(f"   Username: {getattr(existing_admin, 'username', 'N/A')}")
            print(f"   ID: {existing_admin.id}")
            print(f"   Active: {existing_admin.is_active}")

            # Verify password works
            from app.core.security import verify_password
            test_pass = "admin123"
            if verify_password(test_pass, existing_admin.hashed_password):
                print(f"\n✅ Password 'admin123' is correct for this user")
            else:
                print(f"\n⚠️  Password 'admin123' does NOT match this user")
                print(f"   You may need to reset the password")

            return existing_admin

        # Check if admin@example.com already exists
        existing_email = db.query(User).filter(User.email == "admin@example.com").first()
        if existing_email:
            print(f"\n⚠️  User with email admin@example.com exists but is not admin!")
            print(f"   Converting to admin...")
            existing_email.role = "admin"
            existing_email.is_active = True
            db.commit()
            db.refresh(existing_email)
            print(f"✅ User converted to admin!")
            return existing_email

        # Check if admin@test.com exists (for backwards compatibility)
        existing_email = db.query(User).filter(User.email == "admin@test.com").first()
        if existing_email:
            print(f"\n⚠️  User with email admin@test.com exists but is not admin!")
            print(f"   Converting to admin and updating email to admin@example.com...")
            existing_email.role = "admin"
            existing_email.email = "admin@example.com"  # Update email to preferred address
            existing_email.is_active = True
            db.commit()
            db.refresh(existing_email)
            print(f"✅ User converted to admin with updated email!")
            return existing_email

        # Create brand new admin with requested credentials
        admin_user = User(
            email="admin@example.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            role="admin",
            is_active=True
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("\n✅ Admin user created successfully!")
        print(f"   Email: admin@example.com")
        print(f"   Username: admin")
        print(f"   Password: admin123")
        print(f"   ID: {admin_user.id}")
        print(f"\n⚠️  IMPORTANT: Change this password in production!")

        return admin_user

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_or_verify_admin()