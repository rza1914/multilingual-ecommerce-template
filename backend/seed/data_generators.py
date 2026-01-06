"""
Data Generators for Seed Script
Uses Faker with deterministic seed for reproducible data
"""

import random
from typing import List, Dict, Any
from faker import Faker
from datetime import datetime, timedelta

from .constants import (
    ROLE_USER, ROLE_ADMIN,
    ORDER_STATUSES, SHIPPING_METHODS, PAYMENT_METHODS,
    CATEGORIES, CATEGORY_TRANSLATIONS,
    COUNTRIES, US_STATES,
    ADMIN_PASSWORD_HASH, USER_PASSWORD_HASH,
    RANDOM_SEED
)


# Initialize Faker with seed for deterministic output
fake = Faker()
Faker.seed(RANDOM_SEED)
random.seed(RANDOM_SEED)

# Also create localized fakers for multilingual content
fake_fa = Faker('fa_IR')
fake_ar = Faker('ar_SA')
fake_fa.seed_instance(RANDOM_SEED)
fake_ar.seed_instance(RANDOM_SEED)


def generate_users(count: int = 1000, admin_count: int = 5) -> List[Dict[str, Any]]:
    """
    Generate user records
    
    Args:
        count: Number of regular users to generate
        admin_count: Number of admin users to generate
    
    Returns:
        List of user dictionaries ready for database insertion
    """
    users = []
    
    # Generate admin users first
    for i in range(admin_count):
        users.append({
            "email": f"admin{i+1}@luxstore.com",
            "username": f"admin{i+1}",
            "full_name": f"Admin User {i+1}",
            "hashed_password": ADMIN_PASSWORD_HASH,
            "is_active": True,
            "role": ROLE_ADMIN,
            "created_at": datetime.utcnow() - timedelta(days=random.randint(30, 365)),
        })
    
    # Generate regular users
    used_emails = set()
    used_usernames = set()
    
    for i in range(count):
        # Ensure unique email
        while True:
            email = fake.email()
            if email not in used_emails:
                used_emails.add(email)
                break
        
        # Ensure unique username
        while True:
            username = fake.user_name()[:20]  # Limit length
            if username not in used_usernames:
                used_usernames.add(username)
                break
        
        users.append({
            "email": email,
            "username": username,
            "full_name": fake.name(),
            "hashed_password": USER_PASSWORD_HASH,
            "is_active": random.random() > 0.05,  # 95% active
            "role": ROLE_USER,
            "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 365)),
        })
    
    return users


