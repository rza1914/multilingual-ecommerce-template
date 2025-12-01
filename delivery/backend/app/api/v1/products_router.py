from sqlalchemy.orm import Session
from app.crud.products import get_product_by_id, get_products_by_category
from app.schemas.product import ProductOut
from app.database import get_db

@router.get("/{product_id}/recommendations", response_model=List[ProductOut])
def get_recommendations(
    product_id: int, db: Session = Depends(get_db)
):
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    recs = get_products_by_category(db, category_id=product.category_id, limit=5, exclude_id=product_id)
    return recs