# Database Schema Documentation
## Multilingual E-Commerce Platform

## Table of Contents
- [Overview](#overview)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Table Descriptions](#table-descriptions)
- [Indexing Strategy](#indexing-strategy)
- [Database Migrations](#database-migrations)
- [Performance Considerations](#performance-considerations)

## Overview

The database schema follows a normalized design optimized for a multilingual e-commerce platform. It includes support for products, users, orders, payments, and multilingual content. The schema is implemented using SQLAlchemy with PostgreSQL as the primary database (with SQLite support for development).

### Technology Stack
- **Primary Database**: PostgreSQL 14+
- **Development Database**: SQLite
- **ORM**: SQLAlchemy 2.0+
- **Migration Tool**: Alembic
- **Connection Pooling**: SQLAlchemy built-in connection pool

### Design Principles
- **Normalization**: Third normal form (3NF) to reduce data redundancy
- **Referential Integrity**: Foreign key constraints with appropriate cascade rules
- **Performance**: Strategic indexing for common queries
- **Scalability**: Designed to handle growth in users, products, and orders
- **Multilingual Support**: Dedicated fields for content in different languages

## Entity Relationship Diagram

```
+------------------+       +------------------+       +------------------+
|     users        |       |    products      |       |     orders       |
|------------------|       |------------------|       |------------------|
| id (PK)          |<------| owner_id (FK)    |       | id (PK)          |
| email (UNIQUE)   |       | id (PK)          |>------| user_id (FK)     |
| username (UNIQUE)|       | title            |       | status           |
| full_name        |       | description      |       | total_amount     |
| hashed_password  |       | price            |       | created_at       |
| is_active        |       | stock            |       | updated_at       |
| role             |       | rating           |       | shipping_address |
| created_at       |       | is_active        |       +------------------+
| updated_at       |       | is_featured      |                |
+------------------+       | category         |                |
         |                 | image_url        |                |
         |                 | created_at       |                |
         |                 | updated_at       |                |
         |                 +------------------+                |
         |                        |                            |
         |                        |                            |
         |                        |                            |
         |                        |                            |
         |                        v                            |
         |                 +------------------+                |
         |                 |  order_items     |                |
         |                 |------------------|                |
         |                 | id (PK)          |                |
         |                 | order_id (FK)    |<---------------+
         |                 | product_id (FK)  |
         |                 | quantity         |
         |                 | price_at_time    |
         |                 | created_at       |
         +----------------->| updated_at       |
                           +------------------+
                                    |
                                    |
                                    v
                           +------------------+
                           |  bot_api_keys    |
                           |------------------|
                           | id (PK)          |
                           | name             |
                           | api_key (UNIQUE) |
                           | is_active        |
                           | permissions      |
                           | user_id (FK)     |
                           | created_at       |
                           | updated_at       |
                           +------------------+
```

## Table Descriptions

### users Table

Stores user account information including authentication details.

| Column Name | Type | Constraints | Description | Index |
|-------------|------|-------------|-------------|-------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier for user | PK |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address for login | IX (UNIQUE) |
| username | VARCHAR(255) | UNIQUE, NOT NULL | User's chosen username | IX (UNIQUE) |
| full_name | VARCHAR(255) | | User's full name | |
| hashed_password | VARCHAR(255) | NOT NULL | BCrypt hashed password | |
| is_active | BOOLEAN | DEFAULT TRUE | Account activation status | IX |
| role | VARCHAR(20) | DEFAULT 'user' | User role (user, admin) | IX |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation timestamp | IX |
| updated_at | TIMESTAMP | | Last update timestamp | |

**Indexes:**
- `ix_users_email`: ON (email) - For email lookups
- `ix_users_username`: ON (username) - For username lookups  
- `ix_users_is_active`: ON (is_active) - For filtering active/inactive users
- `ix_users_role`: ON (role) - For role-based queries
- `ix_users_created_at`: ON (created_at) - For chronological queries

**Constraints:**
- UQ_users_email: UNIQUE (email)
- UQ_users_username: UNIQUE (username)
- CK_users_role: CHECK (role IN ('user', 'admin'))

### products Table

Main product catalog table storing product information and inventory.

| Column Name | Type | Constraints | Description | Index |
|-------------|------|-------------|-------------|-------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique product identifier | PK |
| title | VARCHAR(255) | NOT NULL | Product title | IX |
| description | TEXT | | Detailed product description | |
| price | DECIMAL(10,2) | NOT NULL | Product price in base currency | IX |
| discount_price | DECIMAL(10,2) | | Discounted price | |
| discount | DECIMAL(5,2) | DEFAULT 0.00 | Discount percentage (0-100) | IX |
| stock | INTEGER | DEFAULT 100 | Available inventory quantity | IX |
| rating | DECIMAL(3,2) | DEFAULT 0.00 | Average product rating (0-5) | IX |
| is_active | BOOLEAN | DEFAULT TRUE | Product availability status | IX |
| is_featured | BOOLEAN | DEFAULT FALSE | Featured product flag | IX |
| image_url | VARCHAR(500) | | Product image URL | |
| category | VARCHAR(100) | | Product category | IX |
| tags | VARCHAR(500) | | Comma-separated tags for search | |
| title_en | VARCHAR(255) | | English title for multilingual support | |
| title_ar | VARCHAR(255) | | Arabic title for multilingual support | |
| title_fa | VARCHAR(255) | | Persian title for multilingual support | |
| description_en | TEXT | | English description for multilingual support | |
| description_ar | TEXT | | Arabic description for multilingual support | |
| description_fa | TEXT | | Persian description for multilingual support | |
| created_at | TIMESTAMP | DEFAULT NOW() | Product creation timestamp | IX |
| updated_at | TIMESTAMP | | Last update timestamp | |
| owner_id | INTEGER | FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE | Product owner (seller) | IX |

**Indexes:**
- `ix_products_title`: ON (title) - For title-based searches
- `ix_products_category`: ON (category) - For category browsing
- `ix_products_price`: ON (price) - For price-based filtering
- `ix_products_discount`: ON (discount) - For discount-based searches
- `ix_products_stock`: ON (stock) - For inventory management
- `ix_products_rating`: ON (rating) - For rating-based filtering
- `ix_products_is_active`: ON (is_active) - For availability filtering
- `ix_products_is_featured`: ON (is_featured) - For featured products
- `ix_products_created_at`: ON (created_at) - For chronological ordering
- `ix_products_owner_id`: ON (owner_id) - For owner-based queries
- `idx_products_category_active`: ON (category, is_active) - For category + availability
- `idx_products_featured_active`: ON (is_featured, is_active) - For featured + active
- `idx_products_price_range`: ON (price, is_active) - For price + availability
- `idx_products_owner_visibility`: ON (owner_id, is_active) - For seller products

**Constraints:**
- FK_products_users: FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
- CK_products_price_positive: CHECK (price > 0)
- CK_products_stock_non_negative: CHECK (stock >= 0)
- CK_products_discount_range: CHECK (discount >= 0 AND discount <= 100)
- CK_products_rating_range: CHECK (rating >= 0 AND rating <= 5)

### orders Table

Stores order information and shipping details.

| Column Name | Type | Constraints | Description | Index |
|-------------|------|-------------|-------------|-------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique order identifier | PK |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(id) ON DELETE SET NULL | Customer who placed order | IX |
| full_name | VARCHAR(255) | NOT NULL | Recipient full name | |
| email | VARCHAR(255) | NOT NULL | Recipient email | IX |
| phone | VARCHAR(20) | NOT NULL | Recipient phone number | |
| address | TEXT | NOT NULL | Shipping address | |
| city | VARCHAR(100) | NOT NULL | City | |
| state | VARCHAR(100) | NOT NULL | State/province/region | |
| zip_code | VARCHAR(20) | NOT NULL | Postal/zip code | |
| country | VARCHAR(100) | DEFAULT 'United States' | Country | |
| shipping_method | VARCHAR(50) | NOT NULL | Shipping option (standard, express, etc.) | IX |
| payment_method | VARCHAR(50) | NOT NULL | Payment method | IX |
| subtotal | DECIMAL(10,2) | NOT NULL | Subtotal before shipping/tax | |
| shipping_cost | DECIMAL(10,2) | NOT NULL | Shipping cost | |
| tax | DECIMAL(10,2) | NOT NULL | Tax amount | |
| discount | DECIMAL(10,2) | DEFAULT 0.00 | Discount amount | |
| total | DECIMAL(10,2) | NOT NULL | Total order amount | IX |
| status | VARCHAR(50) | DEFAULT 'pending' | Order status | IX |
| created_at | TIMESTAMP | DEFAULT NOW() | Order creation timestamp | IX |
| updated_at | TIMESTAMP | | Last status update | |

**Indexes:**
- `ix_orders_user_id`: ON (user_id) - For user order history
- `ix_orders_email`: ON (email) - For email-based lookups
- `ix_orders_shipping_method`: ON (shipping_method) - For shipping method queries
- `ix_orders_payment_method`: ON (payment_method) - For payment method analysis
- `ix_orders_total`: ON (total) - For revenue reporting
- `ix_orders_status`: ON (status) - For status-based filtering
- `ix_orders_created_at`: ON (created_at) - For chronological queries
- `idx_orders_user_status`: ON (user_id, status) - For user status combinations
- `idx_orders_status_date`: ON (status, created_at) - For status trend analysis
- `idx_orders_total_range`: ON (total, status) - For revenue analysis

**Constraints:**
- FK_orders_users: FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
- CK_orders_total_positive: CHECK (total >= 0)
- CK_orders_status_values: CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))

### order_items Table

Stores individual items within an order.

| Column Name | Type | Constraints | Description | Index |
|-------------|------|-------------|-------------|-------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique order item identifier | PK |
| order_id | INTEGER | FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE | Parent order | IX |
| product_id | INTEGER | FOREIGN KEY REFERENCES products(id) ON DELETE SET NULL | Product in order | IX |
| quantity | INTEGER | NOT NULL | Number of items | IX |
| price_at_time | DECIMAL(10,2) | NOT NULL | Price when order was placed | |
| created_at | TIMESTAMP | DEFAULT NOW() | Item creation timestamp | |
| updated_at | TIMESTAMP | | Last update timestamp | |

**Indexes:**
- `ix_order_items_order_id`: ON (order_id) - For order item lookups
- `ix_order_items_product_id`: ON (product_id) - For product order history
- `ix_order_items_quantity`: ON (quantity) - For quantity analysis
- `idx_order_items_order_product`: ON (order_id, product_id) - For order-item relationships
- `idx_order_items_product_quantity`: ON (product_id, quantity) - For product quantity trends

**Constraints:**
- FK_order_items_orders: FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
- FK_order_items_products: FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
- CK_order_items_quantity_positive: CHECK (quantity > 0)
- CK_order_items_price_positive: CHECK (price_at_time >= 0)

### bot_api_keys Table

Stores API keys for bot integrations.

| Column Name | Type | Constraints | Description | Index |
|-------------|------|-------------|-------------|-------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique API key identifier | PK |
| name | VARCHAR(255) | NOT NULL | Name/description for identification | IX |
| api_key | VARCHAR(255) | UNIQUE, NOT NULL | The actual API key value | IX (UNIQUE) |
| is_active | BOOLEAN | DEFAULT TRUE | Whether key is currently active | IX |
| permissions | TEXT | DEFAULT 'read' | Comma-separated permissions list | |
| user_id | INTEGER | FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE | Owner of the key | IX |
| created_at | TIMESTAMP | DEFAULT NOW() | Key creation timestamp | IX |
| updated_at | TIMESTAMP | | Last update timestamp | |
| last_used_at | TIMESTAMP | | Last time key was used | |

**Indexes:**
- `ix_bot_api_keys_name`: ON (name) - For name-based lookups
- `ix_bot_api_keys_api_key`: ON (api_key) - For API key lookups (UNIQUE)
- `ix_bot_api_keys_is_active`: ON (is_active) - For filtering active keys
- `ix_bot_api_keys_user_id`: ON (user_id) - For user key management
- `ix_bot_api_keys_created_at`: ON (created_at) - For audit trails
- `idx_bot_api_keys_active_user`: ON (is_active, user_id) - For active keys by user
- `idx_bot_api_keys_name_active`: ON (name, is_active) - For named active keys

**Constraints:**
- UQ_bot_api_keys_api_key: UNIQUE (api_key)
- FK_bot_api_keys_users: FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

## Indexing Strategy

### Primary Indexes
- Every primary key (id) column has an automatic index
- This ensures fast lookups for single record retrieval

### Foreign Key Indexes
- All foreign key columns are indexed to optimize JOIN operations
- Improves performance for relationship queries (user orders, product items, etc.)

### Composite Indexes
- **`idx_products_category_active`**: Optimizes queries filtering products by category and active status
- **`idx_orders_user_status`**: Optimizes queries for user's orders by status
- **`idx_orders_status_date`**: Optimizes queries for order status trends over time
- **`idx_order_items_order_product`**: Optimizes queries for specific product in specific order

### Search Indexes
- `ix_products_title`: Optimizes product title searches
- `ix_products_category`: Optimizes category browsing
- `ix_orders_email`: Optimizes order lookup by email

### Filtering Indexes
- `ix_products_is_active`: Optimizes active product filtering
- `ix_products_is_featured`: Optimizes featured product queries
- `ix_orders_status`: Optimizes order status filtering
- `ix_users_is_active`: Optimizes active user queries

## Database Migrations

### Alembic Configuration
The database uses Alembic for schema migrations:

```python
# alembic.ini
[alembic]
script_location = alembic
sqlalchemy.url = postgresql://user:pass@localhost/dbname

# Environment script - alembic/env.py
from app.database import engine
from app.models import Base

target_metadata = Base.metadata
```

### Migration Commands
```bash
# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations to database
alembic upgrade head

# Rollback to previous version
alembic downgrade -1

# Check current version
alembic current
```

### Migration Example
```python
# Example migration file
"""Add discount_percentage column to products

Revision ID: abc123
Revises: def456
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = 'abc123'
down_revision = 'def456'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('products', sa.Column('discount_percentage', sa.Numeric(5, 2), server_default='0.00'))

def downgrade():
    op.drop_column('products', 'discount_percentage')
```

## Performance Considerations

### Query Optimization
- Use the `selectinload` or `joinedload` strategies for relationship loading to prevent N+1 queries
- Implement pagination for large dataset queries
- Use `EXPLAIN ANALYZE` to analyze query performance
- Leverage database connection pooling

### Index Recommendations
- Monitor query patterns and adjust indexes accordingly
- Remove unused indexes to reduce write performance overhead
- Consider partial indexes for filtered queries (e.g., `WHERE is_active = TRUE`)
- Use covering indexes for frequently queried column combinations

### Partitioning Strategy
- For very large tables (orders, order_items), consider time-based partitioning
- Archive old data to separate partitions to improve query performance
- Partition by commonly filtered columns like created_at or order status

### Connection Management
- Configure appropriate connection pool size based on expected concurrent users
- Implement proper transaction management to prevent connection leaks
- Use read replicas for read-heavy operations when scaling becomes necessary

## Security Considerations

### Data Encryption
- Passwords are stored using bcrypt hashing
- API keys are stored as encrypted values
- Sensitive data should be encrypted at the application level if needed

### Access Controls
- Implement role-based access controls through the application layer
- Database users should have minimal required permissions
- Use prepared statements to prevent SQL injection

### Audit Trail
- The schema includes created_at and updated_at timestamps for audit purposes
- Consider additional audit tables for sensitive operations
- Log access to admin-level data appropriately