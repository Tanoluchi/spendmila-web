import uuid
import datetime
from typing import TYPE_CHECKING, Optional, ForwardRef, List

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import AccountType

if TYPE_CHECKING:
    from .user import User
    from .currency import Currency
    from .transaction import Transaction
    from .debt import Debt
    from .subscription import Subscription

# Forward references for runtime
User = ForwardRef("User")
Currency = ForwardRef("Currency")
Transaction = ForwardRef("Transaction")
Debt = ForwardRef("Debt")
Subscription = ForwardRef("Subscription")


class AccountBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    name: str = Field(index=True, max_length=150)
    account_type: AccountType = Field(index=True)
    balance: float = Field(default=0.0)
    institution: Optional[str] = Field(default=None, max_length=150)
    icon: Optional[str] = Field(default=None, max_length=255)  # Icon for the account
    is_default: bool = Field(default=False)  # Whether this is the default account
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)

    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    currency_id: uuid.UUID = Field(foreign_key="currency.id", index=True)


class Account(AccountBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    user: "User" = Relationship(back_populates="accounts")
    currency: "Currency" = Relationship(back_populates="accounts")
    transactions: List["Transaction"] = Relationship(back_populates="account")
    debts: List["Debt"] = Relationship(back_populates="account")
    subscriptions: List["Subscription"] = Relationship(back_populates="account")


# Update forward references at the end of the file
Account.model_rebuild()
