"""
Migration Script: Add Missing Columns to Products Table

This script adds columns that exist in the SQLAlchemy model but are missing
from the actual SQLite database schema.

Usage:
    cd backend
    python run_migration.py
"""

import sqlite3
import os
import sys
from pathlib import Path


def find_database_file() -> str:
    """
    Search for the SQLite database file in common locations.
    Returns the path to the database file if found, otherwise returns default path.
    """
    # Get the directory where this script is located
    script_dir = Path(__file__).parent.parent.parent  # backend/

    # Common database file names and locations to check
    possible_paths = [
        # Relative to backend folder
        script_dir / "app.db",
        script_dir / "database.db",
        script_dir / "db.sqlite3",
        script_dir / "data" / "app.db",
        script_dir / "app" / "app.db",
        script_dir / "app" / "database.db",
        # Relative to current working directory
        Path("app.db"),
        Path("database.db"),
        Path("db.sqlite3"),
        Path("backend/app.db"),
        Path("backend/database.db"),
        # Check for .db files in backend folder
    ]

    # First, check explicit paths
    for path in possible_paths:
        if path.exists():
            print(f"  ✓ Found database at: {path.absolute()}")
            return str(path.absolute())

    # Search for any .db file in backend folder
    for db_file in script_dir.glob("*.db"):
        print(f"  ✓ Found database at: {db_file.absolute()}")
        return str(db_file.absolute())

    # Search for any .db file in backend/app folder
    app_dir = script_dir / "app"
    if app_dir.exists():
        for db_file in app_dir.glob("*.db"):
            print(f"  ✓ Found database at: {db_file.absolute()}")
            return str(db_file.absolute())

    # Search for any .sqlite3 file
    for db_file in script_dir.glob("*.sqlite3"):
        print(f"  ✓ Found database at: {db_file.absolute()}")
        return str(db_file.absolute())

    # Check environment variable
    db_url = os.environ.get("DATABASE_URL", "")
    if db_url.startswith("sqlite:///"):
        db_path = db_url.replace("sqlite:///", "")
        if os.path.exists(db_path):
            print(f"  ✓ Found database from DATABASE_URL: {db_path}")
            return db_path

    # Default path - will be created if not exists
    default_path = script_dir / "app.db"
    print(f"  ⚠ No existing database found. Will create at: {default_path}")
    return str(default_path)


def add_column_if_not_exists(
    cursor: sqlite3.Cursor,
    table: str,
    column: str,
    column_type: str,
    default=None
) -> bool:
    """
    Safely add a column to a table if it doesn't already exist.

    Args:
        cursor: SQLite cursor object
        table: Name of the table
        column: Name of the column to add
        column_type: SQLite data type (TEXT, INTEGER, REAL, BOOLEAN, etc.)
        default: Default value for the column

    Returns:
        bool: True if column was added, False if it already existed
    """
    # Get existing columns
    cursor.execute(f"PRAGMA table_info({table})")
    existing_columns = [row[1] for row in cursor.fetchall()]

    if column not in existing_columns:
        # Build the ALTER TABLE statement
        default_clause = ""
        if default is not None:
            if isinstance(default, str):
                default_clause = f" DEFAULT '{default}'"
            elif isinstance(default, bool):
                default_clause = f" DEFAULT {1 if default else 0}"
            else:
                default_clause = f" DEFAULT {default}"

        sql = f"ALTER TABLE {table} ADD COLUMN {column} {column_type}{default_clause}"
        print(f"    ➕ Adding column: {column} ({column_type}){default_clause}")
        cursor.execute(sql)
        return True
    else:
        print(f"    ✓ Column exists: {column}")
        return False


def create_products_table(cursor: sqlite3.Cursor) -> None:
    """
    Create the products table if it doesn't exist.
    """
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
    print("    ✓ Products table ready")


def create_users_table(cursor: sqlite3.Cursor) -> None:
    """
    Create the users table if it doesn't exist.
    """
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
    print("    ✓ Users table ready")


def migrate_products_table(cursor: sqlite3.Cursor) -> int:
    """
    Add all missing columns to the products table.

    Returns:
        int: Number of columns added
    """
    print("\n📦 Checking products table columns...")

    columns_added = 0

    # List of columns that should exist in the products table
    # Format: (column_name, column_type, default_value)
    required_columns = [
        ("is_active", "BOOLEAN", True),
        ("is_featured", "BOOLEAN", False),
        ("discount_price", "REAL", None),
        ("discount", "REAL", 0),
        ("stock", "INTEGER", 0),
        ("rating", "REAL", 0),
        ("image_url", "TEXT", None),
        ("category", "TEXT", None),
        ("tags", "TEXT", None),
        ("title_en", "TEXT", None),
        ("title_ar", "TEXT", None),
        ("title_fa", "TEXT", None),
        ("description_en", "TEXT", None),
        ("description_ar", "TEXT", None),
        ("description_fa", "TEXT", None),
        ("created_at", "TIMESTAMP", None),
        ("updated_at", "TIMESTAMP", None),
        ("owner_id", "INTEGER", None),
    ]

    for column_name, column_type, default_value in required_columns:
        if add_column_if_not_exists(cursor, "products", column_name, column_type, default_value):
            columns_added += 1

    return columns_added


def show_table_schema(cursor: sqlite3.Cursor, table: str) -> None:
    """
    Display the current schema of a table.
    """
    print(f"\n📋 Current schema for '{table}':")
    cursor.execute(f"PRAGMA table_info({table})")
    columns = cursor.fetchall()
    
    if not columns:
        print(f"    ⚠ Table '{table}' does not exist or has no columns")
        return
    
    print("    {:<20} {:<15} {:<10} {:<15}".format("Column", "Type", "NotNull", "Default"))
    print("    " + "-" * 60)
    
    for col in columns:
        # col format: (cid, name, type, notnull, dflt_value, pk)
        print("    {:<20} {:<15} {:<10} {:<15}".format(
            col[1],  # name
            col[2] or "N/A",  # type
            "Yes" if col[3] else "No",  # notnull
            str(col[4]) if col[4] else "NULL"  # default
        ))


def run_migration() -> bool:
    """
    Main migration function.

    Returns:
        bool: True if migration was successful, False otherwise
    """
    print("="*60)
    print("🚀 Database Migration: Add Missing Columns")
    print("="*60)

    print("\n🔍 Searching for database file...")
    db_path = find_database_file()

    try:
        # Connect to database (this will create it if it doesn't exist)
        print(f"\n📂 Connecting to database: {db_path}")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Check if products table exists
        cursor.execute("""
            SELECT name FROM sqlite_master
            WHERE type='table' AND name='products'
        """)

        if not cursor.fetchone():
            print("\n⚠ Products table does not exist. Creating...")
            create_products_table(cursor)
            create_users_table(cursor)
            conn.commit()
            print("\n✅ Tables created successfully!")
        else:
            # Show current schema before migration
            show_table_schema(cursor, "products")

            # Run migration
            columns_added = migrate_products_table(cursor)

            # Commit changes
            conn.commit()

            if columns_added > 0:
                print(f"\n✅ Successfully added {columns_added} column(s)")
            else:
                print("\n✅ All columns already exist - no migration needed")

        # Show final schema
        show_table_schema(cursor, "products")

        conn.close()
        print("\n" + "="*60)
        print("✅ Migration completed successfully!")
        print("="*60)
        return True

    except sqlite3.Error as e:
        print(f"\n❌ SQLite Error: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected Error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = run_migration()
    sys.exit(0 if success else 1)