import uuid
from typing import Sequence

from sqlmodel import Session, select

from app.models.financial_goal import FinancialGoal
from app.schemas.financial_goal import FinancialGoalCreate, FinancialGoalUpdate


def get_financial_goal(
    *, session: Session, goal_id: uuid.UUID, user_id: uuid.UUID
) -> FinancialGoal | None:
    """Get a financial goal by ID, ensuring it belongs to the user."""
    statement = select(FinancialGoal).where(
        FinancialGoal.id == goal_id, FinancialGoal.user_id == user_id
    )
    return session.exec(statement).first()


def get_financial_goals_by_user(
    *, session: Session, user_id: uuid.UUID
) -> Sequence[FinancialGoal]:
    """Get multiple financial goals for a specific user."""
    statement = (
        select(FinancialGoal)
        .where(FinancialGoal.user_id == user_id)
    )
    return session.exec(statement).all()


def create_financial_goal(
    *, session: Session, goal_in: FinancialGoalCreate, user_id: uuid.UUID
) -> FinancialGoal:
    """Create a new financial goal for a user."""
    goal_data = goal_in.model_dump()
    goal_data["user_id"] = user_id
    # Ensure current_amount starts at 0 or provided value (but usually 0 on creation)
    goal_data["current_amount"] = goal_data.get("current_amount", 0)

    db_goal = FinancialGoal.model_validate(goal_data)
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    return db_goal


def update_financial_goal(
    *, session: Session, db_goal: FinancialGoal, goal_in: FinancialGoalUpdate
) -> FinancialGoal:
    """Update an existing financial goal."""
    # Exclude current_amount from direct update via this method
    # It should be updated via add_saving_to_goal
    update_data = goal_in.model_dump(exclude_unset=True, exclude={"current_amount"})
    db_goal.sqlmodel_update(update_data)
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    return db_goal


def add_saving_to_goal(
    *, session: Session, db_goal: FinancialGoal, amount: float
) -> FinancialGoal:
    """Adds an amount to the current_amount of the goal."""
    # Basic implementation - consider moving complex logic to a service
    if amount <= 0:
        raise ValueError("Amount to add must be positive.")

    db_goal.current_amount += amount
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    return db_goal


def delete_financial_goal(*, session: Session, db_goal: FinancialGoal) -> None:
    """Delete a financial goal."""
    session.delete(db_goal)
    session.commit() 