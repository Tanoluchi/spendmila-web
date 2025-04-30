import uuid
from typing import TYPE_CHECKING, Optional, ForwardRef, List, Dict, Any, Literal

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

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

# Account types as per UML diagram
AccountType = Literal["bank", "digital", "cash", "other"]


class AccountBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    name: str = Field(index=True, max_length=150)
    type: str = Field(index=True)  # "bank", "digital", "cash", "other" as per UML diagram
    balance: float = Field(default=0.0)
    institution: Optional[str] = Field(default=None, max_length=150)
    icon: Optional[str] = Field(default=None, max_length=255)  # Icon for the account
    color: Optional[str] = Field(default=None, max_length=50)  # Color code for the account
    is_default: bool = Field(default=False)  # Whether this is the default account

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
