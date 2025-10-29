"""
Check products in database
"""
from app.database import SessionLocal
from app.models.product import Product

def check_products():
    db = SessionLocal()
    try:
        products = db.query(Product).all()
        print("\n" + "="*60)
        print("📦 Products in database:")
        print("="*60)
        
        if not products:
            print("❌ No products found in database!")
            return
        
        for product in products:
            print(f"\nID: {product.id}")
            print(f"Title: {product.title_en}")
            print(f"Price: ${product.price}")
            print(f"Stock: {getattr(product, 'stock', 'N/A')}")
            print(f"Active: {product.is_active}")
            print(f"Featured: {product.is_featured}")
            print(f"Discount: {getattr(product, 'discount', 0)}%")
            print("-" * 40)
        
        # محصولات با مشکل
        print("\n" + "="*60)
        print("⚠️  POTENTIAL ISSUES:")
        print("="*60)
        
        inactive_products = db.query(Product).filter(Product.is_active == False).all()
        if inactive_products:
            print(f"\n❌ Inactive products: {len(inactive_products)}")
            for product in inactive_products:
                print(f"   - {product.title_en}")
        else:
            print("\n✅ All products are active")
        
        # محصولات بدون موجودی
        out_of_stock = [p for p in products if getattr(p, 'stock', None) == 0]
        if out_of_stock:
            print(f"\n❌ Out of stock products: {len(out_of_stock)}")
            for product in out_of_stock:
                print(f"   - {product.title_en}")
        else:
            print("\n✅ All products have stock")
        
        # محصولات بدون فیلد stock
        no_stock_field = [p for p in products if not hasattr(p, 'stock')]
        if no_stock_field:
            print(f"\n⚠️  Products without stock field: {len(no_stock_field)}")
            for product in no_stock_field:
                print(f"   - {product.title_en}")
        
        print("\n" + "="*60)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_products()
