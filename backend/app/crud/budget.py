import uuid
import calendar
from datetime import datetime, date
from typing import Sequence, Optional, Dict, Any, List, Tuple, Union
from decimal import Decimal

from sqlmodel import Session, select, func, and_
from sqlalchemy import extract
from sqlalchemy.orm import selectinload

from app.models.budget import Budget
from app.models.transaction import Transaction
from app.models.user import User
from app.models.currency import Currency
from app.models.enums import TransactionType
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetSummary


def get_budget(
    *, session: Session, budget_id: uuid.UUID, user_id: uuid.UUID
) -> Budget | None:
    """Get a budget by ID, ensuring it belongs to the user."""
    statement = select(Budget).where(
        Budget.id == budget_id, Budget.user_id == user_id
    ).options(selectinload(Budget.category))
    return session.exec(statement).first()


def get_budgets(
    *, session: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> Sequence[Budget]:
    """
    Get multiple budgets for a specific user with pagination.
    
    Args:
        session: Database session
        user_id: User ID to filter by
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
    
    Returns:
        A sequence of Budget objects
    """
    # Query to get budgets for the user with pagination
    statement = (
        select(Budget)
        .where(Budget.user_id == user_id)
        .order_by(Budget.created_at.desc())
        .options(selectinload(Budget.category))
        .offset(skip)
        .limit(limit)
    )
    
    # Execute the query and get the results
    budgets = session.exec(statement).all()
    
    return budgets


def get_budget_count(
    *, session: Session, user_id: uuid.UUID
) -> int:
    """
    Get the total count of budgets for a user.
    
    Args:
        session: Database session
        user_id: User ID to filter by
    
    Returns:
        Total count of budgets
    """
    statement = select(func.count(Budget.id)).where(Budget.user_id == user_id)
    count = session.exec(statement).one()
    return count


def create_budget(
    *, session: Session, budget_in: BudgetCreate, user_id: uuid.UUID
) -> Budget:
    """Create a new budget."""
    budget_data = budget_in.model_dump()
    budget_data["user_id"] = user_id
    
    # Set created_at and updated_at timestamps
    now = datetime.now()
    budget_data["created_at"] = now
    budget_data["updated_at"] = now
    
    # Create budget instance
    db_budget = Budget.model_validate(budget_data)
    
    session.add(db_budget)
    session.commit()
    session.refresh(db_budget)
    
    return db_budget


def update_budget(
    *,
    session: Session,
    db_budget: Budget,
    budget_in: BudgetUpdate,
) -> Budget:
    """Update a budget."""
    update_data = budget_in.model_dump(exclude_unset=True)
    
    # Always update the updated_at timestamp
    update_data["updated_at"] = datetime.now()
    
    # If category_id is explicitly set to null in the update, ensure it's handled.
    # SQLModel's setattr loop should handle this if category_id is in update_data.
    # If category_id is not in update_data (because it wasn't provided in the PATCH request),
    # it will remain unchanged, which is correct.
    # If budget_in contains category_id: None, update_data will have category_id: None.

    for key, value in update_data.items():
        setattr(db_budget, key, value)
    
    session.add(db_budget)
    session.commit()
    session.refresh(db_budget)
    
    return db_budget


def delete_budget(
    *, session: Session, db_budget: Budget
) -> None:
    """Delete a budget."""
    session.delete(db_budget)
    session.commit()


def get_user_currency(*, session: Session, user_id: uuid.UUID) -> Dict[str, str]:
    """
    Get the user's default currency.
    
    Args:
        session: Database session
        user_id: User ID
        
    Returns:
        Dictionary with currency symbol and code
    """
    # Query to join User and Currency to get the default currency
    statement = (
        select(Currency)
        .join(User, Currency.id == User.default_currency_id)
        .where(User.id == user_id)
    )
    
    currency = session.exec(statement).first()
    
    if not currency:
        return {"currency_symbol": "$", "currency_code": "USD"}
    
    return {"currency_symbol": currency.symbol, "currency_code": currency.code}


def get_budget_progress(
    *, 
    session: Session, 
    budget_id: uuid.UUID, 
    user_id: uuid.UUID,
    year: int = None,
    month: int = None
) -> Dict[str, Any]:
    """
    Calculate the budget progress for a specific month.
    
    Args:
        session: Database session
        budget_id: Budget ID
        user_id: User ID
        year: Optional year to calculate progress for (defaults to current year)
        month: Optional month to calculate progress for (defaults to current month)
        
    Returns:
        Dictionary with budget progress information
    """
    # Default to current year and month if not provided
    today = date.today()
    year = year or today.year
    month = month or today.month
    
    # Get the budget
    budget = get_budget(session=session, budget_id=budget_id, user_id=user_id)
    if not budget or not budget.category_id:
        return None 
    
    # Get the user's currency information
    currency_info = get_user_currency(session=session, user_id=user_id)
    
    # Calculate total spent amount for the specified month for transactions associated with this budget's category
    statement = (
        select(func.sum(Transaction.amount))
        .where(
            Transaction.user_id == user_id,
            Transaction.transaction_type == TransactionType.EXPENSE,
            Transaction.category_id == budget.category_id,
            extract('year', Transaction.date) == year,
            extract('month', Transaction.date) == month
        )
    )
    
    spent_amount = Decimal(session.exec(statement).one() or 0)
    
    # Calculate remaining amount and progress percentage
    remaining_amount = max(Decimal(0), budget.amount - spent_amount)
    # Round the percentage to an integer and ensure it doesn't exceed 100%
    progress_percentage = min(100, round((spent_amount / budget.amount * 100) if budget.amount > Decimal(0) else Decimal(0)))
    
    return {
        "budget_id": budget.id,
        "budget_name": budget.name,
        "budget_amount": budget.amount,
        "color": budget.color,
        "spent_amount": spent_amount,
        "remaining_amount": remaining_amount,
        "progress_percentage": progress_percentage,
        "year": year,
        "month": month,
        "currency_symbol": currency_info["currency_symbol"],
        "currency_code": currency_info["currency_code"]
    }


def get_all_budgets_progress(
    *, 
    session: Session, 
    user_id: uuid.UUID,
    year: int = None,
    month: int = None
) -> List[Dict[str, Any]]:
    """
    Calculate progress for all budgets of a user for a specific month.
    
    Args:
        session: Database session
        user_id: User ID
        year: Optional year to calculate progress for (defaults to current year)
        month: Optional month to calculate progress for (defaults to current month)
        
    Returns:
        List of dictionaries with budget progress information
    """
    # Default to current year and month if not provided
    today = date.today()
    year = year or today.year
    month = month or today.month
    
    # Get all budgets for the user
    budgets = get_budgets(session=session, user_id=user_id, limit=1000)
    
    # Get the user's currency information
    currency_info = get_user_currency(session=session, user_id=user_id)
    
    # Get all expense transactions for the user for the specified month
    transactions_statement = (
        select(Transaction.amount, Transaction.category_id) # Select only needed fields
        .where(
            Transaction.user_id == user_id,
            Transaction.transaction_type == TransactionType.EXPENSE,
            Transaction.category_id.isnot(None), # Ensure transactions have a category to be counted
            extract('year', Transaction.date) == year,
            extract('month', Transaction.date) == month
        )
    )
    monthly_transactions = session.exec(transactions_statement).all()
    
    # Calculate total spent amount per category_id for the specified month
    spent_per_category: Dict[uuid.UUID, Decimal] = {}
    for amount, category_id_val in monthly_transactions:
        if category_id_val: # Should always be true due to the .where clause
            # Ensure amount is Decimal, though it should be from the model
            current_amount = Decimal(amount) if not isinstance(amount, Decimal) else amount
            spent_per_category[category_id_val] = spent_per_category.get(category_id_val, Decimal(0)) + current_amount
    
    # Calculate progress for each budget
    results = []
    for budget in budgets:
        spent_amount = Decimal(0)
        if budget.category_id: # Budget must have a category_id
            spent_amount = spent_per_category.get(budget.category_id, Decimal(0))
        
        # Calculate remaining amount and progress percentage
        # Ensure budget.amount is Decimal, should be from model
        budget_amount_decimal = Decimal(budget.amount) if not isinstance(budget.amount, Decimal) else budget.amount
        remaining_amount = max(Decimal(0), budget_amount_decimal - spent_amount)
        # Round the percentage to an integer and ensure it doesn't exceed 100%
        progress_percentage = min(100, round((spent_amount / budget_amount_decimal * 100) if budget_amount_decimal > 0 else Decimal(0)))
        
        # Create progress data
        progress = {
            "budget_id": budget.id,
            "budget_name": budget.name,
            "budget_amount": budget.amount,
            "color": budget.color,
            "spent_amount": spent_amount,
            "remaining_amount": remaining_amount,
            "progress_percentage": progress_percentage,
            "year": year,
            "month": month,
            "currency_symbol": currency_info["currency_symbol"],
            "currency_code": currency_info["currency_code"]
        }
        results.append(progress)
    
    return results


def get_budget_summary(
    *, 
    session: Session, 
    user_id: uuid.UUID,
    year: int = None,
    month: int = None
) -> BudgetSummary:
    """
    Calculate the overall budget summary for a user.
    
    Args:
        session: Database session
        user_id: User ID
        year: Optional year (defaults to current year)
        month: Optional month (defaults to current month)
        
    Returns:
        BudgetSummary object with overall budget information
    """
    # Default to current year and month if not provided
    today = date.today()
    year = year or today.year
    month = month or today.month
    
    # Get the user's currency information
    currency_info = get_user_currency(session=session, user_id=user_id)
    
    # Get sum of all budget amounts
    budget_sum_statement = (
        select(func.sum(Budget.amount))
        .where(Budget.user_id == user_id)
    )
    
    total_budgeted = Decimal(session.exec(budget_sum_statement).one_or_none() or 0)
    
    # Get all category_ids associated with the user's budgets
    budget_categories_statement = (
        select(Budget.category_id)
        .where(Budget.user_id == user_id, Budget.category_id.isnot(None)) 
        .distinct()
    )
    budget_category_ids_results = session.exec(budget_categories_statement).all()
    active_budget_category_ids = {row for row in budget_category_ids_results if row is not None}

    total_spent = Decimal(0)
    if active_budget_category_ids:
        transaction_sum_statement = (
            select(func.sum(Transaction.amount))
            .where(
                Transaction.user_id == user_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
                Transaction.category_id.in_(active_budget_category_ids), 
                extract('year', Transaction.date) == year,
                extract('month', Transaction.date) == month
            )
        )
        total_spent = Decimal(session.exec(transaction_sum_statement).one_or_none() or 0)
    
    remaining = max(Decimal(0), total_budgeted - total_spent)
    percentage = min(100, round((total_spent / total_budgeted * 100) if total_budgeted > Decimal(0) else Decimal(0)))
    
    status = "on-track"
    if percentage >= 100:
        status = "over-budget"
    elif percentage >= 90:
        status = "warning"
    
    return BudgetSummary(
        total_budgeted=total_budgeted,
        total_spent=total_spent,
        remaining=remaining,
        percentage=percentage,
        status=status,
        currency_symbol=currency_info["currency_symbol"],
        currency_code=currency_info["currency_code"]
    )
