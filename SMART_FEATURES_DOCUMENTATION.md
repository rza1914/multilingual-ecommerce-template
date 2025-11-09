# Multilingual E-commerce Template - Updated Feature Documentation

This document provides detailed information about the advanced features implemented in the multilingual e-commerce template.

## Table of Contents
1. [Smart Chatbot Integration](#smart-chatbot-integration)
2. [Smart Product Search](#smart-product-search)
3. [Smart Product Recommendations](#smart-product-recommendations)
4. [AI Product Description Generator](#ai-product-description-generator)
5. [Smart Cart Suggestions](#smart-cart-suggestions)
6. [AI Insights Dashboard](#ai-insights-dashboard)
7. [Image-based Product Search](#image-based-product-search)

---

## Smart Chatbot Integration

### Overview
A customer service chatbot powered by Groq AI that understands natural language queries and provides intelligent responses with product and order information.

### Features
- Natural language processing for product queries
- Order status checks
- Inventory availability
- Product recommendations
- Multilingual support (Persian/English)

### API Endpoint
```
POST /api/v1/chat/message
```

#### Request
```json
{
  "message": "گوشی سامسونگ دارید؟"
}
```

#### Response
```json
{
  "response": "بله، چند مدل گوشی سامسونگ در انبار ما موجود است...",
  "context": {
    "user_info": {...},
    "recent_orders": [...],
    "relevant_products": [...]
  },
  "user_id": 1
}
```

### Frontend Component
- `ChatWidget.tsx` - Floating chat widget with real-time messaging

---

## Smart Product Search

### Overview
Advanced search functionality that understands natural language queries instead of exact matches.

### Features
- Natural language queries like "گوشی سامسونگ زیر ۲۰ میلیون"
- Automatic extraction of filters (price, brand, category)
- Smart autocomplete suggestions
- Results with AI explanations

### API Endpoint
```
POST /api/v1/products/smart-search
```

#### Request
```json
{
  "query": "گوشی سامسونگ زیر ۲۰ میلیون با دوربین عالی"
}
```

#### Response
```json
{
  "results": [...],
  "explanation": "۳ گوشی سامسونگ با قیمت زیر ۲۰ میلیون پیدا کردم که دوربین عالی دارند...",
  "extracted_filters": {
    "brand": "Samsung",
    "max_price": 20000000,
    "category": "mobile"
  },
  "total_results": 3
}
```

### Frontend Component
- `SmartSearchBar.tsx` - Intelligent search bar with suggestions

---

## Smart Product Recommendations

### Overview
AI-powered product recommendations system that provides personalized suggestions based on product and user history.

### Types of Recommendations
1. **Related Products** - Items in the same category
2. **Accessories** - Complementary products
3. **Upsell** - Better alternatives
4. **Downsell** - More affordable alternatives

### API Endpoint
```
GET /api/v1/products/{product_id}/recommendations
```

#### Response
```json
{
  "related": [...],
  "accessories": [...],
  "upsell": [...],
  "downsell": [...],
  "explanation": "محصولاتی مرتبط با محصول انتخاب شده برای شما آماده شده‌اند."
}
```

### Frontend Component
- `RecommendationSection.tsx` - Section to display recommendations on product pages

---

## AI Product Description Generator

### Overview
Admin tool to automatically generate product descriptions using AI based on product specifications.

### Features
- Multiple tone options (professional, casual, sales, minimal)
- Complete content generation (title, descriptions, highlights, keywords)
- SEO optimization

### API Endpoint
```
POST /api/v1/admin/products/generate-description
```

#### Request
```json
{
  "name": "Samsung Galaxy S24 Ultra",
  "brand": "Samsung", 
  "category": "smartphone",
  "specs": {
    "RAM": "12GB",
    "Storage": "256GB", 
    "Camera": "200MP"
  },
  "price": 45000000,
  "tone": "professional"
}
```

#### Response
```json
{
  "title": "...",
  "short_description": "...",
  "full_description": "...",
  "highlights": ["...", "..."],
  "keywords": ["...", "..."],
  "meta_description": "...",
  "tone": "professional"
}
```

### Frontend Component
- `ProductDescriptionGenerator.tsx` - Admin panel for generating product descriptions

---

## Smart Cart Suggestions

### Overview
Real-time product suggestions while users are viewing or adding items to their cart.

### Types of Suggestions
1. **Cross-sell** - Complementary products ("With this, also get...")
2. **Bundles** - Grouped products with discount
3. **Upsell** - Better alternatives

### API Endpoint
```
POST /api/v1/cart/suggestions
```

#### Request
```json
{
  "cart_items": [
    {
      "product_id": 1,
      "quantity": 1,
      "price": 10000000
    }
  ]
}
```

#### Response
```json
{
  "cross_sell": [...],
  "bundle": {
    "items": [...],
    "original_price": 15000000,
    "discounted_price": 12000000,
    "savings": 3000000,
    "discount_percent": 20,
    "description": "..."
  },
  "up_sell": [...],
  "reasoning": "..."
}
```

### Frontend Component
- `CartSuggestions.tsx` - Suggestions panel for cart page

---

## AI Insights Dashboard

### Overview
Admin dashboard with AI-powered business intelligence and recommendations.

### Features
1. **Sales Forecasting** - Predicts next month's revenue
2. **Smart Alerts** - Low stock, low sales, churn risk
3. **Actionable Recommendations** - Marketing, restocking, discounts

### API Endpoint
```
GET /api/v1/admin/ai-insights
```

#### Response
```json
{
  "forecast": {
    "next_month_revenue": 85000000,
    "confidence": 0.87,
    "trend": "up"
  },
  "alerts": [
    {
      "type": "low_stock",
      "product": "iPhone 15 Pro",
      "urgency": "high",
      "action": "سفارش 50 عدد دیگه"
    }
  ],
  "recommendations": [...],
  "timestamp": "2023-11-07T10:30:00"
}
```

### Frontend Component
- `AIInsightsCard.tsx` - Dashboard card with insights visualization

---

## Image-based Product Search

### Overview
Allows users to upload an image to find similar products in the store.

### Features
- Drag & drop image upload
- Camera access for mobile
- AI-powered image analysis
- Product similarity matching

### API Endpoint
```
POST /api/v1/products/search-by-image
```

#### Request
```json
{
  "image": "base64_encoded_image_string"
}
```

#### Response
```json
{
  "results": [...],
  "extracted_attributes": {
    "type": "shoe",
    "brand": "Nike", 
    "color": "white",
    "style": "sneaker"
  },
  "total_results": 5
}
```

### Frontend Component
- `ImageSearchModal.tsx` - Modal interface for image upload and results

---

## Technical Implementation Details

### Backend Architecture
- FastAPI with SQLAlchemy ORM
- JWT authentication
- PostgreSQL database
- Groq AI integration for NLP and analysis
- Proper error handling and logging

### Frontend Architecture
- React with TypeScript
- Tailwind CSS for styling
- Responsive design
- Proper state management
- API integration with error handling

### Security Considerations
- JWT token authentication for all endpoints
- Proper input validation
- Rate limiting considerations
- Secure API key handling

### Performance Optimization
- Database indexing for search operations
- Caching where appropriate
- Efficient algorithms for recommendations
- Asynchronous processing where needed

---

## Getting Started

### Backend Setup
1. Install dependencies: `pip install -r requirements.txt`
2. Set up environment variables including `GROQ_API_KEY`
3. Run database migrations: `alembic upgrade head`
4. Start the server: `uvicorn app.main:app --reload`

### Frontend Setup  
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

---

## API Documentation

For detailed API documentation, visit `/docs` endpoint after starting the server. The documentation includes:
- All available endpoints
- Request/response examples
- Authentication requirements
- Error codes and messages