from typing import Optional, List
import uuid

from pydantic import EmailStr, ConfigDict
from sqlmodel import Field, SQLModel

from app.models.enums import SubscriptionType


class UserBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    email: EmailStr = Field(max_length=255)
    full_name: Optional[str] = Field(default=None, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    subscription_type: SubscriptionType = Field(default=SubscriptionType.FREE)
    default_currency_id: Optional[uuid.UUID] = Field(default=None)


class UserRead(UserBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    default_currency: Optional[dict] = None


class UserCreate(UserBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: Optional[str] = Field(default=None, max_length=255)


class UserUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)
    full_name: Optional[str] = Field(default=None, max_length=255)
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    default_currency_id: Optional[uuid.UUID] = None


class UserUpdateMe(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    full_name: Optional[str] = Field(default=None, max_length=255)
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)
    default_currency_id: Optional[uuid.UUID] = None


class UserPublic(UserBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class UsersPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[UserPublic]
    count: int


class UserReadWithDetails(UserRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    transactions: List[dict] = []
    financial_goals: List[dict] = []
    subscriptions: List[dict] = []
    debts: List[dict] = []


class Message(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    message: str


class Token(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    sub: Optional[str] = None


class UpdatePassword(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class NewPassword(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    token: str
    new_password: str = Field(min_length=8, max_length=40) 