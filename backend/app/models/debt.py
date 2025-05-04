import uuid
from datetime import date
from typing import TYPE_CHECKING, Optional, ForwardRef, List

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import DebtType

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


class DebtBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    creditor_name: str = Field(index=True, max_length=150)
    amount: float = Field(gt=0)  # Total original amount of the debt
    due_date: Optional[date] = Field(default=None, index=True)
    description: Optional[str] = Field(default=None, max_length=255)
    is_paid: bool = Field(default=False, index=True)  # Whether the debt is fully paid
    debt_type: DebtType = Field(default=DebtType.PERSONAL, index=True)
    interest_rate: Optional[float] = Field(default=None, ge=0)
    minimum_payment: Optional[float] = Field(default=None, ge=0)
    icon: Optional[str] = Field(default=None, max_length=255)  # Icon for the debt
    color: Optional[str] = Field(default=None, max_length=50)  # Color code for the debt
    
    # Payment tracking
    paid_amount: float = Field(default=0)  # Amount that has been paid off so far
    remaining_amount: float = Field(default=0)  # Amount still left to pay
    payment_progress: float = Field(default=0)  # Percentage complete (0-100)
    
    # Installment tracking
    is_installment: bool = Field(default=False, index=True)  # Whether the debt is paid in installments
    total_installments: Optional[int] = Field(default=None, ge=1)  # Total number of installments
    paid_installments: Optional[int] = Field(default=0, ge=0)  # Number of installments paid
    remaining_installments: Optional[int] = Field(default=None, ge=0)  # Number of installments remaining
    start_date: Optional[date] = Field(default=None)  # When the debt was created/started

    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    currency_id: uuid.UUID = Field(foreign_key="currency.id", index=True)
    account_id: Optional[uuid.UUID] = Field(default=None, foreign_key="account.id", index=True)


class Debt(DebtBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    user: "User" = Relationship(back_populates="debts")
    currency: "Currency" = Relationship(back_populates="debts")
    account: Optional["Account"] = Relationship(back_populates="debts")
    transactions: List["Transaction"] = Relationship(back_populates="debt")

# Update forward references at the end of the file
Debt.model_rebuild()