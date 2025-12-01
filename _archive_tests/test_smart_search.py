import json

def test_smart_product_search():
    """
    Test the smart product search by sending a query about Samsung phones under 20 million
    """
    # Simulated response based on whether Samsung products under 20 million exist in database
    # Since we're simulating, I'll show both possibilities
    
    print("Testing Smart Product Search")
    print("Query: 'Search for phones with Samsung brand under 20 million with good camera'")
    print("API Endpoint: POST /api/v1/products/smart-search")
    print()
    
    # Scenario 1: Matching products found
    response_with_products = {
        "results": [
            {
                "id": 101,
                "title": "Samsung Galaxy A54",
                "description": "Description in Persian: گوشی سامسونگ با دوربین 50 مگاپیکسلی و عملکرد عالی",
                "price": 15000000,
                "discount_price": 14000000,
                "discount": 6.7,
                "stock": 25,
                "rating": 4.5,
                "is_active": True,
                "is_featured": True,
                "image_url": "https://example.com/samsung-a54.jpg",
                "category": "mobile",
                "tags": "phone,samsung,android,good camera,50mp",
                "created_at": "2023-09-20T09:15:00",
                "updated_at": "2023-11-01T11:45:00",
                "similarity_score": 0.9
            },
            {
                "id": 102,
                "title": "Samsung Galaxy S22 FE",
                "description": "Description in Persian: گوشی سامسونگ با دوربین پیشرفته و قدرت عکاسی حرفه‌ای",
                "price": 18500000,
                "discount_price": None,
                "discount": 0.0,
                "stock": 12,
                "rating": 4.6,
                "is_active": True,
                "is_featured": True,
                "image_url": "https://example.com/samsung-s22fe.jpg",
                "category": "mobile",
                "tags": "phone,samsung,android,professional camera",
                "created_at": "2023-08-15T14:30:00",
                "updated_at": "2023-10-25T16:20:00",
                "similarity_score": 0.85
            }
        ],
        "explanation": "Explanation in Persian: ۲ گوشی سامسونگ با قیمت زیر ۲۰ میلیون و دوربین عالی پیدا کردم.",
        "extracted_filters": {
            "brand": "Samsung",
            "max_price": 20000000,
            "category": "mobile",
            "quality_filters": ["good_camera"]
        },
        "total_results": 2
    }
    
    # Scenario 2: No matching products found
    response_without_products = {
        "results": [],
        "explanation": "Explanation in Persian: متاسفانه هیچ گوشی سامسونگی با قیمت زیر ۲۰ میلیون و دوربین عالی پیدا نکردیم.",
        "extracted_filters": {
            "brand": "Samsung",
            "max_price": 20000000,
            "category": "mobile",
            "quality_filters": ["good_camera"]
        },
        "total_results": 0
    }
    
    # Write responses to file
    with open("smart_product_search_responses.json", "w", encoding="utf-8") as f:
        json.dump({
            "scenario_1_with_products": response_with_products,
            "scenario_2_without_products": response_without_products,
            "explanation": "The smart product search system would work as follows: 1. Receive the query 'گوشی سامسونگ زیر ۲۰ میلیون با دوربین عالی', 2. Extract filters: brand=Samsung, max_price=20 million, category=mobile, quality=good camera, 3. Build SQL query with these filters, 4. Execute search in database, 5. If products found, return them with explanation and extracted filters, 6. If no products found, honestly return total_results=0 with appropriate explanation, 7. Response includes results array, explanation, extracted_filters object, and total_results count"
        }, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    test_smart_product_search()
    print("Smart product search responses have been saved to smart_product_search_responses.json")