def generate_products(count: int = 200, admin_user_ids: List[int] = None) -> List[Dict[str, Any]]:
    """
    Generate product records with multilingual support
    
    Args:
        count: Number of products to generate
        admin_user_ids: List of admin user IDs to assign as product owners
    
    Returns:
        List of product dictionaries ready for database insertion
    """
    if admin_user_ids is None:
        admin_user_ids = [1]  # Default to first admin
    
    products = []
    
    # Product name templates per category
    product_templates = {
        "Electronics": ["Wireless {}", "Smart {}", "Digital {}", "Pro {}", "Ultra {}"],
        "Clothing": ["Classic {}", "Modern {}", "Casual {}", "Premium {}", "Designer {}"],
        "Home & Garden": ["Deluxe {}", "Compact {}", "Professional {}", "Eco {}", "Smart {}"],
        "Sports & Outdoors": ["Pro {}", "Elite {}", "Active {}", "Adventure {}", "Sport {}"],
        "Books": ["The Art of {}", "Guide to {}", "Mastering {}", "Introduction to {}", "Advanced {}"],
        "Toys & Games": ["Fun {}", "Magic {}", "Super {}", "Amazing {}", "Creative {}"],
        "Health & Beauty": ["Natural {}", "Organic {}", "Premium {}", "Pure {}", "Luxury {}"],
        "Automotive": ["Pro {}", "Heavy Duty {}", "Premium {}", "Universal {}", "Custom {}"],
        "Food & Grocery": ["Organic {}", "Fresh {}", "Premium {}", "Natural {}", "Gourmet {}"],
        "Jewelry & Watches": ["Elegant {}", "Classic {}", "Luxury {}", "Designer {}", "Vintage {}"]
    }
    
    product_items = {
        "Electronics": ["Headphones", "Speaker", "Camera", "Tablet", "Watch", "Charger", "Mouse", "Keyboard"],
        "Clothing": ["T-Shirt", "Jeans", "Jacket", "Dress", "Sweater", "Hoodie", "Pants", "Shirt"],
        "Home & Garden": ["Lamp", "Chair", "Table", "Planter", "Rug", "Vase", "Clock", "Mirror"],
        "Sports & Outdoors": ["Backpack", "Tent", "Ball", "Bike", "Weights", "Mat", "Bottle", "Shoes"],
        "Books": ["Cooking", "Photography", "Programming", "Design", "Business", "History", "Science", "Art"],
        "Toys & Games": ["Puzzle", "Robot", "Drone", "Car", "Doll", "Board Game", "Building Set", "Action Figure"],
        "Health & Beauty": ["Cream", "Serum", "Shampoo", "Lotion", "Mask", "Oil", "Soap", "Perfume"],
        "Automotive": ["Tool Kit", "Cleaner", "Cover", "Charger", "Light", "Mat", "Organizer", "Mirror"],
        "Food & Grocery": ["Coffee", "Tea", "Honey", "Nuts", "Chocolate", "Spices", "Oil", "Snacks"],
        "Jewelry & Watches": ["Necklace", "Ring", "Bracelet", "Earrings", "Watch", "Pendant", "Brooch", "Cufflinks"]
    }
    
    for i in range(count):
        category = random.choice(CATEGORIES)
        template = random.choice(product_templates[category])
        item = random.choice(product_items[category])
        
        title_en = template.format(item)
        
        # Generate base price based on category
        if category in ["Electronics", "Jewelry & Watches"]:
            base_price = random.uniform(50, 1500)
        elif category in ["Clothing", "Sports & Outdoors"]:
            base_price = random.uniform(20, 300)
        elif category in ["Books", "Food & Grocery"]:
            base_price = random.uniform(5, 50)
        else:
            base_price = random.uniform(10, 200)
        
        price = round(base_price, 2)
        
        # Some products have discounts
        has_discount = random.random() > 0.7  # 30% have discount
        discount = random.randint(5, 40) if has_discount else 0
        discount_price = round(price * (1 - discount / 100), 2) if has_discount else None
        
        # Generate description
        description_en = fake.paragraph(nb_sentences=3)
        
        # Persian title (transliteration + Persian words)
        title_fa = f"{item} {random.choice(['حرفه‌ای', 'لوکس', 'هوشمند', 'باکیفیت', 'ویژه'])}"
        description_fa = fake_fa.paragraph(nb_sentences=2) if hasattr(fake_fa, 'paragraph') else description_en
        
        # Arabic title
        title_ar = f"{item} {random.choice(['احترافي', 'فاخر', 'ذكي', 'ممتاز', 'خاص'])}"
        description_ar = fake_ar.paragraph(nb_sentences=2) if hasattr(fake_ar, 'paragraph') else description_en
        
        products.append({
            "title": title_en,
            "title_en": title_en,
            "title_fa": title_fa,
            "title_ar": title_ar,
            "description": description_en,
            "description_en": description_en,
            "description_fa": description_fa,
            "description_ar": description_ar,
            "price": price,
            "discount": float(discount),
            "discount_price": discount_price,
            "stock": random.randint(0, 500),
            "rating": round(random.uniform(3.0, 5.0), 1),
            "is_active": random.random() > 0.05,  # 95% active
            "is_featured": random.random() > 0.85,  # 15% featured
            "image_url": f"https://placehold.co/400x400/orange/white?text=Product+{i+1}",
            "category": category,
            "tags": ",".join(random.sample(["new", "sale", "popular", "trending", "limited"], k=random.randint(1, 3))),
            "owner_id": random.choice(admin_user_ids),
            "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 180)),
        })
    
    return products


