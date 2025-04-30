import uuid
from typing import TYPE_CHECKING, List, ForwardRef, Optional

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import CategoryType

if TYPE_CHECKING:
    from .transaction import Transaction

# Forward references for runtime
Transaction = ForwardRef("Transaction")


class CategoryBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    name: str = Field(index=True, max_length=100)
    category_type: CategoryType = Field(index=True)  # income or expense as per UML diagram
    icon: Optional[str] = Field(default=None, max_length=255)  # Icon for the category
    color: Optional[str] = Field(default=None, max_length=50)  # Color code for the category


class Category(CategoryBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    transactions: List[Transaction] = Relationship(back_populates="category")

# Update forward references at the end of the file
Category.model_rebuild()
