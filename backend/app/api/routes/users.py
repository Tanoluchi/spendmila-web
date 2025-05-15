import uuid
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import col, delete, func, select

from app.crud import user as crud_user
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.models import User
from app.schemas.user import (
    Message,
    UpdatePassword,
    UserCreate,
    UserPublic,
    UserRegister,
    UsersPublic,
    UserUpdate,
    UserUpdateMe,
    UserFinancialSummaryResponse,
)
from app.utils import generate_new_account_email, send_email
from app.schemas.transaction import PaginatedTransactionResponse # Added
from app.crud import transaction as crud_transaction # Added
from app.models.enums import TransactionType # Added
from fastapi import Query # Added
import datetime # Add this
from app.crud import summary as crud_summary # Add this
from app.schemas.summary import UserExpenseSummaryResponse # Add this

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersPublic,
)
def read_users(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve users.
    """

    count_statement = select(func.count()).select_from(User)
    count = session.exec(count_statement).one()

    statement = select(User).offset(skip).limit(limit)
    users = session.exec(statement).all()

    return UsersPublic(data=users, count=count)


@router.post(
    "/", dependencies=[Depends(get_current_active_superuser)], response_model=UserPublic
)
def create_user(*, session: SessionDep, user_in: UserCreate) -> Any:
    """
    Create new user.
    """
    db_user = crud_user.get_user_by_email(session=session, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )

    db_user = crud_user.create_user(session=session, user_create=user_in)
    if settings.emails_enabled and user_in.email:
        email_data = generate_new_account_email(
            email_to=user_in.email, username=user_in.email, password=user_in.password
        )
        send_email(
            email_to=user_in.email,
            subject=email_data.subject,
            html_content=email_data.html_content,
        )
    return db_user


@router.patch("/me", response_model=UserPublic)
def update_user_me(
    *, session: SessionDep, user_in: UserUpdateMe, current_user: CurrentUser
) -> Any:
    """
    Update own user.
    """

    if user_in.email:
        existing_user = crud_user.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )
    user_data = user_in.model_dump(exclude_unset=True)
    current_user.sqlmodel_update(user_data)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


@router.patch("/me/password", response_model=Message)
def update_password_me(
    *, session: SessionDep, body: UpdatePassword, current_user: CurrentUser
) -> Any:
    """
    Update own password.
    """
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=400, detail="New password cannot be the same as the current one"
        )
    hashed_password = get_password_hash(body.new_password)
    current_user.hashed_password = hashed_password
    session.add(current_user)
    session.commit()
    return Message(message="Password updated successfully")


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    return current_user


@router.get("/me/summary", response_model=UserFinancialSummaryResponse)
def read_user_financial_summary(
    current_user: CurrentUser, session: SessionDep
) -> UserFinancialSummaryResponse:
    """
    Retrieve the financial summary for the current user.
    Includes cumulative income, expenses, and percentage changes.
    """
    summary_data_dict = crud_user.get_user_financial_summary(session=session, user=current_user)
    return UserFinancialSummaryResponse(**summary_data_dict)


@router.get("/me/transactions", response_model=PaginatedTransactionResponse)
async def read_user_transactions(
    current_user: CurrentUser,
    session: SessionDep,
    page: int = Query(1, ge=1, description="Page number, 1-indexed"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
    transaction_type: Optional[TransactionType] = Query(None, description="Filter by transaction type"),
    category_name: Optional[str] = Query(None, description="Filter by category name"),
    account_id: Optional[uuid.UUID] = Query(None, description="Filter by account ID")
) -> PaginatedTransactionResponse:
    """
    Retrieve paginated transactions for the current user.
    """
    transactions_data = crud_transaction.get_transactions_paginated(
        session=session, 
        user_id=current_user.id, 
        page=page, 
        page_size=page_size,
        transaction_type=transaction_type,
        category_name=category_name,
        account_id=account_id
    )
    return PaginatedTransactionResponse(**transactions_data)


@router.get("/me/expense-summary", response_model=UserExpenseSummaryResponse)
def read_user_expense_summary(
    current_user: CurrentUser,
    session: SessionDep,
    year: int = Query(None, description="Year for monthly summary. Defaults to current year."),
    days_for_daily: int = Query(7, ge=1, le=365, description="Number of past days for daily summary (e.g., 7 for weekly view).")
) -> UserExpenseSummaryResponse:
    """
    Retrieve an expense summary for the current user.
    Includes a monthly breakdown for the specified year and a daily breakdown for the specified number of past days.
    """
    current_datetime = datetime.datetime.now() # Use datetime.datetime for current year
    if year is None:
        year = current_datetime.year

    monthly_summary_data = crud_summary.get_monthly_expense_summary(
        db=session, user_id=current_user.id, year=year
    )

    # Use datetime.date for date calculations
    end_date_for_daily = datetime.date.today()
    start_date_for_daily = end_date_for_daily - datetime.timedelta(days=days_for_daily - 1)
    
    daily_summary_data = crud_summary.get_daily_expense_summary_for_period(
        db=session,
        user_id=current_user.id,
        start_date=start_date_for_daily,
        end_date=end_date_for_daily,
    )

    return UserExpenseSummaryResponse(
        monthly_summary=monthly_summary_data,
        daily_summary=daily_summary_data
    )


@router.delete("/me", response_model=Message)
def delete_user_me(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Delete own user.
    """
    if current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="Super users are not allowed to delete themselves"
        )
    session.delete(current_user)
    session.commit()
    return Message(message="User deleted successfully")


@router.post("/signup", response_model=UserPublic)
def register_user(session: SessionDep, user_in: UserRegister) -> Any:
    """
    Create new user without the need to be logged in.
    """
    db_user = crud_user.get_user_by_email(session=session, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    user_create = UserCreate.model_validate(user_in)
    db_user = crud_user.create_user(session=session, user_create=user_create)
    return db_user


@router.get("/{user_id}", response_model=UserPublic)
def read_user_by_id(
    user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get a specific user by id.
    """
    user = session.get(User, user_id)
    if user == current_user:
        return user
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges",
        )
    return user


@router.patch(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserPublic,
)
def update_user(
    *,
    session: SessionDep,
    user_id: uuid.UUID,
    user_in: UserUpdate,
) -> Any:
    """
    Update a user.
    """

    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    if user_in.email:
        existing_user = crud_user.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )

    db_user = crud_user.update_user(session=session, db_user=db_user, user_in=user_in)
    return db_user


@router.delete("/{user_id}", dependencies=[Depends(get_current_active_superuser)])
def delete_user(
    session: SessionDep, current_user: CurrentUser, user_id: uuid.UUID
) -> Message:
    """
    Delete a user.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user == current_user:
        raise HTTPException(
            status_code=403, detail="Super users are not allowed to delete themselves"
        )
    statement = delete(Item).where(col(Item.owner_id) == user_id)
    session.exec(statement)  # type: ignore
    session.delete(user)
    session.commit()
    return Message(message="User deleted successfully")
