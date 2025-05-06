from typing import Optional, List, Dict, Any, TYPE_CHECKING
import datetime
import uuid

from pydantic import ConfigDict, Field
from sqlmodel import SQLModel

from app.schemas.category import CategoryRead


class BudgetBase(SQLModel):
    """Base schema with shared properties for Budgets."""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    name: str = Field(max_length=100)
    amount: float = Field(gt=0)  # Ensure amount is positive
    color: Optional[str] = Field(default="#607D8B", max_length=50)  # Color code for the budget
    category_id: uuid.UUID = Field(description="The ID of the category associated with the budget")


class BudgetRead(BudgetBase):
    """Schema for reading budget data, including relationships."""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime

    user: Dict[str, Any] = None
    category: CategoryRead = None


class BudgetCreate(BudgetBase):
    """Schema for creating a new budget."""
    model_config = ConfigDict(arbitrary_types_allowed=True)


class BudgetUpdate(SQLModel):
    """Schema for updating an existing budget."""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    name: Optional[str] = Field(default=None, max_length=100)
    amount: Optional[float] = Field(default=None, gt=0)
    color: Optional[str] = Field(default=None, max_length=50)
    category_id: Optional[uuid.UUID] = Field(default=None, description="The ID of the category to associate with the budget")


class BudgetReadWithDetails(BudgetRead):
    """Schema for reading budget data with additional relationship details."""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    # Progress information
    spent_amount: float = 0
    remaining_amount: float = 0
    progress_percentage: float = 0
    currency_symbol: str = "$"  # Default currency symbol
    currency_code: str = "USD"  # Default currency code
    category_name: Optional[str] = None  # Name of the associated category


class BudgetPublic(BudgetBase):
    """Schema for public budget data."""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    id: uuid.UUID
    spent_amount: float = 0
    remaining_amount: float = 0
    progress_percentage: float = 0
    currency_symbol: str = "$"  # Default currency symbol
    currency_code: str = "USD"  # Default currency code


class BudgetsPublic(SQLModel):
    """Schema for a list of public budget data."""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    data: List[BudgetPublic]


class BudgetSummary(SQLModel):
    """Schema for overall budget summary information."""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    total_budgeted: float = 0
    total_spent: float = 0
    remaining: float = 0
    percentage: float = 0
    status: str = "on-track"  # on-track, warning, over-budget
    currency_symbol: str = "$"  # Default currency symbol
    currency_code: str = "USD"  # Default currency code


class PaginatedBudgetResponse(SQLModel):
    """Response model for paginated budgets."""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    items: List[BudgetReadWithDetails]
    total: int
    page: int
    page_size: int
    total_pages: int
    summary: BudgetSummary  # Overall budget summary information
