import uuid
import datetime
from typing import TYPE_CHECKING, List, ForwardRef

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import CurrencyCode

if TYPE_CHECKING:
    from .user import User
    from .transaction import Transaction
    from .financial_goal import FinancialGoal
    from .subscription import Subscription
    from .debt import Debt
    from .account import Account

# Forward references for runtime
User = ForwardRef("User")
Transaction = ForwardRef("Transaction")
FinancialGoal = ForwardRef("FinancialGoal")
Subscription = ForwardRef("Subscription")
Debt = ForwardRef("Debt")
Account = ForwardRef("Account")


class CurrencyBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    code: CurrencyCode = Field(index=True, unique=True)
    symbol: str = Field(max_length=5)
    name: str = Field(index=True, max_length=50)
    is_default: bool = Field(default=False, nullable=False)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)


class Currency(CurrencyBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships (one currency can be used by many entities)
    users: List["User"] = Relationship(back_populates="default_currency", sa_relationship_kwargs={"lazy": "selectin"})
    transactions: List["Transaction"] = Relationship(back_populates="currency", sa_relationship_kwargs={"lazy": "selectin"})
    subscriptions: List["Subscription"] = Relationship(back_populates="currency", sa_relationship_kwargs={"lazy": "selectin"})
    debts: List["Debt"] = Relationship(back_populates="currency", sa_relationship_kwargs={"lazy": "selectin"})
    accounts: List["Account"] = Relationship(back_populates="currency", sa_relationship_kwargs={"lazy": "selectin"})

    def __init__(self, **data):
        super().__init__(**data)
        self.users = []
        self.transactions = []
        self.subscriptions = []
        self.debts = []
        self.accounts = []

# Update forward references at the end of the file
Currency.model_rebuild()
