"""simplify product category to string

Revision ID: 006
Revises: 005
Create Date: 2025-11-12 18:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '006'
down_revision = '005'
branch_labels = None
depends_on = None


def upgrade():
    # This migration represents the simplification of the category system
    # We're using string categories instead of foreign key relationships for demo purposes
    pass


def downgrade():
    # Reverting would involve restoring the foreign key relationship
    pass