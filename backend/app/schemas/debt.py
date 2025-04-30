from typing import Optional, List
from datetime import date
import uuid

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

from app.models.enums import DebtStatus, DebtType


class DebtBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    total_amount: float = Field(gt=0)
    remaining_amount: float = Field(default=0)
    interest_rate: Optional[float] = Field(default=None, ge=0)
    due_date: date
    type: DebtType
    status: DebtStatus = Field(default=DebtStatus.PENDING)
    is_active: bool = True
    installment_count: int = Field(default=1, ge=1)


class DebtRead(DebtBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    user_id: uuid.UUID
    currency_id: uuid.UUID
    account_id: Optional[uuid.UUID] = None
    currency: Optional[dict] = None
    account: Optional[dict] = None


class DebtCreate(DebtBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    currency_id: uuid.UUID
    account_id: Optional[uuid.UUID] = None


class DebtUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    name: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    total_amount: Optional[float] = Field(default=None, gt=0)
    remaining_amount: Optional[float] = None
    interest_rate: Optional[float] = Field(default=None, ge=0)
    due_date: Optional[date] = None
    type: Optional[DebtType] = None
    status: Optional[DebtStatus] = None
    is_active: Optional[bool] = None
    currency_id: Optional[uuid.UUID] = None
    account_id: Optional[uuid.UUID] = None
    installment_count: Optional[int] = Field(default=None, ge=1)


class DebtPublic(DebtBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    currency: Optional[dict] = None
    account: Optional[dict] = None

class DebtReadWithDetails(DebtRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    payments: List[dict] = []


class DebtAddPayment(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    amount: float = Field(gt=0)
    description: Optional[str] = Field(default=None, max_length=255) 