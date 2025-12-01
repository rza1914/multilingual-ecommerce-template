# API Documentation - Multilingual E-Commerce Platform

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Caching](#caching)
- [Examples](#examples)

## Overview

The Multilingual E-Commerce Platform provides a comprehensive RESTful API for all e-commerce functionality. The API follows REST principles and returns JSON responses.

### Base URL
- **Production**: `https://api.your-ecommerce-site.com/api/v1`
- **Staging**: `https://staging-api.your-ecommerce-site.com/api/v1`
- **Development**: `http://localhost:8000/api/v1`

### Content Type
All requests and responses use the JSON format (`application/json`).

### Versioning
The API uses URI versioning with the format `/api/v1/`. This version (v1) is stable and production-ready.

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens).

### Obtaining a Token

#### POST `/auth/token`
Authenticate and obtain access token

**Request**
```
POST /api/v1/auth/token
Content-Type: application/x-www-form-urlencoded
```

**Form Parameters**
- `username` (string, required): Email or username
- `password` (string, required): User password

**Response (Success)**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error)**
```json
{
  "detail": "Incorrect username or password"
}
```

#### POST `/auth/refresh`
Refresh an access token using the refresh token

**Request**
```
POST /api/v1/auth/refresh
Content-Type: application/json
```

**Request Body**
```json
{
  "refresh_token": "your_refresh_token_here"
}
```

**Response (Success)**
```json
{
  "access_token": "new_access_token_here",
  "token_type": "bearer",
  "refresh_token": "new_refresh_token_here"
}
```

### Using the Token

Include the access token in the Authorization header for protected endpoints:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## API Endpoints

### Authentication Endpoints

#### POST `/auth/register`
Create a new user account

**Request**
```
POST /api/v1/auth/register
Content-Type: application/json
```

**Request Body**
```json
{
  "email": "user@example.com",
  "username": "username",
  "full_name": "User Name",
  "password": "SecurePassword123!"
}
```

