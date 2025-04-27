from typing import Optional, List
from datetime import date
import uuid

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

from app.models.enums import SubscriptionStatus, SubscriptionFrequency


class SubscriptionBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    amount: float = Field(gt=0)
    frequency: SubscriptionFrequency
    next_payment_date: date
    status: SubscriptionStatus = Field(default=SubscriptionStatus.ACTIVE)
    is_active: bool = True
    icon: Optional[str] = Field(default=None, max_length=255)  # URL or string for subscription icon
    color: Optional[str] = Field(default=None, max_length=50)  # Color code for subscription


class SubscriptionRead(SubscriptionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    user_id: uuid.UUID
    currency_id: uuid.UUID
    category_id: Optional[uuid.UUID] = None
    currency: Optional[dict] = None
    category: Optional[dict] = None


class SubscriptionCreate(SubscriptionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    currency_id: uuid.UUID
    category_id: Optional[uuid.UUID] = None


class SubscriptionUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    name: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    amount: Optional[float] = Field(default=None, gt=0)
    frequency: Optional[SubscriptionFrequency] = None
    next_payment_date: Optional[date] = None
    status: Optional[SubscriptionStatus] = None
    is_active: Optional[bool] = None
    icon: Optional[str] = Field(default=None, max_length=255)
    color: Optional[str] = Field(default=None, max_length=50)
    currency_id: Optional[uuid.UUID] = None
    category_id: Optional[uuid.UUID] = None


class SubscriptionPublic(SubscriptionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    currency: Optional[dict] = None
    category: Optional[dict] = None


class SubscriptionsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[SubscriptionPublic]
    count: int


class SubscriptionReadWithDetails(SubscriptionRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    transactions: List[dict] = [] 