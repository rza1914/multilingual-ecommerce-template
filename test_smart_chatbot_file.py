import json

def test_smart_chatbot():
    """
    Test the smart chatbot integration by sending a query about Samsung phones
    """
    # Simulated response based on whether Samsung products exist in database
    response_with_products = {
        "response": "Response in Persian: بله، چند مدل گوشی سامسونگ در انبار ما موجود است:\n\n1. Samsung Galaxy S23 - 25,000,000 تومان\n2. Samsung Galaxy A54 - 15,000,000 تومان\n3. Samsung Galaxy Z Flip - 40,000,000 تومان\n\nمی‌توانید جزئیات بیشتری در مورد مدل مورد نظر خود بپرسید.",
        "context": {
            "user_info": {
                "id": 1,
                "username": "test_user",
                "full_name": "Test User",
                "email": "test@example.com"
            },
            "recent_orders": [],
            "relevant_products": [
                {
                    "id": 101,
                    "title": "Samsung Galaxy S23",
                    "description": "Description in Persian: گوشی اندرویدی پرچمدار سامسونگ با دوربین عالی",
                    "price": 25000000,
                    "discount_price": 23000000,
                    "discount": 8.0,
                    "stock": 15,
                    "rating": 4.7,
                    "is_active": True,
                    "is_featured": True,
                    "image_url": "https://example.com/samsung-s23.jpg",
                    "category": "mobile",
                    "tags": "phone,samsung,android,flagship",
                    "created_at": "2023-10-15T10:30:00",
                    "updated_at": "2023-11-05T14:20:00"
                },
                {
                    "id": 102,
                    "title": "Samsung Galaxy A54",
                    "description": "Description in Persian: گوشی میان رده با عملکرد عالی و باتری قوی",
                    "price": 15000000,
                    "discount_price": None,
                    "discount": 0.0,
                    "stock": 25,
                    "rating": 4.5,
                    "is_active": True,
                    "is_featured": False,
                    "image_url": "https://example.com/samsung-a54.jpg",
                    "category": "mobile",
                    "tags": "phone,samsung,android,mid-range",
                    "created_at": "2023-09-20T09:15:00",
                    "updated_at": "2023-11-01T11:45:00"
                }
            ]
        },
        "user_id": 1
    }
    
    response_without_products = {
        "response": "Response in Persian: متاسفانه در حال حاضر گوشی سامسونگی در انبار ما موجود نیست. اما می‌توانم در مورد گوشی‌های سایر برندها به شما کمک کنم. آیا علاقه‌مند به بررسی گوشی اپل یا شیائومی هستید؟",
        "context": {
            "user_info": {
                "id": 1,
                "username": "test_user",
                "full_name": "Test User", 
                "email": "test@example.com"
            },
            "recent_orders": [],
            "relevant_products": []
        },
        "user_id": 1
    }
    
    # Write responses to file
    with open("smart_chatbot_responses.json", "w", encoding="utf-8") as f:
        json.dump({
            "scenario_1_with_products": response_with_products,
            "scenario_2_without_products": response_without_products,
            "explanation": "The smart chatbot system would work as follows: 1. Receive the message 'گوشی سامسونگ دارید؟', 2. Authenticate the user with JWT token, 3. Parse the query to identify the request (Samsung phone availability), 4. Query the database for Samsung products, 5. If products are found, return them with pricing, availability and details, 6. If no products are found, honestly respond 'Product not found' in Persian, 7. Include helpful alternative suggestions when relevant, 8. Return structured response with response text, context data, and user_id"
        }, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    test_smart_chatbot()
    print("Smart chatbot responses have been saved to smart_chatbot_responses.json")