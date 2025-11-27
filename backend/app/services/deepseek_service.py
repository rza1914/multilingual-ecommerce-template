"""
DeepSeek Service for AI-powered product search
Handles communication with DeepSeek API for smart search functionality
"""
import os
import logging
import time
from typing import Dict, Any, Optional, List
from openai import OpenAI
from app.config import settings
from collections import deque
import threading
import json


class RateLimiter:
    """
    Simple rate limiter to manage API calls to DeepSeek
    """
    def __init__(self, max_requests_per_minute: int = 30, daily_limit: int = 1000):
        self.max_requests_per_minute = max_requests_per_minute
        self.daily_limit = daily_limit
        self.requests = deque()
        self.daily_requests = 0
        self.lock = threading.Lock()
        self.daily_reset_time = time.time() + 86400  # Reset after 24 hours

    def check_rate_limit(self) -> bool:
        """
        Check if we're within rate limits
        """
        with self.lock:
            now = time.time()
            
            # Clean old requests (older than 60 seconds)
            while self.requests and now - self.requests[0] > 60:
                self.requests.popleft()
                
            # Check if we're within the minute limit
            if len(self.requests) >= self.max_requests_per_minute:
                return False
                
            # Check if we're within the daily limit
            if self.daily_requests >= self.daily_limit:
                # Check if it's time to reset the daily counter
                if now > self.daily_reset_time:
                    self.daily_requests = 0
                    self.daily_reset_time = now + 86400  # Reset in 24 hours
                else:
                    return False
                    
            # Add the current request
            self.requests.append(now)
            self.daily_requests += 1
            return True

    def wait_if_needed(self):
        """
        Wait if rate limit is exceeded
        """
        while not self.check_rate_limit():
            time.sleep(1)  # Wait 1 second before retrying