**Response (Success)**
```json
{
  "id": 123,
  "email": "user@example.com",
  "username": "username",
  "full_name": "User Name",
  "is_active": true,
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### GET `/auth/profile`
Get authenticated user's profile

**Headers**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response**
```json
{
  "id": 123,
  "email": "user@example.com",
  "username": "username",
  "full_name": "User Name",
  "is_active": true,
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Product Endpoints

#### GET `/products/`
Get a list of products with filtering and pagination

**Parameters**
- `skip` (integer, optional): Number of products to skip (default: 0)
- `limit` (integer, optional): Max number of products to return (default: 20, max: 100)
- `category` (string, optional): Filter by category
- `search` (string, optional): Search term for title/description
- `min_price` (number, optional): Minimum price filter
- `max_price` (number, optional): Maximum price filter
- `is_active` (boolean, optional): Filter by active status (default: true)
- `is_featured` (boolean, optional): Filter by featured status
- `sort_by` (string, optional): Sort field (price, rating, created_at, popularity)
- `sort_order` (string, optional): Sort order (asc, desc, default: desc)

**Example Request**
```
GET /api/v1/products/?skip=0&limit=10&category=electronics&sort_by=price&sort_order=asc
```

**Response**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Wireless Headphones",
      "description": "High-quality wireless headphones",
      "price": 99.99,
      "discount_price": 89.99,
      "discount": 10.0,
      "stock": 50,
      "rating": 4.5,
      "is_active": true,
      "is_featured": true,
      "image_url": "https://example.com/image.jpg",
      "category": "Electronics",
      "tags": "audio, wireless, headphones",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "owner_id": 123,
      "title_en": "Wireless Headphones",
      "title_fa": "هدفون بی‌سیم",
      "title_ar": "سماعة رأس لاسلكية",
      "description_en": "High-quality wireless headphones",
      "description_fa": "هدفون بی‌سیم با کیفیت بالا",
      "description_ar": "سماعة رأس لاسلكية عالية الجودة"
    }
  ],
  "total": 150,
  "skip": 0,
  "limit": 10
}
```

#### GET `/products/{id}`
Get a specific product by ID

**Parameters**
- `id` (integer, required): Product ID

**Response**
```json
{
  "id": 1,
  "title": "Wireless Headphones",
  "description": "High-quality wireless headphones",
  "price": 99.99,
  "discount_price": 89.99,
  "discount": 10.0,
  "stock": 50,
  "rating": 4.5,
  "is_active": true,
  "is_featured": true,
  "image_url": "https://example.com/image.jpg",
  "category": "Electronics",
  "tags": "audio, wireless, headphones",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "owner_id": 123,
  "related_products": [...],
  "product_reviews": [...]
}
```

#### POST `/products/`
Create a new product (Admin only)

**Headers**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Request Body**
```json
{
  "title": "New Product",
  "description": "Product description",
  "price": 49.99,
  "discount_price": 39.99,
  "discount": 20.0,
  "stock": 100,
  "category": "Electronics",
  "tags": "new, featured",
  "is_active": true,
  "is_featured": false,
  "image_url": "https://example.com/new-product.jpg"
}
```

**Response**
```json
{
  "id": 2,
  "title": "New Product",
  "description": "Product description",
  "price": 49.99,
  "discount_price": 39.99,
  "discount": 20.0,
  "stock": 100,
  "rating": 0.0,
  "is_active": true,
  "is_featured": false,
  "image_url": "https://example.com/new-product.jpg",
  "category": "Electronics",
  "tags": "new, featured",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "owner_id": 123
}
```

#### PUT `/products/{id}`
Update a product (Admin only)

**Headers**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Request Body** (partial update supported)
```json
{
  "price": 59.99,
  "stock": 80
}
```

**Response**
```json
{
  "id": 1,
  "title": "Updated Product",
  "description": "Updated description",
  "price": 59.99,
  "discount_price": 49.99,
  "discount": 16.7,
  "stock": 80,
  "rating": 4.5,
  "is_active": true,
  "is_featured": true,
  "image_url": "https://example.com/image.jpg",
  "category": "Electronics",
  "tags": "audio, wireless, headphones",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-02T00:00:00Z",
  "owner_id": 123
}
```

#### DELETE `/products/{id}`
Delete a product (Admin only)

**Headers**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Response**
```json
{
  "message": "Product deleted successfully",
  "deleted_product": {
    "id": 1,
    "title": "Product to delete"
  }
}
```

### Smart Search Endpoints

#### POST `/products/smart-search`
AI-powered smart search with natural language understanding

**Headers**
```
Authorization: Bearer ACCESS_TOKEN (optional)
Content-Type: application/json
```

**Request Body**
```json
{
  "query": "find me wireless headphones under $100 with good battery life",
  "category": "electronics",
  "min_price": 0,
  "max_price": 100,
  "limit": 10,
  "user_context": {
    "preferences": ["audio", "wireless"],
    "budget": 100,
    "recent_searches": ["headphones", "earbuds"]
  }
}
```

**Response**
```json
{
  "results": [
    {
      "product": {
        "id": 1,
        "title": "Wireless Headphones",
        "description": "High-quality wireless headphones with 30hr battery",
        "price": 89.99,
        "rating": 4.7,
        "image_url": "https://example.com/headphones.jpg",
        "category": "Electronics",
        "similarity_score": 0.95,
        "ai_explanation": "This matches your query for wireless headphones with good battery life under $100"
      }
    }
  ],
  "total_results": 5,
  "query": "find me wireless headphones under $100 with good battery life",
  "explanation": {
    "interpretation": "Search for wireless audio devices under $100 with emphasis on battery performance",
    "applied_filters": {
      "max_price": 100,
      "category": "Electronics",
      "battery_life": "important"
    }
  },
  "extracted_filters": {
    "max_price": 100,
    "category": "Electronics",
    "features": ["wireless", "good battery life"]
  },
  "related_searches": [
    "wireless earbuds under $100",
    "over-ear headphones with noise cancellation",
    "sport headphones with sweat resistance"
  ],
  "search_time": 0.254
}
```

#### POST `/products/search-by-image`
Visual product search using image recognition

**Headers**
```
Authorization: Bearer ACCESS_TOKEN (optional)
Content-Type: multipart/form-data
```

**Form Data**
- `image` (file, required): The image file to search with
- `category` (string, optional): Filter by category
- `limit` (integer, optional): Max results (default: 10, max: 50)

**Response**
```json
{
  "results": [
    {
      "product_id": 1,
      "similarity_score": 0.92,
      "product": {...},
      "ai_explanation": "Found visually similar product based on image characteristics"
    }
  ],
  "confidence_level": "high",
  "search_time": 1.234,
  "detected_objects": ["headphones", "wireless", "black", "over-ear"]
}
```

### Cart Endpoints

#### GET `/cart/`
Get the current user's cart

**Headers**
```
Authorization: Bearer ACCESS_TOKEN
```

**Response**
```json
{
  "items": [
    {
      "id": 123,
      "product_id": 1,
      "product": {
        "id": 1,
        "title": "Wireless Headphones",
        "price": 89.99,
        "image_url": "https://example.com/image.jpg"
      },
      "quantity": 2,
      "price_at_addition": 89.99,
      "total_price": 179.98
    }
  ],
  "total_items": 2,
  "total_quantity": 3,
  "cart_total": 179.98,
  "applied_discount": 10.00,
  "final_total": 169.98
}
```

#### POST `/cart/items/`
Add item to cart

**Headers**
```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

