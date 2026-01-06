"""
Seed Data Constants
Enums, statuses, and fixed values for seed generation
"""

# User Roles
ROLE_USER = "user"
ROLE_ADMIN = "admin"

# Order Statuses
ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]

# Shipping Methods
SHIPPING_METHODS = ["standard", "express", "nextday"]

# Payment Methods
PAYMENT_METHODS = ["card", "cod"]

# Product Categories (English)
CATEGORIES = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Toys & Games",
    "Health & Beauty",
    "Automotive",
    "Food & Grocery",
    "Jewelry & Watches"
]

# Category Translations
CATEGORY_TRANSLATIONS = {
    "Electronics": {
        "en": "Electronics",
        "fa": "الکترونیک",
        "ar": "إلكترونيات"
    },
    "Clothing": {
        "en": "Clothing",
        "fa": "پوشاک",
        "ar": "ملابس"
    },
    "Home & Garden": {
        "en": "Home & Garden",
        "fa": "خانه و باغ",
        "ar": "المنزل والحديقة"
    },
    "Sports & Outdoors": {
        "en": "Sports & Outdoors",
        "fa": "ورزش و فضای باز",
        "ar": "الرياضة والهواء الطلق"
    },
    "Books": {
        "en": "Books",
        "fa": "کتاب",
        "ar": "كتب"
    },
    "Toys & Games": {
        "en": "Toys & Games",
        "fa": "اسباب‌بازی و بازی",
        "ar": "ألعاب"
    },
    "Health & Beauty": {
        "en": "Health & Beauty",
        "fa": "سلامت و زیبایی",
        "ar": "الصحة والجمال"
    },
    "Automotive": {
        "en": "Automotive",
        "fa": "خودرو",
        "ar": "السيارات"
    },
    "Food & Grocery": {
        "en": "Food & Grocery",
        "fa": "غذا و خواربار",
        "ar": "الطعام والبقالة"
    },
    "Jewelry & Watches": {
        "en": "Jewelry & Watches",
        "fa": "جواهرات و ساعت",
        "ar": "المجوهرات والساعات"
    }
}

# Countries for shipping
COUNTRIES = ["United States", "Canada", "United Kingdom", "Germany", "France", "Iran", "UAE", "Saudi Arabia"]

# US States for addresses
US_STATES = ["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"]

# Fixed admin password (hashed version of 'admin123')
# In production, use proper password hashing
ADMIN_PASSWORD_HASH = "$2b$12$TbXG24VVIgV1IF6PGrqZSeWi2TgakDj2GqsdBnoU8Ipw5QWWgrgMy"

# Fixed user password (hashed version of 'user123')
USER_PASSWORD_HASH = "$2b$12$mqJG.F2bBny5qVIOzKi0DeTb9TIz0kzV7E8r9hAZOiaD8JWURX69S"

# Seed for deterministic randomness
RANDOM_SEED = 42