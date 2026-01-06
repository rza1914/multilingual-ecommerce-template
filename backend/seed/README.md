# Database Seed Script

Generates realistic test data for the AI e-commerce platform.

## Features

- ✅ **Deterministic**: Uses seeded random for reproducible results
- ✅ **Multilingual**: Products have EN/FA/AR translations
- ✅ **Realistic Distribution**: Orders follow power-law distribution
- ✅ **Idempotent**: Can be run multiple times with `--clear`
- ✅ **Configurable**: Adjust counts via CLI arguments

## Quick Start

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already)
pip install faker

# Run with default settings
python -m seed.seed

# Or clear existing data first
python -m seed.seed --clear
```

## CLI Options

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--clear` | `-c` | False | Clear existing data before seeding |
| `--dry-run` | `-d` | False | Preview without inserting |
| `--users` | `-u` | 1000 | Number of regular users |
| `--admins` | `-a` | 5 | Number of admin users |
| `--products` | `-p` | 200 | Number of products |
| `--orders` | `-o` | 500 | Number of orders |

## Examples

```bash
# Preview what would be created
python -m seed.seed --dry-run

# Create minimal dataset for quick testing
python -m seed.seed --clear -u 100 -p 50 -o 100

# Create large dataset for load testing
python -m seed.seed --clear -u 5000 -p 1000 -o 2500
```

## Generated Data

### Users
- **1000 regular users** with unique emails and usernames
- **5 admin users** with emails `admin1@luxstore.com` to `admin5@luxstore.com`
- Password for all users: `user123`
- Password for admins: `admin123`

### Products
- **200 products** across 10 categories
- Multilingual titles (English, Farsi, Arabic)
- Realistic pricing based on category
- 30% have discounts (5-40% off)
- 15% are featured products
- Random stock levels (0-500)
- Rating between 3.0-5.0

### Orders
- **500 orders** from customer users
- Each order has 1-5 items
- Realistic status based on order date
- Power-law distribution (some users order more)
- Includes shipping, tax, and discounts

## Data Relations

```
User (1) ──────────< Order (N)
                         │
Product (1) ────────< OrderItem (N) >──── Order
```

- Each **Order** belongs to one **User**
- Each **Order** has multiple **OrderItems**
- Each **OrderItem** references one **Product**
- **Products** are owned by **Admin** users

## Categories

| Category | Price Range | Featured % |
|----------|-------------|------------|
| Electronics | $50-1500 | 20% |
| Jewelry & Watches | $50-1500 | 15% |
| Clothing | $20-300 | 15% |
| Sports & Outdoors | $20-300 | 10% |
| Home & Garden | $10-200 | 10% |
| Health & Beauty | $10-200 | 10% |
| Toys & Games | $10-200 | 10% |
| Automotive | $10-200 | 5% |
| Books | $5-50 | 3% |
| Food & Grocery | $5-50 | 2% |

## Troubleshooting

### Import Errors

Make sure you're running from the `backend` directory:

```bash
cd backend
python -m seed.seed
```

### Database Connection

Ensure your `.env` file has the correct `DATABASE_URL`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/ecommerce
```

### Foreign Key Errors

Use `--clear` to remove existing data first:

```bash
python -m seed.seed --clear
```