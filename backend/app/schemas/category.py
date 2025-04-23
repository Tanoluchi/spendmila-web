from typing import Optional, List
import uuid

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

from app.models.enums import CategoryType


class CategoryBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    type: CategoryType
    icon: Optional[str] = Field(default=None, max_length=255)
    color: Optional[str] = Field(default=None, max_length=7)
    is_active: bool = True


class CategoryRead(CategoryBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    user_id: uuid.UUID


class CategoryCreate(CategoryBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    pass


class CategoryUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    name: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    type: Optional[CategoryType] = None
    icon: Optional[str] = Field(default=None, max_length=255)
    color: Optional[str] = Field(default=None, max_length=7)
    is_active: Optional[bool] = None


class CategoryPublic(CategoryBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class CategoriesPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[CategoryPublic]
    count: int


class CategoryReadWithDetails(CategoryRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    transactions: List[dict] = [] 