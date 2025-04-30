import datetime
import uuid

from typing import Optional, List, Dict, Any

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

from app.models.enums import FinancialGoalStatus, FinancialGoalType


class FinancialGoalBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    name: str = Field(max_length=150)
    target_amount: float = Field(gt=0)
    current_amount: float = Field(default=0, ge=0)
    deadline: Optional[datetime.date] = None
    status: FinancialGoalStatus = Field(default=FinancialGoalStatus.ACTIVE)
    goal_type: FinancialGoalType = Field(default=FinancialGoalType.SAVINGS)
    description: Optional[str] = Field(default=None, max_length=255)
    icon: Optional[str] = Field(default=None, max_length=255)  # Icon for the goal
    color: Optional[str] = Field(default=None, max_length=50)  # Color code for the goal


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
    name: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    deadline: Optional[datetime.date] = None
    status: Optional[FinancialGoalStatus] = None
    goal_type: Optional[FinancialGoalType] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
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
    user: Optional[Dict[str, Any]] = None
    currency: Optional[Dict[str, Any]] = None
    progress_percentage: Optional[float] = None
    savings: List[dict] = []


class FinancialGoalAddSaving(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    amount: float = Field(gt=0)
    saving_date: datetime.date = Field(default_factory=datetime.date.today)
    notes: Optional[str] = Field(default=None, max_length=255)