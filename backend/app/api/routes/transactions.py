import uuid
from typing import Any, Sequence, List

from fastapi import APIRouter, Depends, HTTPException

from app.crud import transaction as crud_transaction # Alias to avoid name clash
from app.api.deps import SessionDep, CurrentUser
from app.models.transaction import Transaction
from app.schemas.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionReadWithDetails,
    TransactionUpdate
)
from app.models.enums import TransactionType
from app.schemas.user import Message

# Decide on response models for reading lists/single items
# Using specific Read models (IncomeRead, ExpenseRead) might require logic
# to determine the type before responding, or use TransactionRead/TransactionReadWithDetails
# which contain the 'transaction_type' field. Let's use TransactionReadWithDetails for GET.

# Create main router
router = APIRouter()

# General transactions routes
@router.post("/transactions", response_model=TransactionRead, tags=["transactions"])
def create_transaction(
    *, session: SessionDep, current_user: CurrentUser, transaction_in: TransactionCreate
) -> Any:
    """
    Create a new transaction (income or expense) for the current user.
    """
    try:
        transaction = crud_transaction.create_transaction(
            session=session, transaction_in=transaction_in, user_id=current_user.id
        )
        # Refresh the transaction to get all relationships
        session.refresh(transaction)
        return transaction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/transactions", response_model=List[TransactionReadWithDetails], tags=["transactions"])
def read_transactions(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100,
    transaction_type: TransactionType = None
    # TODO: Add more query parameters for filtering (date range, category etc.)
) -> Any:
    """
    Retrieve transactions (incomes and expenses) for the current user.
    Optionally filter by transaction type.
    """
    transactions = crud_transaction.get_transactions(
        session=session, user_id=current_user.id, skip=skip, limit=limit,
        transaction_type=transaction_type
    )
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
    return db_transaction


@router.patch("/transactions/{transaction_id}", response_model=TransactionRead, tags=["transactions"])
def update_transaction(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    transaction_id: uuid.UUID,
    transaction_in: TransactionUpdate,
) -> Any:
    """
    Update a transaction for the current user.
    """
    db_transaction = crud_transaction.get_transaction(
        session=session, transaction_id=transaction_id, user_id=current_user.id
    )
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    try:
        updated_transaction = crud_transaction.update_transaction(
            session=session, db_transaction=db_transaction, transaction_in=transaction_in
        )
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