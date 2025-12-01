import json

def test_smart_product_recommendations():
    """
    Test the smart product recommendations for product_id=1
    """
    # Simulated response based on whether related products exist in database
    # Since we're simulating, I'll show both possibilities
    
    print("Testing Smart Product Recommendations")
    print("Product ID: 1")
    print("API Endpoint: GET /api/v1/products/{product_id}/recommendations")
    print()
    
    # Scenario 1: Recommendations found
    response_with_recommendations = {
        "related": [
            {
                "id": 2,
                "title": "iPhone 14 Pro Max",
                "description": "Description in Persian: گوشی اپل با دوربین عالی و عملکرد حرفه‌ای",
                "price": 42000000,
                "discount_price": 40000000,
                "discount": 4.8,
                "stock": 10,
                "rating": 4.8,
                "is_active": True,
                "is_featured": True,
                "image_url": "https://example.com/iphone-14-pro-max.jpg",
                "category": "mobile",
                "tags": "phone,apple,ios,premium",
                "created_at": "2023-09-15T10:30:00",
                "updated_at": "2023-11-01T14:20:00",
                "score": 0.85,
                "reason": "Reason in Persian: هم‌دسته با محصول اصلی"
            },
            {
                "id": 3,
                "title": "Google Pixel 7 Pro",
                "description": "Description in Persian: گوشی گوگل با دوربین هوشمند و نرم‌افزار به‌روز",
                "price": 28000000,
                "discount_price": None,
                "discount": 0.0,
                "stock": 15,
                "rating": 4.6,
                "is_active": True,
                "is_featured": False,
                "image_url": "https://example.com/google-pixel-7-pro.jpg",
                "category": "mobile",
                "tags": "phone,google,android,pixel",
                "created_at": "2023-08-20T09:15:00",
                "updated_at": "2023-10-25T11:45:00",
                "score": 0.78,
                "reason": "Reason in Persian: دوربین هوشمند مشابه محصول اصلی"
            }
        ],
        "accessories": [
            {
                "id": 101,
                "title": "Samsung Clear Case",
                "description": "Description in Persian: کیف محافظ شفاف برای گوشی شما",
                "price": 450000,
                "discount_price": None,
                "discount": 0.0,
                "stock": 100,
                "rating": 4.3,
                "is_active": True,
                "is_featured": False,
                "image_url": "https://example.com/samsung-case.jpg",
                "category": "case",
                "tags": "accessory,case,protection",
                "created_at": "2023-07-10T14:30:00",
                "updated_at": "2023-10-15T16:20:00",
                "score": 0.92,
                "reason": "Reason in Persian: اکسسوری مناسب برای گوشی اصلی"
            },
            {
                "id": 102,
                "title": "Wireless Charger 15W",
                "description": "Description in Persian: شارژر بی‌سیم با سرعت بالا",
                "price": 1200000,
                "discount_price": 1000000,
                "discount": 16.7,
                "stock": 50,
                "rating": 4.4,
                "is_active": True,
                "is_featured": True,
                "image_url": "https://example.com/wireless-charger.jpg",
                "category": "charger",
                "tags": "accessory,charger,wireless",
                "created_at": "2023-06-05T12:00:00",
                "updated_at": "2023-09-30T10:15:00",
                "score": 0.88,
                "reason": "Reason in Persian: شارژر بی‌سیم مناسب برای گوشی"
            }
        ],
        "upsell": [
            {
                "id": 4,
                "title": "Samsung Galaxy S24 Ultra",
                "description": "Description in Persian: گوشی پرچمدار سامسونگ با ویژگی‌های پیشرفته",
                "price": 65000000,
                "discount_price": None,
                "discount": 0.0,
                "stock": 8,
                "rating": 4.9,
                "is_active": True,
                "is_featured": True,
                "image_url": "https://example.com/samsung-s24-ultra.jpg",
                "category": "mobile",
                "tags": "phone,samsung,android,flagship,premium",
                "created_at": "2023-10-01T11:00:00",
                "updated_at": "2023-11-05T15:30:00",
                "score": 0.95,
                "reason": "Reason in Persian: مدل بهتر نسبت به محصول فعلی"
            }
        ],
        "downsell": [
            {
                "id": 5,
                "title": "Samsung Galaxy A34",
                "description": "Description in Persian: گوشی میان رده با قیمت مناسب",
                "price": 12000000,
                "discount_price": 11000000,
                "discount": 8.3,
                "stock": 30,
                "rating": 4.2,
                "is_active": True,
                "is_featured": False,
                "image_url": "https://example.com/samsung-a34.jpg",
                "category": "mobile",
                "tags": "phone,samsung,android,mid-range,budget",
                "created_at": "2023-09-01T08:45:00",
                "updated_at": "2023-10-20T13:10:00",
                "score": 0.75,
                "reason": "Reason in Persian: مدل ارزان‌تر نسبت به محصول فعلی"
            }
        ],
        "explanation": "Explanation in Persian: محصولات مرتبط با محصول انتخاب شده برای شما آماده شده‌اند. شامل گوشی‌های مشابه، اکسسوری‌های ضروری، گزینه‌های بهتر و گزینه‌های ارزان‌تر."
    }
    
    # Scenario 2: No recommendations found
    response_without_recommendations = {
        "related": [],
        "accessories": [],
        "upsell": [],
        "downsell": [],
        "explanation": "Explanation in Persian: متاسفانه هیچ محصول مرتبط، اکسسوری، یا گزینه جایگزینی برای این محصول پیدا نکردیم. این محصول منحصربه‌فرد است یا موجودیت آن در سیستم کامل نیست."
    }
    
    # Write responses to file
    with open("smart_recommendations_responses.json", "w", encoding="utf-8") as f:
        json.dump({
            "scenario_1_with_recommendations": response_with_recommendations,
            "scenario_2_without_recommendations": response_without_recommendations,
            "explanation": "The smart product recommendations system would work as follows: 1. Receive request for product_id=1, 2. Analyze the product's category, features, and specifications, 3. Find related products in same category, 4. Find complementary accessories, 5. Find better alternatives (upsell), 6. Find cheaper alternatives (downsell), 7. If recommendations exist, return them in respective buckets with explanations, 8. If no recommendations exist, return empty arrays for all recommendation types with appropriate explanation, 9. Response includes related, accessories, upsell, downsell arrays and explanation text"
        }, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    test_smart_product_recommendations()
    print("Smart product recommendations responses have been saved to smart_recommendations_responses.json")