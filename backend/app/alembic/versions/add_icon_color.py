"""add_icon_color

Revision ID: add_icon_color
Revises: d6fed478558e
Create Date: 2025-04-27

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = 'add_icon_color'  # Shorter revision ID
down_revision = 'd6fed478558e'  # Set this to the ID of the most recent migration
branch_labels = None
depends_on = None


def upgrade():
    # Add icon and color columns to subscription table
    op.add_column('subscription', sa.Column('icon', sa.String(255), nullable=True))
    op.add_column('subscription', sa.Column('color', sa.String(50), nullable=True))


def downgrade():
    # Remove icon and color columns from subscription table
    op.drop_column('subscription', 'color')
    op.drop_column('subscription', 'icon')
