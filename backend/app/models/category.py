import uuid
from typing import TYPE_CHECKING, Optional, List, ForwardRef, Dict, Any

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
    type: CategoryType = Field(index=True)  # income or expense


class Category(CategoryBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    transactions: List[Transaction] = Relationship(back_populates="category")


class CategoryCreate(CategoryBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    pass


class CategoryRead(CategoryBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class CategoryReadWithDetails(CategoryRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    transactions: Optional[List[Dict[str, Any]]] = None


class CategoryUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    name: Optional[str] = None
    type: Optional[CategoryType] = None


class CategoriesPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[CategoryRead]
    count: int


# Update forward references at the end of the file
Category.model_rebuild()
CategoryRead.model_rebuild()
CategoryReadWithDetails.model_rebuild()
CategoriesPublic.model_rebuild() 