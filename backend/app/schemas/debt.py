from typing import Optional, List
from datetime import date
import uuid

from pydantic import ConfigDict, computed_field
from sqlmodel import Field, SQLModel

from app.models.debt import DebtBase
from app.models.enums import DebtType
from app.schemas.currency import CurrencyRead
from app.schemas.account import AccountRead


class DebtRead(DebtBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    user_id: uuid.UUID
    currency_id: uuid.UUID
    account_id: Optional[uuid.UUID] = None
    currency: Optional[CurrencyRead] = None
    account: Optional[AccountRead] = None


class DebtCreate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    creditor_name: str = Field(max_length=150)
    amount: float = Field(gt=0)  # Total original amount of the debt
    due_date: Optional[date] = Field(default=None)
    description: Optional[str] = Field(default=None, max_length=255)
    debt_type: DebtType = Field(default=DebtType.PERSONAL)
    interest_rate: Optional[float] = Field(default=None, ge=0)
    minimum_payment: Optional[float] = Field(default=None, ge=0)
    icon: Optional[str] = Field(default=None, max_length=255)
    color: Optional[str] = Field(default=None, max_length=50)
    
    # Installment tracking
    is_installment: bool = Field(default=False)
    total_installments: Optional[int] = Field(default=None, ge=1)
    
    # Only account_id is required - currency_id will be determined automatically
    account_id: Optional[uuid.UUID] = None


class DebtUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    creditor_name: Optional[str] = Field(default=None, max_length=150)
    description: Optional[str] = Field(default=None, max_length=255)
    amount: Optional[float] = Field(default=None, gt=0)
    interest_rate: Optional[float] = Field(default=None, ge=0)
    minimum_payment: Optional[float] = Field(default=None, ge=0)
    due_date: Optional[date] = None
    debt_type: Optional[DebtType] = None
    is_paid: Optional[bool] = None
    account_id: Optional[uuid.UUID] = None
    is_installment: Optional[bool] = None
    total_installments: Optional[int] = Field(default=None, ge=1)


class DebtPublic(DebtBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    currency: Optional[CurrencyRead] = None
    account: Optional[AccountRead] = None


class DebtPayment(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    date: date
    amount: float
    description: Optional[str] = None


class DebtReadWithDetails(DebtRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    payments: List[DebtPayment] = []
    paid_amount: float
    remaining_amount: float
    paid_installments: Optional[int] = None
    remaining_installments: Optional[int] = None
    payment_progress: float  # Percentage of debt paid (0-100)


class DebtAddPayment(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    amount: float = Field(gt=0)
    description: Optional[str] = Field(default=None, max_length=255)
    payment_date: Optional[date] = Field(default=None)  # If not provided, current date will be used