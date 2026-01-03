"""
Pydantic models for Smart Search functionality
Defines the input/output schemas for the smart search API
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from .product import ProductResponse as Product  # Import the existing ProductResponse schema as Product


class SmartSearchQuery(BaseModel):
    """
    Input schema for smart search requests
    Defines the expected parameters for the smart search endpoint
    """
    query: str
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    limit: Optional[int] = 20  # Default to 20 results
    offset: Optional[int] = 0  # Default to 0 offset
    
    class Config:
        # Allow extra fields in case of additional parameters
        extra = "allow"


class SmartSearchExplanation(BaseModel):
    """
    Schema for AI-generated explanation of search results
    """
    explanation: str
    query_interpretation: str
    applied_filters: Dict[str, Any]


class SmartSearchResultItem(BaseModel):
    """
    Schema for individual search result item with relevance score
    """
    product: Product
    relevance_score: int  # Score from 1-10
    relevance_explanation: str


class SmartSearchResponse(BaseModel):
    """
    Response schema for smart search endpoint
    Combines products with AI explanations and metadata
    """
    results: List[SmartSearchResultItem]
    total_results: int
    query: str
    explanation: SmartSearchExplanation
    extracted_filters: Dict[str, Any]
    related_searches: List[str]
    search_time: float  # Time taken for the search in seconds