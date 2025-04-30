from typing import Optional, List
import datetime
import uuid

from pydantic import ConfigDict, Field
from sqlmodel import SQLModel

from app.models.enums import TransactionType


class TransactionBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    description: str = Field(max_length=255)
    amount: float = Field(gt=0)
    transaction_type: TransactionType
    date: datetime.date
    is_active: bool = True


class TransactionRead(TransactionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    user_id: uuid.UUID
    currency: Optional[dict] = None
    category: Optional[dict] = None
    payment_method: Optional[dict] = None
    subscription: Optional[dict] = None
    financial_goal: Optional[dict] = None
    debt: Optional[dict] = None
    account: Optional[dict] = None
    installments: Optional[bool] = None
    installment_count: Optional[int] = None


class TransactionCreate(TransactionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    currency_id: uuid.UUID
    category_id: Optional[uuid.UUID] = None
    payment_method_id: Optional[uuid.UUID] = None
    subscription_id: Optional[uuid.UUID] = None
    financial_goal_id: Optional[uuid.UUID] = None
    debt_id: Optional[uuid.UUID] = None
    account_id: Optional[uuid.UUID] = None
    installments: Optional[bool] = Field(default=False)
    installment_count: Optional[int] = None


class TransactionUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    description: Optional[str] = Field(default=None, max_length=255)
    amount: Optional[float] = Field(default=None, gt=0)
    transaction_type: Optional[TransactionType] = None
    date: Optional[datetime.date] = None
    is_active: Optional[bool] = None
    currency_id: Optional[uuid.UUID] = None
    category_id: Optional[uuid.UUID] = None
    payment_method_id: Optional[uuid.UUID] = None
    subscription_id: Optional[uuid.UUID] = None
    financial_goal_id: Optional[uuid.UUID] = None
    debt_id: Optional[uuid.UUID] = None
    account_id: Optional[uuid.UUID] = None



class TransactionPublic(TransactionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    currency: Optional[dict] = None
    category: Optional[dict] = None
    payment_method: Optional[dict] = None
    subscription: Optional[dict] = None
    financial_goal: Optional[dict] = None
    debt: Optional[dict] = None
    account: Optional[dict] = None



class TransactionsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[TransactionPublic]
    count: int


class TransactionReadWithDetails(TransactionRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)