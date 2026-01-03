# Database Migrations

This directory contains database migration scripts for managing schema changes in the multilingual e-commerce template.

## Available Scripts

### `add_missing_columns.py`
This script adds columns that exist in the SQLAlchemy model but are missing from the actual SQLite database schema.

**Usage:**
```bash
cd backend
python -m app.migrations.add_missing_columns
```

### `run_migration.py`
Main migration runner script that applies all pending migrations.

**Usage:**
```bash
cd backend
python run_migration.py
```

### `init_db.py`
Initializes the database with all required tables.

**Usage:**
```bash
cd backend
python init_db.py
```

## When to Run Migrations

Run migrations if you encounter database schema errors like:
- `no such column: products.is_active`
- `no such column: products.is_featured`
- `no such column: products.discount_price`

## Troubleshooting

If migrations fail:
1. Make sure the database file exists
2. Stop the server before running migrations
3. Check file permissions on the database file
4. Ensure no other process is using the database file