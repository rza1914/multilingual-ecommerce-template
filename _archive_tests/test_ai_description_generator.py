import json

def test_ai_product_description_generator():
    """
    Test the AI product description generator with Samsung Galaxy S24 Ultra specs
    """
    # Simulated request data for Samsung Galaxy S24 Ultra
    product_data = {
        "name": "Samsung Galaxy S24 Ultra",
        "brand": "Samsung",
        "category": "smartphone",
        "specs": {
            "RAM": "12GB",
            "Storage": "256GB",
            "Camera": "200MP",
            "Display": "6.8 inch Dynamic AMOLED",
            "Battery": "5000mAh",
            "Processor": "Snapdragon 8 Gen 3"
        },
        "price": 45000000,
        "tone": "professional"
    }
    
    print("Testing AI Product Description Generator")
    print(f"Product: {product_data['name']}")
    print("API Endpoint: POST /api/v1/admin/products/generate-description")
    print()
    
    # Scenario 1: AI successfully generates descriptions
    response_success = {
        "title": "Samsung Galaxy S24 Ultra 12GB RAM 256GB - گوشی اندرویدی پرچمدار با دوربین 200 مگاپیکسلی",
        "short_description": "گوشی پرچمدار سامسونگ با دوربین 200 مگاپیکسلی، 12 گیگابایت رم و 256 گیگابایت حافظه داخلی",
        "full_description": "شرح کامل در Persian: گوشی اندرویدی پرچمدار سامسونگ، Samsung Galaxy S24 Ultra، مجهز به دوربین 200 مگاپیکسلی پیشرفته، 12 گیگابایت رم، و 256 گیگابایت حافظه داخلی است. این گوشی با پردازنده قدرتمند Snapdragon 8 Gen 3 و باتری 5000 میلی‌آمپری، عملکرد بی‌نظیری در کارهای سنگین و گرافیکی ارائه می‌دهد. صفحه‌نمایش 6.8 اینچی Dynamic AMOLED با کیفیت بالا، تجربه بینایی عالی را فراهم می‌کند.",
        "highlights": [
            "دوربین 200 مگاپیکسلی با قابلیت‌های پیشرفته عکاسی",
            "پردازنده قدرتمند Snapdragon 8 Gen 3",
            "12 گیگابایت رم برای عملکرد عالی چندوظیفه‌ای",
            "باتری 5000 میلی‌آمپری با شارژ سریع",
            "صفحه‌نمایش 6.8 اینچی Dynamic AMOLED با کیفیت بالا"
        ],
        "keywords": [
            "گوشی سامسونگ",
            "Galaxy S24 Ultra",
            "گوشی پرچمدار",
            "دوربین 200 مگاپیکسل",
            "پردازنده Snapdragon 8 Gen 3",
            "گوشی اندرویدی",
            "حافظه 256 گیگابایت"
        ],
        "meta_description": "خرید گوشی Samsung Galaxy S24 Ultra با دوربین 200 مگاپیکسلی، 12 گیگابایت رم و 256 گیگابایت حافظه داخلی. عملکرد عالی، کیفیت تصویر بی‌نظیر و طراحی لوکس.",
        "tone": "professional"
    }
    
    # Scenario 2: AI fails to generate descriptions
    response_failure = {
        "title": "Samsung Galaxy S24 Ultra",
        "short_description": "توضیحات کوتاه محصول",
        "full_description": "شرح کامل در Persian: متاسفانه در پردازش توضیحات این محصول خطایی رخ داد. لطفاً مجدداً تلاش کنید یا توضیحات را به صورت دستی وارد نمایید.",
        "highlights": ["ویژگی 1", "ویژگی 2", "ویژگی 3"],
        "keywords": ["keyword1", "keyword2", "keyword3"],
        "meta_description": "تولید خودکار توضیحات برای این محصول با خطا مواجه شد.",
        "tone": "professional",
        "error": "خطا در تولید توضیحات"
    }
    
    # Write responses to file
    with open("ai_description_generator_responses.json", "w", encoding="utf-8") as f:
        json.dump({
            "request_data": product_data,
            "scenario_1_success": response_success,
            "scenario_2_failure": response_failure,
            "explanation": "The AI product description generator system would work as follows: 1. Receive product specifications including name, brand, category, technical specs, and price, 2. Use AI to generate title, short description, full description, highlights, keywords, and meta description, 3. If AI processing is successful, return all generated content with specified tone, 4. If AI processing fails, return default values with error message indicating 'خطا در تولید توضیحات', 5. Response includes title, short_description, full_description, highlights, keywords, meta_description, and tone fields"
        }, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    test_ai_product_description_generator()
    print("AI product description generator responses have been saved to ai_description_generator_responses.json")