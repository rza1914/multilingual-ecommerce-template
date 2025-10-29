"""
Add missing fields to products table
This script adds stock, discount, rating, and multilingual fields
"""
from app.database import SessionLocal, engine
from sqlalchemy import text

def migrate_database():
    db = SessionLocal()
    
    print("\n" + "="*60)
    print("🔄 Database Migration - Adding Product Fields")
    print("="*60)
    
    try:
        # List of new columns to add
        migrations = [
            ("stock", "INTEGER DEFAULT 100"),
            ("discount", "REAL DEFAULT 0.0"),
            ("rating", "REAL DEFAULT 0.0"),
            ("title_en", "VARCHAR"),
            ("title_ar", "VARCHAR"),
            ("title_fa", "VARCHAR"),
            ("description_en", "TEXT"),
            ("description_ar", "TEXT"),
            ("description_fa", "TEXT"),
        ]
        
        for column_name, column_type in migrations:
            try:
                # Try to add column
                sql = f"ALTER TABLE products ADD COLUMN {column_name} {column_type}"
                db.execute(text(sql))
                db.commit()
                print(f"✅ Added column: {column_name}")
            except Exception as e:
                if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                    print(f"⏭️  Column '{column_name}' already exists, skipping...")
                    db.rollback()
                else:
                    print(f"❌ Error adding column '{column_name}': {e}")
                    db.rollback()
        
        # Update existing products with multilingual data
        print("\n🔄 Copying title and description to multilingual fields...")
        
        try:
            db.execute(text("""
                UPDATE products 
                SET title_en = title,
                    description_en = description
                WHERE title_en IS NULL
            """))
            db.commit()
            print("✅ Multilingual fields updated")
        except Exception as e:
            print(f"⚠️  Could not update multilingual fields: {e}")
            db.rollback()
        
        # Update stock for products that have 0 or NULL
        print("\n🔄 Fixing stock values...")
        try:
            db.execute(text("UPDATE products SET stock = 100 WHERE stock IS NULL OR stock = 0"))
            db.commit()
            print("✅ Stock values fixed")
        except Exception as e:
            print(f"⚠️  Could not fix stock: {e}")
            db.rollback()
        
        print("\n" + "="*60)
        print("✅ Migration completed successfully!")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate_database()
