import datetime
import uuid
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional, List, Dict, Any

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel

# Ensure FinancialGoal model is available for type hinting if needed, though it's passed as 'Any'
# from app.models.financial_goal import FinancialGoal # Not strictly needed for runtime if goal is 'Any'
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


class FinancialGoalRead(FinancialGoalBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    user_id: uuid.UUID


class FinancialGoalCreate(FinancialGoalBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)


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


class FinancialGoalPublic(FinancialGoalBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class FinancialGoalsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[FinancialGoalPublic]
    count: int


class FinancialGoalReadWithDetails(FinancialGoalRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    user: Optional[Dict[str, Any]] = None
    progress_percentage: Optional[float] = None
    savings: List[dict] = []


class FinancialGoalAddSaving(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    amount: float = Field(gt=0)
    saving_date: datetime.date = Field(default_factory=datetime.date.today)
    notes: Optional[str] = Field(default=None, max_length=255)


# Utility functions for converting models to API response format

def format_financial_goal_for_response(goal: Any) -> Optional[Dict[str, Any]]:
    """
    Convert a FinancialGoal model instance to a dictionary format suitable for API responses.
    This handles nested objects like user and currency properly and calculates current_amount
    by including linked transactions.
    
    Args:
        goal: A FinancialGoal model instance (expected to have 'transactions' loaded).
        
    Returns:
        Dict[str, Any]: A dictionary representation of the goal with properly formatted nested objects.
    """
    if not goal:
        return None
        
    # Start with the manually added savings (from FinancialGoal.current_amount field)
    # This field is updated by the 'add_saving_to_goal' CRUD operation.
    effective_current_amount = Decimal(str(goal.current_amount or '0.00'))

    # Add amounts from linked transactions
    # Assumes goal.transactions are loaded by the caller (e.g., via selectinload)
    if hasattr(goal, "transactions") and goal.transactions:
        for transaction in goal.transactions:
            # Only consider active transactions and assume their amounts contribute positively to the goal.
            if hasattr(transaction, 'is_active') and transaction.is_active and hasattr(transaction, 'amount'):
                effective_current_amount += Decimal(str(transaction.amount or '0.00'))
    
    # Calculate progress percentage using the effective_current_amount
    progress_percentage = Decimal('0.00')
    target_amount_decimal = Decimal(str(goal.target_amount or '0.00'))

    if target_amount_decimal > Decimal('0.00'):
        progress_percentage = (effective_current_amount / target_amount_decimal) * Decimal('100')
        progress_percentage = min(progress_percentage, Decimal('100.00')) # Cap at 100%
    
    # Ensure two decimal places for currency values and percentages
    effective_current_amount = effective_current_amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    target_amount_decimal = target_amount_decimal.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    progress_percentage = progress_percentage.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    goal_dict = {
        "id": goal.id,
        "name": goal.name,
        "description": goal.description,
        "target_amount": float(target_amount_decimal),
        "current_amount": float(effective_current_amount), # Use the dynamically calculated amount
        "deadline": goal.deadline,
        "status": goal.status,
        "goal_type": goal.goal_type,
        "icon": goal.icon,
        "is_active": getattr(goal, "is_active", True), # Retain existing getattr for fields not directly on model
        "user_id": goal.user_id,
        "account_id": getattr(goal, "account_id", None),
        "created_at": getattr(goal, "created_at", None),
        "updated_at": getattr(goal, "updated_at", None),
        "progress_percentage": float(progress_percentage), # Use the dynamically calculated percentage
        "savings": []  # This field seems unused or for a different purpose; keeping as is.
    }
    
    # Handle nested user object
    if hasattr(goal, "user") and goal.user:
        # Assuming goal.user is a Pydantic/SQLModel model that supports .model_dump()
        goal_dict["user"] = goal.user.model_dump() if hasattr(goal.user, 'model_dump') else vars(goal.user)
    else:
        goal_dict["user"] = None
    
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