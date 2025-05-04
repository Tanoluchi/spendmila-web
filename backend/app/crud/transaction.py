import uuid
from typing import Sequence, Union, Optional, List

from sqlmodel import Session, select, func, or_ # Added or_

from app.models.transaction import Transaction
from app.models.enums import TransactionType
from app.models.category import Category
from app.models.debt import Debt
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
    account_id: Optional[uuid.UUID] = None,
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
        account_id: Optional account ID filter
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
    
    # Filter by account ID if provided
    if account_id:
        statement = statement.where(Transaction.account_id == account_id)
    
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
            
        # Re-apply account ID filter if needed
        if account_id:
            statement = statement.where(Transaction.account_id == account_id)
    
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
    category_name: Optional[str] = None,
    account_id: Optional[uuid.UUID] = None
) -> int:
    """
    Get the total count of transactions for a user, with optional filtering.
    
    Args:
        session: Database session
        user_id: User ID to filter by
        transaction_type: Optional transaction type filter
        category_name: Optional category name filter
        account_id: Optional account ID filter
    
    Returns:
        Total count of matching transactions
    """
    # Start with the base query
    statement = select(func.count(Transaction.id)).where(Transaction.user_id == user_id)
    
    # Filter by transaction type if provided
    if transaction_type:
        statement = statement.where(Transaction.transaction_type == transaction_type)
        
    # Filter by account ID if provided
    if account_id:
        statement = statement.where(Transaction.account_id == account_id)
    
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
            
        # Re-apply account ID filter if needed
        if account_id:
            statement = statement.where(Transaction.account_id == account_id)
    
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

    # Update account balance based on transaction type
    if db_transaction.account_id:
        from app.models.account import Account
        account = session.get(Account, db_transaction.account_id)
        if account:
            # For transfers, we need source and destination accounts
            if db_transaction.transaction_type == TransactionType.TRANSFER:
                # For transfers, the amount is deducted from the source account
                account.balance -= db_transaction.amount
                
                # If destination_account_id is provided (it should be in transfer_data)
                dest_account_id = transaction_data.get("destination_account_id")
                if dest_account_id:
                    dest_account = session.get(Account, dest_account_id)
                    if dest_account:
                        # Add the amount to the destination account
                        dest_account.balance += db_transaction.amount
                        session.add(dest_account)
            # For income, add to balance
            elif db_transaction.transaction_type == TransactionType.INCOME:
                account.balance += db_transaction.amount
            # For expenses, subtract from balance
            elif db_transaction.transaction_type == TransactionType.EXPENSE:
                account.balance -= db_transaction.amount
            
            session.add(account)

    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    
    # If this transaction is linked to a debt, update the debt payment progress
    if db_transaction.debt_id:
        _update_debt_payment_progress(session=session, debt_id=db_transaction.debt_id)
    
    return db_transaction


