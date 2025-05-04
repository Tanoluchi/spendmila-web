import uuid
from typing import Sequence, Dict, List, Optional, Tuple
from datetime import date, datetime

from sqlmodel import Session, select, func, col

from app.models.debt import Debt
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.debt import DebtCreate, DebtUpdate, DebtPayment, DebtReadWithDetails


def get_debt(
    *, session: Session, debt_id: uuid.UUID, user_id: uuid.UUID
) -> Debt | None:
    """Get a debt by ID, ensuring it belongs to the user."""
    statement = select(Debt).where(Debt.id == debt_id, Debt.user_id == user_id)
    return session.exec(statement).first()


def get_debts_by_user(
    *, session: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> Sequence[Debt]:
    """Get multiple debts for a specific user."""
    statement = (
        select(Debt).where(Debt.user_id == user_id).offset(skip).limit(limit)
    )
    return session.exec(statement).all()


def calculate_debt_details(
    *, session: Session, debt: Debt
) -> Dict:
    """Calculate debt payment details including remaining amount and installment progress."""
    # Get all transactions associated with this debt
    statement = select(Transaction).where(
        Transaction.debt_id == debt.id,
        Transaction.is_active == True
    )
    transactions = session.exec(statement).all()
    
    # Calculate total paid amount from transactions
    paid_amount = sum(transaction.amount for transaction in transactions)
    
    # Calculate remaining amount - ensure it never goes below zero
    remaining_amount = max(0, debt.amount - paid_amount)
    
    # Calculate payment progress as percentage (0-100%)
    payment_progress = 0
    if debt.amount > 0:
        payment_progress = min(100, round((paid_amount / debt.amount) * 100))
    
    # Update the debt with calculated values
    # This ensures that the debt model always has the latest payment calculations
    debt.paid_amount = paid_amount
    debt.remaining_amount = remaining_amount
    debt.payment_progress = payment_progress
    debt.is_paid = remaining_amount <= 0
    
    # Save the updated debt information
    session.add(debt)
    session.commit()
    session.refresh(debt)
    
    # Format transactions as payments for response
    payments = [
        DebtPayment(
            id=transaction.id,
            date=transaction.date,
            amount=transaction.amount,
            description=transaction.description
        )
        for transaction in transactions
    ]
    
    # Calculate installment progress if applicable
    paid_installments = None
    remaining_installments = None
    
    if debt.is_installment and debt.total_installments:
        # Count transactions as installments
        paid_installments = len(transactions)
        remaining_installments = max(0, debt.total_installments - paid_installments)
        
        # Update the debt with installment information
        debt.paid_installments = paid_installments
        debt.remaining_installments = remaining_installments
        session.add(debt)
        session.commit()
    
    return {
        "payments": payments,
        "paid_amount": paid_amount,
        "remaining_amount": remaining_amount,
        "paid_installments": paid_installments,
        "remaining_installments": remaining_installments,
        "payment_progress": payment_progress
    }


def get_debt_with_details(
    *, session: Session, debt_id: uuid.UUID, user_id: uuid.UUID
) -> Optional[DebtReadWithDetails]:
    """Get a debt with payment details and calculations."""
    debt = get_debt(session=session, debt_id=debt_id, user_id=user_id)
    if not debt:
        return None
    
    # Get debt details
    details = calculate_debt_details(session=session, debt=debt)
    
    # Create the response with debt and payment details
    debt_dict = debt.model_dump()
    debt_dict.update(details)
    
    return DebtReadWithDetails.model_validate(debt_dict)


def create_debt(
    *, session: Session, debt_in: DebtCreate, user_id: uuid.UUID
) -> Debt:
    """Create a new debt for a user."""
    debt_data = debt_in.model_dump()
    debt_data["user_id"] = user_id
    
    # Set start_date to today if not provided
    if "start_date" not in debt_data or not debt_data["start_date"]:
        debt_data["start_date"] = date.today()
    
    # Determine currency_id based on account or user default
    if debt_data.get("account_id"):
        # Get currency from the account
        from app.models.account import Account
        account_statement = select(Account.currency_id).where(Account.id == debt_data["account_id"])
        currency_id = session.exec(account_statement).first()
        if currency_id:
            debt_data["currency_id"] = currency_id
    
    # If no currency_id yet, use user's default currency
    if "currency_id" not in debt_data:
        user_statement = select(User.default_currency_id).where(User.id == user_id)
        default_currency_id = session.exec(user_statement).first()
        if default_currency_id:
            debt_data["currency_id"] = default_currency_id
        else:
            raise ValueError("No currency could be determined for this debt. Please specify an account or ensure the user has a default currency.")
    
    db_debt = Debt.model_validate(debt_data)
    session.add(db_debt)
    session.commit()
    session.refresh(db_debt)
    return db_debt


def update_debt(
    *, session: Session, db_debt: Debt, debt_in: DebtUpdate
) -> Debt:
    """Update an existing debt."""
    update_data = debt_in.model_dump(exclude_unset=True)
    
    # If account_id is changing, update currency_id accordingly
    if "account_id" in update_data and update_data["account_id"] != db_debt.account_id:
        account_id = update_data["account_id"]
        if account_id:
            # Get currency from the new account
            account_statement = select(col("currency_id")).select_from("account").where(col("id") == account_id)
            currency_id = session.exec(account_statement).first()
            if currency_id:
                update_data["currency_id"] = currency_id
    
    db_debt.sqlmodel_update(update_data)
    session.add(db_debt)
    session.commit()
    session.refresh(db_debt)
    return db_debt


def delete_debt(*, session: Session, db_debt: Debt) -> None:
    """Delete a debt."""
    session.delete(db_debt)
    session.commit()


def add_debt_payment(
    *, session: Session, debt_id: uuid.UUID, user_id: uuid.UUID, amount: float, 
    description: Optional[str] = None, payment_date: Optional[date] = None
) -> Tuple[Debt, Transaction]:
    """Add a payment to a debt and create a transaction record."""
    # Get the debt
    debt = get_debt(session=session, debt_id=debt_id, user_id=user_id)
    if not debt:
        raise ValueError("Debt not found")
    
    # Use today's date if not provided
    if not payment_date:
        payment_date = date.today()
    
    # Create a transaction for this payment
    from app.models.transaction import TransactionBase
    from app.models.enums import TransactionType
    
    transaction_data = {
        "user_id": user_id,
        "debt_id": debt_id,
        "amount": amount,
        "description": description or f"Payment for {debt.creditor_name}",
        "date": payment_date,
        "transaction_type": TransactionType.EXPENSE,
        "currency_id": debt.currency_id,
    }
    
    # Add account_id if available
    if debt.account_id:
        transaction_data["account_id"] = debt.account_id
    
    # Add payment_method_id if available
    if debt.payment_method_id:
        transaction_data["payment_method_id"] = debt.payment_method_id
    
    transaction = Transaction.model_validate(transaction_data)
    session.add(transaction)
    
    # Check if debt is now fully paid
    details = calculate_debt_details(session=session, debt=debt)
    if details["remaining_amount"] <= 0:
        debt.is_paid = True
        session.add(debt)
    
    session.commit()
    session.refresh(debt)
    session.refresh(transaction)
    
    return debt, transaction