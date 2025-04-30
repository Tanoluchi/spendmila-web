import uuid
from typing import Any, Sequence

from fastapi import APIRouter, Depends, HTTPException

# Import CRUD functions using the new naming convention
from app.crud import payment_method
from app.api.deps import SessionDep, CurrentUser # Add CurrentUser dependency
from app.models.payment_method import PaymentMethod
from app.schemas.payment_method import (
    PaymentMethodCreate,
    PaymentMethodRead,
    PaymentMethodUpdate,
)
from app.schemas.user import Message

# Define the router
router = APIRouter(prefix="/payment-methods", tags=["payment-methods"])


@router.post("/", response_model=PaymentMethodRead)
def create_payment_method(
    *, session: SessionDep, current_user: CurrentUser, pm_in: PaymentMethodCreate
) -> PaymentMethod:
    """
    Create a new payment method.
    (Requires authenticated user. Consider if superuser only?)
    """
    # Currently, payment methods are global. If they become user-specific,
    # the create function in crud would need the user_id.
    return payment_method.create_payment_method(
        session=session, 
        payment_method_in=pm_in, 
        user_id=current_user.id
    )


@router.get("/", response_model=Sequence[PaymentMethodRead])
def read_payment_methods(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve payment methods.
    (Requires authenticated user)
    """
    # Currently retrieves all. Add filtering by user if they become user-specific.
    pms = payment_method.get_payment_methods(session=session, skip=skip, limit=limit)
    return pms


@router.get("/{pm_id}", response_model=PaymentMethodRead)
def read_payment_method_by_id(
    session: SessionDep, current_user: CurrentUser, pm_id: uuid.UUID
) -> Any:
    """
    Get a specific payment method by ID.
    (Requires authenticated user)
    """
    db_pm = payment_method.get_payment_method(session=session, payment_method_id=pm_id)
    if not db_pm:
        raise HTTPException(status_code=404, detail="Payment Method not found")
    # Add ownership check here if payment methods become user-specific
    return db_pm


@router.patch("/{pm_id}", response_model=PaymentMethodRead)
def update_payment_method(
    *,
    session: SessionDep,
    current_user: CurrentUser, # Consider superuser only?
    pm_id: uuid.UUID,
    pm_in: PaymentMethodUpdate,
) -> Any:
    """
    Update a payment method.
    (Requires authenticated user. Consider superuser only?)
    """
    db_pm = payment_method.get_payment_method(session=session, payment_method_id=pm_id)
    if not db_pm:
        raise HTTPException(status_code=404, detail="Payment Method not found")
    # Add ownership/permission check here if needed

    return payment_method.update_payment_method(session=session, db_pm=db_pm, pm_in=pm_in)


@router.delete("/{pm_id}", response_model=Message)
def delete_payment_method(
    *,
    session: SessionDep,
    current_user: CurrentUser, # Consider superuser only?
    pm_id: uuid.UUID,
) -> Message:
    """
    Delete a payment method.
    (Requires authenticated user. Consider superuser only?)
    """
    db_pm = payment_method.get_payment_method(session=session, payment_method_id=pm_id)
    if not db_pm:
        raise HTTPException(status_code=404, detail="Payment Method not found")
    # Add ownership/permission check here if needed

    # Consider adding logic to prevent deletion if the payment method is in use
    try:
        payment_method.delete_payment_method(session=session, db_pm=db_pm)
        return Message(message="Payment Method deleted successfully")
    except Exception as e:
        # Catch potential integrity errors
        # Log the error e
        raise HTTPException(
            status_code=409, # Conflict
            detail="Cannot delete Payment Method. It might be in use.",
        ) 