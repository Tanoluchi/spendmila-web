import uuid
from typing import Sequence

from sqlmodel import Session, select

from app.models.currency import Currency
from app.schemas.currency import CurrencyCreate, CurrencyUpdate


def get_currency(*, session: Session, currency_id: uuid.UUID) -> Currency | None:
    """Get a currency by ID."""
    return session.get(Currency, currency_id)

def get_currency_by_code(*, session: Session, code: str) -> Currency | None:
    """Get a currency by its unique code."""
    statement = select(Currency).where(Currency.code == code)
    return session.exec(statement).first()

def get_currencies(*, session: Session) -> Sequence[Currency]:
    """Get multiple currencies."""
    statement = select(Currency)
    return session.exec(statement).all()

def create_currency(*, session: Session, currency_in: CurrencyCreate) -> Currency:
    """Create a new currency."""
    # Check if currency code already exists
    existing_currency = get_currency_by_code(session=session, code=currency_in.code)
    if existing_currency:
        # Consider raising an exception or returning the existing one
        # For now, let's assume creation fails if code exists
        raise ValueError(f"Currency code '{currency_in.code}' already exists.") # Or handle differently

    db_currency = Currency.model_validate(currency_in)
    session.add(db_currency)
    session.commit()
    session.refresh(db_currency)
    return db_currency

def update_currency(*, session: Session, db_currency: Currency, currency_in: CurrencyUpdate) -> Currency:
    """Update an existing currency."""
    currency_data = currency_in.model_dump(exclude_unset=True)
    db_currency.sqlmodel_update(currency_data)
    session.add(db_currency)
    session.commit()
    session.refresh(db_currency)
    return db_currency

def delete_currency(*, session: Session, db_currency: Currency) -> None:
    """Delete a currency."""
    # Consider adding checks here: e.g., don't delete if it's used as a default currency
    # or if transactions/goals etc. are associated with it, unless cascade delete is set up.
    session.delete(db_currency)
    session.commit() 