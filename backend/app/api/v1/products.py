from typing import Any, List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_

from ...core.auth import get_current_active_user, get_current_admin_user
from ...database import get_db
from ...models.user import User
from ...models.product import Product as ProductModel
from ...schemas.product import Product, ProductCreate, ProductUpdate
from ...services.recommendation_service import RecommendationService

router = APIRouter()

@router.get("/", response_model=List[Product])
def read_products(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(True),
    is_featured: Optional[bool] = Query(None)
) -> Any:
    query = db.query(ProductModel)

    if category:
        query = query.filter(ProductModel.category == category)

    if search:
        query = query.filter(ProductModel.title.contains(search))

    if is_active is not None:
        query = query.filter(ProductModel.is_active == is_active)

    if is_featured is not None:
        query = query.filter(ProductModel.is_featured == is_featured)

    products = query.offset(skip).limit(limit).all()
    return products

@router.post("/", response_model=Product)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    db_product = ProductModel(
        **product.dict(),
        owner_id=current_user.id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/{product_id}", response_model=Product)
def read_product(
    product_id: int,
    db: Session = Depends(get_db)
) -> Any:
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )
    return product

@router.get("/{product_id}/recommendations",
            summary="Get smart product recommendations",
            description="Get related, accessory, upsell, and downsell product recommendations for a specific product")
async def get_product_recommendations(
    product_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get product recommendations based on the current product and user preferences.
    
    The endpoint:
    1. Takes the current product ID
    2. Uses the authenticated user's history (if available)
    3. Applies recommendation algorithms
    4. Returns different types of recommendations with explanations
    """
    try:
        # Initialize the recommendation service
        recommendation_service = RecommendationService(db, current_user.id)
        
        # Get recommendations
        recommendations = recommendation_service.get_recommendations(product_id)
        
        return recommendations
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error
        print(f"Error processing recommendations: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing recommendations"
        )


@router.post("/search-by-image",
             summary="Search products by image",
             description="Upload an image to find similar products in the store")
async def search_products_by_image(
    image_data: Dict[str, str],
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Search for products using an image.
    
    The endpoint:
    1. Takes a base64 encoded image
    2. Analyzes the image with AI Vision
    3. Extracts product attributes
    4. Finds similar products in the database
    5. Returns results with similarity scores
    """
    from ...services.image_search_service import ImageSearchService
    
    try:
        # Validate required fields
        if "image" not in image_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing image data"
            )
        
        # Initialize the image search service
        image_search_service = ImageSearchService(db)
        
        # Perform the image search
        results = await image_search_service.search_by_image(image_data["image"])
        
        return results
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error
        print(f"Error in image search: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the image search"
        )


@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    update_data = product_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}", response_model=Product)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()
    return product