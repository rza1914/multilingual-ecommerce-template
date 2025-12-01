# Developer Guide - Multilingual E-Commerce Platform

## Table of Contents
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Architecture Overview](#architecture-overview)
- [Coding Standards](#coding-standards)
- [API Design Guidelines](#api-design-guidelines)
- [Database Design Guidelines](#database-design-guidelines)
- [Testing Strategy](#testing-strategy)
- [Performance Optimization](#performance-optimization)
- [Security Best Practices](#security-best-practices)
- [Multilingual Implementation](#multilingual-implementation)
- [AI Integration](#ai-integration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting Guide](#troubleshooting-guide)

## Project Structure

```
multilingual-ecommerce-template/
├── backend/                    # Python/FastAPI backend
│   ├── alembic/               # Database migrations
│   │   ├── versions/          # Migration files
│   │   ├── env.py             # Migration environment
│   │   └── script.py.mako     # Migration template
│   ├── app/                   # Application code
│   │   ├── api/               # API endpoints
│   │   │   └── v1/           # API version 1
│   │   │       ├── auth.py    # Authentication endpoints
│   │   │       ├── products.py # Product endpoints
│   │   │       ├── orders.py  # Order endpoints
│   │   │       ├── cart.py    # Cart endpoints
│   │   │       ├── admin.py   # Admin endpoints
│   │   │       └── smart_search.py # AI search endpoints
│   │   ├── models/            # Database models
│   │   │   ├── user.py        # User model
│   │   │   ├── product.py     # Product model
│   │   │   ├── order.py       # Order model
│   │   │   └── bot.py         # Bot model
│   │   ├── schemas/           # Pydantic schemas
│   │   │   ├── user.py        # User schemas
│   │   │   ├── product.py     # Product schemas
│   │   │   ├── order.py       # Order schemas
│   │   │   └── bot.py         # Bot schemas
│   │   ├── services/          # Business logic
│   │   │   ├── ai_service.py  # AI service
│   │   │   ├── recommendation_service.py # Recommendations
│   │   │   ├── cart_service.py # Cart service
│   │   │   └── image_search_service.py # Image search
│   │   ├── core/              # Core utilities
│   │   │   ├── auth.py        # Authentication utilities
│   │   │   ├── config.py      # Configuration
│   │   │   ├── security.py    # Security utilities
│   │   │   └── deps.py        # Dependency injection
│   │   ├── utils/             # Utility functions
│   │   │   ├── cache_utils.py # Caching utilities
│   │   │   ├── image_utils.py # Image handling
│   │   │   └── i18n_utils.py  # Internationalization
│   │   ├── middleware/        # Middleware
│   │   │   ├── csrf_middleware.py # CSRF protection
│   │   │   └── etag_middleware.py # HTTP caching
│   │   ├── contexts/          # Context managers
│   │   ├── database.py        # Database setup
│   │   └── main.py            # FastAPI app instance
│   ├── tests/                 # Backend tests
│   │   ├── conftest.py        # Test configuration
│   │   ├── test_auth.py       # Authentication tests
│   │   ├── test_products.py   # Product tests
│   │   ├── test_orders.py     # Order tests
│   │   └── test_ai.py         # AI functionality tests
│   ├── requirements.txt       # Python dependencies
│   ├── alembic.ini            # Migration config
│   ├── create_admin.py        # Admin creation script
│   ├── run_migrations.py      # Migration runner script
│   └── run.py                 # Application entry point
│
├── frontend/                  # React/TypeScript frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── assets/           # Images, fonts, etc.
│   │   ├── components/       # Reusable components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── products/     # Product components
│   │   │   ├── cart/         # Cart components
│   │   │   ├── orders/       # Order components
│   │   │   ├── admin/        # Admin components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── search/       # Search components
│   │   │   └── common/       # Common/shared components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript types
│   │   ├── data/             # Static data
│   │   ├── utils/            # Utility functions
│   │   ├── config/           # Configuration
│   │   ├── styles/           # CSS and styling
│   │   ├── locales/          # Translation files
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Application entry point
│   ├── package.json          # Node dependencies
│   ├── tsconfig.json         # TypeScript config
│   └── vite.config.ts        # Vite config
│
├── docs/                     # Documentation
│   ├── API_DOCUMENTATION.md  # API documentation
│   ├── DATABASE_SCHEMA.md    # Database schema
│   ├── DEPLOYMENT_GUIDE.md   # Deployment documentation
│   ├── DEVELOPER_GUIDE.md    # This file
│   └── USER_GUIDE.md         # User documentation
│
├── scripts/                  # Automation scripts
│   ├── setup_dev.sh          # Development setup
│   ├── migrate_db.sh         # Database migration
│   └── run_tests.sh          # Test runner
│
├── .github/                  # GitHub configuration
│   └── workflows/            # CI/CD workflows
├── docker/                   # Docker configuration
├── docker-compose.yml        # Docker compose setup
├── README.md                 # Project overview
└── requirements.txt          # Root dependencies file
```

## Development Setup

### Prerequisites
- **Node.js** 18+ (for frontend development)
- **Python** 3.10+ (for backend development)
- **Git** (version control)
- **Docker** (optional, for containerized development)
- **PostgreSQL** (optional, for local database)
- **Redis** (optional, for caching)

### Initial Setup

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/multilingual-ecommerce-template.git
cd multilingual-ecommerce-template
```

2. **Setup backend environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create admin user
python create_admin.py
```

3. **Setup frontend environment:**
```bash
cd ../frontend
npm install
```

4. **Set up environment files:**

**backend/.env**
```env
# Database
DATABASE_URL=sqlite:///./test.db  # For development
# DATABASE_URL=postgresql://user:pass@localhost:5432/ecommerce  # For production

# Security
SECRET_KEY=your-super-secret-key-here-32-chars-minimum
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# API Keys
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_GEMINI_API_KEY=your-google-gemini-api-key

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAILS_FROM_EMAIL=your-email@gmail.com
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME="Development Store"
VITE_SUPPORTED_LANGUAGES="en,fa,ar"
VITE_DEFAULT_LANGUAGE="en"
VITE_ENABLE_RTL=true
```

5. **Run the applications:**
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

## Architecture Overview

### Frontend Architecture

The frontend follows a component-based architecture with the following principles:

#### Component Structure
```
components/
├── common/           # Reusable components (buttons, inputs, etc.)
├── layout/           # Layout components (header, footer, sidebar)
├── auth/             # Authentication components
├── products/         # Product-specific components
├── cart/             # Cart components
├── orders/           # Order components
├── admin/            # Admin components
├── search/           # Search components
└── ui/               # UI primitives and design system
```

#### State Management
- **Global State**: React Context API for authentication and cart
- **Component State**: React hooks (useState, useEffect, etc.)
- **API Handling**: Custom hooks for API calls with error handling
- **Caching**: React Query/SWR for server state management

#### Routing Strategy
- **Code Splitting**: Lazy loading with React.lazy and Suspense
- **Protected Routes**: Conditional rendering based on authentication
- **Nested Routing**: Hierarchical route structure for complex pages

### Backend Architecture

The backend follows a service-oriented architecture with:

#### Layered Design
- **API Layer**: FastAPI endpoints (thin layer, minimal business logic)
- **Service Layer**: Business logic and complex operations
- **Data Layer**: Models and database operations
- **Utility Layer**: Shared utilities and helpers

#### Dependency Injection
- **Function-level**: FastAPI dependencies (Depends)
- **Class-level**: Service instantiation in endpoints

#### Caching Strategy
- **Application Level**: In-memory caching with TTL
- **HTTP Level**: ETag implementation for conditional requests
- **Database Level**: Query result caching for expensive operations

## Coding Standards

### Backend (Python)

#### Code Style
- **PEP 8** compliance using Black formatter
- **Type hints** for all function signatures
- **Docstrings** in Google format
- **Logging** instead of print statements

#### Example Python Code Block:
```python
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.product import Product as ProductModel
from app.schemas.product import ProductCreate, ProductUpdate
from app.utils.cache_utils import cached


def get_product_with_cache(db: Session, product_id: int) -> Optional[Dict[str, Any]]:
    """
    Get a product by ID with caching support.
    
    Args:
        db: Database session
        product_id: ID of the product to retrieve
        
    Returns:
        Product data dictionary or None if not found
        
    Example:
        >>> product = get_product(db, 1)
        >>> print(product['title'])  # 'Sample Product'
    """
    cache_key = f"product:{product_id}"
    
    # Try cache first
    cached_product = PRODUCT_CACHE.get(cache_key)
    if cached_product:
        return cached_product
    
    # Fetch from database
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        return None
    
    # Convert to dict and cache
    product_dict = product.__dict__
    product_dict.pop('_sa_instance_state', None)  # Remove SQLAlchemy internal state
    
    PRODUCT_CACHE.set(cache_key, product_dict, ttl=300)  # Cache for 5 minutes
    return product_dict


def create_product(db: Session, product_data: ProductCreate, owner_id: int) -> ProductModel:
    """
    Create a new product in the database.
    
    Args:
        db: Database session
        product_data: Product creation data validated by Pydantic schema
        owner_id: ID of the user who owns this product
        
    Returns:
        Created ProductModel instance
        
    Raises:
        IntegrityError: If product creation violates database constraints
    """
    # Create product instance from validated data
    db_product = ProductModel(
        **product_data.model_dump(),
        owner_id=owner_id
    )
    
    # Add to database session and commit
    db.add(db_product)
    db.commit()
    
    # Refresh to get generated ID and other auto-populated fields
    db.refresh(db_product)
    
    # Clear related caches that might be affected
    clear_product_list_cache()
    
    return db_product
```

#### Naming Conventions
- **Functions**: `snake_case` for public, `_snake_case` for private
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Variables**: `snake_case`

### Frontend (TypeScript/React)

#### Code Style
- **Airbnb JavaScript Style Guide** with TypeScript extensions
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities
- **Import Organization**: Standard library > 3rd party > Local modules

#### Example TypeScript Component:
```tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../types/product.types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Calculate discount with safe number handling
  const hasDiscount = product.discount && product.discount > 0;
  const safePrice = Number(product.price) || 0;
  const safeDiscount = Number(product.discount) || 0;
  const discountedPrice = hasDiscount
    ? safePrice * (1 - safeDiscount / 100)
    : safePrice;

  // Handle quantity changes
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > (product.stock || 0)) return;
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    } else {
      addToCart(product, quantity);
    }
  };

  // Get localized content
  const title = product.title || product.title_en || 'Untitled';
  const description = product.description || product.description_en || 'No description';

  return (
    <div 
      className={`glass-card group relative overflow-hidden will-change-transform hover:scale-105 transition-transform ${
        isHovered ? 'ring-2 ring-orange-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square overflow-hidden rounded-t-3xl">
        <img
          src={product.image_url || '/placeholder-product.jpg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 right-4 glass-orange p-2 rounded-full">
            <span className="text-white font-bold text-sm">-{safeDiscount}%</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
            {title}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {product.category}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex justify-between items-center">
          <div>
            {hasDiscount ? (
              <div>
                <span className="text-xl font-bold text-orange-500">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                  ${safePrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-orange-500">
                ${safePrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(Number(product.rating) || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                {(Number(product.rating) || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-3 py-1 text-gray-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              disabled={quantity >= (product.stock || 0)}
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              product.stock && product.stock > 0
                ? 'bg-gradient-orange text-white hover:opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!product.stock || product.stock <= 0}
          >
            {product.stock && product.stock > 0 ? t('cart.addToCart') : t('product.outOfStock')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
```

#### Naming Conventions
- **Components**: PascalCase (ProductCard, UserProfile)
- **Functions**: camelCase (handleClick, formatCurrency)
- **Constants**: UPPER_SNAKE_CASE (MAX_PRODUCTS_PER_PAGE)
- **Hooks**: camelCase starting with use (useCart, useAuth)

## API Design Guidelines

### RESTful Principles
- **Consistent endpoints**: `/api/v1/resources/{id}`
- **Standard HTTP methods**: GET, POST, PUT, DELETE
- **Meaningful HTTP status codes**: 200, 201, 400, 401, 403, 404, 500
- **JSON responses**: Consistent structure with data/error fields

### Response Format
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Product Name",
    "price": 99.99
  },
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Handling
- **Consistent error format**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Authentication & Authorization
- **JWT Bearer tokens** for authentication
- **RBAC** (Role-Based Access Control) for authorization
- **API keys** for external service access
- **CSRF protection** for state-changing requests

### Rate Limiting
- **Per-endpoint limits**: Different limits for different operations
- **Per-IP limits**: Prevent abuse from single sources
- **Per-user limits**: Fair usage among registered users

## Database Design Guidelines

### SQLAlchemy Models
- **Explicit column types**: Specify types and constraints
- **Relationship definitions**: Proper back_populates for bidirectional relationships
- **Indexing**: Index frequently queried fields
- **Constraints**: Use check constraints where appropriate

### Example Model:
```python
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False, index=True)
    discount_price = Column(Float, nullable=True)
    discount = Column(Float, default=0.0, index=True)
    stock = Column(Integer, default=100, index=True)
    rating = Column(Float, default=0.0, index=True)
    is_active = Column(Boolean, default=True, index=True)
    is_featured = Column(Boolean, default=False, index=True)
    image_url = Column(String, nullable=True)
    category = Column(String, index=True, nullable=True)
    tags = Column(String, nullable=True)

    # Multilingual fields
    title_en = Column(String, nullable=True)
    title_fa = Column(String, nullable=True)
    title_ar = Column(String, nullable=True)
    description_en = Column(Text, nullable=True)
    description_fa = Column(Text, nullable=True)
    description_ar = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    owner = relationship("User", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        # Composite indexes for common queries
        Index('idx_products_category_active', 'category', 'is_active'),
        Index('idx_products_featured_active', 'is_featured', 'is_active'),
        Index('idx_products_price_range', 'price', 'is_active'),
    )
```

### Migration Guidelines
- **Always use Alembic** for schema changes
- **Test migrations** before applying to production
- **Create backward-compatible** migrations when possible
- **Document breaking changes** in release notes

## Testing Strategy

### Backend Testing

#### Unit Tests
- **Pydantic Schemas**: Test validation rules
- **Utility Functions**: Test edge cases and error conditions
- **Business Logic**: Test service layer functions independently

#### Integration Tests
- **API Endpoints**: Test complete request/response cycle
- **Database Operations**: Test complex queries and transactions
- **External Services**: Mock external API calls

#### Example Test:
```python
# tests/test_products.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base
from app.models.user import User
from app.models.product import Product
from app.core.security import get_password_hash
from app.schemas.product import ProductCreate

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

@pytest.fixture
def client():
    """Create test client with test database"""
    Base.metadata.drop_all(bind=engine)  # Clean slate for each test
    Base.metadata.create_all(bind=engine)
    
    with TestClient(app) as c:
        yield c

def test_create_product(client):
    """Test creating a product"""
    # Create a user first
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "full_name": "Test User",
        "password": "testpassword123"
    }
    
    # Register user
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 200
    
    # Login to get token
    login_response = client.post("/api/v1/auth/token", 
                                data={"username": "test@example.com", "password": "testpassword123"})
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    
    # Create product
    product_data = {
        "title": "Test Product",
        "description": "Test Description",
        "price": 99.99,
        "stock": 10,
        "category": "Electronics"
    }
    
    response = client.post(
        "/api/v1/products/",
        json=product_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Product"
    assert data["price"] == 99.99
    assert data["stock"] == 10

def test_product_list_pagination(client):
    """Test product listing with pagination"""
    # Add multiple products to database
    for i in range(15):
        product_data = {
            "title": f"Test Product {i}",
            "description": f"Test Description {i}",
            "price": 99.99 + i,
            "stock": 10 + i,
            "category": "Electronics"
        }
        
        response = client.post(
            "/api/v1/products/", 
            json=product_data,
            headers={"Authorization": "Bearer valid_token"}  # Mock token
        )
        assert response.status_code == 200
    
    # Test pagination
    response = client.get("/api/v1/products/?skip=0&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
```

### Frontend Testing

#### Unit Tests
- **React Components**: Test rendering, user interactions, state changes
- **Custom Hooks**: Test business logic separately from UI
- **Utility Functions**: Test helper functions independently

#### Integration Tests
- **API Service Calls**: Test actual API interactions
- **Context Providers**: Test state management
- **Form Submissions**: Test complete user workflows

#### Example Test:
```tsx
// tests/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CartProvider } from '../contexts/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types/product.types';

// Mock translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));

// Mock cart context
const mockAddToCart = vi.fn();
vi.mock('../contexts/CartContext', () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
    cartItems: [],
    totalItems: 0
  })
}));

describe('ProductCard Component', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    discount: 10,
    stock: 5,
    rating: 4.5,
    is_featured: true,
    category: 'Electronics',
    image_url: 'test.jpg'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(
      <CartProvider value={{ 
        cartItems: [], 
        addToCart: mockAddToCart, 
        totalItems: 0,
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        cartTotal: 0,
        loading: false
      }}>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('$89.99')).toBeInTheDocument(); // With 10% discount
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('calls addToCart when add to cart button is clicked', () => {
    render(
      <CartProvider value={{ 
        cartItems: [], 
        addToCart: mockAddToCart, 
        totalItems: 0,
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        cartTotal: 0,
        loading: false
      }}>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('disables add to cart button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    
    render(
      <CartProvider value={{ 
        cartItems: [], 
        addToCart: mockAddToCart, 
        totalItems: 0,
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        cartTotal: 0,
        loading: false
      }}>
        <ProductCard product={outOfStockProduct} />
      </CartProvider>
    );

    const addToCartButton = screen.getByRole('button', { name: /out of stock/i });
    expect(addToCartButton).toBeDisabled();
  });

  it('updates quantity when quantity buttons are clicked', () => {
    render(
      <CartProvider value={{ 
        cartItems: [], 
        addToCart: mockAddToCart, 
        totalItems: 0,
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        cartTotal: 0,
        loading: false
      }}>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    const incrementBtn = screen.getByRole('button', { name: '+' });
    fireEvent.click(incrementBtn);
    fireEvent.click(incrementBtn);

    // Verify the component updated appropriately
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
```

#### Testing Tools
- **Backend**: pytest, pytest-cov, pytest-mock
- **Frontend**: Vitest, React Testing Library, MSW (Mock Service Worker)
- **E2E**: Playwright or Cypress (future implementation)

## Performance Optimization

### Frontend Optimizations

#### Code Splitting
- **Route-based splitting**: Each route dynamically imports its components
- **Component-level splitting**: Heavy components like modals and admin panels
- **Library splitting**: Large libraries loaded asynchronously

#### Image Optimization
- **Lazy loading**: Images load only when entering viewport
- **Multiple formats**: WebP with fallback to JPEG/PNG
- **Responsive sizes**: Different image sizes for different screen resolutions
- **Placeholders**: Loading placeholders while images load

#### Caching Strategies
- **HTTP caching**: ETag implementation and proper headers
- **Service workers**: Progressive web app features
- **Client-side caching**: React Query for API response caching
- **Component memoization**: React.memo and useMemo hooks

### Backend Optimizations

#### Database Optimization
- **Indexing**: Proper indexes on frequently queried columns
- **Query optimization**: Join queries, eager loading to avoid N+1 problems
- **Connection pooling**: SQLAlchemy connection pooling
- **Query caching**: Result caching for expensive queries

#### API Optimization
- **Pagination**: Default limits and offset-based pagination
- **Field selection**: Allow clients to select specific fields
- **Batch operations**: Bulk updates when appropriate
- **Caching**: ETag implementation and response caching

#### Example Optimized Endpoint:
```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import get_db
from app.models.product import Product
from app.schemas.product import Product as ProductSchema
from app.utils.cache_utils import cached

router = APIRouter()

@router.get("/products/", response_model=list[ProductSchema])
@cached(ttl=300)  # Cache for 5 minutes
def get_products(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, le=10000),
    limit: int = Query(100, ge=1, le=1000),
    category: str = Query(None),
    search: str = Query(None),
    is_active: bool = Query(True),
    sort_by: str = Query("created_at", enum=["created_at", "price", "rating"]),
    sort_order: str = Query("desc", enum=["asc", "desc"])
):
    """
    Get paginated list of products with optional filtering and sorting.
    Results are cached for performance.
    """
    query = select(Product).where(Product.is_active == is_active)
    
    if category:
        query = query.where(Product.category == category)
    
    if search:
        query = query.where(Product.title.contains(search) | Product.description.contains(search))
    
    # Apply sorting
    if sort_by == "price":
        query = query.order_by(Product.price.desc() if sort_order == "desc" else Product.price.asc())
    elif sort_by == "rating":
        query = query.order_by(Product.rating.desc() if sort_order == "desc" else Product.rating.asc())
    else:  # created_at
        query = query.order_by(Product.created_at.desc() if sort_order == "desc" else Product.created_at.asc())
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    products = db.execute(query).scalars().all()
    
    return products
```

## Security Best Practices

### Authentication & Authorization
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt with appropriate rounds
- **Role-Based Access Control**: Different permissions for different roles
- **Session Management**: Proper token refresh and invalidation

### Input Validation
- **Pydantic Schemas**: Strong validation for all API inputs
- **Sanitization**: Clean user inputs to prevent injection attacks
- **Rate Limiting**: Prevent abuse and brute force attacks
- **File Upload Protection**: Validate file types and sizes

### Security Headers
- **CORS**: Properly configured to prevent unauthorized cross-origin requests
- **CSRF**: Token-based protection for state-changing operations
- **Content Security Policy**: Prevent XSS attacks
- **HTTPS**: Enforced in production environments

### Example Security Implementation:
```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

# Security context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Securely verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password for storage."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Get the currently authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

def require_active_user(current_user: User = Security(get_current_user)):
    """Dependency to ensure user is active."""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def require_admin_user(current_user: User = Security(require_active_user)):
    """Dependency to ensure user has admin role."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user
```

## Multilingual Implementation

### Internationalization (i18n)
- **React-i18next**: Client-side translation management
- **Server-side translations**: Backend API responses localized
- **Direction support**: RTL (Right-to-Left) for Persian/Arabic
- **Date/time formatting**: Locale-aware formatting

### Example Multilingual Component:
```tsx
// components/MultilingualProduct.tsx
import { useTranslation } from 'react-i18next';
import { Product } from '../types/product.types';

interface MultilingualProductProps {
  product: Product;
}

const MultilingualProduct: React.FC<MultilingualProductProps> = ({ product }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // Get localized content based on current language
  const getTitle = () => {
    switch (currentLang) {
      case 'fa': return product.title_fa || product.title;
      case 'ar': return product.title_ar || product.title;
      default: return product.title || product.title_en;
    }
  };

  const getDescription = () => {
    switch (currentLang) {
      case 'fa': return product.description_fa || product.description;
      case 'ar': return product.description_ar || product.description;
      default: return product.description || product.description_en;
    }
  };

  return (
    <div className={`product-card ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>
      <h3 className="font-bold text-lg">{getTitle()}</h3>
      <p className="text-gray-600 dark:text-gray-400">{getDescription()}</p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-orange-500">${product.price}</span>
        <button className="btn-primary">
          {t('product.addToCart')}
        </button>
      </div>
    </div>
  );
};

export default MultilingualProduct;
```

### RTL Support
- **CSS Utilities**: Direction-aware utility classes
- **Component Adaptation**: Layout changes for RTL languages
- **Text Alignment**: Proper text alignment based on direction
- **Icon Flipping**: Some icons flipped in RTL mode

## AI Integration

### Smart Search Implementation
- **Natural Language Processing**: Understanding user queries beyond keywords
- **Semantic Search**: Finding products based on meaning, not just text match
- **AI Fallback**: Robust fallback system when external APIs are unavailable
- **Performance Optimization**: Caching and rate limiting for AI calls

### Example AI Service Implementation:
```python
# services/ai_smart_search_service.py
from typing import Dict, List, Any
import logging
from groq import AsyncGroq
from app.config import settings
from app.models.product import Product

logger = logging.getLogger(__name__)

class AISmartSearchService:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)

    async def smart_search(self, query: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Perform semantic search using AI to understand natural language queries.
        
        Args:
            query: Natural language search query
            user_context: User-specific context for personalized results
            
        Returns:
            Dictionary containing search results and AI explanation
        """
        try:
            # Build system message with context
            system_message = (
                "You are an expert product search assistant for an e-commerce platform. "
                "Analyze the user's query to understand their intent and extract relevant filters. "
                "Return structured information about search criteria."
            )
            
            user_message = f"Query: {query}\nContext: {user_context or {}}"
            
            # Call the AI model
            chat_completion = await self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                model="llama3-8b-8192",
                temperature=0.3,
                max_tokens=512
            )
            
            # Parse AI response
            response_text = chat_completion.choices[0].message.content
            
            # Convert AI response to structured format
            search_criteria = self._parse_ai_response(response_text)
            
            # Execute database query based on criteria
            products = await self._query_database(search_criteria)
            
            return {
                "results": products,
                "explanation": f"Found products matching your request for \"{query}\".",
                "extracted_criteria": search_criteria,
                "total_results": len(products),
                "search_time": 0.1  # Placeholder - actual timing would be measured
            }
            
        except Exception as e:
            logger.error(f"AI search failed: {e}")
            # Fall back to traditional search
            return await self._traditional_search(query)
    
    def _parse_ai_response(self, response: str) -> Dict[str, Any]:
        """Parse AI response into structured search criteria."""
        # Implementation to convert AI response to structured data
        # This would typically involve extracting entities from the text
        # such as price ranges, categories, attributes, etc.
        pass
    
    async def _query_database(self, criteria: Dict[str, Any]) -> List[Product]:
        """Execute database query based on AI-extracted criteria."""
        # Implementation using SQLAlchemy based on the criteria
        pass
    
    async def _traditional_search(self, query: str) -> Dict[str, Any]:
        """Fallback to traditional search when AI fails."""
        # Implementation of traditional text-based search
        # This should still work and provide reasonable results
        pass
```

## CI/CD Pipeline

### GitHub Actions Configuration
```yaml
# .github/workflows/test-and-deploy.yml
name: Tests and Deployment

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'

    - name: Install dependencies
      run: |
        cd backend
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest pytest-cov black flake8

    - name: Run linters
      run: |
        cd backend
        black --check .
        flake8 .

    - name: Run tests
      run: |
        cd backend
        pytest --cov=app --cov-report=xml --cov-report=term
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        SECRET_KEY: test-key-for-ci

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  test-frontend:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json

    - name: Install dependencies
      run: |
        cd frontend
        npm ci

    - name: Run type check
      run: |
        cd frontend
        npm run type-check

    - name: Run linters
      run: |
        cd frontend
        npm run lint

    - name: Run tests
      run: |
        cd frontend
        npm test -- --ci --coverage --coverage-reporter=text --coverage-reporter=cobertura

    - name: Build
      run: |
        cd frontend
        npm run build