import uuid
from datetime import date
from typing import TYPE_CHECKING, Optional, ForwardRef, List

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import SubscriptionFrequency, SubscriptionStatus

if TYPE_CHECKING:
    from .user import User
    from .currency import Currency
    from .account import Account
    from .transaction import Transaction

# Forward references for runtime
User = ForwardRef("User")
Currency = ForwardRef("Currency")
Account = ForwardRef("Account")
Transaction = ForwardRef("Transaction")


class SubscriptionBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    service_name: str = Field(index=True, max_length=150)
    amount: float = Field(gt=0)
    frequency: SubscriptionFrequency = Field(index=True)
    next_payment_date: date = Field(index=True)
    status: SubscriptionStatus = Field(default=SubscriptionStatus.ACTIVE, index=True)
    icon: Optional[str] = Field(default=None, max_length=255)  # URL or string for subscription icon
    color: Optional[str] = Field(default=None, max_length=50)  # Color code for subscription
    description: Optional[str] = Field(default=None, max_length=255)  # Description of the subscription
    reminder_days: Optional[int] = Field(default=3, ge=0)  # Days before to remind about payment

    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    currency_id: uuid.UUID = Field(foreign_key="currency.id", index=True)
    account_id: Optional[uuid.UUID] = Field(default=None, foreign_key="account.id", index=True)


class Subscription(SubscriptionBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    user: User = Relationship(back_populates="subscriptions")
    currency: Currency = Relationship(back_populates="subscriptions")
    account: Optional[Account] = Relationship(back_populates="subscriptions")
    transactions: List["Transaction"] = Relationship(back_populates="subscription")


# Update forward references at the end of the file
Subscription.model_rebuild()