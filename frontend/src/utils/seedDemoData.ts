"""
Demo data seeding script for multilingual e-commerce template
This script creates 20 diverse demo products with English, Arabic, and Persian translations
"""

import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import Product
from app.models.user import User

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config import settings


def seed_demo_data():
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # Check if demo data already exists
        existing_products = db.query(Product).count()
        if existing_products > 0:
            print("Demo data already exists. Clearing existing data...")
            db.query(Product).delete()
            db.commit()

        # Create demo products with string categories
        demo_products = [
            {
                'title_en': 'Wireless Headphones',
                'title_ar': 'سماعات لاسلكية',
                'title_fa': 'هدفون بی‌سیم',
                'description_en': 'High-quality wireless headphones with noise cancellation.',
                'description_ar': 'سماعات لاسلكية عالية الجودة مع مقاومة للضوضاء.',
                'description_fa': 'هدفون بی‌سیم با کیفیت بالا و قابلیت حذف نویز.',
                'price': 129.99,
                'category': 'Electronics',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/3b82f6/FFFFFF?text=Headphones',
                'is_featured': True,
                'stock': 50
            },
            {
                'title_en': 'Smart Watch',
                'title_ar': 'ساعة ذكية',
                'title_fa': 'ساعت هوشمند',
                'description_en': 'Advanced smartwatch with health monitoring features.',
                'description_ar': 'ساعة ذكية متطورة مع ميزات مراقبة الصحة.',
                'description_fa': 'ساعت هوشمند پیشرفته با قابلیت‌های مانیتورینگ سلامت.',
                'price': 249.99,
                'category': 'Electronics',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/ef4444/FFFFFF?text=Smartwatch',
                'is_featured': True,
                'stock': 30
            },
            {
                'title_en': 'Programming Book',
                'title_ar': 'كتاب البرمجة',
                'title_fa': 'کتاب برنامه‌نویسی',
                'description_en': 'Comprehensive guide to modern programming techniques.',
                'description_ar': 'دليل شامل لتقنيات البرمجة الحديثة.',
                'description_fa': 'راهنمای جامع تکنیک‌های برنامه‌نویسی مدرن.',
                'price': 49.99,
                'category': 'Books',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/10b981/FFFFFF?text=Book',
                'is_featured': False,
                'stock': 100
            },
            {
                'title_en': 'Running Shoes',
                'title_ar': 'أحذية الجري',
                'title_fa': 'کفش دویدن',
                'description_en': 'Comfortable running shoes for all terrains.',
                'description_ar': 'أحذية رunning مريحة لجميع أنواع الأسطح.',
                'description_fa': 'کفش‌های دویدن راحت برای تمام زمینه‌ها.',
                'price': 89.99,
                'category': 'Clothing',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/8b5cf6/FFFFFF?text=Shoes',
                'is_featured': True,
                'stock': 75
            },
            {
                'title_en': 'Bluetooth Speaker',
                'title_ar': 'مكبر صوت بلوتوث',
                'title_fa': 'اسپیکر بلوتوثی',
                'description_en': 'Portable speaker with excellent sound quality.',
                'description_ar': 'مكبر صوت محمول بجودة صوت ممتازة.',
                'description_fa': 'اسپیکر قابل حمل با کیفیت صدای عالی.',
                'price': 79.99,
                'category': 'Electronics',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/f97316/FFFFFF?text=Speaker',
                'is_featured': True,
                'stock': 40
            },
            {
                'title_en': 'Coffee Maker',
                'title_ar': 'ماكينة القهوة',
                'title_fa': 'ماشین قهوه',
                'description_en': 'Automatic coffee maker with programmable settings.',
                'description_ar': 'ماكينة قهوة تلقائية مع إعدادات قابلة للبرمجة.',
                'description_fa': 'ماشین قهوه خودکار با تنظیمات قابل برنامه‌ریزی.',
                'price': 119.99,
                'category': 'Electronics',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/06b6d4/FFFFFF?text=Coffee',
                'is_featured': False,
                'stock': 25
            },
            {
                'title_en': 'Backpack',
                'title_ar': 'حقيبة الظهر',
                'title_fa': 'کوله پشتی',
                'description_en': 'Durable backpack for hiking and travel.',
                'description_ar': 'حقيبة ظهر متينة للتسلق والسفر.',
                'description_fa': 'کوله پشتی مقاوم برای کوهنوردی و مسافرت.',
                'price': 59.99,
                'category': 'Clothing',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/84cc16/FFFFFF?text=Backpack',
                'is_featured': True,
                'stock': 60
            },
            {
                'title_en': 'Wireless Mouse',
                'title_ar': 'فأرة لاسلكية',
                'title_fa': 'ماوس بی‌سیم',
                'description_en': 'Ergonomic wireless mouse with long battery life.',
                'description_ar': 'فأرة لاسلكية مريحة مع بطارية تدوم طويلاً.',
                'description_fa': 'ماوس بی‌سیم ارگونومیک با عمر باتری طولانی.',
                'price': 39.99,
                'category': 'Electronics',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/ec4899/FFFFFF?text=Mouse',
                'is_featured': False,
                'stock': 85
            },
            {
                'title_en': 'Yoga Mat',
                'title_ar': 'بساط اليوغا',
                'title_fa': 'فرش یوگا',
                'description_en': 'Non-slip yoga mat for all types of exercises.',
                'description_ar': 'بساط يوغا مانع للانزلاق لجميع أنواع التمارين.',
                'description_fa': 'فرش یوگا ضد لغزش برای تمام انواع تمرینات.',
                'price': 29.99,
                'category': 'Clothing',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/f59e0b/FFFFFF?text=Yoga',
                'is_featured': False,
                'stock': 70
            },
            {
                'title_en': 'Sunglasses',
                'title_ar': 'ن眼镜 شمسية',
                'title_fa': 'عینک آفتابی',
                'description_en': 'UV protection sunglasses with polarized lenses.',
                'description_ar': 'نظارات شمسية بحماية من الأشعة فوق البنفسجية و عدسات مزدوجة.',
                'description_fa': 'عینک آفتابی با محافظت از UV و لنزهای قطبی.',
                'price': 89.99,
                'category': 'Clothing',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/64748b/FFFFFF?text=Glasses',
                'is_featured': True,
                'stock': 45
            },
            {
                'title_en': 'Laptop Bag',
                'title_ar': 'حقيبة الكمبيوتر المحمول',
                'title_fa': 'کیف لپ تاپ',
                'description_en': 'Protective laptop bag with multiple compartments.',
                'description_ar': 'حقيبة للكمبيوتر المحمول واقية مع عدة أقسام.',
                'description_fa': 'کیف محافظ لپ تاپ با چندین جا مخصوص.',
                'price': 49.99,
                'category': 'Clothing',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/6366f1/FFFFFF?text=Laptop+Bag',
                'is_featured': False,
                'stock': 50
            },
            {
                'title_en': 'Fitness Tracker',
                'title_ar': 'متتبع اللياقة البدنية',
                'title_fa': 'دستگاه فیتنس',
                'description_en': 'Advanced fitness tracker with heart rate monitor.',
                'description_ar': 'متتبع لياقة متطورة مع مراقبة معدل ضربات القلب.',
                'description_fa': 'دستگاه فیتنس پیشرفته با مانیتور ضربان قلب.',
                'price': 129.99,
                'category': 'Electronics',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/1f2937/FFFFFF?text=Fitness',
                'is_featured': True,
                'stock': 35
            },
            {
                'title_en': 'Noise Cancelling Headphones',
                'title_ar': 'السماعات المقاومة للضوضاء',
                'title_fa': 'هدفون حذف نویز',
                'description_en': 'Premium noise cancelling headphones with superior sound quality.',
                'description_ar': 'سماعات ممتازة مقاومة للضوضاء بجودة صوت ممتازة.',
                'description_fa': 'هدفون حذف نویز پریمیوم با کیفیت صدای عالی.',
                'price': 199.99,
                'category': 'Electronics',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/4f46e5/FFFFFF?text=NC+Headphones',
                'is_featured': True,
                'stock': 20
            },
            {
                'title_en': 'Digital Camera',
                'title_ar': 'كاميرا رقمية',
                'title_fa': 'دوربین دیجیتال',
                'description_en': 'High-resolution digital camera with advanced photo capabilities.',
                'description_ar': 'كاميرا رقمية عالية الدقة مع ميزات تصوير متطورة.',
                'description_fa': 'دوربین دیجیتال با کیفیت بالا و قابلیت‌های عکاسی پیشرفته.',
                'price': 599.99,
                'category': 'Electronics',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/7c3aed/FFFFFF?text=Camera',
                'is_featured': True,
                'stock': 15
            },
            {
                'title_en': 'Desk Lamp',
                'title_ar': 'مصباح المكتب',
                'title_fa': 'چراغ میزکار',
                'description_en': 'Adjustable LED desk lamp with multiple brightness settings.',
                'description_ar': 'مصباح مكتب LED قابل للتعديل مع إعدادات سطوع متعددة.',
                'description_fa': 'چراغ میزکار LED قابل تنظیم با چندین تنظیم روشنایی.',
                'price': 44.99,
                'category': 'Home & Kitchen',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/f59e0b/FFFFFF?text=Lamp',
                'is_featured': False,
                'stock': 90
            },
            {
                'title_en': 'Water Bottle',
                'title_ar': 'زجاجة الماء',
                'title_fa': 'بطری آب',
                'description_en': 'Insulated stainless steel water bottle keeps drinks cold for 24 hours.',
                'description_ar': 'زجاجة ماء من الفولاذ المقاوم للصدأ تحافظ على البرودة لمدة 24 ساعة.',
                'description_fa': 'بطری استیل عایق که نوشیدنی‌ها را تا 24 ساعت سرد نگه می‌دارد.',
                'price': 24.99,
                'category': 'Home & Kitchen',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/10b981/FFFFFF?text=Bottle',
                'is_featured': False,
                'stock': 120
            },
            {
                'title_en': 'Desk Chair',
                'title_ar': 'كرسي المكتب',
                'title_fa': 'صندلی میزکار',
                'description_en': 'Ergonomic office chair with adjustable height and lumbar support.',
                'description_ar': 'كرسي مكتب مريح بارتفاع قابل للتعديل و دعم لأسفل الظهر.',
                'description_fa': 'صندلی دفتر کار ارگونومیک با ارتفاع قابل تنظیم و حمایت کمر.',
                'price': 189.99,
                'category': 'Home & Kitchen',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/ef4444/FFFFFF?text=Chair',
                'is_featured': True,
                'stock': 25
            },
            {
                'title_en': 'Tablet',
                'title_ar': 'جهاز لوحي',
                'title_fa': 'تبلت',
                'description_en': 'High-performance tablet with large display and long battery life.',
                'description_ar': 'جهاز لوحي عالي الأداء بشاشة كبيرة و بطارية تدوم طويلاً.',
                'description_fa': 'تبلت با عملکرد بالا با نمایشگر بزرگ و عمر باتری طولانی.',
                'price': 399.99,
                'category': 'Electronics',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/8b5cf6/FFFFFF?text=Tablet',
                'is_featured': True,
                'stock': 30
            },
            {
                'title_en': 'Wireless Charger',
                'title_ar': 'شاحن لاسلكي',
                'title_fa': 'شارژر بی‌سیم',
                'description_en': 'Fast wireless charging pad compatible with all Qi-enabled devices.',
                'description_ar': 'شاحن لاسلكي سريع متوافق مع جميع الأجهزة المزودة بخاصية Qi.',
                'description_fa': 'پد شارژ بی‌سیم سریع سازگار با تمام دستگاه‌های دارای Qi.',
                'price': 34.99,
                'category': 'Electronics',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/06b6d4/FFFFFF?text=Charger',
                'is_featured': False,
                'stock': 100
            },
            {
                'title_en': 'Smart Home Hub',
                'title_ar': 'جهاز التحكم الذكي بالمنزل',
                'title_fa': 'مرکز خانه هوشمند',
                'description_en': 'Central hub to control all your smart home devices.',
                'description_ar': 'جهاز مركزي للتحكم في جميع أجهزة منزلك الذكية.',
                'description_fa': 'مرکز اصلی برای کنترل تمام دستگاه‌های خانه هوشمند شما.',
                'price': 149.99,
                'category': 'Electronics',  # Use string category instead of foreign key
                'image_url': 'https://placehold.co/600x400/06b6d4/FFFFFF?text=Smart+Hub',
                'is_featured': True,
                'stock': 18
            }
        ]

        for product_data in demo_products:
            product = Product(
                title=product_data['title_en'],
                title_en=product_data['title_en'],
                title_ar=product_data['title_ar'],
                title_fa=product_data['title_fa'],
                description=product_data['description_en'],
                description_en=product_data['description_en'],
                description_ar=product_data['description_ar'],
                description_fa=product_data['description_fa'],
                price=product_data['price'],
                category=product_data['category'],  # Use string category instead of foreign key
                image_url=product_data['image_url'],
                stock=product_data['stock'],
                is_active=True,
                is_featured=product_data['is_featured']
            )
            db.add(product)

        # Create sample users including the required admin and regular user
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        def verify_password(plain_password, hashed_password):
            return pwd_context.verify(plain_password, hashed_password)

        def get_password_hash(password):
            return pwd_context.hash(password)

        # Create admin user
        admin_user = User(
            email='admin@demo.com',
            username='admin',
            full_name='Admin User',
            hashed_password=get_password_hash('admin123'),
            role='admin'
        )
        
        # Create regular user
        regular_user = User(
            email='user@demo.com',
            username='user',
            full_name='Regular User',
            hashed_password=get_password_hash('user123'),
            role='user'
        )

        # Check if users already exist
        existing_admin = db.query(User).filter(User.email == 'admin@demo.com').first()
        existing_user = db.query(User).filter(User.email == 'user@demo.com').first()
        
        if not existing_admin:
            db.add(admin_user)
        if not existing_user:
            db.add(regular_user)

        db.commit()
        print(f"Successfully created {len(demo_products)} demo products with multilingual support")
        print(f"Created admin user: admin@demo.com")
        print(f"Created regular user: user@demo.com")

    except Exception as e:
        print(f"Error seeding demo data: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()