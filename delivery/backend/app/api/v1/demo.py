# app/api/v1/demo.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.product import Product
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/demo-reset")
def reset_demo_data(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Reset demo data - clears all products and creates new demo products
    Available only to admin users
    """
    # Only allow admin users to reset demo data
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403, 
            detail="Not authorized to reset demo data"
        )
    
    try:
        # Clear existing products
        db.query(Product).delete()
        
        # Create demo products with string categories
        demo_products = [
            Product(
                name="Wireless Headphones",
                description="High-quality wireless headphones with noise cancellation",
                price=129.99,
                category="Electronics",
                stock=50,
                image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                is_active=True
            ),
            Product(
                name="Smart Watch",
                description="Advanced smartwatch with health monitoring features",
                price=249.99,
                category="Electronics",
                stock=50,
                image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                is_active=True
            ),
            Product(
                name="Programming Book",
                description="Comprehensive guide to modern programming techniques",
                price=49.99,
                category="Books",
                stock=50,
                image_url="https://images.unsplash.com/photo-1532012197267-da84d127e765",
                is_active=True
            ),
            Product(
                name="Running Shoes",
                description="Comfortable running shoes for all terrains",
                price=89.99,
                category="Clothing",
                stock=50,
                image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff",
                is_active=True
            ),
            Product(
                name="Bluetooth Speaker",
                description="Portable speaker with excellent sound quality",
                price=79.99,
                category="Electronics",
                stock=50,
                image_url="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
                is_active=True
            ),
            Product(
                name="Coffee Maker",
                description="Automatic coffee maker with programmable settings",
                price=119.99,
                category="Home",
                stock=50,
                image_url="https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6",
                is_active=True
            ),
            Product(
                name="Backpack",
                description="Durable backpack for hiking and travel",
                price=59.99,
                category="Accessories",
                stock=50,
                image_url="https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
                is_active=True
            ),
            Product(
                name="Wireless Mouse",
                description="Ergonomic wireless mouse with long battery life",
                price=39.99,
                category="Electronics",
                stock=50,
                image_url="https://images.unsplash.com/photo-1527814050087-3793815479db",
                is_active=True
            ),
            Product(
                name="Yoga Mat",
                description="Non-slip yoga mat for all types of exercises",
                price=29.99,
                category="Sports",
                stock=50,
                image_url="https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",
                is_active=True
            ),
            Product(
                name="Sunglasses",
                description="UV protection sunglasses with polarized lenses",
                price=89.99,
                category="Accessories",
                stock=50,
                image_url="https://images.unsplash.com/photo-1572635196237-14b3f281503f",
                is_active=True
            )
        ]
        
        # Add all products
        for product in demo_products:
            db.add(product)
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"Successfully reset demo data with {len(demo_products)} products",
            "products_created": len(demo_products)
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Error resetting demo data: {str(e)}"
        )

@router.get("/demo-status")
def get_demo_status(db: Session = Depends(get_db)):
    """Get current demo database status"""
    product_count = db.query(Product).count()
    user_count = db.query(User).count()
    
    return {
        "status": "active",
        "products": product_count,
        "users": user_count,
        "categories_used": db.query(Product.category).distinct().all()
    }