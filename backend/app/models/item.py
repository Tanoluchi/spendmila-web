import uuid
from typing import TYPE_CHECKING, Optional, Dict, Any, ForwardRef

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User, UserRead

# Forward references for runtime
User = ForwardRef("User")
UserRead = ForwardRef("UserRead")


# Shared properties
class ItemBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)

    # Relationship to the adapted User model
    owner: User = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemRead(ItemBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemReadWithDetails(ItemRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    owner: Optional[Dict[str, Any]] = None


class ItemsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: list[ItemRead] # Use ItemRead for consistency
    count: int

# Update forward references at the end of the file
Item.model_rebuild()
ItemRead.model_rebuild()
ItemReadWithDetails.model_rebuild() 