#!/usr/bin/env python3
"""
Script to check for existing users in the database and create test users if they don't exist.
Creates the specified test users if they are not already present.
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.core.security import get_password_hash
from app.config import settings
from app.schemas.user import UserRole

def check_and_create_test_users():
    """Check for existing users and create test users if they don't exist"""
    
    # Create database engine and session
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("Checking for existing users...")
    
    # Check if test users already exist
    user_email = "user@test.com"
    admin_email = "admin@test.com"
    
    existing_user = db.query(User).filter(User.email == user_email).first()
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    
    users_created = 0
    
    if existing_user:
        print(f"[OK] Regular user {user_email} already exists")
    else:
        # Create regular user
        from datetime import datetime
        regular_user = User(
            email=user_email,
            username="user",
            full_name="Regular User",
            hashed_password=get_password_hash("user123"),
            role=UserRole.USER,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(regular_user)
        print(f"[OK] Created regular user: {user_email} / user123")
        users_created += 1

    if existing_admin:
        print(f"[OK] Admin user {admin_email} already exists")
    else:
        # Create admin user
        from datetime import datetime
        admin_user = User(
            email=admin_email,
            username="admin",
            full_name="Admin User",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(admin_user)
        print(f"[OK] Created admin user: {admin_email} / admin123")
        users_created += 1

    if users_created > 0:
        db.commit()
        print(f"\n[SUCCESS] {users_created} user(s) created successfully!")
    else:
        print("\n[INFO] All test users already exist in the database.")

    # Show all users in the database
    print("\nAll users in database:")
    all_users = db.query(User).all()
    for user in all_users:
        print(f"  - ID: {user.id}, Email: {user.email}, Username: {user.username}, Role: {user.role}, Active: {user.is_active}")

    db.close()

if __name__ == "__main__":
    check_and_create_test_users()
    print("\n[INFO] You can now use these credentials to log in:")
    print("  Regular User: user@test.com / user123")
    print("  Admin User: admin@test.com / admin123")
    print("\nAfter logging in, the chat bot should connect properly to the WebSocket service.")