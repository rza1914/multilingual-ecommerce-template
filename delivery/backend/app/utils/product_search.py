from typing import List, Dict, Any, Optional
import logging
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from sqlalchemy.exc import SQLAlchemyError
from ..models.product import Product
from ..models.order import Order, OrderItem
from datetime import datetime, timedelta


class ProductSearch:
    """
    Utility class for searching products and retrieving user context
    """
    
    def __init__(self, db: Session):
        """
        Initialize the product search utility
        
        Args:
            db: Database session
        """
        self.db = db
        self.logger = logging.getLogger(__name__)

    def search_products(self, query: str) -> List[Dict[str, Any]]:
        """
        Search for products based on a query string
        
        Args:
            query: Search query string
            
        Returns:
            List of product dictionaries
        """
        try:
            # Normalize the query string
            if not query or not query.strip():
                return []
                
            normalized_query = query.strip().lower()
            
            # Build the query with filters
            products_query = self.db.query(Product).filter(
                Product.is_active == True
            )
            
            # If query contains specific keywords, search by title/description
            if normalized_query:
                products_query = products_query.filter(
                    or_(
                        func.lower(Product.title).contains(normalized_query),
                        func.lower(Product.description).contains(normalized_query),
                        func.lower(Product.category).contains(normalized_query),
                        func.lower(Product.tags).contains(normalized_query),
                    )
                )
            
            # Limit to 10 relevant results
            products = products_query.limit(10).all()
            
            # Convert to dictionaries
            product_dicts = []
            for product in products:
                product_dicts.append({
                    "id": product.id,
                    "title": product.title,
                    "description": product.description,
                    "price": product.price,
                    "discount_price": product.discount_price,
                    "discount": product.discount,
                    "stock": product.stock,
                    "rating": product.rating,
                    "is_active": product.is_active,
                    "is_featured": product.is_featured,
                    "image_url": product.image_url,
                    "category": product.category,
                    "tags": product.tags,
                    "created_at": product.created_at.isoformat() if product.created_at else None,
                    "updated_at": product.updated_at.isoformat() if product.updated_at else None
                })
            
            return product_dicts
            
        except SQLAlchemyError as e:
            self.logger.error(f"Database error searching products: {str(e)}", exc_info=True)
            return []
        except Exception as e:
            self.logger.error(f"Unexpected error searching products: {str(e)}", exc_info=True)
            return []

    def get_user_orders(self, user_id: int) -> List[Dict[str, Any]]:
        """
        Get recent orders for a specific user
        
        Args:
            user_id: The ID of the user
            
        Returns:
            List of order dictionaries
        """
        try:
            if not user_id:
                return []
                
            # Get the 3 most recent orders for the user
            orders = self.db.query(Order).filter(
                Order.user_id == user_id
            ).order_by(Order.created_at.desc()).limit(3).all()
            
            order_dicts = []
            for order in orders:
                # Get items for each order
                order_items = self.db.query(OrderItem).filter(
                    OrderItem.order_id == order.id
                ).all()
                
                items_list = []
                for item in order_items:
                    product = self.db.query(Product).filter(
                        Product.id == item.product_id
                    ).first()
                    
                    items_list.append({
                        "product_id": item.product_id,
                        "quantity": item.quantity,
                        "price_at_time": item.price_at_time,
                        "product_title": product.title if product else "Unknown Product"
                    })
                
                order_dicts.append({
                    "id": order.id,
                    "user_id": order.user_id,
                    "full_name": order.full_name,
                    "email": order.email,
                    "phone": order.phone,
                    "address": order.address,
                    "city": order.city,
                    "state": order.state,
                    "zip_code": order.zip_code,
                    "country": order.country,
                    "shipping_method": order.shipping_method,
                    "payment_method": order.payment_method,
                    "subtotal": order.subtotal,
                    "shipping_cost": order.shipping_cost,
                    "tax": order.tax,
                    "discount": order.discount,
                    "total": order.total,
                    "status": order.status,
                    "created_at": order.created_at.isoformat() if order.created_at else None,
                    "updated_at": order.updated_at.isoformat() if order.updated_at else None,
                    "items": items_list
                })
            
            return order_dicts
            
        except SQLAlchemyError as e:
            self.logger.error(f"Database error getting user orders: {str(e)}", exc_info=True)
            return []
        except Exception as e:
            self.logger.error(f"Unexpected error getting user orders: {str(e)}", exc_info=True)
            return []

    def check_product_availability(self, product_id: int) -> Dict[str, Any]:
        """
        Check if a specific product is available in stock
        
        Args:
            product_id: The ID of the product to check
            
        Returns:
            Dictionary with availability information
        """
        try:
            if not product_id:
                return {
                    "available": False,
                    "message": "Invalid product ID",
                    "stock": 0
                }
                
            product = self.db.query(Product).filter(
                Product.id == product_id
            ).first()
            
            if not product:
                return {
                    "available": False,
                    "message": "Product not found",
                    "stock": 0
                }
            
            return {
                "available": product.stock > 0,
                "stock": product.stock,
                "message": "In stock" if product.stock > 0 else "Out of stock",
                "product_info": {
                    "id": product.id,
                    "title": product.title,
                    "description": product.description,
                    "price": product.price,
                    "stock": product.stock,
                    "category": product.category
                }
            }
            
        except SQLAlchemyError as e:
            self.logger.error(f"Database error checking product availability: {str(e)}", exc_info=True)
            return {
                "available": False,
                "message": "Error checking availability",
                "stock": 0
            }
        except Exception as e:
            self.logger.error(f"Unexpected error checking product availability: {str(e)}", exc_info=True)
            return {
                "available": False,
                "message": "Error checking availability",
                "stock": 0
            }

    def get_related_products(self, category: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Get products related to a specific category
        
        Args:
            category: Product category to find related products for
            limit: Maximum number of products to return
            
        Returns:
            List of related product dictionaries
        """
        try:
            if not category:
                return []
            
            products = self.db.query(Product).filter(
                Product.category == category,
                Product.is_active == True
            ).limit(limit).all()
            
            product_dicts = []
            for product in products:
                product_dicts.append({
                    "id": product.id,
                    "title": product.title,
                    "description": product.description,
                    "price": product.price,
                    "discount_price": product.discount_price,
                    "discount": product.discount,
                    "stock": product.stock,
                    "rating": product.rating,
                    "is_featured": product.is_featured,
                    "image_url": product.image_url,
                    "category": product.category
                })
            
            return product_dicts
            
        except SQLAlchemyError as e:
            self.logger.error(f"Database error getting related products: {str(e)}", exc_info=True)
            return []
        except Exception as e:
            self.logger.error(f"Unexpected error getting related products: {str(e)}", exc_info=True)
            return []