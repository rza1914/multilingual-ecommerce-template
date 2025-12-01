from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
import time

from ...database import get_db
from ...services.smart_search_service import SmartSearchService
from ...schemas.smart_search import SmartSearchQuery, SmartSearchResponse, SmartSearchResultItem, SmartSearchExplanation
from ...schemas.product import Product

router = APIRouter()

# Setup logging
logger = logging.getLogger(__name__)


@router.post("/smart-search",
             summary="Smart product search with natural language",
             description="Search products using natural language queries with AI-powered filter extraction",
             response_model=SmartSearchResponse)
async def smart_search(
    search_query: SmartSearchQuery,
    db: Session = Depends(get_db)
) -> SmartSearchResponse:
    """
    Perform a smart search for products using natural language query.

    The endpoint:
    1. Takes a natural language query from the user
    2. Extracts filters (brand, price, category, etc.) using NLP
    3. Builds an intelligent SQL query based on extracted filters
    4. Executes the query against the database
    5. Returns products with an AI-generated explanation
    """
    try:
        start_time = time.time()

        # Ensure query is not empty
        if not search_query.query or not search_query.query.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Query parameter cannot be empty"
            )

        # Initialize the smart search service
        smart_search_service = SmartSearchService(db)

        # Perform the smart search
        raw_results = await smart_search_service.smart_search(search_query.query)

        # Calculate search time
        search_time = time.time() - start_time

        # Process the results from the service into the proper format
        response_results = []
        total_results = 0
        extracted_filters = raw_results.get("extracted_filters", {})
        related_searches = raw_results.get("related_searches", [])
        explanation_text = raw_results.get("explanation", "Search completed successfully")

        if "results" in raw_results and raw_results["results"]:
            total_results = len(raw_results["results"])

            # Convert results to proper format
            for product_data in raw_results["results"]:
                # Handle datetime objects properly for Product schema
                from datetime import datetime
                
                created_at_val = product_data.get("created_at")
                updated_at_val = product_data.get("updated_at")
                
                # Process created_at - required field
                if created_at_val is None:
                    # Default to current time if not provided
                    processed_created_at = datetime.now()
                elif isinstance(created_at_val, str):
                    try:
                        # If it's an ISO format string, parse it
                        processed_created_at = datetime.fromisoformat(created_at_val.replace('Z', '+00:00'))
                    except ValueError:
                        # If parsing fails, use current time
                        processed_created_at = datetime.now()
                else:
                    processed_created_at = created_at_val

                # Process updated_at - optional field
                if updated_at_val is None:
                    processed_updated_at = None
                elif isinstance(updated_at_val, str):
                    try:
                        # If it's an ISO format string, parse it
                        processed_updated_at = datetime.fromisoformat(updated_at_val.replace('Z', '+00:00'))
                    except ValueError:
                        # If parsing fails, use None
                        processed_updated_at = None
                else:
                    processed_updated_at = updated_at_val

                # Create a product object from the data - make sure all required fields are provided
                product = Product(
                    id=product_data.get("id", 0),
                    title=product_data.get("title", ""),
                    description=product_data.get("description", ""),
                    price=product_data.get("price", 0.0),
                    discount_price=product_data.get("discount_price"),
                    is_active=product_data.get("is_active", True),
                    is_featured=product_data.get("is_featured", False),
                    image_url=product_data.get("image_url"),
                    category=product_data.get("category"),
                    tags=product_data.get("tags"),
                    owner_id=product_data.get("owner_id"),
                    created_at=processed_created_at,
                    updated_at=processed_updated_at
                )

                # Add relevance information if available
                relevance_data = product_data.get("ai_relevance", {})
                relevance_score = relevance_data.get("relevance_score", 5)
                relevance_explanation = relevance_data.get("explanation", "Relevance score calculated by AI")

                result_item = SmartSearchResultItem(
                    product=product,
                    relevance_score=relevance_score,
                    relevance_explanation=relevance_explanation
                )

                response_results.append(result_item)

        # Create the explanation object
        explanation = SmartSearchExplanation(
            explanation=explanation_text,
            query_interpretation=f"Processed query: {search_query.query}",
            applied_filters=extracted_filters
        )

        # Create the final response
        response = SmartSearchResponse(
            results=response_results,
            total_results=total_results,
            query=search_query.query,
            explanation=explanation,
            extracted_filters=extracted_filters,
            related_searches=related_searches,
            search_time=search_time
        )

        return response

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error
        logger.error(f"Error processing smart search: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing your search request: {str(e)}"
        )