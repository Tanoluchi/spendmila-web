import uuid
from datetime import date
from typing import TYPE_CHECKING, Optional, ForwardRef, List

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import DebtStatus, DebtType

if TYPE_CHECKING:
    from .user import User
    from .payment_method import PaymentMethod
    from .currency import Currency
    from .account import Account
    from .transaction import Transaction

# Forward references for runtime
User = ForwardRef("User")
PaymentMethod = ForwardRef("PaymentMethod")
Currency = ForwardRef("Currency")
Account = ForwardRef("Account")
Transaction = ForwardRef("Transaction")


class DebtBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    creditor_name: str = Field(index=True, max_length=150)
    amount: float = Field(gt=0)
    due_date: Optional[date] = Field(default=None, index=True)
    description: Optional[str] = Field(default=None, max_length=255)
    is_paid: bool = Field(default=False, index=True)  # Matches isPaid in UML diagram
    status: DebtStatus = Field(default=DebtStatus.PENDING, index=True)
    debt_type: DebtType = Field(default=DebtType.PERSONAL, index=True)
    interest_rate: Optional[float] = Field(default=None, ge=0)
    minimum_payment: Optional[float] = Field(default=None, ge=0)
    icon: Optional[str] = Field(default=None, max_length=255)  # Icon for the debt
    color: Optional[str] = Field(default=None, max_length=50)  # Color code for the debt
    installment_count: Optional[int] = Field(default=None, ge=1)

    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    payment_method_id: Optional[uuid.UUID] = Field(default=None, foreign_key="payment_method.id", index=True)
    currency_id: uuid.UUID = Field(foreign_key="currency.id", index=True)
    account_id: Optional[uuid.UUID] = Field(default=None, foreign_key="account.id", index=True)


class Debt(DebtBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    user: "User" = Relationship(back_populates="debts")
    payment_method: Optional["PaymentMethod"] = Relationship(back_populates="debts")
    currency: "Currency" = Relationship(back_populates="debts")
    account: Optional["Account"] = Relationship(back_populates="debts")
    transactions: List["Transaction"] = Relationship(back_populates="debt")

# Update forward references at the end of the file
Debt.model_rebuild()