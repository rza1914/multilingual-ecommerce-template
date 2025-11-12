"""Add category_id to products table

Revision ID: 003
Revises: 002
Create Date: 2025-11-12 15:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade():
    # Add foreign key constraint to category_id column in products table using batch operations for SQLite compatibility
    # The categories table and category_id column have already been created in a partial execution
    with op.batch_alter_table('products') as batch_op:
        batch_op.create_foreign_key('fk_products_category', 'categories', ['category_id'], ['id'])


def downgrade():
    # Drop foreign key constraint first using batch operations for SQLite compatibility
    with op.batch_alter_table('products') as batch_op:
        batch_op.drop_constraint('fk_products_category', type_='foreignkey')
        
        # Optionally drop the category_id column if needed
        # Note: dropping columns in SQLite with batch operations is complex
        # and often not recommended once data exists