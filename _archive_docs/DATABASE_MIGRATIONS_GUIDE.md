# Database Migrations Guide

This guide explains how to use the Alembic-based database migration system in the multilingual e-commerce template.

## What Are Database Migrations?

Database migrations are version control for your database schema. They allow you to:

- Track changes to your database structure over time
- Safely apply schema changes across development, staging, and production environments
- Rollback changes if problems arise
- Collaborate effectively with other developers

## Prerequisites

Before working with migrations, ensure you have:

- Python 3.8+
- The project dependencies installed (including Alembic)
- A properly configured database connection

## Migration System Overview

The migration system is implemented using Alembic and includes:

- **Automated migration generation** from model changes
- **Pre-built initial migrations** for existing models
- **Relationship and constraint handling** for data integrity
- **Environment-specific configuration** for different deployment targets
- **Automatic migration execution** on application startup

## Running Migrations

### On Application Startup (Automatic)

The application automatically runs pending migrations when it starts up. This is handled by the `run_migrations.py` script called from `run.py`.

### Manually Running Migrations

You can run pending migrations manually:

```bash
cd backend
python run_migrations.py
```

Or using Alembic directly:

```bash
cd backend
alembic upgrade head
```

### Checking Migration Status

To see the current migration status:

```bash
cd backend
alembic current
```

To see all available migrations:

```bash
cd backend
alembic history
```

## Creating New Migrations

### Method 1: Auto-generate from Model Changes (Recommended)

1. **Modify your SQLAlchemy models** in `backend/app/models/`
   - Add, remove, or change fields
   - Update relationships between models
   - Modify constraints or indexes

2. **Generate the migration automatically:**
   ```bash
   cd backend
   python create_migration.py generate -m "Description of your changes"
   ```
   
   For example:
   ```bash
   python create_migration.py generate -m "Add profile picture field to users"
   ```

3. **Review the generated migration file** in `backend/alembic/versions/`
   - Check that upgrade/downgrade operations are correct
   - Add any additional logic if needed (data transformations, etc.)

4. **Test the migration** on a copy of your data before applying to production

### Method 2: Manual Migration Creation

1. **Create a blank migration file:**
   ```bash
   cd backend
   python create_migration.py generate -m "Brief description"
   ```

2. **Edit the generated file** in `backend/alembic/versions/` with your own upgrade/downgrade functions

## Migration File Structure

Each migration file includes:

- **Revision ID**: Unique identifier for the migration
- **Dependencies**: Previous migration this depends on
- **Upgrade function**: Applies the schema changes
- **Downgrade function**: Reverses the schema changes

Example structure:
```python
"""Description of the changes

Revision ID: abc123def456
Revises: previous_migration_id
Create Date: YYYY-MM-DD HH:MM:SS.ssssss

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'abc123def456'
down_revision = 'previous_migration_id'
branch_labels = None
depends_on = None

def upgrade():
    # Schema changes to apply
    pass

def downgrade():
    # Schema changes to reverse
    pass
```

## Best Practices

### ✅ Good Practices

- **Always test migrations** on a copy of production data
- **Use auto-generation** when possible to avoid errors
- **Keep migrations focused** on single logical changes
- **Update models first**, then generate migrations
- **Include data migration logic** when needed (moving data between tables/columns)
- **Test downgrade capability** to ensure you can rollback if needed
- **Document complex migrations** with comments explaining the purpose

### ❌ Avoid These Patterns

- Don't drop tables or columns with important data without backup/data migration
- Don't create migrations that depend on data in other tables (make them independent)
- Don't skip testing the downgrade function
- Don't apply migrations to production without testing in staging first

## Managing Relationships and Constraints

The system properly handles:

- **Foreign Key Constraints**: With CASCADE delete options where appropriate
- **Relationships**: Between Users, Products, Orders, and OrderItems
- **Indexes**: For optimal query performance
- **Unique Constraints**: To prevent duplicate data where needed

### Foreign Key Cascade Behavior

- User → Products: CASCADE (when user is deleted, products are deleted)
- User → Orders: CASCADE (when user is deleted, orders are deleted)
- Order → OrderItems: CASCADE (when order is deleted, items are deleted)
- Product → OrderItems: CASCADE (when product is deleted, order items are deleted)

## Troubleshooting Common Issues

### Issue: "Can't locate revision identified by [hash_id]"
**Solution:** Check if the migration file exists in `backend/alembic/versions/`. If missing, recreate it or restore from version control.

### Issue: Foreign key constraint violations
**Solution:** Ensure proper order of operations in your migration. Delete dependent records before the parent table.

### Issue: Migration file conflicts between branches
**Solution:** Create a merge migration that combines the different changes:
```bash
alembic merge -m "merge branch changes"
```

### Issue: Migration takes too long on production
**Solution:** For large tables, break the migration into multiple smaller ones. Consider using:
- Background job processing for data migrations
- Batch operations instead of single transactions
- Maintenance windows for large schema changes

## Environment-Specific Considerations

### Development
- SQLite database, supports most migration operations
- Auto-run on startup for convenience
- Safe to recreate database if needed

### Production
- PostgreSQL database (assumed), with more strict migration requirements
- Always backup before running migrations
- Test in staging environment first
- Plan for maintenance windows if needed

## Rollback Procedures

If a migration causes issues in production:

1. **Immediate response:** 
   ```bash
   cd backend
   alembic downgrade -1  # Go back to previous migration
   ```

2. **For specific migration:**
   ```bash
   alembic downgrade [target_migration_id]
   ```

3. **In case of data corruption:**
   - Restore from backup immediately
   - Investigate the problematic migration
   - Create a corrected migration

## Version Control Integration

Migration files should be committed to version control alongside the code changes that necessitated them. This ensures:

- Migration history is preserved
- Multiple developers can work together
- Rollbacks to any previous version are possible
- Deployment automation can be properly orchestrated

## Performance Considerations

For large datasets, consider:

- Running large migrations during off-peak hours
- Breaking large migrations into smaller chunks
- Using background workers for data transformations
- Monitoring database performance during migrations

## Security Implications

- Migration files may contain sensitive information about database structure
- Limit access to production migrations
- Sanitize data in migration scripts
- Validate all inputs if migrations accept parameters

Remember: A well-planned migration strategy is crucial for maintaining data integrity and application stability in production environments.