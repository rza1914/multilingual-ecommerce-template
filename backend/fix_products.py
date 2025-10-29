"""
Fix products stock and active status
"""
from app.database import SessionLocal
from app.models.product import Product

def fix_products():
    db = SessionLocal()
    try:
        print("\n" + "="*60)
        print("🔧 Fixing Products")
        print("="*60)
        
        products = db.query(Product).all()
        
        if not products:
            print("❌ No products found!")
            return
        
        fixed_count = 0
        
        for product in products:
            changes = []
            
            # Fix is_active
            if not product.is_active:
                product.is_active = True
                changes.append("activated")
            
            # Fix stock if it exists and is 0
            if hasattr(product, 'stock'):
                if product.stock == 0:
                    product.stock = 50  # Set default stock
                    changes.append(f"stock: 0 → 50")
                elif product.stock < 0:
                    product.stock = 50
                    changes.append(f"stock: {product.stock} → 50")
            else:
                # Add stock field if doesn't exist (this might not work depending on model)
                changes.append("no stock field")
            
            if changes:
                print(f"\n✏️  {product.title_en}")
                for change in changes:
                    print(f"   - {change}")
                fixed_count += 1
        
        db.commit()
        
        print("\n" + "="*60)
        print(f"✅ Fixed {fixed_count} products!")
        print("="*60)
        
        # Verify
        print("\n📊 Verification:")
        all_active = db.query(Product).filter(Product.is_active == True).count()
        total = db.query(Product).count()
        print(f"Active products: {all_active}/{total}")
        
        if hasattr(Product, 'stock'):
            in_stock = db.query(Product).filter(Product.stock > 0).count()
            print(f"In stock products: {in_stock}/{total}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_products()
