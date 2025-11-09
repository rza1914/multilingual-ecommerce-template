# Telegram Bot Integration API Documentation

This document provides comprehensive information for developers who want to integrate their Telegram bots with the e-commerce platform.

## Overview

The Telegram Bot Integration API allows external Telegram bots to access read-only data from the e-commerce platform. This includes customer information, product details, and order status. All access is secured through API keys with granular permission controls.

## Authentication

All bot API endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_BOT_API_KEY
```

## Obtaining an API Key

To get an API key, use the management script:

```bash
cd backend
python manage_bot_keys.py create "My Bot Name" --permissions "read:customers,read:products,read:orders"
```

This will generate a new API key with the specified permissions. Save the key securely as it will only be displayed once.

## Available Permissions

- `read:customers` - Access to customer data
- `read:products` - Access to product information
- `read:orders` - Access to order data
- `read:stats` - Access to API key usage statistics

## API Endpoints

### Get Customers

**Endpoint:** `GET /api/v1/bot/bot/customers/`

Retrieve customer information with read-only access.

#### Query Parameters:
- `customer_id` (optional): Filter by specific customer ID
- `limit` (optional, default: 50, max: 100): Number of records to return
- `offset` (optional, default: 0): Offset for pagination

#### Required Permission:
- `read:customers`

#### Example Request:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "http://localhost:8000/api/v1/bot/bot/customers/?limit=10&offset=0"
```

#### Example Response:
```json
{
  "data": [
    {
      "id": 1,
      "email": "customer@example.com",
      "full_name": "John Doe",
      "is_active": true,
      "created_at": "2023-01-01T00:00:00"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0,
  "bot_name": "My Bot Name"
}
```

### Get Products

**Endpoint:** `GET /api/v1/bot/bot/products/`

Retrieve product information.

#### Query Parameters:
- `product_id` (optional): Filter by specific product ID
- `category` (optional): Filter by product category
- `limit` (optional, default: 50, max: 100): Number of records to return
- `offset` (optional, default: 0): Offset for pagination

#### Required Permission:
- `read:products`

#### Example Request:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "http://localhost:8000/api/v1/bot/bot/products/?category=electronics&limit=5"
```

#### Example Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Wireless Headphones",
      "description": "High quality wireless headphones",
      "price": 99.99,
      "discount_price": 79.99,
      "is_active": true,
      "is_featured": true,
      "category": "electronics",
      "image_url": "http://example.com/image.jpg",
      "created_at": "2023-01-01T00:00:00",
      "updated_at": "2023-01-01T00:00:00"
    }
  ],
  "total": 1,
  "limit": 5,
  "offset": 0,
  "bot_name": "My Bot Name"
}
```

### Get Orders

**Endpoint:** `GET /api/v1/bot/bot/orders/`

Retrieve order information.

#### Query Parameters:
- `order_id` (optional): Filter by specific order ID
- `user_id` (optional): Filter by user ID
- `status` (optional): Filter by order status
- `limit` (optional, default: 50, max: 100): Number of records to return
- `offset` (optional, default: 0): Offset for pagination

#### Required Permission:
- `read:orders`

#### Example Request:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "http://localhost:8000/api/v1/bot/bot/orders/?status=pending&limit=10"
```

#### Example Response:
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "full_name": "John Doe",
      "email": "customer@example.com",
      "phone": "+1234567890",
      "status": "pending",
      "subtotal": 99.99,
      "shipping_cost": 5.99,
      "tax": 8.50,
      "discount": 0.00,
      "total": 114.48,
      "created_at": "2023-01-01T00:00:00",
      "updated_at": "2023-01-01T00:00:00"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0,
  "bot_name": "My Bot Name"
}
```

### Get Bot Statistics

**Endpoint:** `GET /api/v1/bot/bot/stats/`

Retrieve statistics about the current API key usage.

#### Required Permission:
- Valid API key (any permissions)

#### Example Request:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "http://localhost:8000/api/v1/bot/bot/stats/"
```

#### Example Response:
```json
{
  "data": {
    "id": 1,
    "name": "My Bot Name",
    "is_active": true,
    "permissions": "read:customers,read:products,read:orders",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00",
    "last_used_at": "2023-01-01T00:00:00"
  },
  "bot_name": "My Bot Name"
}
```

### Get Bot Permissions

**Endpoint:** `GET /api/v1/bot/bot/permissions/`

Retrieve the permissions assigned to the current bot.

#### Required Permission:
- Valid API key (any permissions)

#### Example Request:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "http://localhost:8000/api/v1/bot/bot/permissions/"
```

#### Example Response:
```json
{
  "permissions": ["read:customers", "read:products", "read:orders"],
  "is_active": true,
  "name": "My Bot Name"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Default limits are:
- 100 requests per minute per API key
- 1000 requests per hour per API key

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Error message here"
}
```

Common HTTP status codes:
- `401 Unauthorized`: Invalid or missing API key
- `403 Forbidden`: Insufficient permissions for the requested resource
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Best Practices

1. **Secure Your API Key**: Store your API key securely and never expose it in client-side code.
2. **Handle Errors Gracefully**: Implement proper error handling for API responses.
3. **Respect Rate Limits**: Implement appropriate backoff strategies when rate limits are reached.
4. **Cache Responses**: Where appropriate, cache API responses to reduce load and improve performance.
5. **Monitor Usage**: Regularly check your API key usage statistics.