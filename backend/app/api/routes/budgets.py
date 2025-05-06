from typing import Any, List, Optional, Dict
import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlmodel import Session

from app import crud, schemas
from app.api.deps import SessionDep
from app.api import deps
from app.models import User
from app.schemas.budget import PaginatedBudgetResponse

router = APIRouter()


@router.post("/", response_model=schemas.BudgetRead)
def create_budget(
    *,
    session: SessionDep,
    budget_in: schemas.BudgetCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create a new budget.
    """
    budget = crud.create_budget(
        session=session, budget_in=budget_in, user_id=current_user.id
    )
    return budget


@router.get("/", response_model=PaginatedBudgetResponse)
def read_budgets(
    *,
    session: SessionDep,
    current_user: User = Depends(deps.get_current_user),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    year: Optional[int] = Query(None, description="Year (defaults to current year)"),
    month: Optional[int] = Query(None, description="Month (defaults to current month)"),
) -> Any:
    """
    Retrieve budgets with their progress information and overall budget summary.
    """
    skip = (page - 1) * page_size
    
    # Default to current year and month if not provided
    today = date.today()
    year = year or today.year
    month = month or today.month
    
    # Get budgets with pagination
    budgets = crud.get_budgets(
        session=session, user_id=current_user.id, skip=skip, limit=page_size
    )
    
    # Get total count for pagination
    total = crud.get_budget_count(session=session, user_id=current_user.id)
    
    # Get budget summary
    summary = crud.get_budget_summary(
        session=session,
        user_id=current_user.id,
        year=year,
        month=month
    )
    
    budget_items = []
    for budget in budgets:
        # Get budget progress
        progress = crud.get_budget_progress(
            session=session,
            budget_id=budget.id,
            user_id=current_user.id,
            year=year,
            month=month
        )
        
        # Convert Budget model to BudgetReadWithDetails schema
        budget_dict = budget.model_dump()
        budget_dict["spent_amount"] = progress["spent_amount"]
        budget_dict["remaining_amount"] = progress["remaining_amount"]
        budget_dict["progress_percentage"] = progress["progress_percentage"]
        budget_dict["currency_symbol"] = progress["currency_symbol"]
        budget_dict["currency_code"] = progress["currency_code"]
        
        # Get category data if it exists
        if budget.category:  
            budget_dict["category"] = budget.category.model_dump()
            # Also add category_name directly for easier frontend access
            budget_dict["category_name"] = budget.category.name
        
        # Add user data to meet the schema requirements
        budget_dict["user"] = current_user.model_dump()
        
        budget_item = schemas.BudgetReadWithDetails.model_validate(budget_dict)
        budget_items.append(budget_item)
    
    # Calculate total pages
    total_pages = (total + page_size - 1) // page_size
    
    return PaginatedBudgetResponse(
        items=budget_items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        summary=summary
    )


@router.get("/progress", response_model=Dict[str, Any])
def read_budgets_progress(
    *,
    session: SessionDep,
    current_user: User = Depends(deps.get_current_user),
    year: Optional[int] = Query(None, description="Year (defaults to current year)"),
    month: Optional[int] = Query(None, description="Month (defaults to current month)"),
) -> Any:
    """
    Retrieve the progress of all budgets and overall budget summary for the current month or a specified month.
    """
    progress = crud.get_all_budgets_progress(
        session=session,
        user_id=current_user.id,
        year=year,
        month=month
    )
    
    # Get budget summary
    summary = crud.get_budget_summary(
        session=session,
        user_id=current_user.id,
        year=year,
        month=month
    )
    
    return {
        "budgets": progress,
        "summary": summary
    }


@router.get("/{budget_id}", response_model=schemas.BudgetReadWithDetails)
def read_budget(
    *,
    session: SessionDep,
    budget_id: uuid.UUID = Path(..., description="The ID of the budget to get"),
    current_user: User = Depends(deps.get_current_user),
    year: Optional[int] = Query(None, description="Year for progress calculation"),
    month: Optional[int] = Query(None, description="Month for progress calculation"),
) -> Any:
    """
    Get budget by ID with progress information.
    """
    budget = crud.get_budget(session=session, budget_id=budget_id, user_id=current_user.id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    # Get budget progress
    progress = crud.get_budget_progress(
        session=session,
        budget_id=budget.id,
        user_id=current_user.id,
        year=year,
        month=month
    )
    
    # Convert Budget model to BudgetReadWithDetails schema
    budget_dict = budget.model_dump()
    budget_dict["spent_amount"] = progress["spent_amount"]
    budget_dict["remaining_amount"] = progress["remaining_amount"]
    budget_dict["progress_percentage"] = progress["progress_percentage"]
    budget_dict["currency_symbol"] = progress["currency_symbol"]
    budget_dict["currency_code"] = progress["currency_code"]
    
    # Get category data if it exists
    if budget.category:  
        budget_dict["category"] = budget.category.model_dump()
        # Also add category_name directly for easier frontend access
        budget_dict["category_name"] = budget.category.name
    
    # Add user data to meet the schema requirements
    budget_dict["user"] = current_user.model_dump()
    
    return schemas.BudgetReadWithDetails.model_validate(budget_dict)


@router.put("/{budget_id}", response_model=schemas.BudgetRead)
def update_budget(
    *,
    session: SessionDep,
    budget_id: uuid.UUID = Path(..., description="The ID of the budget to update"),
    budget_in: schemas.BudgetUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update a budget.
    """
    budget = crud.get_budget(session=session, budget_id=budget_id, user_id=current_user.id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    budget = crud.update_budget(session=session, db_budget=budget, budget_in=budget_in)
    return budget


@router.delete("/{budget_id}", response_model=schemas.Message)
def delete_budget(
    *,
    session: SessionDep,
    budget_id: uuid.UUID = Path(..., description="The ID of the budget to delete"),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a budget.
    """
    budget = crud.get_budget(session=session, budget_id=budget_id, user_id=current_user.id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    crud.delete_budget(session=session, db_budget=budget)
    return {"message": "Budget deleted successfully"}
