import uuid
from typing import Any, Sequence

from fastapi import APIRouter, Depends, HTTPException

from app.crud import debt as crud_debt
from app.api.deps import SessionDep, CurrentUser
from app.models.debt import Debt
from app.schemas.debt import DebtCreate, DebtRead, DebtUpdate
from app.schemas.user import Message

router = APIRouter(prefix="/debts", tags=["debts"])


@router.post("/", response_model=DebtRead)
def create_debt(*, session: SessionDep, current_user: CurrentUser, debt_in: DebtCreate) -> Debt:
    """
    Create a new debt for the current user.
    """
    debt = crud_debt.create_debt(
        session=session, debt_in=debt_in, user_id=current_user.id
    )
    return debt


@router.get("/", response_model=Sequence[DebtRead])
def read_debts(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve debts for the current user.
    """
    debts = crud_debt.get_debts_by_user(
        session=session, user_id=current_user.id, skip=skip, limit=limit
    )
    return debts


@router.get("/{debt_id}", response_model=DebtRead)
def read_debt_by_id(
    session: SessionDep, current_user: CurrentUser, debt_id: uuid.UUID
) -> Any:
    """
    Get a specific debt by ID for the current user.
    """
    debt = crud_debt.get_debt(session=session, debt_id=debt_id, user_id=current_user.id)
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")
    return debt


@router.patch("/{debt_id}", response_model=DebtRead)
def update_debt(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    debt_id: uuid.UUID,
    debt_in: DebtUpdate,
) -> Any:
    """
    Update a debt for the current user.
    """
    db_debt = crud_debt.get_debt(session=session, debt_id=debt_id, user_id=current_user.id)
    if not db_debt:
        raise HTTPException(status_code=404, detail="Debt not found")

    updated_debt = crud_debt.update_debt(
        session=session, db_debt=db_debt, debt_in=debt_in
    )
    return updated_debt


@router.delete("/{debt_id}", response_model=Message)
def delete_debt(
    *, session: SessionDep, current_user: CurrentUser, debt_id: uuid.UUID
) -> Message:
    """
    Delete a debt for the current user.
    """
    db_debt = crud_debt.get_debt(session=session, debt_id=debt_id, user_id=current_user.id)
    if not db_debt:
        raise HTTPException(status_code=404, detail="Debt not found")

    crud_debt.delete_debt(session=session, db_debt=db_debt)
    return Message(message="Debt deleted successfully") 