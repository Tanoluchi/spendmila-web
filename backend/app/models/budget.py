import uuid
import datetime
from typing import TYPE_CHECKING, ForwardRef, List, Optional
from decimal import Decimal
from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User
    from .category import Category

User = ForwardRef("User")
Category = ForwardRef("Category")


class BudgetBase(SQLModel):
    """Base model for Budget with shared properties."""
    model_config = ConfigDict(arbitrary_types_allowed=True)

    name: str = Field(index=True)
    amount: Decimal
    color: str = Field(default=None, max_length=50)  # Color code for the budget
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)

    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    category_id: uuid.UUID = Field(foreign_key="category.id", index=True)


class Budget(BudgetBase, table=True):
    """Main Budget model representing the database table."""
    model_config = ConfigDict(arbitrary_types_allowed=True)

    __tablename__ = "budget"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    user: "User" = Relationship(back_populates="budgets")
    category: "Category" = Relationship(back_populates="budgets")

# Update forward references
Budget.model_rebuild()
