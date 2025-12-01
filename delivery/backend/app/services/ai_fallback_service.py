"""
AI Fallback Service
Provides fallback mechanisms for AI functionalities when external APIs are unavailable
"""
import logging
import time
import json
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass
from enum import Enum
from datetime import datetime, timedelta
import re
from collections import defaultdict

from ..models.product import Product as ProductModel
from ..models.user import User
from ..models.order import Order, OrderItem
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..config import settings


class AIAction(Enum):
    """Defines different AI actions that may require fallback"""
    CHAT = "chat"
    SMART_SEARCH = "smart_search"
    PRODUCT_RECOMMENDATIONS = "product_recommendations"
    PRODUCT_DESCRIPTION = "product_description"


@dataclass
class FallbackResponse:
    """Standardized response from fallback services"""
    success: bool
    data: Any = None
    fallback_used: bool = False
    error_message: Optional[str] = None
    execution_time: float = 0.0


class AIFallbackService:
    """
    AI Fallback Service that provides fallback mechanisms for AI functionalities
    when external APIs are unavailable or fail.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.logger = logging.getLogger(__name__)
        self.cache = {}  # Simple in-memory cache
        self.cache_ttl = 300  # 5 minutes TTL
        
        # Predefined responses for common questions
        self.predefined_responses = {
            'shipping': [
                'For shipping information, please check our shipping policy page.',
                'We offer multiple shipping options at checkout. Standard shipping takes 3-5 business days.',
                'International shipping is available to most countries. See checkout for details.'
            ],
            'return': [
                'Our return policy allows returns within 30 days of purchase.',
                'For return instructions, please visit our returns page.',
                'Items must be in original condition with tags attached for returns.'
            ],
            'order': [
                'You can check your order status by logging into your account.',
                'Order confirmation details are sent to your email after purchase.',
                'For order inquiries, please contact customer support.'
            ],
            'product': [
                'For product specifications, please check the product page.',
                'We offer a wide range of products. Use the search bar to find specific items.',
                'If you need more information about a product, please contact us.'
            ],
            'payment': [
                'We accept all major credit cards, PayPal, and other payment methods.',
                'Payment information is securely processed. See checkout for accepted methods.',
                'Your payment details are encrypted and secure.'
            ]
        }
    
    def _is_cache_valid(self, key: str) -> bool:
        """Check if cached data is still valid"""
        if key not in self.cache:
            return False
        
        cached_time, _ = self.cache[key]
        return datetime.utcnow() < cached_time + timedelta(seconds=self.cache_ttl)
    
    def _get_from_cache(self, key: str) -> Optional[Any]:
        """Retrieve data from cache if valid"""
        if self._is_cache_valid(key):
            _, data = self.cache[key]
            return data
        return None
    
    def _set_cache(self, key: str, data: Any):
        """Store data in cache"""
        self.cache[key] = (datetime.utcnow(), data)
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts using simple string matching"""
        if not text1 or not text2:
            return 0.0
            
        # Convert to lowercase and tokenize
        tokens1 = set(re.findall(r'\w+', text1.lower()))
        tokens2 = set(re.findall(r'\w+', text2.lower()))
        
        if not tokens1 and not tokens2:
            return 1.0
        if not tokens1 or not tokens2:
            return 0.0
            
        # Calculate Jaccard similarity
        intersection = tokens1.intersection(tokens2)
        union = tokens1.union(tokens2)
        
        return len(intersection) / len(union)
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text"""
        if not text:
            return []
        
        # Convert to lowercase and extract words
        words = re.findall(r'\w+', text.lower())
        
        # Remove common stop words
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
        }
        
        return [word for word in words if word not in stop_words and len(word) > 2]
    
    def chat_fallback(self, user_message: str, context: Dict[str, Any] = None) -> FallbackResponse:
        """
        Fallback chat service that provides responses based on keyword matching
        """
        start_time = time.time()
        
        try:
            # Extract keywords from user message
            keywords = self._extract_keywords(user_message.lower())
            
            # Check for common keywords and return appropriate responses
            for keyword in keywords:
                if any(k in keyword for k in ['ship', 'delivery', 'send', 'post']):
                    response = self.predefined_responses['shipping'][0]
                    return FallbackResponse(
                        success=True,
                        data={'response': response},
                        fallback_used=True,
                        execution_time=time.time() - start_time
                    )
                
                elif any(k in keyword for k in ['return', 'refund', 'exchange', 'back']):
                    response = self.predefined_responses['return'][0]
                    return FallbackResponse(
                        success=True,
                        data={'response': response},
                        fallback_used=True,
                        execution_time=time.time() - start_time
                    )
                
                elif any(k in keyword for k in ['order', 'status', 'track', 'where']):
                    response = self.predefined_responses['order'][0]
                    return FallbackResponse(
                        success=True,
                        data={'response': response},
                        fallback_used=True,
                        execution_time=time.time() - start_time
                    )
                
                elif any(k in keyword for k in ['product', 'item', 'buy', 'price', 'cost']):
                    response = self.predefined_responses['product'][0]
                    return FallbackResponse(
                        success=True,
                        data={'response': response},
                        fallback_used=True,
                        execution_time=time.time() - start_time
                    )
            
            # If no specific keywords found, provide a general response
            general_responses = [
                "Thanks for your message. For immediate assistance, please contact our support team.",
                "I'm here to help. For specific questions about products or orders, please check our FAQ or contact support.",
                "Thank you for reaching out. If your question is urgent, please contact our customer service team directly."
            ]
            
            import random
            response = random.choice(general_responses)
            
            return FallbackResponse(
                success=True,
                data={'response': response},
                fallback_used=True,
                execution_time=time.time() - start_time
            )
            
        except Exception as e:
            self.logger.error(f"Error in chat fallback: {str(e)}")
            return FallbackResponse(
                success=False,
                error_message="Unable to process chat request",
                fallback_used=True,
                execution_time=time.time() - start_time
            )
    
    def smart_search_fallback(self, query: str, category: Optional[str] = None, 
                             limit: int = 10) -> FallbackResponse:
        """
        Fallback smart search that performs basic text matching
        """
        start_time = time.time()
        
        try:
            # Create cache key
            cache_key = f"smart_search:{query}:{category}:{limit}"
            
            # Check cache first
            cached_result = self._get_from_cache(cache_key)
            if cached_result:
                return FallbackResponse(
                    success=True,
                    data=cached_result,
                    fallback_used=True,
                    execution_time=time.time() - start_time
                )
            
            # Build query
            search_query = self.db.query(ProductModel).filter(ProductModel.is_active == True)
            
            # Apply category filter if specified
            if category:
                search_query = search_query.filter(ProductModel.category == category)
            
            # Get all products
            all_products = search_query.all()
            
            # Calculate similarity scores
            scored_products = []
            for product in all_products:
                # Calculate similarity with title, description, and tags
                title_score = self._calculate_similarity(query, product.title)
                desc_score = self._calculate_similarity(query, product.description or "")
                tags_score = 0.0
                
                if product.tags:
                    tags_score = self._calculate_similarity(query, product.tags)
                
                # Combine scores
                total_score = max(title_score, desc_score, tags_score)
                
                if total_score > 0.1:  # Only include if similarity is above threshold
                    scored_products.append((product, total_score))
            
            # Sort by score in descending order
            scored_products.sort(key=lambda x: x[1], reverse=True)
            
            # Get top results
            results = [product for product, _ in scored_products[:limit]]
            
            # Format response
            formatted_results = []
            for product in results:
                formatted_results.append({
                    'id': product.id,
                    'title': product.title,
                    'description': product.description,
                    'price': product.price,
                    'image_url': product.image_url,
                    'category': product.category,
                    'stock': product.stock,
                    'rating': product.rating
                })
            
            # Cache the results
            self._set_cache(cache_key, formatted_results)
            
            return FallbackResponse(
                success=True,
                data=formatted_results,
                fallback_used=True,
                execution_time=time.time() - start_time
            )
            
        except Exception as e:
            self.logger.error(f"Error in smart search fallback: {str(e)}")
            return FallbackResponse(
                success=False,
                error_message="Unable to perform search",
                fallback_used=True,
                execution_time=time.time() - start_time
            )
    
    def product_recommendations_fallback(self, product_id: int, user_id: Optional[int] = None, 
                                       limit: int = 4) -> FallbackResponse:
        """
        Fallback product recommendation system
        """
        start_time = time.time()
        
        try:
            # Create cache key
            cache_key = f"recommendations:{product_id}:{user_id}:{limit}"
            
            # Check cache first
            cached_result = self._get_from_cache(cache_key)
            if cached_result:
                return FallbackResponse(
                    success=True,
                    data=cached_result,
                    fallback_used=True,
                    execution_time=time.time() - start_time
                )
            
            # Get the reference product
            ref_product = self.db.query(ProductModel).filter(ProductModel.id == product_id).first()
            if not ref_product:
                return FallbackResponse(
                    success=False,
                    error_message="Reference product not found",
                    fallback_used=True,
                    execution_time=time.time() - start_time
                )
            
            # Find products in the same category
            similar_products = self.db.query(ProductModel).filter(
                ProductModel.category == ref_product.category,
                ProductModel.id != ref_product.id,
                ProductModel.is_active == True
            ).limit(limit + 2).all()  # Get a few more than needed to have options
            
            # If not enough in same category, get popular products
            if len(similar_products) < limit:
                popular_products = self.db.query(ProductModel).filter(
                    ProductModel.is_active == True
                ).order_by(ProductModel.rating.desc()).limit(limit).all()
                
                # Combine and remove duplicates
                all_products = list(set(similar_products + popular_products))
            else:
                all_products = similar_products
            
            # If user_id is provided, try to get products based on user's previous purchases
            if user_id:
                # Get user's previous purchased products
                user_orders = self.db.query(Order).filter(Order.user_id == user_id).all()
                purchased_product_ids = set()
                
                for order in user_orders:
                    order_items = self.db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
                    for item in order_items:
                        purchased_product_ids.add(item.product_id)
                
                # Get products from same categories as user's purchases
                if purchased_product_ids:
                    purchased_products = self.db.query(ProductModel).filter(
                        ProductModel.id.in_(list(purchased_product_ids))
                    ).all()
                    
                    user_category_products = []
                    for p in purchased_products:
                        cat_products = self.db.query(ProductModel).filter(
                            ProductModel.category == p.category,
                            ProductModel.id != product_id,
                            ProductModel.id.notin_(purchased_product_ids),
                            ProductModel.is_active == True
                        ).limit(2).all()
                        user_category_products.extend(cat_products)
                    
                    # Add these to recommendations if we don't have enough
                    if len(all_products) < limit:
                        all_products.extend(user_category_products)
            
            # Take unique items and limit to requested amount
            unique_products = []
            seen_ids = set()
            
            for product in all_products:
                if product.id not in seen_ids and product.id != product_id:
                    unique_products.append(product)
                    seen_ids.add(product.id)
                    if len(unique_products) >= limit:
                        break
            
            # Format results
            formatted_results = []
            for product in unique_products:
                formatted_results.append({
                    'id': product.id,
                    'title': product.title,
                    'description': product.description,
                    'price': product.price,
                    'image_url': product.image_url,
                    'category': product.category,
                    'stock': product.stock,
                    'rating': product.rating
                })
            
            # Cache the results
            self._set_cache(cache_key, formatted_results)
            
            return FallbackResponse(
                success=True,
                data=formatted_results,
                fallback_used=True,
                execution_time=time.time() - start_time
            )
            
        except Exception as e:
            self.logger.error(f"Error in product recommendations fallback: {str(e)}")
            return FallbackResponse(
                success=False,
                error_message="Unable to generate recommendations",
                fallback_used=True,
                execution_time=time.time() - start_time
            )
    
    def handle_fallback(self, action: AIAction, **kwargs) -> FallbackResponse:
        """
        Main entry point for handling fallback for different AI actions
        """
        if action == AIAction.CHAT:
            return self.chat_fallback(
                user_message=kwargs.get('user_message', ''),
                context=kwargs.get('context', {})
            )
        elif action == AIAction.SMART_SEARCH:
            return self.smart_search_fallback(
                query=kwargs.get('query', ''),
                category=kwargs.get('category'),
                limit=kwargs.get('limit', 10)
            )
        elif action == AIAction.PRODUCT_RECOMMENDATIONS:
            return self.product_recommendations_fallback(
                product_id=kwargs.get('product_id', 0),
                user_id=kwargs.get('user_id'),
                limit=kwargs.get('limit', 4)
            )
        else:
            return FallbackResponse(
                success=False,
                error_message=f"Unknown action: {action}",
                fallback_used=True
            )