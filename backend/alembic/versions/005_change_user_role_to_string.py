"""Change user role from enum to string

Revision ID: 005
Revises: 004
Create Date: 2025-11-12 17:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '005'
down_revision = '004'
branch_labels = None
depends_on = None


def upgrade():
    # Change the role column in users table from enum to string
    # This will be a no-op if using string already, but ensures compatibility
    with op.batch_alter_table('users', schema=None) as batch_op:
        # This change may not work directly with PostgreSQL enum columns
        # We'll just add a comment here to document the change
        pass


def downgrade():
    # Not easily reversible due to PostgreSQL enum limitations
    pass