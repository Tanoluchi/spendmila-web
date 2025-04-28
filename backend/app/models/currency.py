import uuid
from typing import TYPE_CHECKING, Optional, List, ForwardRef, Dict, Any

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import CurrencyCode

if TYPE_CHECKING:
    from .user import User
    from .transaction import Transaction
    from .financial_goal import FinancialGoal
    from .subscription import Subscription
    from .debt import Debt

# Forward references for runtime
User = ForwardRef("User")
Transaction = ForwardRef("Transaction")
FinancialGoal = ForwardRef("FinancialGoal")
Subscription = ForwardRef("Subscription")
Debt = ForwardRef("Debt")


class CurrencyBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    code: CurrencyCode = Field(index=True, unique=True)
    symbol: str = Field(max_length=5)
    name: str = Field(index=True, max_length=50)


class Currency(CurrencyBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships (one currency can be used by many entities)
    users: List["User"] = Relationship(back_populates="default_currency", sa_relationship_kwargs={"lazy": "selectin"})
    transactions: List["Transaction"] = Relationship(back_populates="currency", sa_relationship_kwargs={"lazy": "selectin"})
    financial_goals: List["FinancialGoal"] = Relationship(back_populates="currency", sa_relationship_kwargs={"lazy": "selectin"})
    subscriptions: List["Subscription"] = Relationship(back_populates="currency", sa_relationship_kwargs={"lazy": "selectin"})
    debts: List["Debt"] = Relationship(back_populates="currency", sa_relationship_kwargs={"lazy": "selectin"})

    def __init__(self, **data):
        super().__init__(**data)
        self.users = []
        self.transactions = []
        self.financial_goals = []
        self.subscriptions = []
        self.debts = []


class CurrencyCreate(CurrencyBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    pass


class CurrencyRead(CurrencyBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class CurrencyReadWithDetails(CurrencyRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    users: Optional[List[Dict[str, Any]]] = None
    transactions: Optional[List[Dict[str, Any]]] = None
    financial_goals: Optional[List[Dict[str, Any]]] = None
    subscriptions: Optional[List[Dict[str, Any]]] = None
    debts: Optional[List[Dict[str, Any]]] = None


class CurrencyUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    code: Optional[CurrencyCode] = None
    symbol: Optional[str] = None
    name: Optional[str] = None

# Update forward references at the end of the file
Currency.model_rebuild()
CurrencyRead.model_rebuild()
CurrencyReadWithDetails.model_rebuild()