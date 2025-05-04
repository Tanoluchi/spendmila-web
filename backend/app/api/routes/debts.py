import uuid
from typing import Any, Sequence
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query

from app.crud import debt as crud_debt
from app.api.deps import SessionDep, CurrentUser
from app.models.debt import Debt
from app.models.transaction import Transaction
from app.schemas.debt import DebtCreate, DebtRead, DebtUpdate, DebtReadWithDetails, DebtAddPayment
from app.schemas.transaction import TransactionRead
from app.schemas.user import Message

router = APIRouter(prefix="/debts", tags=["debts"])


@router.post("/", response_model=DebtRead)
def create_debt(*, session: SessionDep, current_user: CurrentUser, debt_in: DebtCreate) -> Debt:
    """
    Create a new debt for the current user.
    
    The currency will be automatically determined based on:
    1. The currency of the linked account (if account_id is provided)
    2. The user's default currency (if no account_id is provided)
    """
    try:
        debt = crud_debt.create_debt(
            session=session, debt_in=debt_in, user_id=current_user.id
        )
        return debt
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


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


@router.get("/{debt_id}/details", response_model=DebtReadWithDetails)
def read_debt_details(
    session: SessionDep, current_user: CurrentUser, debt_id: uuid.UUID
) -> Any:
    """
    Get a specific debt with detailed payment information, including:
    - List of all payments made
    - Total amount paid
    - Remaining amount to be paid
    - Payment progress percentage
    - Installment tracking (if applicable)
    """
    debt_with_details = crud_debt.get_debt_with_details(
        session=session, debt_id=debt_id, user_id=current_user.id
    )
    if not debt_with_details:
        raise HTTPException(status_code=404, detail="Debt not found")
    return debt_with_details


@router.post("/{debt_id}/payments", response_model=TransactionRead)
def add_payment(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    debt_id: uuid.UUID,
    payment: DebtAddPayment
) -> Any:
    """
    Add a payment to a debt.
    
    This will create a transaction record linked to the debt and update the debt's payment status.
    If the payment completes the debt, the debt will be marked as paid.
    """
    try:
        _, transaction = crud_debt.add_debt_payment(
            session=session,
            debt_id=debt_id,
            user_id=current_user.id,
            amount=payment.amount,
            description=payment.description,
            payment_date=payment.payment_date
        )
        return transaction
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


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
    
    If the account_id is changed, the currency will be automatically updated to match
    the new account's currency.
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