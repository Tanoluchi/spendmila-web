import uuid
from typing import Sequence

from sqlmodel import Session, select

from app.models.debt import Debt
from app.schemas.debt import DebtCreate, DebtUpdate


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


def create_debt(
    *, session: Session, debt_in: DebtCreate, user_id: uuid.UUID
) -> Debt:
    """Create a new debt for a user."""
    debt_data = debt_in.model_dump()
    debt_data["user_id"] = user_id

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
    db_debt.sqlmodel_update(update_data)
    session.add(db_debt)
    session.commit()
    session.refresh(db_debt)
    return db_debt


def delete_debt(*, session: Session, db_debt: Debt) -> None:
    """Delete a debt."""
    session.delete(db_debt)
    session.commit() 