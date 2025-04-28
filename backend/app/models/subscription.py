import uuid
from datetime import date
from typing import TYPE_CHECKING, Optional, Dict, Any, ForwardRef, List

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import SubscriptionFrequency

if TYPE_CHECKING:
    from .user import User
    from .currency import Currency

# Forward references for runtime
User = ForwardRef("User")
Currency = ForwardRef("Currency")


class SubscriptionBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    service_name: str = Field(index=True, max_length=150)
    amount: float = Field(gt=0)
    frequency: SubscriptionFrequency = Field(index=True)
    next_payment_date: date = Field(index=True)
    active: bool = Field(default=True, index=True)
    icon: Optional[str] = Field(default=None, max_length=255)  # URL or string for subscription icon
    color: Optional[str] = Field(default=None, max_length=50)  # Color code for subscription

    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    currency_id: uuid.UUID = Field(foreign_key="currency.id", index=True)


class Subscription(SubscriptionBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    user: "User" = Relationship(back_populates="subscriptions")
    currency: "Currency" = Relationship(back_populates="subscriptions")


# --- Schemas ---

class SubscriptionCreate(SubscriptionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    # user_id will be set based on logged-in user
    pass


class SubscriptionRead(SubscriptionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class SubscriptionReadWithDetails(SubscriptionRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    user: Optional[Dict[str, Any]] = None
    currency: Optional[Dict[str, Any]] = None


class SubscriptionUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    service_name: Optional[str] = None
    amount: Optional[float] = None
    frequency: Optional[SubscriptionFrequency] = None
    next_payment_date: Optional[date] = None
    active: Optional[bool] = None
    currency_id: Optional[uuid.UUID] = None


class SubscriptionsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[SubscriptionRead]
    count: int


# Schema for subscription payment operation
class SubscriptionPayment(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    payment_date: date = Field(...)


# Update forward references at the end of the file
Subscription.model_rebuild()
SubscriptionRead.model_rebuild()
SubscriptionReadWithDetails.model_rebuild()
SubscriptionsPublic.model_rebuild()
SubscriptionPayment.model_rebuild() 