class DeepSeekService:
    """
    Service for interacting with the DeepSeek API
    """
    
    def __init__(self):
        # Initialize logger first
        self.logger = logging.getLogger(__name__)
        
        # Get the API key from environment variables
        self.api_key = os.getenv("DEEPSEEK_API_KEY")
        self.base_url = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
        self.enabled = bool(self.api_key)  # Check if API key is available
        
        if self.enabled:
            try:
                self.client = OpenAI(
                    api_key=self.api_key,
                    base_url=self.base_url
                )
                
                # Model to use for smart search
                self.model = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
                
                # Initialize rate limiter with configurable limits
                max_requests_per_minute = int(os.getenv("DEEPSEEK_RATE_LIMIT_PER_MINUTE", "30"))
                daily_limit = int(os.getenv("DEEPSEEK_DAILY_LIMIT", "1000"))
                self.rate_limiter = RateLimiter(max_requests_per_minute, daily_limit)
                
                self.logger.info("DeepSeekService initialized with API key")
            except Exception as e:
                self.logger.error(f"Error initializing DeepSeek client: {e}")
                self.enabled = False
                self.logger.warning("DEEPSEEK_API_KEY not set or invalid, DeepSeek functionality will be disabled")
        else:
            self.logger.warning("DEEPSEEK_API_KEY not set, DeepSeek functionality will be disabled")
            # Set default values when not enabled
            self.model = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
            # Rate limiter is still initialized even if not used
            max_requests_per_minute = int(os.getenv("DEEPSEEK_RATE_LIMIT_PER_MINUTE", "30"))
            daily_limit = int(os.getenv("DEEPSEEK_DAILY_LIMIT", "1000"))
            self.rate_limiter = RateLimiter(max_requests_per_minute, daily_limit)
    
    def extract_search_filters(self, query: str) -> Dict[str, Any]:
        """
        Extract search filters from a natural language query using DeepSeek
        
        Args:
            query: Natural language search query in Persian or English
            
        Returns:
            Dictionary of extracted filters
        """
        if not self.enabled:
            return self._fallback_extract_filters(query)
        
        try:
            self.rate_limiter.wait_if_needed()
            
            prompt = f"""
            Extract search filters from the following query. Identify the following if mentioned:
            - category: product category (e.g., mobile, laptop, tablet, etc.)
            - brand: product brand (e.g., Samsung, Apple, etc.)
            - min_price: minimum price in tomans
            - max_price: maximum price in tomans
            - color: product color if mentioned
            - features: any specific features mentioned
            - rating: minimum rating if specified
            - in_stock: whether product should be in stock (true/false)
            
            Query: {query}
            
            Respond in JSON format with only the filters that are mentioned in the query:
            {{
                "category": "...",
                "brand": "...",
                "min_price": ...,
                "max_price": ...,
                "color": "...",
                "features": [...],
                "rating": ...,
                "in_stock": ...
            }}
            
            If a value is not mentioned in the query, do not include that key in the response.
            For prices, convert to numerical values (e.g., "2 million tomans" = 2000000).
            If the query contains Persian text, handle it appropriately.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at parsing natural language search queries for an e-commerce platform. Extract relevant filters accurately. Return ONLY JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.1,
                max_tokens=512,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            if content:
                filters = json.loads(content)
                # Clean up the filters to remove None values
                filters = {k: v for k, v in filters.items() if v is not None}
                return filters
            return {}
            
        except Exception as e:
            self.logger.error(f"Error extracting search filters: {str(e)}", exc_info=True)
            return self._fallback_extract_filters(query)

    def _fallback_extract_filters(self, query: str) -> Dict[str, Any]:
        """
        Fallback method to extract filters using simple regex when DeepSeek is not available
        """
        import re
        
        filters = {}
        query_lower = query.lower()
        
        # Extract price information (simple regex-based)
        price_patterns = [
            r"تا\s*(\d+(?:\.\d+)?)\s*(?:میلیون|میلیارد|million|billion)",
            r"زیر\s*(\d+(?:\.\d+)?)\s*(?:میلیون|میلیارد|million|billion)",
            r"کمتر\s+از\s*(\d+(?:\.\d+)?)\s*(?:میلیون|میلیارد|million|billion)",
            r"(\d+(?:\.\d+)?)\s*تا\s*(\d+(?:\.\d+)?)\s*(?:میلیون|میلیارد|million|billion)",
        ]

        for pattern in price_patterns:
            matches = re.findall(pattern, query_lower)
            for match in matches:
                if isinstance(match, tuple) and len(match) == 2:
                    # Between pattern
                    min_val = float(match[0]) * (1000000 if 'میلیون' in query or 'million' in query else 1000000000)
                    max_val = float(match[1]) * (1000000 if 'میلیون' in query or 'million' in query else 1000000000)
                    filters['min_price'] = min_val
                    filters['max_price'] = max_val
                    break
                elif not isinstance(match, tuple):
                    # Single value pattern
                    value = float(match) * (1000000 if 'میلیون' in query or 'million' in query else 1000000000)
                    filters['max_price'] = value
                    break

        # Extract basic category/brand information
        brand_patterns = {
            'Samsung': [r'samsung', r'سامسونگ'],
            'Apple': [r'iphone', r'ios', r'اپل'],
            'Huawei': [r'huawei', r'هواوی'],
            'Xiaomi': [r'xiaomi', r'redmi', r'ریدمی']
        }
        
        for brand, patterns in brand_patterns.items():
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    filters['brand'] = brand
                    break

        # Extract category information
        category_patterns = {
            'mobile': [r'mobile', r'phone', r'گوشی', r'موبایل'],
            'laptop': [r'laptop', r'لپتاپ', r'نوت'],
            'tablet': [r'tablet', r'تبلت'],
            'headphone': [r'headphone', r'earphone', r'هدفون', r'هندزفری']
        }
        
        for category, patterns in category_patterns.items():
            for pattern in patterns:
                if re.search(pattern, query_lower):
                    filters['category'] = category
                    break

        return filters
    
    def generate_search_explanation(self, query: str, filters: Dict[str, Any], results_count: int) -> str:
        """
        Generate a human-readable explanation of the search results using DeepSeek
        """
        if not self.enabled:
            return self._fallback_generate_explanation(query, filters, results_count)
        
        try:
            self.rate_limiter.wait_if_needed()
            
            prompt = f"""
            Given the following search query and filters, create a helpful explanation for the user about their search results.
            
            Query: {query}
            Filters: {filters}
            Results Count: {results_count}
            
            Write a friendly, helpful explanation in the same language as the original query.
            If the query was in Persian, respond in Persian. If in English, respond in English.
            The explanation should:
            1. Acknowledge what the user was looking for
            2. Mention what filters were applied (if any)
            3. Tell the user how many results were found
            4. If no results were found, suggest alternative searches
            
            Keep the response natural and helpful, as if speaking to a customer.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful customer service assistant for an e-commerce website. Provide clear, friendly explanations of search results."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=256
            )
            
            explanation = response.choices[0].message.content if response.choices and response.choices[0].message.content else ""
            return explanation.strip()
            
        except Exception as e:
            self.logger.error(f"Error generating search explanation: {str(e)}", exc_info=True)
            return self._fallback_generate_explanation(query, filters, results_count)

    def _fallback_generate_explanation(self, query: str, filters: Dict[str, Any], results_count: int) -> str:
        """
        Fallback method to generate explanation when DeepSeek is not available
        """
        if results_count > 0:
            if filters:
                filter_descriptions = []
                if 'category' in filters:
                    filter_descriptions.append(filters['category'])
                if 'brand' in filters:
                    filter_descriptions.append(filters['brand'])
                if 'max_price' in filters:
                    filter_descriptions.append(f"تا {filters['max_price']}")
                
                if filter_descriptions:
                    return f"جستجوی شما '{query}' با فیلترهای {', '.join(filter_descriptions)} منجر به یافتن {results_count} محصول شد."
                else:
                    return f"جستجوی شما '{query}' منجر به یافتن {results_count} محصول شد."
            else:
                return f"جستجوی شما '{query}' منجر به یافتن {results_count} محصول شد."
        else:
            return f"جستجوی شما '{query}' هیچ نتیجه‌ای نداشت. لطفاً عبارت جستجوی خود را تغییر دهید."
    
    def generate_related_searches(self, query: str) -> list:
        """
        Generate related search suggestions using DeepSeek
        """
        if not self.enabled:
            return self._fallback_generate_related_searches(query)
        
        try:
            self.rate_limiter.wait_if_needed()
            
            prompt = f"""
            Based on the following search query, suggest 3-5 related search queries that the user might be interested in.
            Query: {query}
            
            Return only the related searches as a JSON array:
            ["search1", "search2", "search3"]
            
            Make sure the suggestions are in the same language as the original query.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a search assistant that suggests related queries based on user input. Return ONLY JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.5,
                max_tokens=256,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            if content:
                data = json.loads(content)
                suggestions = data.get("suggestions", []) if isinstance(data, dict) else data
                return suggestions
            return []
            
        except Exception as e:
            self.logger.error(f"Error generating related searches: {str(e)}", exc_info=True)
            return self._fallback_generate_related_searches(query)

    def _fallback_generate_related_searches(self, query: str) -> list:
        """
        Fallback method to generate related searches when DeepSeek is not available
        """
        import re
        
        # Basic logic to generate related searches
        query_lower = query.lower()
        related_searches = []
        
        # Common product categories and related terms
        categories = {
            "mobile": ["phone", "smartphone", "cell phone", "گوشی", "موبایل"],
            "laptop": ["notebook", "computer", "ultrabook", "لپتاپ", "رایانه"],
            "tablet": ["ipad", "surface", "tab", "تبلت", "تبلیت"],
            "headphone": ["earphone", "earbuds", "wireless", "هدفون", "هندزفری"]
        }
        
        for category, terms in categories.items():
            for term in terms:
                if term in query_lower:
                    related_searches.extend([f"{cat}" for cat in categories.keys() if cat != category])
                    break
        
        # Add brand-related searches if brand is detected
        brands = ["samsung", "apple", "huawei", "xiaomi", "sony", "lg", "nokia"]
        for brand in brands:
            if brand in query_lower:
                related_searches.extend([f"{brand} phone", f"{brand} smartphone"] if "mobile" in query_lower else [f"{brand} product"])
                break
        
        # Add price-related searches
        if re.search(r'\d+\s*(تومان|toman|rial)', query_lower):
            related_searches.append("products under budget")
            related_searches.append("affordable options")
        
        # Take up to 5 suggestions
        return list(set(related_searches))[:5] if related_searches else []
    
    def analyze_product_relevance(self, query: str, product_title: str, product_description: str) -> Dict[str, Any]:
        """
        Analyze the relevance of a product to a search query using DeepSeek
        """
        if not self.enabled:
            return self._fallback_analyze_relevance(query, product_title, product_description)
        
        try:
            self.rate_limiter.wait_if_needed()
            
            prompt = f"""
            Analyze how relevant the following product is to the search query.
            
            Query: {query}
            Product Title: {product_title}
            Product Description: {product_description}
            
            Rate the relevance on a scale of 1-10 where:
            1 = completely irrelevant
            10 = extremely relevant
            
            Respond in JSON format:
            {{
                "relevance_score": ...,
                "explanation": "..."
            }}
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at matching search queries to products. Rate relevance accurately and helpfully. Return ONLY JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2,
                max_tokens=256,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            if content:
                result = json.loads(content)
                return result
            return {}
            
        except Exception as e:
            self.logger.error(f"Error analyzing product relevance: {str(e)}", exc_info=True)
            return self._fallback_analyze_relevance(query, product_title, product_description)

    def _fallback_analyze_relevance(self, query: str, product_title: str, product_description: str) -> Dict[str, Any]:
        """
        Fallback method to analyze product relevance when DeepSeek is not available
        """
        import re
        
        query_lower = query.lower()
        title_lower = product_title.lower()
        description_lower = product_description.lower() if product_description else ""
        
        # Count keyword matches
        query_words = re.findall(r'\b\w+\b', query_lower)
        matches = 0
        total_terms = len(query_words)
        
        for word in query_words:
            if word in title_lower or word in description_lower:
                matches += 1
        
        # Calculate relevance score (0-10)
        if total_terms > 0:
            relevance_score = min(10, max(1, int((matches / total_terms) * 10)))
        else:
            relevance_score = 5  # Default score if no query terms
            
        # Adjust score based on common factors
        if query_lower in title_lower:
            relevance_score = min(10, relevance_score + 2)
        if len(description_lower) > 0 and query_lower in description_lower:
            relevance_score = min(10, relevance_score + 1)
        
        explanation = f"Product matches {matches} out of {total_terms} query terms"
        if matches == 0:
            explanation = "Product has no direct matches with query terms"
        elif matches == total_terms:
            explanation = "Product matches all query terms"
        
        return {
            "relevance_score": relevance_score,
            "explanation": explanation
        }
