import uuid
import datetime
from typing import TYPE_CHECKING, ForwardRef, Optional

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel, Column, String

from .enums import TransactionType

if TYPE_CHECKING:
    from .user import User
    from .account import Account
    from .category import Category
    from .payment_method import PaymentMethod
    from .currency import Currency
    from .subscription import Subscription
    from .financial_goal import FinancialGoal
    from .debt import Debt

User = ForwardRef("User")
Category = ForwardRef("Category")
PaymentMethod = ForwardRef("PaymentMethod")
Currency = ForwardRef("Currency")
Account = ForwardRef("Account")
Subscription = ForwardRef("Subscription")
FinancialGoal = ForwardRef("FinancialGoal")
Debt = ForwardRef("Debt")

# Base model with shared properties
class TransactionBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    date: datetime.date = Field(index=True)
    amount: float = Field(gt=0)  # Ensure amount is positive
    description: Optional[str] = Field(default=None, max_length=255)
    is_active: bool = Field(default=True)

    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    category_id: Optional[uuid.UUID] = Field(default=None, foreign_key="category.id", index=True)
    payment_method_id: Optional[uuid.UUID] = Field(default=None, foreign_key="payment_method.id", index=True)
    currency_id: uuid.UUID = Field(foreign_key="currency.id", index=True)
    account_id: Optional[uuid.UUID] = Field(default=None, foreign_key="account.id", index=True)
    subscription_id: Optional[uuid.UUID] = Field(default=None, foreign_key="subscription.id", index=True)
    financial_goal_id: Optional[uuid.UUID] = Field(default=None, foreign_key="financial_goal.id", index=True)
    debt_id: Optional[uuid.UUID] = Field(default=None, foreign_key="debt.id", index=True)

    # Transaction type
    transaction_type: TransactionType = Field(sa_column=Column(String(50), index=True))

# Main Transaction model representing the table
class Transaction(TransactionBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    __tablename__ = "transaction"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    user: "User" = Relationship(back_populates="transactions")
    category: Optional["Category"] = Relationship(back_populates="transactions")
    payment_method: Optional["PaymentMethod"] = Relationship(back_populates="transactions")
    currency: "Currency" = Relationship(back_populates="transactions")
    account: Optional["Account"] = Relationship(back_populates="transactions")
    subscription: Optional["Subscription"] = Relationship(back_populates="transactions")
    financial_goal: Optional["FinancialGoal"] = Relationship(back_populates="transactions")
    debt: Optional["Debt"] = Relationship(back_populates="transactions")

# Update forward references
Transaction.model_rebuild()