import uuid
from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query

from app.crud import transaction as crud_transaction # Alias to avoid name clash
from app.api.deps import SessionDep, CurrentUser
from app.schemas.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionReadWithDetails,
    TransactionUpdate,
    PaginatedTransactionResponse
)
from app.models.enums import TransactionType
from app.schemas.user import Message

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


@router.get("/transactions", response_model=PaginatedTransactionResponse, tags=["transactions"])
def read_transactions(
    session: SessionDep, 
    current_user: CurrentUser,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
    transaction_type: Optional[TransactionType] = None,
    category_name: Optional[str] = None,
    account_id: Optional[str] = None
) -> Any:
    """
    Retrieve transactions (incomes and expenses) for the current user.
    Supports pagination and filtering by transaction type, category name, and account ID.
    """
    # Get total count for pagination
    # Safely convert account_id to UUID if provided
    account_uuid = None
    if account_id:
        try:
            account_uuid = uuid.UUID(account_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid account_id format")
    
    # Log the received filters for debugging
    print(f"Filtering transactions with: type={transaction_type}, category={category_name}, account={account_uuid}")
    
    total_count = crud_transaction.get_transaction_count(
        session=session, 
        user_id=current_user.id,
        transaction_type=transaction_type,
        category_name=category_name,
        account_id=account_uuid
    )
    
    # Calculate pagination values
    total_pages = (total_count + page_size - 1) // page_size  # Ceiling division
    
    # Ensure page is within valid range
    if page > total_pages and total_count > 0:
        page = total_pages
    
    # Get paginated transactions
    transactions = crud_transaction.get_transactions(
        session=session, 
        user_id=current_user.id,
        transaction_type=transaction_type,
        category_name=category_name,
        account_id=account_uuid,
        skip=(page - 1) * page_size,
        limit=page_size
    )
    
    # Process transactions to handle nested objects with explicit relationship handling
    processed_transactions = []
    for transaction in transactions:
        # Create a dictionary representation of the transaction
        tx_dict = {}
        
        # Add all direct attributes of the transaction
        for key, value in transaction.__dict__.items():
            if not key.startswith('_'):
                tx_dict[key] = value
        
        # Process other relationships similarly
        for rel in ['category', 'account', 'currency', 'payment_method', 'subscription', 'financial_goal', 'debt']:
            rel_obj = getattr(transaction, rel, None)
            if rel_obj:
                # Convert relationship object to dictionary
                rel_dict = {}
                for rel_key, rel_value in rel_obj.__dict__.items():
                    if not rel_key.startswith('_'):
                        rel_dict[rel_key] = rel_value
                # Replace relationship object with dictionary
                tx_dict[rel] = rel_dict
        
        processed_transactions.append(tx_dict)
    
    # Return paginated response
    return {
        "items": processed_transactions,
        "total": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


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