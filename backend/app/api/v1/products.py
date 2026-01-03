"""
Products API Endpoints

This module provides REST API endpoints for product management including:
- List all products with filtering and pagination
- Get single product by ID
- Create, update, and delete products (admin only)
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.core.auth import get_current_user, get_current_admin_user
from app.models.user import User

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["products"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[ProductResponse])
def read_products(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    category: Optional[str] = Query(None, description="Filter by category"),
    featured: Optional[bool] = Query(None, description="Filter by featured status"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    db: Session = Depends(get_db)
):
    """
    Retrieve a list of products with optional filtering.
    
    - **skip**: Number of records to skip for pagination
    - **limit**: Maximum number of records to return
    - **category**: Filter products by category
    - **featured**: Filter by featured status (true/false)
    - **min_price**: Minimum price filter
    - **max_price**: Maximum price filter
    - **search**: Search term for title/description
    """
    try:
        # Start with base query
        query = db.query(Product)
        
        # Try to filter by is_active, but handle case where column doesn't exist
        try:
            query = query.filter(Product.is_active == True)
        except SQLAlchemyError as e:
            # Column might not exist in database, log and continue without filter
            logger.warning(f"Could not filter by is_active: {e}")
            # Continue without is_active filter
            query = db.query(Product)
        
        # Apply optional filters
        if category:
            query = query.filter(Product.category == category)
        
        if featured is not None:
            try:
                query = query.filter(Product.is_featured == featured)
            except SQLAlchemyError:
                logger.warning("Could not filter by is_featured")
        else:
            # If featured is not specified, try to filter by is_featured if column exists
            try:
                query = query.filter(Product.is_featured == False)
            except SQLAlchemyError:
                # Column doesn't exist, skip filter
                pass

        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (Product.title.ilike(search_term)) |
                (Product.description.ilike(search_term))
            )
        
        # Execute query with pagination
        products = query.offset(skip).limit(limit).all()
        return products
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in read_products: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while fetching products. Please run database migration."
        )


@router.get("/{product_id}", response_model=ProductResponse)
def read_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a single product by ID.
    
    - **product_id**: The unique identifier of the product
    """
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {product_id} not found"
            )
        
        # Check if product is active (if column exists)
        try:
            if hasattr(product, 'is_active') and not product.is_active:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product with id {product_id} not found"
                )
        except AttributeError:
            pass  # Column doesn't exist, skip check
        
        return product
        
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Database error in read_product: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while fetching product"
        )


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a new product. Requires admin privileges.
    
    - **product**: Product data to create
    """
    try:
        db_product = Product(**product.model_dump())
        db_product.owner_id = current_user.id
        
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        
        logger.info(f"Product created: {db_product.id} by user {current_user.id}")
        return db_product
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in create_product: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while creating product"
        )


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update an existing product. Requires admin privileges.
    
    - **product_id**: The unique identifier of the product to update
    - **product**: Updated product data
    """
    try:
        db_product = db.query(Product).filter(Product.id == product_id).first()
        
        if db_product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {product_id} not found"
            )
        
        # Update only provided fields
        update_data = product.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)
        
        db.commit()
        db.refresh(db_product)
        
        logger.info(f"Product updated: {product_id} by user {current_user.id}")
        return db_product
        
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in update_product: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while updating product"
        )


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Delete a product. Requires admin privileges.
    
    - **product_id**: The unique identifier of the product to delete
    """
    try:
        db_product = db.query(Product).filter(Product.id == product_id).first()
        
        if db_product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {product_id} not found"
            )
        
        db.delete(db_product)
        db.commit()
        
        logger.info(f"Product deleted: {product_id} by user {current_user.id}")
        return None
        
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error in delete_product: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while deleting product"
        )


@router.get("/categories/list", response_model=List[str])
def get_categories(
    db: Session = Depends(get_db)
):
    """
    Get a list of all unique product categories.
    """
    try:
        categories = db.query(Product.category).distinct().filter(
            Product.category.isnot(None)
        ).all()
        
        return [cat[0] for cat in categories if cat[0]]
        
    except SQLAlchemyError as e:
        logger.error(f"Database error in get_categories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while fetching categories"
        )