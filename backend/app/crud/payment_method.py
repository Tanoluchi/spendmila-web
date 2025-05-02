import uuid
from typing import Sequence

from sqlmodel import Session, select

from app.models.payment_method import PaymentMethod
from app.schemas.payment_method import PaymentMethodCreate, PaymentMethodUpdate


def get_payment_method(*, session: Session, payment_method_id: uuid.UUID) -> PaymentMethod | None:
    """Get a payment method by ID."""
    return session.get(PaymentMethod, payment_method_id)

def get_payment_methods(*, session: Session) -> Sequence[PaymentMethod]:
    """Get multiple payment methods."""
    # Consider adding filtering by user if payment methods become user-specific
    statement = select(PaymentMethod)
    return session.exec(statement).all()

def create_payment_method(*, session: Session, payment_method_in: PaymentMethodCreate, user_id: uuid.UUID) -> PaymentMethod:
    """Create a new payment method."""
    # Consider adding user_id if they become user-specific
    payment_method_data = payment_method_in.model_dump()
    payment_method_data["user_id"] = user_id

    db_pm = PaymentMethod.model_validate(payment_method_data)
    session.add(db_pm)
    session.commit()
    session.refresh(db_pm)
    return db_pm

def update_payment_method(*, session: Session, db_pm: PaymentMethod, pm_in: PaymentMethodUpdate) -> PaymentMethod:
    """Update an existing payment method."""
    pm_data = pm_in.model_dump(exclude_unset=True)
    db_pm.sqlmodel_update(pm_data)
    session.add(db_pm)
    session.commit()
    session.refresh(db_pm)
    return db_pm

def delete_payment_method(*, session: Session, db_pm: PaymentMethod) -> None:
    """Delete a payment method."""
    # Add checks: prevent deletion if used by transactions or debts?
    session.delete(db_pm)
    session.commit() 