import uuid
import datetime
from typing import TYPE_CHECKING, Optional, List, Dict, Any, ForwardRef

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from app.models.enums import PaymentMethodType

if TYPE_CHECKING:
    from .transaction import Transaction

# Forward references for runtime
Transaction = ForwardRef("Transaction")


class PaymentMethodBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    name: str = Field(index=True, unique=True, max_length=100)
    description: Optional[str] = Field(default=None, max_length=255)
    payment_method_type: PaymentMethodType = Field(default=PaymentMethodType.CASH)
    is_active: bool = Field(default=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    # Removed user_id as payment methods are now global

class PaymentMethod(PaymentMethodBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    __tablename__ = "payment_method"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships 
    transactions: List["Transaction"] = Relationship(back_populates="payment_method")


# Update forward references at the end of the file
PaymentMethod.model_rebuild()