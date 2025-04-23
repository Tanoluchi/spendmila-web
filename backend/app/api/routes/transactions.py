import uuid
from typing import Any, Sequence, Union # Added Union

from fastapi import APIRouter, Depends, HTTPException

from app.crud import transaction as crud_transaction # Alias to avoid name clash
from app.api.deps import SessionDep, CurrentUser
from app.models.transaction import Transaction
from app.schemas.transaction import (
    IncomeCreate,
    ExpenseCreate,
    IncomeRead,
    ExpenseRead,
    TransactionRead,
    TransactionReadWithDetails,
    IncomeUpdate,
    ExpenseUpdate,
)
from app.schemas.user import Message

# Decide on response models for reading lists/single items
# Using specific Read models (IncomeRead, ExpenseRead) might require logic
# to determine the type before responding, or use TransactionRead/TransactionReadWithDetails
# which contain the 'transaction_type' field. Let's use TransactionReadWithDetails for GET.

router = APIRouter() # No global prefix, define per-endpoint group

# --- Income Endpoints ---

@router.post("/incomes", response_model=IncomeRead, tags=["incomes"])
def create_income(
    *, session: SessionDep, current_user: CurrentUser, income_in: IncomeCreate
) -> Transaction: # Returns Transaction, but response model validates as IncomeRead
    """
    Create a new income record for the current user.
    """
    # Ensure the category used is an income category? Validation could be added.
    income = crud_transaction.create_transaction(
        session=session, transaction_in=income_in, user_id=current_user.id
    )
    return income

# --- Expense Endpoints ---

@router.post("/expenses", response_model=ExpenseRead, tags=["expenses"])
def create_expense(
    *, session: SessionDep, current_user: CurrentUser, expense_in: ExpenseCreate
) -> Transaction: # Returns Transaction, but response model validates as ExpenseRead
    """
    Create a new expense record for the current user.
    """
     # Ensure the category used is an expense category? Validation could be added.
    expense = crud_transaction.create_transaction(
        session=session, transaction_in=expense_in, user_id=current_user.id
    )
    return expense


# --- Generic Transaction Endpoints ---

@router.get("/transactions", response_model=Sequence[TransactionReadWithDetails], tags=["transactions"])
def read_transactions(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
    # TODO: Add query parameters for filtering (date range, type, category etc.)
) -> Any:
    """
    Retrieve transactions (incomes and expenses) for the current user.
    """
    transactions = crud_transaction.get_transactions(
        session=session, user_id=current_user.id, skip=skip, limit=limit
    )
    # The response_model TransactionReadWithDetails includes details like category, currency
    return transactions


@router.get("/transactions/{transaction_id}", response_model=TransactionReadWithDetails, tags=["transactions"])
def read_transaction_by_id(
    session: SessionDep, current_user: CurrentUser, transaction_id: uuid.UUID
) -> Any:
    """
    Get a specific transaction by ID for the current user.
    """
    db_transaction = crud_transaction.get_transaction(
        session=session, transaction_id=transaction_id, user_id=current_user.id
    )
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    # Depending on exact response needs, might return IncomeRead or ExpenseRead
    # but TransactionReadWithDetails covers both + relationships
    return db_transaction


@router.patch("/transactions/{transaction_id}", response_model=TransactionRead, tags=["transactions"])
def update_transaction(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    transaction_id: uuid.UUID,
    # Accept either IncomeUpdate or ExpenseUpdate in the body
    transaction_in: Union[IncomeUpdate, ExpenseUpdate],
) -> Any:
    """
    Update a transaction (income or expense) for the current user.
    """
    db_transaction = crud_transaction.get_transaction(
        session=session, transaction_id=transaction_id, user_id=current_user.id
    )
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # The CRUD function handles applying the correct update type
    try:
        updated_transaction = crud_transaction.update_transaction(
            session=session, db_transaction=db_transaction, transaction_in=transaction_in
        )
        # Use TransactionRead as response_model, showing common fields after update
        return updated_transaction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/transactions/{transaction_id}", response_model=Message, tags=["transactions"])
def delete_transaction(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    transaction_id: uuid.UUID,
) -> Message:
    """
    Delete a transaction for the current user.
    """
    db_transaction = crud_transaction.get_transaction(
        session=session, transaction_id=transaction_id, user_id=current_user.id
    )
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    crud_transaction.delete_transaction(session=session, db_transaction=db_transaction)
    return Message(message="Transaction deleted successfully") 