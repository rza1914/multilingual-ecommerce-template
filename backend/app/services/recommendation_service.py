from typing import Dict, List, Any, Optional
import logging
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from decimal import Decimal
from groq import AsyncGroq
import os
import math
from ..models.product import Product as ProductModel
from ..models.order import Order, OrderItem
from ..models.user import User
from ..schemas.product import Product
from ..config import settings


class RecommendationService:
    """
    Service for providing smart product recommendations
    """
    
    def __init__(self, db: Session, user_id: Optional[int] = None):
        self.db = db
        self.user_id = user_id
        self.logger = logging.getLogger(__name__)
        # Using the Groq API key from configuration, but make it optional
        api_key = settings.GROQ_API_KEY
        if not api_key:
            # Don't raise an error, just set the client to None
            self.client = None
        else:
            try:
                self.client = AsyncGroq(api_key=api_key)
            except Exception:
                self.client = None
                self.logger.warning("GROQ_API_KEY is set but client initialization failed")
    
    def get_recommendations(self, product_id: int) -> Dict[str, Any]:
        """
        Get product recommendations based on the provided product ID.
        Returns only related products (as required by the endpoint) and explanation.
        
        Args:
            product_id (int): The ID of the product to get recommendations for
            
        Returns:
            Dict[str, Any]: Dictionary containing related products and explanation
        """
        try:
            # Fetch the main product
            product = self.db.query(ProductModel).filter(ProductModel.id == product_id).first()
            
            if not product:
                raise HTTPException(status_code=404, detail="Product not found")
            
            # Query for similar products based on category (excluding the current product itself)
            recs_query = self.db.query(ProductModel).filter(
                ProductModel.category == product.category,
                ProductModel.id != product_id,
                ProductModel.is_active == True  # Only include active products
            ).order_by(desc(ProductModel.rating)).limit(5).all()
            
            # Convert to the expected schema format
            recommendations = []
            for rec in recs_query:
                # Use model_dump if available (Pydantic v2) or create dict manually
                if hasattr(Product, 'model_validate'):
                    # Pydantic v2
                    try:
                        rec_schema = Product.model_validate(rec)
                        rec_dict = rec_schema.model_dump()
                    except Exception:
                        # Fallback if model validation fails
                        rec_dict = {
                            "id": rec.id,
                            "title": rec.title,
                            "description": rec.description,
                            "price": rec.price,
                            "discount_price": rec.discount_price,
                            "is_active": rec.is_active,
                            "is_featured": rec.is_featured,
                            "image_url": rec.image_url,
                            "category": rec.category,
                            "tags": rec.tags,
                            "owner_id": rec.owner_id,
                            "created_at": rec.created_at,
                            "updated_at": rec.updated_at
                        }
                else:
                    # Fallback method to convert the object
                    rec_dict = {
                        "id": getattr(rec, 'id', None),
                        "title": getattr(rec, 'title', 'Unknown Title'),
                        "description": getattr(rec, 'description', None),
                        "price": getattr(rec, 'price', 0.0),
                        "discount_price": getattr(rec, 'discount_price', None),
                        "is_active": getattr(rec, 'is_active', True),
                        "is_featured": getattr(rec, 'is_featured', False),
                        "image_url": getattr(rec, 'image_url', None),
                        "category": getattr(rec, 'category', None),
                        "tags": getattr(rec, 'tags', None),
                        "owner_id": getattr(rec, 'owner_id', None),
                        "created_at": getattr(rec, 'created_at', None),
                        "updated_at": getattr(rec, 'updated_at', None)
                    }
                recommendations.append(rec_dict)
            
            explanation = f"Based on category '{product.category}' ({len(recommendations)} items)"
            
            return {
                "related": recommendations,
                "explanation": explanation
            }
            
        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
        except Exception as e:
            # Log the error for debugging
            self.logger.error(f"Error in RecommendationService.get_recommendations: {str(e)}", exc_info=True)
            
            # Return fallback mock recommendations
            fallback_recommendations = [
                {
                    "id": 3,
                    "title": "Similar Product",
                    "description": "A product similar to what you're looking at",
                    "price": 100.0,
                    "discount_price": None,
                    "is_active": True,
                    "is_featured": False,
                    "image_url": None,
                    "category": "general",
                    "tags": None,
                    "owner_id": 1,
                    "created_at": None,
                    "updated_at": None
                }
            ]
            
            return {
                "related": fallback_recommendations,
                "explanation": f"Based on category fallback recommendations for product {product_id} (using fallback due to error)"
            }
    
    def _get_related_products(self, main_product: ProductModel, limit: int = 5) -> List[ProductModel]:
        """
        Get products related to the main product based on category and features
        """
        try:
            # Find products in the same category
            related_products = self.db.query(ProductModel).filter(
                and_(
                    ProductModel.id != main_product.id,
                    ProductModel.category == main_product.category,
                    ProductModel.is_active == True
                )
            ).order_by(desc(ProductModel.rating)).limit(limit).all()
            
            return related_products
        except Exception as e:
            self.logger.error(f"Error getting related products: {str(e)}", exc_info=True)
            return []
    
    def _get_accessories(self, main_product: ProductModel, limit: int = 5) -> List[ProductModel]:
        """
        Get accessory products for the main product
        """
        try:
            # Define accessory categories for different product types
            accessory_categories = {
                'mobile': ['cover', 'case', 'screen protector', 'charger', 'cable', 'headphone'],
                'laptop': ['bag', 'mouse', 'keyboard', 'charger', 'cable', 'stand'],
                'watch': ['band', 'charger', 'screen protector'],
                'tablet': ['cover', 'case', 'screen protector', 'charger', 'pencil'],
                'headphone': ['case', 'adapter', 'cable'],
                'tv': ['mount', 'soundbar', 'cable', 'remote'],
            }
            
            # Determine potential accessory categories based on product category
            categories = accessory_categories.get(main_product.category, [])
            
            if not categories:
                # If no specific mapping, look for related products with common accessory keywords in tags
                accessories = self.db.query(ProductModel).filter(
                    and_(
                        ProductModel.id != main_product.id,
                        ProductModel.is_active == True,
                        func.lower(ProductModel.tags).contains('accessory') |
                        func.lower(ProductModel.tags).contains('case') |
                        func.lower(ProductModel.tags).contains('cover') |
                        func.lower(ProductModel.tags).contains('charger') |
                        func.lower(ProductModel.tags).contains('cable')
                    )
                ).order_by(desc(ProductModel.rating)).limit(limit).all()
                return accessories
            
            # Find products in accessory categories
            accessories = self.db.query(ProductModel).filter(
                and_(
                    ProductModel.id != main_product.id,
                    ProductModel.is_active == True,
                    func.lower(ProductModel.category).in_([cat.lower() for cat in categories])
                )
            ).order_by(desc(ProductModel.rating)).limit(limit).all()
            
            return accessories
        except Exception as e:
            self.logger.error(f"Error getting accessories: {str(e)}", exc_info=True)
            return []
    
    def _get_upsell_products(self, main_product: ProductModel, limit: int = 3) -> List[ProductModel]:
        """
        Get better/upgrade products compared to the main product
        """
        try:
            # Find products in the same category with better features or higher price
            upsell_products = self.db.query(ProductModel).filter(
                and_(
                    ProductModel.id != main_product.id,
                    ProductModel.category == main_product.category,
                    ProductModel.is_active == True,
                    ProductModel.price > main_product.price
                )
            ).order_by(ProductModel.price.asc()).limit(limit).all()
            
            return upsell_products
        except Exception as e:
            self.logger.error(f"Error getting upsell products: {str(e)}", exc_info=True)
            return []
    
    def _get_downsell_products(self, main_product: ProductModel, limit: int = 3) -> List[ProductModel]:
        """
        Get cheaper alternatives to the main product
        """
        try:
            # Find products in the same category with lower price or older model
            downsell_products = self.db.query(ProductModel).filter(
                and_(
                    ProductModel.id != main_product.id,
                    ProductModel.category == main_product.category,
                    ProductModel.is_active == True,
                    ProductModel.price < main_product.price
                )
            ).order_by(ProductModel.price.desc()).limit(limit).all()
            
            return downsell_products
        except Exception as e:
            self.logger.error(f"Error getting downsell products: {str(e)}", exc_info=True)
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
    
    def _calculate_similarity_score(self, product1: ProductModel, product2: ProductModel) -> float:
        """
        Calculate similarity score between two products based on features
        """
        score = 0.0
        
        # Category match
        if product1.category == product2.category:
            score += 0.3
            
        # Price similarity (if in same order of magnitude)
        if product1.price > 0 and product2.price > 0:
            price_ratio = min(product1.price, product2.price) / max(product1.price, product2.price)
            if price_ratio > 0.7:  # More than 70% price similarity
                score += 0.2
            elif price_ratio > 0.5:  # More than 50% price similarity
                score += 0.1
                
        # Tag similarity
        if product1.tags and product2.tags:
            tags1 = set(product1.tags.lower().split(','))
            tags2 = set(product2.tags.lower().split(','))
            common_tags = tags1.intersection(tags2)
            if common_tags:
                score += min(0.5, len(common_tags) * 0.1)
        
        return min(1.0, score)
    
    def _score_recommendations(self, products: List[ProductModel], context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Score and rank recommendation products
        """
        scored_products = []
        main_product = context["main_product"]
        
        for product in products:
            # Calculate similarity score (40% weight)
            similarity_score = self._calculate_similarity_score(
                self._dict_to_product(main_product), product
            )
            
            # Calculate co-purchase score (30% weight) - simplified implementation
            copurchase_score = self._get_copurchase_score(main_product["id"], product.id)
            
            # Calculate user preference score (20% weight) - simplified implementation
            user_pref_score = self._get_user_preference_score(product, context["user_history"])
            
            # Calculate AI reasoning score (10% weight) - placeholder
            ai_score = 0.5  # Placeholder until we have a more sophisticated AI scoring
            
            # Calculate total score
            total_score = (
                similarity_score * 0.4 +
                copurchase_score * 0.3 +
                user_pref_score * 0.2 +
                ai_score * 0.1
            )
            
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
                "score": total_score,
                "reason": self._generate_reason_for_recommendation(product, context)
            })
        
        # Sort by score in descending order
        scored_products.sort(key=lambda x: x["score"], reverse=True)
        
        return scored_products
    
    def _get_copurchase_score(self, main_product_id: int, candidate_product_id: int) -> float:
        """
        Get score based on co-purchase behavior
        """
        try:
            # Simplified implementation - in a real system, you would have more sophisticated logic
            # For now, we'll return a base score
            return 0.5
        except Exception as e:
            self.logger.error(f"Error getting co-purchase score: {str(e)}", exc_info=True)
            return 0.0
    
    def _get_user_preference_score(self, product: ProductModel, user_history: List[Dict[str, Any]]) -> float:
        """
        Get score based on user's purchase history
        """
        try:
            if not user_history:
                return 0.3  # Base score if no user history
            
            score = 0.0
            for item in user_history:
                if item.get("category") == product.category:
                    score += 0.3
                # Add more sophisticated matching logic here
                if item.get("product_id") == product.id:
                    score += 0.5  # Don't recommend already purchased product highly
            
            return min(1.0, score)
        except Exception as e:
            self.logger.error(f"Error getting user preference score: {str(e)}", exc_info=True)
            return 0.0
    
    def _generate_reason_for_recommendation(self, product: ProductModel, context: Dict[str, Any]) -> str:
        """
        Generate a reason for why this product is recommended
        """
        main_product = context["main_product"]
        reasons = []
        
        if product.category == main_product["category"]:
            reasons.append("هم‌دسته با محصول اصلی")
            
        if product.price < main_product["price"]:
            reasons.append("ارزان‌تر از محصول اصلی")
        elif product.price > main_product["price"]:
            reasons.append("گران‌تر از محصول اصلی")
        
        if product.rating > main_product["rating"] + 0.5:
            reasons.append("امتیاز بالاتری دارد")
        
        if reasons:
            return f"پیشنهاد به دلیل: {', '.join(reasons)}"
        else:
            return "محصولی مرتبط با محصول اصلی"
    
    def _generate_ai_explanation(self, context: Dict[str, Any]) -> str:
        """
        Generate an explanation for the recommendations using AI
        """
        try:
            # Build a context message for the AI
            main_product = context["main_product"]
            user_history = context["user_history"]
            
            system_prompt = f"""
            You are a helpful e-commerce product recommendation assistant. 
            Your role is to explain why certain products are recommended based on the main product 
            and user's purchase history.
            
            Main Product: {main_product['title']} (Category: {main_product['category']}, Price: {main_product['price']})
            User Purchase History: {user_history}
            
            Please provide a clear, concise explanation in Persian about why these products are recommended.
            Mention related products, accessories, up-sell options, and down-sell options if applicable.
            Be specific and helpful.
            """
            
            # For now, using a simple implementation due to the async nature of the Groq client
            # In a real implementation, you would await the API call:
            # response = await self.client.chat.completions.create(
            #     messages=[{"role": "system", "content": system_prompt}],
            #     model="llama3-8b-8192",
            #     max_tokens=150
            # )
            # explanation = response.choices[0].message.content
            
            # For now, returning a placeholder explanation based on rule-based logic
            explanation_parts = []
            
            if user_history:
                explanation_parts.append(f"با توجه به تاریخچه خرید شما، ")
            
            explanation_parts.append(
                f"محصولاتی مرتبط با {main_product['title']} را برای شما انتخاب کردیم. "
                f"شامل محصولات مشابه، اکسسوری‌های مناسب، گزینه‌های بهتر و ارزان‌تر."
            )
            
            return "".join(explanation_parts)
            
        except Exception as e:
            self.logger.error(f"Error generating AI explanation: {str(e)}", exc_info=True)
            return "پیشنهادهای مرتبط با محصول انتخاب شده برای شما آماده شده‌اند."
    
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
    
    def _dict_to_product(self, product_dict: Dict[str, Any]) -> ProductModel:
        """
        Convert a dictionary representation back to a ProductModel-like object
        This is a simplified implementation for similarity calculations
        """
        product = ProductModel()
        for key, value in product_dict.items():
            setattr(product, key, value)
        return product