def update_transaction(
    *,
    session: Session,
    db_transaction: Transaction,
    transaction_in: TransactionUpdate,
) -> Transaction:
    """Update an existing transaction."""
    # Store old values before update
    old_debt_id = db_transaction.debt_id
    old_account_id = db_transaction.account_id
    old_amount = db_transaction.amount
    old_transaction_type = db_transaction.transaction_type
    
    # Apply update data
    update_data = transaction_in.model_dump(exclude_unset=True)
    
    # If we're updating the account balance, we need to revert the old transaction first
    if old_account_id:
        from app.models.account import Account
        old_account = session.get(Account, old_account_id)
        if old_account:
            # Revert the effect of the old transaction
            if old_transaction_type == TransactionType.INCOME:
                old_account.balance -= old_amount
            elif old_transaction_type == TransactionType.EXPENSE:
                old_account.balance += old_amount
            elif old_transaction_type == TransactionType.TRANSFER:
                # For transfers, add back to source account
                old_account.balance += old_amount
                
                # If there was a destination account, subtract from it
                old_dest_account_id = getattr(db_transaction, 'destination_account_id', None)
                if old_dest_account_id:
                    old_dest_account = session.get(Account, old_dest_account_id)
                    if old_dest_account:
                        old_dest_account.balance -= old_amount
                        session.add(old_dest_account)
            
            session.add(old_account)
    
    # Now apply the update
    db_transaction.sqlmodel_update(update_data)
    session.add(db_transaction)
    session.flush()  # Flush to get updated values but don't commit yet
    
    # Apply the new transaction effects on account balance
    if db_transaction.account_id:
        from app.models.account import Account
        new_account = session.get(Account, db_transaction.account_id)
        if new_account:
            # Apply the effect of the new/updated transaction
            if db_transaction.transaction_type == TransactionType.INCOME:
                new_account.balance += db_transaction.amount
            elif db_transaction.transaction_type == TransactionType.EXPENSE:
                new_account.balance -= db_transaction.amount
            elif db_transaction.transaction_type == TransactionType.TRANSFER:
                # For transfers, subtract from source account
                new_account.balance -= db_transaction.amount
                
                # If there is a destination account, add to it
                new_dest_account_id = update_data.get('destination_account_id')
                if new_dest_account_id:
                    new_dest_account = session.get(Account, new_dest_account_id)
                    if new_dest_account:
                        new_dest_account.balance += db_transaction.amount
                        session.add(new_dest_account)
            
            session.add(new_account)
    
    # Now we can commit all changes
    session.commit()
    session.refresh(db_transaction)
    
    # If this transaction is linked to a debt or was previously linked to a debt,
    # we need to recalculate the debt payment progress
    if db_transaction.debt_id or old_debt_id:
        # If debt_id has changed, update both old and new debt
        if old_debt_id and old_debt_id != db_transaction.debt_id:
            # Update old debt's payment progress
            _update_debt_payment_progress(session=session, debt_id=old_debt_id)
        
        # Update current debt's payment progress if it exists
        if db_transaction.debt_id:
            _update_debt_payment_progress(session=session, debt_id=db_transaction.debt_id)
    
    return db_transaction


def _update_debt_payment_progress(*, session: Session, debt_id: uuid.UUID) -> None:
    """Helper function to update a debt's payment progress after transactions change.
    
    This function ensures that the debt payment progress is accurately calculated based on
    the sum of all transaction amounts linked to the debt. It updates multiple fields in the
    debt record, including paid_amount, remaining_amount, and payment_progress percentage.
    
    Args:
        session: The database session
        debt_id: The UUID of the debt to update
    """
    # Get the debt
    debt = session.get(Debt, debt_id)
    if not debt:
        return
    
    # Get all active transactions associated with this debt
    statement = select(Transaction).where(
        Transaction.debt_id == debt_id,
        Transaction.is_active == True
    )
    transactions = session.exec(statement).all()
    
    # Calculate total paid amount from transactions
    paid_amount = sum(transaction.amount for transaction in transactions)
    
    # Calculate remaining amount and ensure it doesn't go below zero
    remaining_amount = max(0, debt.amount - paid_amount)
    
    # Calculate payment progress as percentage (0-100)
    payment_progress = 0
    if debt.amount > 0:
        payment_progress = min(100, round((paid_amount / debt.amount) * 100))
    
    # Update debt with new payment status
    debt.is_paid = remaining_amount <= 0
    debt.paid_amount = paid_amount
    debt.remaining_amount = remaining_amount
    debt.payment_progress = payment_progress
    
    # Calculate installment progress if applicable
    if debt.is_installment and debt.total_installments:
        # If this is an installment debt, update installment tracking
        paid_installments = len(transactions)
        remaining_installments = max(0, debt.total_installments - paid_installments)
        debt.paid_installments = paid_installments
        debt.remaining_installments = remaining_installments
    
    # Commit the changes to the database
    session.add(debt)
    session.commit()


def delete_transaction(*, session: Session, db_transaction: Transaction) -> None:
    """Delete a transaction."""
    # Store debt_id before deleting the transaction
    debt_id = db_transaction.debt_id
    
    # Delete the transaction
    session.delete(db_transaction)
    session.commit()
    
    # If this transaction was linked to a debt, update the debt payment progress
    if debt_id:
        _update_debt_payment_progress(session=session, debt_id=debt_id)