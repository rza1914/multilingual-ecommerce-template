#!/usr/bin/env python3
"""
Database Initialization Script

This script creates the database and all required tables from scratch.
Use this if the database doesn't exist or you want to reset it.

Usage:
    cd backend
    python init_db.py

WARNING: This will NOT delete existing data, only create missing tables.
"""

import sqlite3
import os
import sys
from datetime import datetime


def create_database():
    """Create the database and all required tables."""
    
    print("="*60)
    print("🗄️  Database Initialization")
    print("="*60)
    
    # Database file path
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app.db")
    print(f"\n📂 Database path: {db_path}")
    
    # Check if database already exists
    db_exists = os.path.exists(db_path)
    if db_exists:
        print("   ⚠ Database already exists. Will add missing tables only.")
    else:
        print("   📝 Creating new database...")
    
    # Connect to database (creates it if it doesn't exist)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create users table
    print("\n👤 Creating users table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            full_name TEXT,
            is_active BOOLEAN DEFAULT 1,
            is_superuser BOOLEAN DEFAULT 0,
            is_admin BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("   ✓ Users table ready")
    
    # Create products table
    print("\n📦 Creating products table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL DEFAULT 0,
            discount_price REAL,
            discount REAL DEFAULT 0,
            stock INTEGER DEFAULT 0,
            rating REAL DEFAULT 0,
            is_active BOOLEAN DEFAULT 1,
            is_featured BOOLEAN DEFAULT 0,
            image_url TEXT,
            category TEXT,
            tags TEXT,
            title_en TEXT,
            title_ar TEXT,
            title_fa TEXT,
            description_en TEXT,
            description_ar TEXT,
            description_fa TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            owner_id INTEGER
        )
    """)
    print("   ✓ Products table ready")
    
    # Create orders table
    print("\n🛒 Creating orders table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            status TEXT DEFAULT 'pending',
            total_amount REAL DEFAULT 0,
            shipping_address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    print("   ✓ Orders table ready")
    
    # Create order_items table
    print("\n📋 Creating order_items table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            price REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    """)
    print("   ✓ Order items table ready")
    
    # Create categories table
    print("\n📂 Creating categories table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            name_en TEXT,
            name_ar TEXT,
            name_fa TEXT,
            slug TEXT UNIQUE,
            parent_id INTEGER,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_id) REFERENCES categories (id)
        )
    """)
    print("   ✓ Categories table ready")
    
    # Create chat_messages table
    print("\n💬 Creating chat_messages table...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            user_id INTEGER,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    print("   ✓ Chat messages table ready")
    
    # Commit all changes
    conn.commit()
    
    # Show all tables
    print("\n📋 Database tables:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = cursor.fetchall()
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
        count = cursor.fetchone()[0]
        print(f"   • {table[0]} ({count} rows)")
    
    conn.close()
    
    print("\n" + "="*60)
    print("✅ Database initialization complete!")
    print("="*60)
    print(f"\n📂 Database created at: {db_path}")
    print("\n👉 You can now start the server:")
    print("   uvicorn app.main:app --reload")
    print()
    
    return True


if __name__ == "__main__":
    try:
        success = create_database()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)