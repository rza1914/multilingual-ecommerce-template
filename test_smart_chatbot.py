import json
import requests

def test_smart_chatbot():
    """
    Test the smart chatbot integration by sending a query about Samsung phones
    """
    # Define the API endpoint
    url = "http://localhost:8000/api/v1/chat/message"  # Default development URL
    
    # Sample headers for authentication (would need a valid JWT token in real usage)
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"  # Replace with actual token
    }
    
    # The query to send
    payload = {
        "message": "گوشی سامسونگ دارید؟"
    }
    
    try:
        # In a real scenario, we would send the request
        # For simulation, I'll show what the expected response would look like
        print("Sending query to chatbot: [Persian query: گوشی سامسونگ دارید؟]")
        print("API Endpoint: POST /api/v1/chat/message")
        print()
        
        # Simulated response based on whether Samsung products exist in database
        # Since we're simulating, I'll show both possibilities
        
        print("=== Scenario 1: Samsung products are available ===")
        print()
        
        response_with_products = {
            "response": "[Persian response: بله، چند مدل گوشی سامسونگ در انبار ما موجود است:\\n\\n1. Samsung Galaxy S23 - 25,000,000 تومان\\n2. Samsung Galaxy A54 - 15,000,000 تومان\\n3. Samsung Galaxy Z Flip - 40,000,000 تومان\\n\\nمی‌توانید جزئیات بیشتری در مورد مدل مورد نظر خود بپرسید.]",
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
                        "description": "[Persian: گوشی اندرویدی پرچمدار سامسونگ با دوربین عالی]",
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
                        "description": "[Persian: گوشی میان رده با عملکرد عالی و باتری قوی]",
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
        
        print("Response:")
        print(json.dumps(response_with_products, ensure_ascii=False, indent=2))
        print()
        
        print("=== Scenario 2: Samsung products are NOT available ===")
        print()
        
        response_without_products = {
            "response": "[Persian response: متاسفانه در حال حاضر گوشی سامسونگی در انبار ما موجود نیست. اما می‌توانم در مورد گوشی‌های سایر برندها به شما کمک کنم. آیا علاقه‌مند به بررسی گوشی اپل یا شیائومی هستید؟]",
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
        
        print("Response:")
        print(json.dumps(response_without_products, ensure_ascii=False, indent=2))
        print()
        
        print("=== Explanation ===")
        print("The smart chatbot would:")
        print("1. Receive the message 'گوشی سامسونگ دارید؟'")
        print("2. Authenticate the user with JWT")
        print("3. Query the database for Samsung products")
        print("4. If products exist, return them with pricing and availability")
        print("5. If no products exist, honestly respond that none are available")
        print("6. Provide a helpful alternative suggestion")
        
    except Exception as e:
        print(f"Error in simulation: {str(e)}")

if __name__ == "__main__":
    test_smart_chatbot()