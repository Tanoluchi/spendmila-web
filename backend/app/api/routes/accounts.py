from typing import Any, Sequence, List, Dict
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api import deps
from app.models.user import User
from app.schemas.account import (
    AccountCreate,
    AccountRead,
    AccountUpdate,
    AccountReadWithDetails,
    AccountTypeResponse
)
from app.schemas.user import Message
from app.services.account_service import AccountService

router = APIRouter(
    prefix="/accounts",
    tags=["accounts"],
    responses={404: {"description": "Not found"}},
)

# IMPORTANTE: Definir las rutas específicas ANTES de las rutas con parámetros dinámicos
@router.get("/types", response_model=List[AccountTypeResponse])
def get_account_types() -> List[AccountTypeResponse]:
    """
    Get all available account types from the AccountType enum.
    """
    return AccountService.get_account_types()


@router.get("/", response_model=Sequence[AccountRead])
def get_accounts(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve accounts for the current user.
    """
    return AccountService.get_accounts(db=db, user_id=current_user.id)


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
    try:
        return AccountService.create_account(
            db=db, account_in=account_in, user_id=current_user.id
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/{account_id}", response_model=AccountReadWithDetails)
def get_account(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    account_id: uuid.UUID,
) -> Any:
    """
    Get account by ID with details including transaction count and last transaction date.
    """
    account_with_details = AccountService.get_account(
        db=db, account_id=account_id, user_id=current_user.id
    )
    
    if not account_with_details:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Account not found or permission denied"
        )
    
    return account_with_details


@router.patch("/{account_id}", response_model=AccountRead)
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
    try:
        updated_account = AccountService.update_account(
            db=db, account_id=account_id, account_update=account_in, user_id=current_user.id
        )
        
        if not updated_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Account not found or permission denied"
            )
            
        return updated_account
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete("/{account_id}", response_model=Message)
def delete_account(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    account_id: uuid.UUID,
) -> Message:
    """
    Delete an account.
    """
    success = AccountService.delete_account(
        db=db, account_id=account_id, user_id=current_user.id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Account not found or permission denied"
        )
    
    return Message(message="Account successfully deleted")

