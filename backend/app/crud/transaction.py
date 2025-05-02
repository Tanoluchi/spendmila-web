import uuid
from typing import Sequence, Union, Optional, List

from sqlmodel import Session, select, func # Added func

from app.models.transaction import Transaction
from app.models.enums import TransactionType
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
    *, session: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100,
    transaction_type: Optional[TransactionType] = None,
    # TODO: Add optional filters: date_from, date_to, category_id
) -> Sequence[Transaction]:
    """Get multiple transactions for a specific user, optionally filtered."""
    statement = (
        select(Transaction)
        .where(Transaction.user_id == user_id)
    )
    
    # Filter by transaction type if provided
    if transaction_type:
        statement = statement.where(Transaction.transaction_type == transaction_type)
        
    statement = (
        statement
        .order_by(Transaction.date.desc()) # Order by date descending by default
        .offset(skip)
        .limit(limit)
    )
    
    # Add additional filters here based on optional arguments
    return session.exec(statement).all()


def get_transaction_count(
    *, session: Session, user_id: uuid.UUID,
    transaction_type: Optional[TransactionType] = None
    # TODO: Add optional filters matching get_transactions
) -> int:
    """Get the total count of transactions for a user, optionally filtered."""
    # Ideally, the filters applied here should match get_transactions
    statement = select(func.count()).select_from(Transaction).where(Transaction.user_id == user_id)
    
    # Filter by transaction type if provided
    if transaction_type:
        statement = statement.where(Transaction.transaction_type == transaction_type)
        
    # Add filter clauses matching get_transactions
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
        from app.models.category import Category
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