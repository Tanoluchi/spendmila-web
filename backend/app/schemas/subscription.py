from typing import Optional, List, Dict, Any
from datetime import date
import uuid

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

from app.models.enums import SubscriptionStatus, SubscriptionFrequency


class SubscriptionBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    service_name: str = Field(max_length=150)
    amount: float = Field(gt=0)
    frequency: SubscriptionFrequency
    next_payment_date: date
    status: SubscriptionStatus = Field(default=SubscriptionStatus.ACTIVE)
    icon: Optional[str] = Field(default=None, max_length=255)  # URL or string for subscription icon
    color: Optional[str] = Field(default=None, max_length=50)  # Color code for subscription
    description: Optional[str] = Field(default=None, max_length=255)  # Description of the subscription
    reminder_days: Optional[int] = Field(default=3, ge=0)  # Days before to remind about payment


class SubscriptionRead(SubscriptionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    user_id: uuid.UUID
    currency_id: uuid.UUID
    account_id: Optional[uuid.UUID] = None

class SubscriptionCreate(SubscriptionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    currency_id: uuid.UUID
    account_id: Optional[uuid.UUID] = None


class SubscriptionUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    service_name: Optional[str] = None
    amount: Optional[float] = None
    frequency: Optional[SubscriptionFrequency] = None
    next_payment_date: Optional[date] = None
    status: Optional[SubscriptionStatus] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    reminder_days: Optional[int] = None
    currency_id: Optional[uuid.UUID] = None
    account_id: Optional[uuid.UUID] = None


class SubscriptionPublic(SubscriptionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    currency_id: uuid.UUID
    account_id: Optional[uuid.UUID] = None


class SubscriptionsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[SubscriptionPublic]
    count: int


class SubscriptionReadWithDetails(SubscriptionRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    user: Optional[Dict[str, Any]] = None
    currency: Optional[Dict[str, Any]] = None
    account: Optional[Dict[str, Any]] = None
    days_until_payment: Optional[int] = None
    transactions: List[dict] = []