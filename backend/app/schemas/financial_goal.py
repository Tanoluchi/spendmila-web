from typing import Optional, List
from datetime import date
import uuid

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

from app.models.enums import FinancialGoalStatus, FinancialGoalType


class FinancialGoalBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    target_amount: float = Field(gt=0)
    current_amount: float = Field(default=0)
    target_date: date
    type: FinancialGoalType
    status: FinancialGoalStatus = Field(default=FinancialGoalStatus.IN_PROGRESS)
    is_active: bool = True


class FinancialGoalRead(FinancialGoalBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    user_id: uuid.UUID
    currency_id: uuid.UUID
    currency: Optional[dict] = None


class FinancialGoalCreate(FinancialGoalBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    currency_id: uuid.UUID


class FinancialGoalUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    name: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)
    target_amount: Optional[float] = Field(default=None, gt=0)
    current_amount: Optional[float] = None
    target_date: Optional[date] = None
    type: Optional[FinancialGoalType] = None
    status: Optional[FinancialGoalStatus] = None
    is_active: Optional[bool] = None
    currency_id: Optional[uuid.UUID] = None


class FinancialGoalPublic(FinancialGoalBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    currency: Optional[dict] = None


class FinancialGoalsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[FinancialGoalPublic]
    count: int


class FinancialGoalReadWithDetails(FinancialGoalRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    savings: List[dict] = []


class FinancialGoalAddSaving(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    amount: float = Field(gt=0)
    description: Optional[str] = Field(default=None, max_length=255) 