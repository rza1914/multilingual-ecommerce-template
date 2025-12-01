# Database Migration System with Alembic

This document describes the database migration system implemented for the multilingual e-commerce template using Alembic.

## Overview

The migration system allows for version-controlled schema changes to the database. It provides:

- Version-controlled schema changes
- Ability to upgrade/downgrade database schemas
- Preservation of existing data during migrations
- Support for multiple database systems (SQLite, PostgreSQL)

## Installation and Setup

### Prerequisites
- Python 3.8+
- SQLAlchemy 2.0+
- Alembic 1.13+

### Setup Steps

1. Install the required packages:
```bash
pip install alembic
```

2. The alembic configuration is already set up in the `backend` directory

3. Database connection is configured in `backend/alembic.ini` and references the application's database settings from `backend/app/config.py`

## Directory Structure

```
backend/
├── alembic/
│   ├── env.py             # Alembic environment configuration
│   ├── script.py.mako     # Migration script template
│   └── versions/          # Migration files directory
│       ├── 001_initial_migration.py
│       └── 002_add_review_table.py
├── alembic.ini            # Alembic configuration file
├── app/
│   └── models/            # SQLAlchemy models
├── run_migrations.py      # Migration runner script
└── run.py                 # Application entry point with migration execution
```

## Creating New Migrations

### Method 1: Auto-generate from model changes (Recommended)

1. Update your SQLAlchemy models in `backend/app/models/`
2. Run the auto-generation command:

```bash
cd backend
alembic revision --autogenerate -m "Description of the changes"
```

This creates a new migration file in `alembic/versions/` with the necessary operations to upgrade and downgrade the schema.

### Method 2: Manual migration creation

1. Create a new migration file:

```bash
alembic revision -m "Description of the changes"
```

2. Edit the generated file in `alembic/versions/` with your upgrade and downgrade operations

## Running Migrations

### During Application Startup
The application automatically runs migrations when it starts up by executing the `run_migrations.py` script.

### Manual Execution
You can also run migrations manually:

```bash
# Run all pending migrations
cd backend
alembic upgrade head

# Rollback to a specific migration
alembic downgrade <migration_id>

# Show current migration status
alembic current

# Show migration history
alembic history
```

## Migration File Structure

Each migration file contains:

- `upgrade()` function: Applies the schema changes
- `downgrade()` function: Reverts the schema changes
- Revision identifier and dependencies

Example:

```python
"""Add user profile picture field

Revision ID: abc123
Revises: def456
Create Date: 2023-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'abc123'
down_revision = 'def456'
branch_labels = None
depends_on = None

def upgrade():
    # Add new column
    op.add_column('users', sa.Column('profile_picture_url', sa.String()))

def downgrade():
    # Remove column
    op.drop_column('users', 'profile_picture_url')
```

## Models and Relationships

The migration system supports various model relationships:

- One-to-many: User to Product, User to Order
- Many-to-many: Implicitly through Order-OrderItem-Product
- Foreign Key Constraints with CASCADE delete options
- Proper indexing for performance

## Supported Databases

The migration system supports:
- SQLite (default for development)
- PostgreSQL (recommended for production)
- MySQL (with minor modifications)

## Best Practices

1. **Always backup your database** before running migrations in production
2. **Test migrations** on a copy of production data
3. **Use auto-generation** when possible to avoid errors
4. **Keep migrations small** and focused on single changes
5. **Maintain data integrity** - don't drop columns with important data
6. **Update models first**, then generate migrations
7. **Test downgrade capability** - ensure you can rollback if needed

## Error Handling

Common migration errors and solutions:

- **Foreign Key Constraint Errors**: Ensure correct table creation order in dependencies
- **Duplicate Column Errors**: Check if migration has already been applied
- **Permission Errors**: Ensure sufficient database privileges
- **Connection Errors**: Check database connection settings

## Production Deployment

When deploying to production:

1. Ensure the database connection settings are correct in environment variables
2. Run migrations in a maintenance window if extensive changes are involved
3. Monitor the migration log for any errors
4. Have a rollback plan ready
5. Test the application functionality after migrations

## Sample Migration Commands

```bash
# Create a new migration
alembic revision --autogenerate -m "Add user preferences"

# Run pending migrations
alembic upgrade head

# Run a specific migration
alembic upgrade 002

# Downgrade to previous version
alembic downgrade -1

# Show migration status
alembic current
```

## Troubleshooting

### Migration Conflicts
If you encounter conflicts between branches with different migration histories:
1. Manually merge the migration files
2. Update dependencies appropriately
3. Test the merged migrations

### Data Loss Prevention
- Always backup before running migrations
- Use `--sql` flag to preview migration SQL before applying
- Test migrations on a copy of production data

### Common Issues
- Ensure database connection is available before running migrations
- Check that all models are properly imported in env.py
- Verify foreign key constraint order in dependencies