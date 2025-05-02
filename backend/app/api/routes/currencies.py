import uuid
from typing import Any, Sequence

from fastapi import APIRouter, Depends, HTTPException

# Import CRUD functions specific to currency
from app.crud import currency
from app.api.deps import SessionDep, get_current_active_superuser
from app.models.currency import Currency
from app.schemas.currency import CurrencyCreate, CurrencyRead, CurrencyUpdate
from app.schemas.user import Message

router = APIRouter(prefix="/currencies", tags=["currencies"])


@router.post("/", response_model=CurrencyRead, dependencies=[Depends(get_current_active_superuser)])
def create_currency(
    *, session: SessionDep, currency_in: CurrencyCreate
) -> Currency:
    """
    Create a new currency. (Superuser only)
    """
    try:
        return currency.create_currency(session=session, currency_in=currency_in)
    except ValueError as e: # Catch potential duplicate code error from CRUD
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=Sequence[CurrencyRead])
def read_currencies(
    session: SessionDep
) -> Any:
    """
    Retrieve all currencies. (No auth required? Or add dependency?)
    Consider if this should be restricted or open.
    """
    # Depending on requirements, might add current_user dependency
    currencies = currency.get_currencies(session=session)
    return currencies


@router.get("/{currency_id}", response_model=CurrencyRead)
def read_currency_by_id(
    session: SessionDep, currency_id: uuid.UUID
) -> Any:
    """
    Get a specific currency by ID.
    """
    # Depending on requirements, might add current_user dependency
    currency = currency.get_currency(session=session, currency_id=currency_id)
    if not currency:
        raise HTTPException(status_code=404, detail="Currency not found")
    return currency


@router.patch(
    "/{currency_id}",
    response_model=CurrencyRead,
    dependencies=[Depends(get_current_active_superuser)],
)
def update_currency(
    *,
    session: SessionDep,
    currency_id: uuid.UUID,
    currency_in: CurrencyUpdate,
) -> Any:
    """
    Update a currency. (Superuser only)
    """
    db_currency = currency.get_currency(session=session, currency_id=currency_id)
    if not db_currency:
        raise HTTPException(status_code=404, detail="Currency not found")

    return currency.update_currency(
        session=session, db_currency=db_currency, currency_in=currency_in
    )


@router.delete(
    "/{currency_id}",
    response_model=Message,
    dependencies=[Depends(get_current_active_superuser)],
)
def delete_currency(
    *,
    session: SessionDep,
    currency_id: uuid.UUID,
) -> Message:
    """
    Delete a currency. (Superuser only)
    """
    db_currency = currency.get_currency(session=session, currency_id=currency_id)
    if not db_currency:
        raise HTTPException(status_code=404, detail="Currency not found")

    # Consider adding logic here to prevent deletion if currency is in use
    # e.g., check if users have it as default, or if transactions exist.
    try:
        currency.delete_currency(session=session, db_currency=db_currency)
        return Message(message="Currency deleted successfully")
    except Exception as e:
        # Catch potential integrity errors if deletion is blocked by FK constraints
        # Log the error e
        raise HTTPException(
            status_code=409, # Conflict
            detail="Cannot delete currency. It might be in use by other records.",
        ) 