def generate_orders(
    count: int = 500,
    user_ids: List[int] = None,
    product_data: List[Dict[str, Any]] = None
) -> tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Generate order and order_item records
    
    Args:
        count: Number of orders to generate
        user_ids: List of user IDs that can place orders
        product_data: List of product dicts with id and price info
    
    Returns:
        Tuple of (orders list, order_items list)
    """
    if user_ids is None:
        user_ids = list(range(6, 1006))  # Skip admin users
    
    if product_data is None:
        product_data = [{"id": i, "price": random.uniform(10, 500)} for i in range(1, 201)]
    
    orders = []
    order_items = []
    
    # Realistic distribution: some users order more than others
    # Power law distribution - 20% of users make 80% of orders
    active_buyers = random.sample(user_ids, k=int(len(user_ids) * 0.3))  # 30% are active buyers
    
    for order_id in range(1, count + 1):
        # Active buyers are more likely to be selected
        if random.random() > 0.2:
            user_id = random.choice(active_buyers)
        else:
            user_id = random.choice(user_ids)
        
        # Generate shipping info
        order_date = datetime.utcnow() - timedelta(days=random.randint(1, 180))
        
        # Each order has 1-5 items
        num_items = random.choices([1, 2, 3, 4, 5], weights=[40, 30, 15, 10, 5])[0]
        selected_products = random.sample(product_data, k=min(num_items, len(product_data)))
        
        # Calculate order totals
        subtotal = 0
        for product in selected_products:
            quantity = random.randint(1, 3)
            price_at_time = product.get("price", random.uniform(10, 500))
            item_total = price_at_time * quantity
            subtotal += item_total
            
            order_items.append({
                "order_id": order_id,
                "product_id": product.get("id", random.randint(1, 200)),
                "quantity": quantity,
                "price_at_time": round(price_at_time, 2),
            })
        
        subtotal = round(subtotal, 2)
        
        # Shipping cost based on method
        shipping_method = random.choice(SHIPPING_METHODS)
        shipping_costs = {"standard": 5.99, "express": 12.99, "nextday": 24.99}
        shipping_cost = shipping_costs[shipping_method]
        
        # Tax calculation (8% average)
        tax = round(subtotal * 0.08, 2)
        
        # Some orders have discounts
        order_discount = round(subtotal * random.choice([0, 0, 0, 0.05, 0.1, 0.15]), 2)
        
        total = round(subtotal + shipping_cost + tax - order_discount, 2)
        
        # Order status based on date
        days_ago = (datetime.utcnow() - order_date).days
        if days_ago > 14:
            status = random.choices(
                ["delivered", "cancelled"],
                weights=[90, 10]
            )[0]
        elif days_ago > 7:
            status = random.choices(
                ["delivered", "shipped", "cancelled"],
                weights=[60, 30, 10]
            )[0]
        elif days_ago > 3:
            status = random.choices(
                ["shipped", "processing", "confirmed"],
                weights=[40, 40, 20]
            )[0]
        else:
            status = random.choices(
                ["pending", "confirmed", "processing"],
                weights=[40, 40, 20]
            )[0]
        
        orders.append({
            "id": order_id,
            "user_id": user_id,
            "full_name": fake.name(),
            "email": fake.email(),
            "phone": fake.phone_number()[:20],
            "address": fake.street_address(),
            "city": fake.city(),
            "state": random.choice(US_STATES),
            "zip_code": fake.zipcode(),
            "country": random.choice(COUNTRIES),
            "shipping_method": shipping_method,
            "payment_method": random.choice(PAYMENT_METHODS),
            "subtotal": subtotal,
            "shipping_cost": shipping_cost,
            "tax": tax,
            "discount": order_discount,
            "total": total,
            "status": status,
            "created_at": order_date,
        })
    
    return orders, order_items