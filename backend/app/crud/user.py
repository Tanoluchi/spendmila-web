import uuid
from typing import Any

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.models.currency import Currency
from app.models.enums import AccountType, CurrencyCode
from app.schemas.account import AccountCreate as AccountCreateSchema
from app.crud.currency import get_currency_by_code
from app.crud.account import create_account as crud_create_account, unset_default_accounts
from datetime import date, timedelta
from decimal import Decimal
from sqlalchemy import func, and_
from app.models.transaction import Transaction, TransactionType
from app.models.currency import Currency


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def create_user(*, session: Session, user_create: UserCreate) -> User:
    # Create a dictionary for model validation, excluding the plain password
    user_data = user_create.model_dump(exclude={"password"})

    # Determine and set default currency to USD if not provided or if None
    if not user_data.get("default_currency_id"):
        usd_currency = get_currency_by_code(session=session, code=CurrencyCode.USD.value)
        if not usd_currency:
            # This should ideally not happen if USD is seeded in the DB.
            # Consider adding a check in init_db to ensure USD currency exists.
            raise ValueError("USD currency not found. Cannot set default currency for user.")
        user_data["default_currency_id"] = usd_currency.id

    hashed_password = get_password_hash(user_create.password)
    
    # Create the user instance directly
    # Ensure all required fields from User model (via UserBase) are present in user_data or UserCreate
    db_obj = User(
        **user_data, # This now includes the potentially defaulted currency_id
        hashed_password=hashed_password,
        # Relationships are typically not set directly during instance creation like this
        # transactions=[],
        # financial_goals=[],
        # subscriptions=[],
        # debts=[],
    )
    
    session.add(db_obj)
    session.commit() # Commit to get the user ID, crucial for FK in account
    session.refresh(db_obj)

    # Create a default "Cash" account for the new user
    # Unset any other default accounts for this user (important if logic changes later)
    unset_default_accounts(db=session, user_id=db_obj.id)

    account_to_create = AccountCreateSchema(
        name="Cash",
        account_type=AccountType.CASH.value, # Use the string value of the enum
        currency_id=db_obj.default_currency_id, # Use the user's (now set) default currency
        is_default=True # Make this the default account
    )
    crud_create_account(db=session, account=account_to_create, user_id=db_obj.id)
    # crud_create_account handles its own commit and refresh

    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    # Get the fields to update, excluding None values
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    # Handle password update separately
    if "password" in user_data and user_data["password"]:
        password = user_data.pop("password") # Remove plain password from update data
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password # Add hashed password to extra_data

    # Update the user model
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

# authenticate function remains largely the same
def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user

# Add other common user CRUD functions if needed:
# def get_user(session: Session, user_id: uuid.UUID) -> User | None: ...
# def get_users(session: Session, skip: int = 0, limit: int = 100) -> list[User]: ...
# def delete_user(session: Session, db_user: User) -> None: ... 

def get_user_by_id(session: Session, user_id: uuid.UUID) -> User | None:
    """Get a user by their ID."""
    user = session.get(User, user_id)
    return user


def _calculate_percentage_change(current_value: Decimal, previous_value: Decimal) -> float:
    if previous_value == Decimal(0):
        # If previous is 0, any current non-zero value is infinite % change.
        # Represent as 100% if current > 0, or 0% if current is also 0.
        return 0.0 if current_value == Decimal(0) else 100.0
    return float(((current_value - previous_value) / previous_value) * 100)

def get_user_financial_summary(session: Session, user: User) -> dict:
    today = date.today()
    current_month_start = today.replace(day=1)
    
    # For previous month calculations, get the last day of the previous month, then its first day
    prev_month_end_date = current_month_start - timedelta(days=1)
    prev_month_start_date = prev_month_end_date.replace(day=1)

    # Cumulative Income: Sum of all income transactions ever
    stmt_total_income = (
        select(func.sum(Transaction.amount))
        .where(Transaction.user_id == user.id)
        .where(Transaction.transaction_type == TransactionType.INCOME)
    )

    total_income = session.exec(stmt_total_income).one_or_none() or Decimal(0)

    # Cumulative Expenses: Sum of all expense transactions ever
    stmt_total_expenses = (
        select(func.sum(Transaction.amount))
        .where(Transaction.user_id == user.id)
        .where(Transaction.transaction_type == TransactionType.EXPENSE)
    )
    total_expenses = session.exec(stmt_total_expenses).one_or_none() or Decimal(0)

    # Income - Current Month (from start of current month to today)
    stmt_income_current_month = (
        select(func.sum(Transaction.amount))
        .where(Transaction.user_id == user.id)
        .where(Transaction.transaction_type == TransactionType.INCOME)
        .where(Transaction.date >= current_month_start)
        .where(Transaction.date <= today) # up to today
    )
    income_current_month = session.exec(stmt_income_current_month).one_or_none() or Decimal(0)

    # Income - Previous Full Month
    stmt_income_prev_month = (
        select(func.sum(Transaction.amount))
        .where(Transaction.user_id == user.id)
        .where(Transaction.transaction_type == TransactionType.INCOME)
        .where(and_(Transaction.date >= prev_month_start_date, Transaction.date <= prev_month_end_date))
    )
    income_prev_month = session.exec(stmt_income_prev_month).one_or_none() or Decimal(0)

    # Expenses - Current Month (from start of current month to today)
    stmt_expenses_current_month = (
        select(func.sum(Transaction.amount))
        .where(Transaction.user_id == user.id)
        .where(Transaction.transaction_type == TransactionType.EXPENSE)
        .where(Transaction.date >= current_month_start)
        .where(Transaction.date <= today) # up to today
    )
    expenses_current_month = session.exec(stmt_expenses_current_month).one_or_none() or Decimal(0)

    # Expenses - Previous Full Month
    stmt_expenses_prev_month = (
        select(func.sum(Transaction.amount))
        .where(Transaction.user_id == user.id)
        .where(Transaction.transaction_type == TransactionType.EXPENSE)
        .where(and_(Transaction.date >= prev_month_start_date, Transaction.date <= prev_month_end_date))
    )
    expenses_prev_month = session.exec(stmt_expenses_prev_month).one_or_none() or Decimal(0)

    income_change_percentage = _calculate_percentage_change(income_current_month, income_prev_month)
    expense_change_percentage = _calculate_percentage_change(expenses_current_month, expenses_prev_month)
    
    currency_code = "USD" # Default currency code
    if user.default_currency_id:
        db_currency = session.get(Currency, user.default_currency_id)
        if db_currency:
            currency_code = db_currency.code
    elif user.default_currency: # If relationship is loaded
        currency_code = user.default_currency.code

    return {
        "cumulative_income": float(total_income),
        "income_change_percentage": income_change_percentage,
        "cumulative_expenses": float(total_expenses),
        "expense_change_percentage": expense_change_percentage,
        "currency_code": currency_code,
    }


# Function to update user details
def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    # Get the fields to update, excluding None values
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    # Handle password update separately
    if "password" in user_data and user_data["password"]:
        password = user_data.pop("password") # Remove plain password from update data
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password # Add hashed password to extra_data

    # Update the user model
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user