"""Fix category_id foreign key constraint

Revision ID: 004
Revises: 003
Create Date: 2025-11-12 16:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '004'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade():
    # Add foreign key constraint to category_id column using batch operations for SQLite compatibility
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.create_foreign_key('fk_products_category', 'categories', ['category_id'], ['id'])


def downgrade():
    # Drop foreign key constraint using batch operations for SQLite compatibility
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.drop_constraint('fk_products_category', type_='foreignkey')
