from typing import Optional, List
from uuid import UUID

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel


class ItemBase(SQLModel):
    """Base schema for Item."""
    title: str
    description: Optional[str] = None
    price: Optional[float] = None
    tax: Optional[float] = None


class ItemCreate(ItemBase):
    """Schema for creating a new item."""
    model_config = ConfigDict(from_attributes=True)


class ItemUpdate(ItemBase):
    """Schema for updating an existing item."""
    title: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class ItemRead(ItemBase):
    """Schema for reading an item, including its ID and owner ID."""
    id: UUID
    owner_id: UUID
    model_config = ConfigDict(from_attributes=True)


class ItemPublic(ItemBase):
    """Schema for public item information."""
    id: UUID
    model_config = ConfigDict(from_attributes=True)


class ItemsPublic(SQLModel):
    """Schema for reading multiple public items."""
    data: List[ItemPublic]
    count: int
    model_config = ConfigDict(from_attributes=True)


class ItemsRead(SQLModel):
    """Schema for reading multiple items."""
    items: list[ItemRead]
    total: int
    model_config = ConfigDict(from_attributes=True) 