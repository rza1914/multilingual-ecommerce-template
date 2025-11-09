import re
from typing import Dict, Any, Optional, List
import logging
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.product import Product as ProductModel
from app.services.ai_service import AIService


class SmartSearchService:
    """
    Service for handling smart product search with natural language queries
    """

    def __init__(self, db: Session):
        self.db = db
        self.ai_service = AIService()  # New AI service using Groq
        self.logger = logging.getLogger(__name__)

    def extract_filters_from_query(self, query: str) -> Dict[str, Any]:
        """
        Extract filters from a natural language query using AI

        Args:
            query: Natural language search query

        Returns:
            Dictionary of extracted filters
        """
        # Use the AI service to extract filters from the query
        try:
            filters = self.ai_service.extract_search_filters(query)
            self.logger.info(f"Extracted filters using AI: {filters}")
            return filters
        except Exception as e:
            self.logger.error(f"Error extracting filters with AI: {str(e)}", exc_info=True)
            # Fallback to basic regex-based extraction
            return self._basic_filter_extraction(query)

    def _basic_filter_extraction(self, query: str) -> Dict[str, Any]:
        """
        Basic regex-based filter extraction as fallback
        """
        filters = {}

        # Normalize the query
        query_lower = query.lower()

        # Extract price filters (in Persian and English)
        # Look for patterns like "تا 20 میلیون", "زیر 15 میلیون", "under 10 million", etc.
        price_patterns = [
            r"تا\s*(\d+(?:\.\d+)?)\s*(?:میلیون|میلیارد|million|billion)",  # up to X million/billion
            r"زیر\s*(\d+(?:\.\d+)?)\s*(?:میلیون|میلیارد|million|billion)",  # under X million/billion
            r"کمتر\s+از\s*(\d+(?:\.\d+)?)\s*(?:میلیون|میلیارد|million|billion)",  # less than X
            r"(\d+(?:\.\d+)?)\s*تا\s*(\d+(?:\.\d+)?)\s*(?:میلیون|میلیارد|million|billion)",  # between X and Y
        ]

        for pattern in price_patterns:
            matches = re.findall(pattern, query_lower)
            for match in matches:
                if isinstance(match, tuple):
                    # Between pattern
                    if len(match) == 2:
                        min_val = float(match[0]) * (1000000 if 'میلیون' in query or 'million' in query else 1000000000)
                        max_val = float(match[1]) * (1000000 if 'میلیون' in query or 'million' in query else 1000000000)
                        filters['min_price'] = min_val
                        filters['max_price'] = max_val
                else:
                    # Single value pattern (up to/under)
                    value = float(match) * (1000000 if 'میلیون' in query or 'million' in query else 1000000000)
                    filters['max_price'] = value

        # Extract brand information
        brand_patterns = [
            r"(?:سامسونگ|samsung)",
            r"(?:اپل|iphone|ios)",
            r"(?:هواوی|huawei)",
            r"(?:نوت|note|galaxy|s\\d+)",  # Samsung Galaxy/Note
            r"(?:ریدمی|redmi|xiaomi)",
            r"(?:اکو|echo|amazon)",
            r"(?:گیم|game|گیمر|gamer)"  # For gaming products
        ]

        for brand_pattern in brand_patterns:
            if re.search(brand_pattern, query_lower):
                if 'سامسونگ' in query_lower or 'samsung' in query_lower:
                    filters['brand'] = 'Samsung'
                elif 'اپل' in query_lower or 'iphone' in query_lower or 'ios' in query_lower:
                    filters['brand'] = 'Apple'
                elif 'هواوی' in query_lower or 'huawei' in query_lower:
                    filters['brand'] = 'Huawei'
                elif 'نوت' in query_lower or 'galaxy' in query_lower or 's\\d+' in query_lower:
                    filters['brand'] = 'Samsung'
                elif 'ریدمی' in query_lower or 'redmi' in query_lower or 'xiaomi' in query_lower:
                    filters['brand'] = 'Xiaomi'
                elif 'اکو' in query_lower or 'echo' in query_lower or 'amazon' in query_lower:
                    filters['brand'] = 'Amazon'
                elif 'گیم' in query_lower or 'game' in query_lower or 'گیمر' in query_lower or 'gamer' in query_lower:
                    filters['category'] = 'gaming'
                break  # Only use first matched brand

        # Extract category information
        category_patterns = {
            'mobile': [r'گوشی', r'موبایل', r'telephone', r'phone', r'mobile'],
            'laptop': [r'لپتاپ', r'laptop', r'نوت', r'کامپیوتر'],
            'tablet': [r'تبلت', r'tablet'],
            'headphone': [r'هدفون', r'earphone', r'headset', r'earbuds'],
            'watch': [r'ساعت', r'watch', r'سماوتچ'],
            'tv': [r'تلویزیون', r'tv', r'تلویزیون'],
            'camera': [r'دوربین', r'camera'],
            'audio': [r'اسپیکر', r'speaker', r'بلندگو'],
        }

        for category, patterns in category_patterns.items():
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    filters['category'] = category
                    break
            if 'category' in filters:
                break

        # Extract quality indicators
        quality_patterns = {
            'high_rating': [r'بهترین', r'برترین', r'عالی', r'best', r'high', r'top'],
            'high_performance': [r'قوی', r'بهترین', r'پیشرفته', r'پردازنده قوی', r' powerful', r'fast'],
            'good_camera': [r'دوربین', r'عکس', r'photo', r'camera'],
        }

        for quality_type, patterns in quality_patterns.items():
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    if 'quality_filters' not in filters:
                        filters['quality_filters'] = []
                    filters['quality_filters'].append(quality_type)
                    break

        return filters

    def build_sql_query(self, filters: Dict[str, Any]):
        """
        Build a SQLAlchemy query based on extracted filters

        Args:
            filters: Dictionary of filters extracted from the query

        Returns:
            SQLAlchemy query object
        """
        query = self.db.query(ProductModel).filter(ProductModel.is_active == True)

        # Apply price filters
        if 'min_price' in filters:
            query = query.filter(ProductModel.price >= filters['min_price'])
        if 'max_price' in filters:
            query = query.filter(ProductModel.price <= filters['max_price'])

        # Apply brand filter
        if 'brand' in filters:
            # Extracting brand from title or description
            brand = filters['brand']
            query = query.filter(
                or_(
                    ProductModel.title.contains(brand),
                    ProductModel.description.contains(brand),
                    ProductModel.tags.contains(brand)
                )
            )

        # Apply category filter
        if 'category' in filters:
            query = query.filter(ProductModel.category.contains(filters['category']))

        # Apply quality filters if needed
        if 'quality_filters' in filters:
            quality_filters = filters['quality_filters']
            if 'high_rating' in quality_filters:
                query = query.order_by(ProductModel.rating.desc())
            if 'high_performance' in quality_filters:
                # This is more complex and would require specific product attribute fields
                # For now, use rating as a proxy for performance
                query = query.order_by(ProductModel.rating.desc())
            if 'good_camera' in quality_filters:
                # If it's a mobile category, prioritize high-rated items
                query = query.order_by(ProductModel.rating.desc())

        return query

    async def smart_search(self, query: str) -> Dict[str, Any]:
        """
        Perform a smart search based on natural language query

        Args:
            query: Natural language search query

        Returns:
            Dictionary with search results and explanations
        """
        try:
            # Extract filters from the query using AI
            filters = self.extract_filters_from_query(query)
            self.logger.info(f"Filters extracted: {filters}")

            # Build the SQL query
            db_query = self.build_sql_query(filters)

            # Execute the query and get products
            products = db_query.limit(20).all()  # Limit to 20 results

            # Convert products to dictionary format
            product_results = []
            for product in products:
                product_dict = {
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
                
                # Analyze relevance using AI
                relevance_analysis = self.ai_service.analyze_product_relevance(
                    query, product.title, product.description
                )
                product_dict["ai_relevance"] = relevance_analysis
                
                product_results.append(product_dict)

            # Generate explanation using AI
            explanation = self.ai_service.generate_search_explanation(query, filters, len(product_results))
            
            # Generate related searches
            related_searches = self.ai_service.generate_related_searches(query)

            return {
                "results": product_results,
                "explanation": explanation,
                "extracted_filters": filters,
                "total_results": len(product_results),
                "related_searches": related_searches
            }

        except Exception as e:
            self.logger.error(f"Error in smart search: {str(e)}", exc_info=True)
            return {
                "results": [],
                "explanation": "متاسفانه در پردازش جستجو خطایی رخ داد. لطفاً دوباره تلاش کنید.",
                "extracted_filters": {},
                "total_results": 0,
                "related_searches": []
            }