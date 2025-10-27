from app.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def create_admin():
    db = SessionLocal()

    # Check if admin exists
    admin = db.query(User).filter(User.email == "admin@example.com").first()

    if admin:
        print("Admin user already exists!")
        db.close()
        return

    # Create admin user
    admin_user = User(
        email="admin@example.com",
        username="admin",
        full_name="Admin User",
        hashed_password=get_password_hash("admin123"),
        role=UserRole.ADMIN,
        is_active=True
    )

    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    print("Admin user created successfully!")
    print("Email: admin@example.com")
    print("Username: admin")
    print("Password: admin123")
    print("Please change the password after first login!")

    db.close()

if __name__ == "__main__":
    create_admin()
