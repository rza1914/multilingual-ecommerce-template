"""
AI Service - Central service for AI-powered features
Uses DeepSeek for smart search and other AI capabilities
"""
import logging
from typing import Dict, Any, List, Optional
from app.services.deepseek_service import DeepSeekService


class AIService:
    """
    Central AI service that coordinates various AI-powered features
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.deepseek = DeepSeekService()
    
    def extract_search_filters(self, query: str) -> Dict[str, Any]:
        """
        Extract search filters from natural language query
        """
        return self.deepseek.extract_search_filters(query)
    
    def generate_search_explanation(self, query: str, filters: Dict[str, Any], results_count: int) -> str:
        """
        Generate explanation for search results
        """
        return self.deepseek.generate_search_explanation(query, filters, results_count)
    
    def generate_related_searches(self, query: str) -> List[str]:
        """
        Generate related search suggestions
        """
        return self.deepseek.generate_related_searches(query)
    
    def analyze_product_relevance(self, query: str, product_title: str, product_description: str) -> Dict[str, Any]:
        """
        Analyze how relevant a product is to a search query
        """
        return self.deepseek.analyze_product_relevance(query, product_title, product_description)
    
    def process_multilingual_query(self, query: str) -> Dict[str, Any]:
        """
        Process a multilingual query and detect language
        """
        persian_chars = set(['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'چ', 'ش', 'س', 'ی', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ک', 'گ', 'ظ', 'ط', 'ز', 'ر', 'ذ', 'د', 'پ', 'و', '؟'])
        
        has_persian = any(char in persian_chars for char in query)
        detected_language = "Persian" if has_persian else "English"
        
        # Determine intent based on common terms
        query_lower = query.lower()
        if any(word in query_lower for word in ['گوشی', 'موبایل', 'phone', 'mobile']):
            intent = "mobile_search"
        elif any(word in query_lower for word in ['لپ', 'رایانه', 'laptop', 'computer']):
            intent = "laptop_search"
        elif any(word in query_lower for word in ['ارزان', 'cheap', 'قیمت', 'price']):
            intent = "price_search"
        else:
            intent = "general_search"
        
        return {
            "original_query": query,
            "detected_language": detected_language,
            "processed_query": query.strip(),
            "intent": intent
        }