**Request Body**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response**
```json
{
  "cart_item": {
    "id": 123,
    "product_id": 1,
    "quantity": 2,
    "price_at_addition": 89.99,
    "total_price": 179.98
  },
  "cart_summary": {
    "total_items": 2,
    "total_quantity": 3,
    "cart_total": 179.98
  },
  "message": "Item added to cart successfully"
}
```

### Order Endpoints

#### GET `/orders/`
Get user's order history

**Headers**
```
Authorization: Bearer ACCESS_TOKEN
```

**Parameters**
- `status` (string, optional): Filter by status (pending, processing, shipped, delivered, cancelled)
- `limit` (integer, optional): Max results per page (default: 10)
- `offset` (integer, optional): Number of results to skip (for pagination)

**Response**
```json
{
  "orders": [
    {
      "id": 123,
      "order_number": "ORD-2024-000123",
      "status": "delivered",
      "total": 124.97,
      "items_count": 2,
      "shipping_address": {
        "full_name": "John Doe",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip_code": "10001",
        "country": "USA"
      },
      "payment_method": "credit_card",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-05T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 10,
    "offset": 0
  }
}
```

#### POST `/orders/`
Create a new order

**Headers**
```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

**Request Body**
```json
{
  "shipping_address": {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "United States"
  },
  "shipping_method": "standard",  // standard, express, overnight
  "payment_method": "credit_card",  // credit_card, paypal, cod
  "cart_items": [  // Items from current cart or specify directly
    {"product_id": 1, "quantity": 2}
  ],
  "special_instructions": "Please deliver after 5 PM"
}
```

**Response**
```json
{
  "id": 123,
  "order_number": "ORD-2024-000123",
  "status": "pending",
  "total": 124.97,
  "items": [
    {
      "product_id": 1,
      "product": {
        "id": 1,
        "title": "Wireless Headphones",
        "price": 89.99
      },
      "quantity": 2,
      "unit_price": 89.99,
      "total_price": 179.98
    }
  ],
  "shipping_address": {
    "full_name": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "United States"
  },
  "shipping_method": "standard",
  "payment_method": "credit_card",
  "tracking_number": "1Z999AA1234567890",
  "estimated_delivery": "2024-01-08T00:00:00Z",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

### User Profile Endpoints

#### PUT `/users/profile/`
Update user profile information

**Headers**
```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

**Request Body** (all fields optional)
```json
{
  "full_name": "John Smith",
  "phone": "+1234567890",
  "bio": "Tech enthusiast and gadget lover",
  "preferred_language": "en",
  "preferred_currency": "USD"
}
```

**Response**
```json
{
  "id": 123,
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Smith",
  "phone": "+1234567890",
  "bio": "Tech enthusiast and gadget lover",
  "preferred_language": "en",
  "preferred_currency": "USD",
  "is_active": true,
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-02T00:00:00Z"
}
```

### Admin Endpoints

#### GET `/admin/dashboard/stats`
Get admin dashboard statistics

**Headers**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Response**
```json
{
  "today_sales": 1245.67,
  "today_orders": 15,
  "today_users": 3,
  "total_revenue": 12456.78,
  "total_orders": 123,
  "total_users": 456,
  "total_products": 78,
  "orders_by_status": {
    "pending": 5,
    "processing": 7,
    "shipped": 2,
    "delivered": 1,
    "cancelled": 0
  },
  "top_products": [
    {
      "id": 1,
      "title": "Wireless Headphones",
      "sales": 25,
      "revenue": 2249.75
    }
  ],
  "recent_orders": [
    {
      "id": 1,
      "order_number": "ORD-2024-000001",
      "user": "john@example.com",
      "total": 99.99,
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET `/admin/products/`
Get all products (Admin only)

**Headers**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**Parameters**
- `skip`, `limit`, `category`, `search`, `is_active`, `is_featured` - same as GET `/products/`

**Response**
Same as GET `/products/` but includes additional admin-specific fields like `owner_email`.

## Error Handling

The API uses standard HTTP status codes and returns consistent error responses:

### Common Error Response Format
```json
{
  "detail": "Human-readable error message",
  "error_code": "MACHINE_READABLE_ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z",
  "request_id": "unique-request-id"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (validation failed)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Common Error Codes
- `INVALID_CREDENTIALS` - Incorrect username/password
- `INSUFFICIENT_PERMISSIONS` - User doesn't have required permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `VALIDATION_ERROR` - Request validation failed
- `RATE_LIMIT_EXCEEDED` - Request rate limit exceeded
- `DUPLICATE_RESOURCE` - Resource already exists

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Public endpoints**: 100 requests per hour per IP
- **Authenticated endpoints**: 1000 requests per hour per user
- **Auth endpoints**: 10 requests per 15 minutes per IP

Rate limit information is included in response headers:
- `X-RateLimit-Limit` - Max requests allowed in the time window
- `X-RateLimit-Remaining` - Remaining requests in current window
- `X-RateLimit-Reset` - Unix timestamp when limit resets

## Caching

The API implements HTTP caching with ETag headers:

- **GET endpoints**: Response includes ETag header
- **Conditional requests**: Use `If-None-Match` header to avoid re-transmitting unchanged data
- **Cache duration**: Varies by endpoint (typically 5-15 minutes for frequently updated data, 1-24 hours for static data)

## Examples

### JavaScript (fetch)
```javascript
// Get products with filtering
fetch('https://api.your-ecommerce-site.com/api/v1/products?category=electronics&limit=10', {
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  }
})
.then(response => response.json())
.then(data => console.log(data));

// Create order
const orderData = {
  shipping_address: { ... },
  shipping_method: 'express',
  payment_method: 'credit_card',
  cart_items: [...]
};

fetch('https://api.your-ecommerce-site.com/api/v1/orders/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: JSON.stringify(orderData)
})
.then(response => response.json())
.then(data => console.log(data));
```

### Python (requests)
```python
import requests

# Set up base configuration
BASE_URL = 'https://api.your-ecommerce-site.com/api/v1'
HEADERS = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

# Get products
response = requests.get(f'{BASE_URL}/products/?category=electronics', headers=HEADERS)
products = response.json()

# Create order
order_payload = {
    'shipping_address': { ... },
    'shipping_method': 'express',
    'payment_method': 'credit_card',
    'cart_items': [ ... ]
}

response = requests.post(f'{BASE_URL}/orders/', json=order_payload, headers=HEADERS)
order = response.json()
```

### cURL
```bash
# Get products
curl -X GET \
  "https://api.your-ecommerce-site.com/api/v1/products?category=electronics" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create order
curl -X POST \
  "https://api.your-ecommerce-site.com/api/v1/orders/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": {...},
    "shipping_method": "express",
    "payment_method": "credit_card",
    "cart_items": [...]
  }'
```

## SDKs and Libraries

Coming soon: Official SDKs for popular programming languages including:
- JavaScript/TypeScript
- Python
- Java
- PHP
- Ruby
- Go