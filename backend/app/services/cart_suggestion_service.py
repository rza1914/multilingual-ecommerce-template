from typing import Dict, List, Any, Optional
import logging
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from decimal import Decimal
from groq import AsyncGroq
from ..models.product import Product as ProductModel
from ..models.order import Order, OrderItem


class CartSuggestionService:
    """
    Service for providing smart cart suggestions
    """
    
    def __init__(self, db: Session, user_id: Optional[int] = None):
        self.db = db
        self.user_id = user_id
        self.logger = logging.getLogger(__name__)
        # Using the Groq API key from configuration
        self.client = AsyncGroq(api_key="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")
    
    def get_suggestions(self, cart_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Get smart suggestions based on cart contents
        
        Args:
            cart_items: List of items in the cart (with id, quantity, etc.)
            
        Returns:
            Dictionary containing different types of suggestions
        """
        try:
            # Extract product IDs from cart
            cart_product_ids = [item['product_id'] for item in cart_items]
            
            # Get the products in the cart
            cart_products = self.db.query(ProductModel).filter(
                ProductModel.id.in_(cart_product_ids)
            ).all()
            
            if not cart_products:
                return {
                    "cross_sell": [],
                    "bundle": None,
                    "up_sell": [],
                    "reasoning": "سبد خرید شما خالی است."
                }
            
            # Build context for AI
            cart_context = {
                "cart_products": [self._product_to_dict(product) for product in cart_products],
                "total_price": sum(p.price * next((item['quantity'] for item in cart_items if item['product_id'] == p.id), 1) for p in cart_products),
                "user_history": self._get_user_purchase_history() if self.user_id else [],
                "available_products": self._get_available_products()
            }
            
            # Get different types of suggestions
            cross_sell = self._get_cross_sell_suggestions(cart_products, 5)
            bundle = self._get_bundle_suggestions(cart_products)
            up_sell = self._get_up_sell_suggestions(cart_products, 3)
            
            # Score and rank the suggestions
            scored_cross_sell = self._score_suggestions(cross_sell, cart_context)
            scored_up_sell = self._score_suggestions(up_sell, cart_context)
            
            # Generate AI reasoning
            reasoning = self._generate_ai_reasoning(cart_context)
            
            return {
                "cross_sell": scored_cross_sell,
                "bundle": bundle,
                "up_sell": scored_up_sell,
                "reasoning": reasoning
            }
            
        except Exception as e:
            self.logger.error(f"Error getting cart suggestions: {str(e)}", exc_info=True)
            return {
                "cross_sell": [],
                "bundle": None,
                "up_sell": [],
                "reasoning": "خطا در دریافت پیشنهادات. لطفاً بعداً دوباره امتحان کنید."
            }
    
    def _get_cross_sell_suggestions(self, cart_products: List[ProductModel], limit: int = 5) -> List[ProductModel]:
        """
        Get cross-sell suggestions based on products in cart
        """
        try:
            # Find products that are commonly bought with items in the cart
            # For now, we'll look for category-based suggestions
            cart_categories = [p.category for p in cart_products if p.category]
            
            # Define common accessories/complementary items for different categories
            accessory_mappings = {
                'mobile': ['screen protector', 'case', 'charger', 'cable', 'wireless charger', 'headphone'],
                'laptop': ['bag', 'mouse', 'keyboard', 'charger', 'cable', 'usb hub', 'laptop stand'],
                'watch': ['watch band', 'charger', 'screen protector'],
                'tablet': ['case', 'screen protector', 'charger', 'pencil'],
                'headphone': ['case', 'adapter', 'cable'],
                'tv': ['mount', 'soundbar', 'cable', 'remote', 'streaming device'],
            }
            
            candidate_categories = set()
            for category in cart_categories:
                if category in accessory_mappings:
                    candidate_categories.update(accessory_mappings[category])
            
            # Find products in these categories that aren't already in the cart
            product_ids = [p.id for p in cart_products]
            
            suggestions = self.db.query(ProductModel).filter(
                and_(
                    ProductModel.id.notin_(product_ids),
                    ProductModel.is_active == True,
                    func.lower(ProductModel.category).in_([cat.lower() for cat in candidate_categories])
                )
            ).order_by(desc(ProductModel.rating)).limit(limit).all()
            
            # If we don't find enough from mappings, get related products by category
            if len(suggestions) < limit:
                additional = self.db.query(ProductModel).filter(
                    and_(
                        ProductModel.id.notin_(product_ids),
                        ProductModel.category.in_(cart_categories),
                        ProductModel.is_active == True
                    )
                ).order_by(desc(ProductModel.rating)).limit(limit - len(suggestions)).all()
                
                suggestions.extend(additional)
            
            return suggestions[:limit]
        except Exception as e:
            self.logger.error(f"Error getting cross-sell suggestions: {str(e)}", exc_info=True)
            return []
    
    def _get_bundle_suggestions(self, cart_products: List[ProductModel]) -> Optional[Dict[str, Any]]:
        """
        Get bundle suggestions that offer discounts
        """
        try:
            # Define common product bundles
            bundle_products = {
                'mobile': ['screen protector', 'case', 'wireless charger'],
                'laptop': ['bag', 'mouse', 'usb hub'],
                'headphone': ['case', 'adapter', 'cable'],
            }
            
            # Find if cart contains items that could form a bundle
            cart_categories = [p.category for p in cart_products if p.category]
            
            for category, bundle_items in bundle_products.items():
                # Check if cart has the main product for this bundle
                main_products = [p for p in cart_products if p.category == category]
                if not main_products:
                    continue
                
                # Find bundle items not already in cart
                cart_product_ids = [p.id for p in cart_products]
                
                bundle_candidates = []
                for item_category in bundle_items:
                    category_products = self.db.query(ProductModel).filter(
                        and_(
                            func.lower(ProductModel.category).contains(item_category.lower()),
                            ProductModel.id.notin_(cart_product_ids),
                            ProductModel.is_active == True
                        )
                    ).order_by(desc(ProductModel.rating)).limit(2).all()
                    
                    bundle_candidates.extend(category_products)
                
                if bundle_candidates:
                    # Calculate bundle savings
                    original_price = sum(p.price for p in cart_products) + sum(p.price for p in bundle_candidates)
                    discounted_price = original_price * 0.8  # 20% discount
                    savings = original_price - discounted_price
                    
                    return {
                        "items": [self._product_to_dict(p) for p in (cart_products + bundle_candidates)],
                        "original_price": original_price,
                        "discounted_price": discounted_price,
                        "savings": savings,
                        "discount_percent": 20,
                        "description": f"باندل {category} و لوازم جانبی با {savings:,} تومان صرفه‌جویی!"
                    }
            
            return None
        except Exception as e:
            self.logger.error(f"Error getting bundle suggestions: {str(e)}", exc_info=True)
            return None
    
    def _get_up_sell_suggestions(self, cart_products: List[ProductModel], limit: int = 3) -> List[ProductModel]:
        """
        Get up-sell suggestions (better alternatives)
        """
        try:
            # Find better products in the same categories
            up_sell_products = []
            
            for product in cart_products:
                # Find products in the same category with better specs or higher price
                query = self.db.query(ProductModel).filter(
                    and_(
                        ProductModel.category == product.category,
                        ProductModel.id != product.id,
                        ProductModel.is_active == True,
                        ProductModel.price > product.price
                    )
                ).order_by(ProductModel.price.asc()).limit(2)
                
                up_sell_products.extend(query.all())
            
            # Limit the results
            return up_sell_products[:limit]
        except Exception as e:
            self.logger.error(f"Error getting up-sell suggestions: {str(e)}", exc_info=True)
            return []
    
    def _get_user_purchase_history(self) -> List[Dict[str, Any]]:
        """
        Get the user's purchase history
        """
        try:
            if not self.user_id:
                return []
            
            # Get user's recent orders and items
            orders = self.db.query(OrderItem).join(Order).filter(
                Order.user_id == self.user_id
            ).order_by(desc(Order.created_at)).limit(10).all()
            
            history = []
            for order_item in orders:
                product = self.db.query(ProductModel).filter(
                    ProductModel.id == order_item.product_id
                ).first()
                if product:
                    history.append({
                        "product_id": product.id,
                        "title": product.title,
                        "category": product.category,
                        "price": product.price
                    })
            
            return history
        except Exception as e:
            self.logger.error(f"Error getting user history: {str(e)}", exc_info=True)
            return []
    
    def _get_available_products(self) -> List[Dict[str, Any]]:
        """
        Get a sample of available products for context
        """
        try:
            products = self.db.query(ProductModel).filter(
                ProductModel.is_active == True
            ).limit(20).all()
            
            result = []
            for product in products:
                result.append({
                    "id": product.id,
                    "title": product.title,
                    "category": product.category,
                    "price": product.price,
                    "rating": product.rating,
                    "stock": product.stock
                })
            
            return result
        except Exception as e:
            self.logger.error(f"Error getting available products: {str(e)}", exc_info=True)
            return []
    
    def _score_suggestions(self, products: List[ProductModel], context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Score and rank suggestion products
        """
        scored_products = []
        
        for product in products:
            # Calculate score based on relevance to cart
            score = 0.0
            
            # Check if product is complementary to items in cart
            cart_products = context.get("cart_products", [])
            for cart_product in cart_products:
                # If product is in the same category as cart product, give lower score
                if product.category == cart_product['category']:
                    score += 0.3
                # If product is a known complement to cart product
                elif self._is_complementary(product, cart_product):
                    score += 0.8
            
            # Check user history
            user_history = context.get("user_history", [])
            for history_item in user_history:
                if product.category == history_item.get('category'):
                    score += 0.2
            
            scored_products.append({
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
                "score": score,
                "reason": self._generate_reason_for_suggestion(product, context)
            })
        
        # Sort by score in descending order
        scored_products.sort(key=lambda x: x["score"], reverse=True)
        
        return scored_products
    
    def _is_complementary(self, product: ProductModel, cart_product: Dict[str, Any]) -> bool:
        """
        Check if a product is complementary to a cart product
        """
        # Define common complementary relationships
        complementary_pairs = {
            'mobile': ['screen protector', 'case', 'charger', 'cable', 'wireless charger'],
            'laptop': ['bag', 'mouse', 'keyboard', 'charger', 'cable', 'usb hub'],
            'watch': ['watch band', 'charger'],
            'tablet': ['case', 'screen protector', 'charger', 'pencil'],
            'headphone': ['case', 'adapter', 'cable'],
        }
        
        cart_category = cart_product.get('category', '').lower()
        product_category = product.category.lower() if product.category else ''
        
        if cart_category in complementary_pairs:
            return product_category in complementary_pairs[cart_category]
        
        return False
    
    def _generate_reason_for_suggestion(self, product: ProductModel, context: Dict[str, Any]) -> str:
        """
        Generate a reason for why this product is suggested
        """
        cart_products = context.get("cart_products", [])
        
        # Check if this is a complement to items in the cart
        for cart_product in cart_products:
            if self._is_complementary(product, cart_product):
                return f"همراه {cart_product['title']} معمولاً خریداری می‌شود"
        
        # Otherwise, provide a general reason
        if cart_products:
            return f"محصولی مکمل برای {cart_products[0]['title']}"
        
        return "محصولی پیشنهادی برای شما"
    
    def _generate_ai_reasoning(self, context: Dict[str, Any]) -> str:
        """
        Generate an explanation for the suggestions using AI
        """
        try:
            cart_products = context["cart_products"]
            if not cart_products:
                return "سبد خرید شما خالی است. محصولات بیشتری را برای شما پیشنهاد می‌دهیم."
            
            # Build a context message for the AI
            cart_titles = [p["title"] for p in cart_products if "title" in p]
            
            # For now, returning a rule-based explanation
            if len(cart_titles) == 1:
                return f"چون شما {cart_titles[0]} را انتخاب کرده‌اید، محصولات تکمیلی و مکمل برای شما آماده کرده‌ایم."
            else:
                return f"چون شما {', '.join(cart_titles[:3])}{' و بیشتر' if len(cart_titles) > 3 else ''} را انتخاب کرده‌اید، محصولات تکمیلی و باندل‌های ویژه را برای شما پیشنهاد می‌دهیم."
                
        except Exception as e:
            self.logger.error(f"Error generating AI reasoning: {str(e)}", exc_info=True)
            return "محصولات تکمیلی و پیشنهادهای ویژه برای شما آماده شده‌اند."
    
    def _product_to_dict(self, product: ProductModel) -> Dict[str, Any]:
        """
        Convert a ProductModel to a dictionary
        """
        return {
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
        }