"""Add category_id to products table

Revision ID: 003
Revises: 002
Create Date: 2025-11-12 15:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None


def upgrade():
    # Create categories table
    op.create_table('categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('parent_id', sa.Integer(), nullable=True),  # For hierarchical categories
        sa.Column('image_url', sa.String(), nullable=True),
        
        # Multilingual fields
        sa.Column('name_en', sa.String(), nullable=True),
        sa.Column('name_ar', sa.String(), nullable=True),
        sa.Column('name_fa', sa.String(), nullable=True),
        sa.Column('description_en', sa.Text(), nullable=True),
        sa.Column('description_ar', sa.Text(), nullable=True),
        sa.Column('description_fa', sa.Text(), nullable=True),
        
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['parent_id'], ['categories.id'], name='fk_categories_parent'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_categories_name'), 'categories', ['name'], unique=False)
    op.create_index(op.f('ix_categories_id'), 'categories', ['id'], unique=False)

    # Add category_id column to products table using batch operations for SQLite compatibility
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.add_column(sa.Column('category_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_products_category', 'categories', ['category_id'], ['id'])


def downgrade():
    # Drop foreign key constraint first
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.drop_constraint('fk_products_category', type_='foreignkey')
        batch_op.drop_column('products', 'category_id')
    
    # Drop categories table
    op.drop_index(op.f('ix_categories_id'), table_name='categories')
    op.drop_index(op.f('ix_categories_name'), table_name='categories')
    op.drop_table('categories')