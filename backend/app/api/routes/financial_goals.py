import uuid
from typing import Any, Sequence
from decimal import Decimal # For add_saving amount

from fastapi import APIRouter, Depends, HTTPException, Body

from app.crud import financial_goal as crud_goal
from app.api.deps import SessionDep, CurrentUser
from app.models.financial_goal import FinancialGoal
from app.schemas.financial_goal import (
    FinancialGoalCreate,
    FinancialGoalRead,
    FinancialGoalReadWithDetails,
    FinancialGoalUpdate,
    FinancialGoalAddSaving,
)
from app.schemas.user import Message

router = APIRouter(prefix="/financial-goals", tags=["financial_goals"])


@router.post("/", response_model=FinancialGoalRead)
def create_financial_goal(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    goal_in: FinancialGoalCreate,
) -> FinancialGoal:
    """
    Create a new financial goal for the current user.
    """
    goal = crud_goal.create_financial_goal(
        session=session, goal_in=goal_in, user_id=current_user.id
    )
    return goal


@router.get("/", response_model=Sequence[FinancialGoalReadWithDetails])
def read_financial_goals(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve financial goals for the current user.
    """
    goals = crud_goal.get_financial_goals_by_user(
        session=session, user_id=current_user.id, skip=skip, limit=limit
    )
    return goals


@router.get("/{goal_id}", response_model=FinancialGoalReadWithDetails)
def read_financial_goal_by_id(
    session: SessionDep, current_user: CurrentUser, goal_id: uuid.UUID
) -> Any:
    """
    Get a specific financial goal by ID for the current user.
    """
    goal = crud_goal.get_financial_goal(
        session=session, goal_id=goal_id, user_id=current_user.id
    )
    if not goal:
        raise HTTPException(status_code=404, detail="Financial Goal not found")
    return goal


@router.patch("/{goal_id}", response_model=FinancialGoalRead)
def update_financial_goal(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    goal_id: uuid.UUID,
    goal_in: FinancialGoalUpdate,
) -> Any:
    """
    Update a financial goal for the current user.
    """
    db_goal = crud_goal.get_financial_goal(
        session=session, goal_id=goal_id, user_id=current_user.id
    )
    if not db_goal:
        raise HTTPException(status_code=404, detail="Financial Goal not found")

    updated_goal = crud_goal.update_financial_goal(
        session=session, db_goal=db_goal, goal_in=goal_in
    )
    return updated_goal


@router.post("/{goal_id}/add-saving", response_model=FinancialGoalRead)
def add_saving_to_financial_goal(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    goal_id: uuid.UUID,
    saving_in: FinancialGoalAddSaving = Body(...), # Embed the amount in the body
) -> Any:
    """
    Add a saving amount to a specific financial goal for the current user.
    Updates the 'current_amount' of the goal.
    """
    db_goal = crud_goal.get_financial_goal(
        session=session, goal_id=goal_id, user_id=current_user.id
    )
    if not db_goal:
        raise HTTPException(status_code=404, detail="Financial Goal not found")

    try:
        updated_goal = crud_goal.add_saving_to_goal(
            session=session, db_goal=db_goal, amount=saving_in.amount
        )
        return updated_goal
    except ValueError as e:
        # Handle cases like adding negative amounts if validation is in CRUD
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{goal_id}", response_model=Message)
def delete_financial_goal(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    goal_id: uuid.UUID,
) -> Message:
    """
    Delete a financial goal for the current user.
    """
    db_goal = crud_goal.get_financial_goal(
        session=session, goal_id=goal_id, user_id=current_user.id
    )
    if not db_goal:
        raise HTTPException(status_code=404, detail="Financial Goal not found")

    crud_goal.delete_financial_goal(session=session, db_goal=db_goal)
    return Message(message="Financial Goal deleted successfully") 