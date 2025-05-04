import uuid
from typing import TYPE_CHECKING, List, Optional, ForwardRef

from pydantic import EmailStr, ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import SubscriptionType

# Cyclic imports
if TYPE_CHECKING:
    from .currency import Currency
    from .transaction import Transaction
    from .financial_goal import FinancialGoal
    from .subscription import Subscription
    from .debt import Debt
    from .account import Account

# Forward references for runtime
Currency = ForwardRef("Currency")
Transaction = ForwardRef("Transaction")
FinancialGoal = ForwardRef("FinancialGoal")
Subscription = ForwardRef("Subscription")
Debt = ForwardRef("Debt")
Account = ForwardRef("Account")

# Base model with shared properties
class UserBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    full_name: Optional[str] = Field(default=None, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    subscription_type: SubscriptionType = Field(default=SubscriptionType.FREE)
    # Foreign key for default currency
    default_currency_id: uuid.UUID = Field(default=None, foreign_key="currency.id")

# Main database model
class User(UserBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    hashed_password: str = Field(nullable=False)

    # Relationships
    default_currency: Currency = Relationship(back_populates="users")
    transactions: List[Transaction] = Relationship(back_populates="user")
    financial_goals: List[FinancialGoal] = Relationship(back_populates="user")
    subscriptions: List[Subscription] = Relationship(back_populates="user")
    debts: List[Debt] = Relationship(back_populates="user")
    accounts: List[Account] = Relationship(back_populates="user")
    # Eliminada la relación con payment_methods ya que ahora son entidades globales

# Update forward references at the end of the file
User.model_rebuild()
