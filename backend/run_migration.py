#!/usr/bin/env python3
"""
Database Migration Runner

Run this script to apply database migrations that fix schema mismatches.

Usage:
    cd backend
    python run_migration.py
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.migrations.add_missing_columns import run_migration


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🔧 Starting Database Migration")
    print("="*60)
    
    success = run_migration()
    
    if success:
        print("\n" + "="*60)
        print("✅ Migration completed successfully!")
        print("="*60)
        print("\n👉 You can now start the server:")
        print("   cd backend")
        print("   uvicorn app.main:app --reload")
        print()
    else:
        print("\n" + "="*60)
        print("❌ Migration failed!")
        print("="*60)
        print("\n📋 Troubleshooting steps:")
        print("   1. Make sure you're in the backend directory")
        print("   2. Check if the database file exists")
        print("   3. Check file permissions on the database file")
        print("   4. Ensure no other process is using the database")
        print()
    
    sys.exit(0 if success else 1)