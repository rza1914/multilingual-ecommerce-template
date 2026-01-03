#!/usr/bin/env python3
"""
Simple Database Seeding Script for SQLite
==========================================
Populates the database with sample data for testing the chatbot.

Usage:
    cd backend
    python seed_data_simple.py
"""

import sqlite3
import os
import sys
import random
from datetime import datetime


def get_database_path():
    """Get the path to the SQLite database file"""
    # Check common locations for the database
    possible_paths = [
        "app.db",
        "./app.db",
        "backend/app.db",
        "../app.db",
        "database.db",
        "./database.db"
    ]

    for path in possible_paths:
        if os.path.exists(path):
            return path

    # Default path if none found
    return "app.db"


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
        print(f"    + Adding column: {column} ({column_type}){default_clause}")
        cursor.execute(sql)
        return True
    else:
        print(f"    [OK] Column exists: {column}")
        return False


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
    print("Database Migration: Add Missing Columns")
    print("="*60)

    print("\nSearching for database file...")
    db_path = get_database_path()
    print(f"\nDatabase path: {db_path}")

    if not os.path.exists(db_path):
        print(f"ERROR: Database file not found: {db_path}")
        print("   Please ensure the database exists before running migration.")
        return False

    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Check if products table exists
        cursor.execute("""
            SELECT name FROM sqlite_master
            WHERE type='table' AND name='products'
        """)

        if not cursor.fetchone():
            print("\n❌ Products table does not exist!")
            print("   Please run the initial database setup first.")
            conn.close()
            return False

        # Show current schema
        show_table_schema(cursor, "products")

        # Run migration
        columns_added = migrate_products_table(cursor)

        # Commit changes
        conn.commit()

        # Show updated schema
        if columns_added > 0:
            print(f"\n✅ Successfully added {columns_added} column(s)")
            show_table_schema(cursor, "products")
        else:
            print("\n✅ All columns already exist - no migration needed")

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