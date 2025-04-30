import uuid
from typing import TYPE_CHECKING, Optional, List, Dict, Any, ForwardRef

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import PaymentMethodType

if TYPE_CHECKING:
    from .transaction import Transaction
    from .debt import Debt
    from .user import User

# Forward references for runtime
Transaction = ForwardRef("Transaction")
Debt = ForwardRef("Debt")
User = ForwardRef("User")


class PaymentMethodBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    name: str = Field(index=True, max_length=100)
    payment_method_type: PaymentMethodType = Field(index=True)
    description: Optional[str] = Field(default=None, max_length=255)
    # Foreign key to User
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)

class PaymentMethod(PaymentMethodBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    __tablename__ = "payment_method"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    user: "User" = Relationship(back_populates="payment_methods")
    transactions: List["Transaction"] = Relationship(back_populates="payment_method")
    debts: List["Debt"] = Relationship(back_populates="payment_method")


# Update forward references at the end of the file
PaymentMethod.model_rebuild()