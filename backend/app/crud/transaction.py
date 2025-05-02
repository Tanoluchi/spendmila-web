import uuid
from typing import Sequence, Union, Optional, List

from sqlmodel import Session, select, func, or_ # Added or_

from app.models.transaction import Transaction
from app.models.enums import TransactionType
from app.models.category import Category
from app.schemas.transaction import (
    TransactionCreate, TransactionUpdate
)

def get_transaction(
    *, session: Session, transaction_id: uuid.UUID, user_id: uuid.UUID
) -> Transaction | None:
    """Get a transaction by ID, ensuring it belongs to the user."""
    statement = select(Transaction).where(
        Transaction.id == transaction_id, Transaction.user_id == user_id
    )
    return session.exec(statement).first()


def get_transactions(
    *, session: Session, user_id: uuid.UUID,
    transaction_type: Optional[TransactionType] = None,
    category_name: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> Sequence[Transaction]:
    """
    Get multiple transactions for a specific user, with optional filtering and pagination.
    
    Args:
        session: Database session
        user_id: User ID to filter by
        transaction_type: Optional transaction type filter
        category_name: Optional category name filter
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
    
    Returns:
        A sequence of Transaction objects
    """
    # Start with the base query
    statement = select(Transaction).where(Transaction.user_id == user_id)
    
    # Filter by transaction type if provided
    if transaction_type:
        statement = statement.where(Transaction.transaction_type == transaction_type)
    
    # Filter by category name if provided
    if category_name:
        # Join with Category table to filter by name
        statement = (
            select(Transaction)
            .join(Category, Transaction.category_id == Category.id)
            .where(
                Transaction.user_id == user_id,
                Category.name == category_name
            )
        )
        
        # Re-apply transaction type filter if needed
        if transaction_type:
            statement = statement.where(Transaction.transaction_type == transaction_type)
    
    # Apply ordering, pagination
    statement = (
        statement
        .order_by(Transaction.date.desc())
        .offset(skip)
        .limit(limit)
    )
    
    return session.exec(statement).all()


def get_transaction_count(
    *, session: Session, user_id: uuid.UUID,
    transaction_type: Optional[TransactionType] = None,
    category_name: Optional[str] = None
) -> int:
    """
    Get the total count of transactions for a user, with optional filtering.
    
    Args:
        session: Database session
        user_id: User ID to filter by
        transaction_type: Optional transaction type filter
        category_name: Optional category name filter
    
    Returns:
        Total count of matching transactions
    """
    # Start with the base query
    statement = select(func.count(Transaction.id)).where(Transaction.user_id == user_id)
    
    # Filter by transaction type if provided
    if transaction_type:
        statement = statement.where(Transaction.transaction_type == transaction_type)
    
    # Filter by category name if provided
    if category_name:
        # Join with Category table to filter by name
        statement = (
            select(func.count(Transaction.id))
            .join(Category, Transaction.category_id == Category.id)
            .where(
                Transaction.user_id == user_id,
                Category.name == category_name
            )
        )
        
        # Re-apply transaction type filter if needed
        if transaction_type:
            statement = statement.where(Transaction.transaction_type == transaction_type)
    
    count = session.exec(statement).one()
    return count


def create_transaction(
    *, session: Session, transaction_in: TransactionCreate, user_id: uuid.UUID
) -> Transaction:
    """Create a new transaction."""
    transaction_data = transaction_in.model_dump()
    transaction_data["user_id"] = user_id

    # Validate category_id if provided
    if transaction_data.get("category_id"):
        category = session.get(Category, transaction_data["category_id"])
        if not category:
            raise ValueError(f"Category with ID {transaction_data['category_id']} does not exist")

    # Create transaction instance
    db_transaction = Transaction.model_validate(transaction_data)

    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction


def update_transaction(
    *,
    session: Session,
    db_transaction: Transaction,
    transaction_in: TransactionUpdate,
) -> Transaction:
    """Update an existing transaction."""
    update_data = transaction_in.model_dump(exclude_unset=True)
    db_transaction.sqlmodel_update(update_data)
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction


def delete_transaction(*, session: Session, db_transaction: Transaction) -> None:
    """Delete a transaction."""
    session.delete(db_transaction)
    session.commit()