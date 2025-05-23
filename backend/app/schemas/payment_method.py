from typing import Optional, List
import uuid

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

from app.models.enums import PaymentMethodType


class PaymentMethodBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    payment_method_type: PaymentMethodType = Field(default=PaymentMethodType.CASH)
    is_active: bool = True


class PaymentMethodRead(PaymentMethodBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class PaymentMethodCreate(PaymentMethodBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    pass


class PaymentMethodUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    name: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    payment_method_type: Optional[PaymentMethodType] = None
    is_active: Optional[bool] = None


class PaymentMethodPublic(PaymentMethodBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class PaymentMethodsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[PaymentMethodPublic]
    count: int


class PaymentMethodReadWithDetails(PaymentMethodRead):
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "Credit Card",
                "description": "Visa credit card",
                "payment_method_type": "card",
                "is_active": True,
                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "transactions": []
            }
        }
    )
    transactions: List[dict] = [] 