from typing import Any, Sequence
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api import deps
from app.crud import account as account_crud
from app.models.user import User
from app.schemas.account import (
    AccountCreate,
    AccountRead,
    AccountUpdate,
    AccountReadWithDetails,
)

router = APIRouter(
    prefix="/accounts",
    tags=["accounts"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=Sequence[AccountRead])
def get_accounts(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve accounts for the current user.
    Optionally filter by account type.
    """
    accounts = account_crud.get_accounts(
        db=db, user_id=current_user.id
    )
    return accounts


@router.post("/", response_model=AccountRead, status_code=status.HTTP_201_CREATED)
def create_account(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    account_in: AccountCreate,
) -> Any:
    """
    Create new account for the current user.
    """
    # Check if account with same name already exists for this user
    existing_account = account_crud.get_account_by_name(
        db=db, user_id=current_user.id, name=account_in.name
    )
    if existing_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account with this name already exists.",
        )
    
    # If this is set as default account, unset any existing default accounts
    if account_in.is_default:
        account_crud.unset_default_accounts(db=db, user_id=current_user.id)
    
    account = account_crud.create_account(
        db=db, account=account_in, user_id=current_user.id
    )
    return account


@router.get("/{account_id}", response_model=AccountReadWithDetails)
def get_account(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    account_id: uuid.UUID,
) -> Any:
    """
    Get account by ID.
    """
    account = account_crud.get_account(db=db, account_id=account_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Account not found"
        )
    if account.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    
    account_with_details = account_crud.get_account_with_details(db=db, account_id=account_id)
    return account_with_details


@router.put("/{account_id}", response_model=AccountRead)
def update_account(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    account_id: uuid.UUID,
    account_in: AccountUpdate,
) -> Any:
    """
    Update an account.
    """
    account = account_crud.get_account(db=db, account_id=account_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Account not found"
        )
    if account.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    
    # If name is being updated, check it doesn't conflict with existing accounts
    if account_in.name and account_in.name != account.name:
        existing_account = account_crud.get_account_by_name(
            db=db, user_id=current_user.id, name=account_in.name
        )
        if existing_account and existing_account.id != account_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account with this name already exists.",
            )
    
    # If this is set as default account, unset any existing default accounts
    if account_in.is_default is True:
        account_crud.unset_default_accounts(db=db, user_id=current_user.id)
    
    account = account_crud.update_account(
        db=db, account_id=account_id, account_update=account_in
    )
    return account


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    account_id: uuid.UUID,
) -> None:
    """
    Delete an account.
    """
    account = account_crud.get_account(db=db, account_id=account_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Account not found"
        )
    if account.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    
    # Check if account has associated transactions, debts, or subscriptions
    if account_crud.has_related_entities(db=db, account_id=account_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete account with associated transactions, debts, or subscriptions"
        )
    
    account_crud.delete_account(db=db, account_id=account_id)
