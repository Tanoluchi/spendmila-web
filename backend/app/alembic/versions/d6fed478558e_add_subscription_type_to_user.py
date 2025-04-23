"""add_subscription_type_to_user

Revision ID: d6fed478558e
Revises: add_default_currency_id
Create Date: 2025-04-22 20:03:05.205168

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'd6fed478558e'
down_revision = 'add_default_currency_id'
branch_labels = None
depends_on = None


def upgrade():
    # Add subscription_type column with default value 'free'
    op.add_column('user', sa.Column('subscription_type', 
                                  sqlmodel.sql.sqltypes.AutoString(length=10),
                                  nullable=False,
                                  server_default='free'))
    # Create an index for faster queries
    op.create_index(op.f('ix_user_subscription_type'), 'user', ['subscription_type'], unique=False)


def downgrade():
    # Remove the index first
    op.drop_index(op.f('ix_user_subscription_type'), table_name='user')
    # Then remove the column
    op.drop_column('user', 'subscription_type')
