import uuid
from typing import TYPE_CHECKING, Optional, List, Dict, Any, ForwardRef

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import PaymentMethodType

if TYPE_CHECKING:
    from .transaction import Transaction
    from .debt import Debt

# Forward references for runtime
Transaction = ForwardRef("Transaction")
Debt = ForwardRef("Debt")


class PaymentMethodBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    name: str = Field(index=True, max_length=100)
    type: PaymentMethodType = Field(index=True)
    description: Optional[str] = Field(default=None, max_length=255)


class PaymentMethod(PaymentMethodBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    __tablename__ = "payment_method"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    transactions: List["Transaction"] = Relationship(back_populates="payment_method")
    debts: List["Debt"] = Relationship(back_populates="payment_method")


class PaymentMethodCreate(PaymentMethodBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    pass


class PaymentMethodRead(PaymentMethodBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class PaymentMethodReadWithDetails(PaymentMethodRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    transactions: Optional[List[Dict[str, Any]]] = None
    debts: Optional[List[Dict[str, Any]]] = None


class PaymentMethodUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    name: Optional[str] = None
    type: Optional[PaymentMethodType] = None
    description: Optional[str] = None


class PaymentMethodsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[PaymentMethodRead]
    count: int


# Update forward references at the end of the file
PaymentMethod.model_rebuild()
PaymentMethodRead.model_rebuild()
PaymentMethodReadWithDetails.model_rebuild()
PaymentMethodsPublic.model_rebuild() 