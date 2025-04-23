import uuid
from typing import Sequence, Union

from sqlmodel import Session, select, func # Added func

from app.models.transaction import (
    Transaction,
    Income,
    Expense,
    IncomeCreate,
    ExpenseCreate,
    IncomeUpdate,
    ExpenseUpdate,
)

# Type alias for create and update schemas
TransactionCreate = Union[IncomeCreate, ExpenseCreate]
TransactionUpdate = Union[IncomeUpdate, ExpenseUpdate]


def get_transaction(
    *, session: Session, transaction_id: uuid.UUID, user_id: uuid.UUID
) -> Transaction | None:
    """Get a transaction by ID, ensuring it belongs to the user."""
    statement = select(Transaction).where(
        Transaction.id == transaction_id, Transaction.user_id == user_id
    )
    # SQLModel automatically handles fetching Income or Expense subclass
    return session.exec(statement).first()


def get_transactions(
    *, session: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    # TODO: Add optional filters: date_from, date_to, category_id, type ('income'/'expense')
) -> Sequence[Transaction]:
    """Get multiple transactions for a specific user, optionally filtered."""
    statement = (
        select(Transaction)
        .where(Transaction.user_id == user_id)
        .order_by(Transaction.date.desc()) # Order by date descending by default
        .offset(skip)
        .limit(limit)
    )
    # Add filters here based on optional arguments
    return session.exec(statement).all()

def get_transaction_count(
    *, session: Session, user_id: uuid.UUID
    # TODO: Add optional filters matching get_transactions
) -> int:
    """Get the total count of transactions for a user, optionally filtered."""
    # Ideally, the filters applied here should match get_transactions
    statement = select(func.count()).select_from(Transaction).where(Transaction.user_id == user_id)
    # Add filter clauses matching get_transactions
    count = session.exec(statement).one()
    return count

def create_transaction(
    *, session: Session, transaction_in: TransactionCreate, user_id: uuid.UUID
) -> Transaction:
    """Create a new transaction (Income or Expense)."""
    transaction_data = transaction_in.model_dump()
    transaction_data["user_id"] = user_id

    # Validate and create the specific type (Income or Expense)
    if isinstance(transaction_in, IncomeCreate):
        db_transaction = Income.model_validate(transaction_data)
    elif isinstance(transaction_in, ExpenseCreate):
        db_transaction = Expense.model_validate(transaction_data)
    else:
        # This should ideally not happen if API validation uses the Union type correctly
        raise ValueError("Invalid transaction type provided")

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

    # Ensure the type-specific fields match if provided
    if isinstance(transaction_in, ExpenseUpdate) and isinstance(db_transaction, Expense):
        # Update fields specific to Expense if present in input
        pass # sqlmodel_update handles this if fields exist
    elif isinstance(transaction_in, IncomeUpdate) and isinstance(db_transaction, Income):
        # Update fields specific to Income if present in input
         pass # sqlmodel_update handles this if fields exist
    # Avoid updating if types mismatch (e.g., trying to apply ExpenseUpdate to an Income)
    elif (isinstance(transaction_in, ExpenseUpdate) and not isinstance(db_transaction, Expense)) or \
         (isinstance(transaction_in, IncomeUpdate) and not isinstance(db_transaction, Income)):
         raise ValueError("Cannot apply update schema to the wrong transaction type.")


    db_transaction.sqlmodel_update(update_data)
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction


def delete_transaction(*, session: Session, db_transaction: Transaction) -> None:
    """Delete a transaction."""
    session.delete(db_transaction)
    session.commit() 