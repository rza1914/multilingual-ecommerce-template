"""
AI Service for e-commerce platform
Integrates Groq for smart search and other AI-powered features
"""
import logging
from typing import Dict, Any, List
from app.services.groq_service import GroqService


class AIService:
    """
    Centralized service for AI operations using Groq API
    """

    def __init__(self):
        self.groq_service = GroqService()
        self.logger = logging.getLogger(__name__)

    def extract_search_filters(self, query: str) -> Dict[str, Any]:
        """
        Extract filters from a natural language query using Groq

        Args:
            query: Natural language search query

        Returns:
            Dictionary of extracted filters
        """
        return self.groq_service.extract_search_filters(query)

    def generate_search_explanation(self, query: str, filters: Dict[str, Any], results_count: int) -> str:
        """
        Generate explanation for search results using Groq

        Args:
            query: Original search query
            filters: Extracted filters
            results_count: Number of results found

        Returns:
            AI-generated explanation
        """
        return self.groq_service.generate_search_explanation(query, filters, results_count)

    def generate_related_searches(self, query: str) -> List[str]:
        """
        Generate related search suggestions using Groq

        Args:
            query: Original search query

        Returns:
            List of related search suggestions
        """
        return self.groq_service.generate_related_searches(query)

    def analyze_product_relevance(self, query: str, product_title: str, product_description: str) -> Dict[str, Any]:
        """
        Analyze relevance of a product to a search query using Groq

        Args:
            query: Original search query
            product_title: Product title
            product_description: Product description

        Returns:
            Dictionary with relevance score and explanation
        """
        return self.groq_service.analyze_product_relevance(query, product_title, product_description)

    def process_multilingual_query(self, query: str) -> Dict[str, Any]:
        """
        Process a multilingual query and return appropriate response

        Args:
            query: Query in any language (Persian, English, etc.)

        Returns:
            Processed results or translation
        """
        if not self.groq_service.enabled:
            # Fallback for multilingual processing when Groq is not available
            return self._fallback_process_multilingual_query(query)
        
        try:
            # Use Groq to detect language and process appropriately
            prompt = f"""
            You are a multilingual assistant. Analyze the following query:

            Query: {query}

            Identify the language of the query and respond in JSON format:
            {{
                "original_query": "...",
                "detected_language": "...",
                "processed_query": "...",
                "intent": "..."
            }}

            The processed_query should be a cleaned version suitable for search.
            The intent should describe what the user is looking for.
            """

            response = self.groq_service.client.chat.completions.create(
                model=self.groq_service.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a multilingual assistant that helps process user queries for an e-commerce platform."
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

            result = {}
            if response.choices and response.choices[0].message.content:
                import json
                result = json.loads(response.choices[0].message.content)

            return result

        except Exception as e:
            self.logger.error(f"Error processing multilingual query: {str(e)}", exc_info=True)
            return self._fallback_process_multilingual_query(query)

    def _fallback_process_multilingual_query(self, query: str) -> Dict[str, Any]:
        """
        Fallback method to process multilingual query when Groq is not available
        """
        # Simple language detection based on character sets
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