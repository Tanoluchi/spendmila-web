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


# Utility functions for converting models to API response format

def format_financial_goal_for_response(goal) -> Dict[str, Any]:
    """
    Convert a FinancialGoal model instance to a dictionary format suitable for API responses.
    This handles nested objects like user and currency properly.
    
    Args:
        goal: A FinancialGoal model instance
        
    Returns:
        Dict[str, Any]: A dictionary representation of the goal with properly formatted nested objects
    """
    if not goal:
        return None
        
    # Calculate progress percentage
    progress_percentage = 0
    if goal.target_amount > 0:
        progress_percentage = (goal.current_amount / goal.target_amount) * 100
    
    # Create the base dictionary from the model
    goal_dict = {
        "id": goal.id,
        "name": goal.name,
        "description": goal.description,
        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "deadline": goal.deadline,
        "status": goal.status,
        "goal_type": goal.goal_type,
        "icon": goal.icon,
        "color": goal.color,
        "is_active": getattr(goal, "is_active", True),
        "user_id": goal.user_id,
        "currency_id": goal.currency_id,
        "account_id": getattr(goal, "account_id", None),
        "created_at": getattr(goal, "created_at", None),
        "updated_at": getattr(goal, "updated_at", None),
        "progress_percentage": progress_percentage,
        "savings": []  # Add savings if needed
    }
    
    # Handle nested objects
    if hasattr(goal, "user") and goal.user:
        goal_dict["user"] = goal.user.model_dump()
    else:
        goal_dict["user"] = None
        
    if hasattr(goal, "currency") and goal.currency:
        goal_dict["currency"] = goal.currency.model_dump()
    else:
        goal_dict["currency"] = None
    
    return goal_dict


def format_financial_goals_for_response(goals) -> List[Dict[str, Any]]:
    """
    Convert a list of FinancialGoal model instances to a list of dictionaries suitable for API responses.
    
    Args:
        goals: A list of FinancialGoal model instances
        
    Returns:
        List[Dict[str, Any]]: A list of dictionary representations of the goals
    """
    return [format_financial_goal_for_response(goal) for goal in goals]