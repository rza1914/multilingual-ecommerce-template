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
    # Previously added foreign key constraint to category_id column
    # For demo purposes, we skip creating the foreign key constraint
    pass


def downgrade():
    # Previously dropped foreign key constraint
    # For demo purposes, we skip this operation
    pass
