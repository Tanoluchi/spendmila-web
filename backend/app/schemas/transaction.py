from typing import Optional, List
from datetime import date
import uuid

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

from app.models.enums import TransactionType


class TransactionBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    description: str = Field(max_length=255)
    amount: float = Field(gt=0)
    type: TransactionType
    date: date
    is_active: bool = True


class TransactionRead(TransactionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    user_id: uuid.UUID
    currency_id: uuid.UUID
    category_id: Optional[uuid.UUID] = None
    payment_method_id: Optional[uuid.UUID] = None
    subscription_id: Optional[uuid.UUID] = None
    financial_goal_id: Optional[uuid.UUID] = None
    debt_id: Optional[uuid.UUID] = None
    currency: Optional[dict] = None
    category: Optional[dict] = None
    payment_method: Optional[dict] = None
    subscription: Optional[dict] = None
    financial_goal: Optional[dict] = None
    debt: Optional[dict] = None


class IncomeRead(TransactionRead):
    """Schema for reading income transactions."""
    type: TransactionType = TransactionType.INCOME


class ExpenseRead(TransactionRead):
    """Schema for reading expense transactions."""
    type: TransactionType = TransactionType.EXPENSE
    installments: bool = False
    installment_count: Optional[int] = None


class TransactionCreate(TransactionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    currency_id: uuid.UUID
    category_id: Optional[uuid.UUID] = None
    payment_method_id: Optional[uuid.UUID] = None
    subscription_id: Optional[uuid.UUID] = None
    financial_goal_id: Optional[uuid.UUID] = None
    debt_id: Optional[uuid.UUID] = None


class IncomeCreate(TransactionCreate):
    """Schema for creating income transactions."""
    type: TransactionType = TransactionType.INCOME


class ExpenseCreate(TransactionCreate):
    """Schema for creating expense transactions."""
    type: TransactionType = TransactionType.EXPENSE
    installments: bool = False
    installment_count: Optional[int] = None


class TransactionUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    description: Optional[str] = Field(default=None, max_length=255)
    amount: Optional[float] = Field(default=None, gt=0)
    type: Optional[TransactionType] = None
    date: Optional[date] = None
    is_active: Optional[bool] = None
    currency_id: Optional[uuid.UUID] = None
    category_id: Optional[uuid.UUID] = None
    payment_method_id: Optional[uuid.UUID] = None
    subscription_id: Optional[uuid.UUID] = None
    financial_goal_id: Optional[uuid.UUID] = None
    debt_id: Optional[uuid.UUID] = None


class IncomeUpdate(TransactionUpdate):
    """Schema for updating income transactions."""
    type: Optional[TransactionType] = TransactionType.INCOME


class ExpenseUpdate(TransactionUpdate):
    """Schema for updating expense transactions."""
    type: Optional[TransactionType] = TransactionType.EXPENSE
    installments: Optional[bool] = None
    installment_count: Optional[int] = None


class TransactionPublic(TransactionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    currency: Optional[dict] = None
    category: Optional[dict] = None
    payment_method: Optional[dict] = None
    subscription: Optional[dict] = None
    financial_goal: Optional[dict] = None
    debt: Optional[dict] = None


class TransactionsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[TransactionPublic]
    count: int


class TransactionReadWithDetails(TransactionRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)