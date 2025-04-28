import uuid
from datetime import date
from typing import TYPE_CHECKING, Optional, Dict, Any, ForwardRef, List

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User
    from .payment_method import PaymentMethod
    from .currency import Currency

# Forward references for runtime
User = ForwardRef("User")
PaymentMethod = ForwardRef("PaymentMethod")
Currency = ForwardRef("Currency")


class DebtBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    creditor_name: str = Field(index=True, max_length=150)
    amount: float = Field(gt=0)
    due_date: Optional[date] = Field(default=None, index=True)
    description: Optional[str] = Field(default=None, max_length=255)
    is_paid: bool = Field(default=False, index=True)

    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    payment_method_id: Optional[uuid.UUID] = Field(default=None, foreign_key="payment_method.id", index=True)
    currency_id: uuid.UUID = Field(foreign_key="currency.id", index=True)


class Debt(DebtBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    user: "User" = Relationship(back_populates="debts")
    payment_method: Optional["PaymentMethod"] = Relationship(back_populates="debts")
    currency: "Currency" = Relationship(back_populates="debts")


# --- Schemas ---

class DebtCreate(DebtBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    # user_id will be set based on logged-in user
    pass


class DebtRead(DebtBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class DebtReadWithDetails(DebtRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    user: Optional[Dict[str, Any]] = None
    payment_method: Optional[Dict[str, Any]] = None
    currency: Optional[Dict[str, Any]] = None


class DebtUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    creditor_name: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[date] = None
    description: Optional[str] = None
    is_paid: Optional[bool] = None
    payment_method_id: Optional[uuid.UUID] = None
    currency_id: Optional[uuid.UUID] = None


class DebtsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[DebtRead]
    count: int


# Schema for debt payment operation
class DebtPayment(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    payment_date: date = Field(...)
    payment_method_id: Optional[uuid.UUID] = None


# Update forward references at the end of the file
Debt.model_rebuild()
DebtRead.model_rebuild()
DebtReadWithDetails.model_rebuild()
DebtsPublic.model_rebuild()
DebtPayment.model_rebuild() 