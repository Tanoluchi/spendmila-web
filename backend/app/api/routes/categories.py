import uuid
from typing import Any, Sequence

from fastapi import APIRouter, Depends, HTTPException

from app.crud import category
from app.api.deps import SessionDep, CurrentUser, get_current_active_superuser
from app.models.category import Category
from app.schemas.category import (
    CategoryCreate,
    CategoryRead,
    CategoryUpdate,
)
from app.schemas.user import Message

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post(
    "/",
    response_model=CategoryRead,
    dependencies=[Depends(get_current_active_superuser)],
)
def create_category(
    *, session: SessionDep, category_in: CategoryCreate
) -> Category:
    """
    Create a new category. (Superuser only)
    """
    # Consider adding checks for duplicate names?
    return category.create_category(session=session, category_in=category_in)


@router.get("/", response_model=Sequence[CategoryRead])
def read_categories(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
    # Optional: Add query param for filtering by type (income/expense)
) -> Any:
    """
    Retrieve categories.
    (Requires authenticated user)
    """
    # Currently retrieves all. Add filtering if needed.
    cats = category.get_categories(session=session, skip=skip, limit=limit)
    return cats


@router.get("/{category_id}", response_model=CategoryRead)
def read_category_by_id(
    session: SessionDep, current_user: CurrentUser, category_id: uuid.UUID
) -> Any:
    """
    Get a specific category by ID.
    (Requires authenticated user)
    """
    db_cat = category.get_category(session=session, category_id=category_id)
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_cat


@router.patch(
    "/{category_id}",
    response_model=CategoryRead,
    dependencies=[Depends(get_current_active_superuser)],
)
def update_category(
    *,
    session: SessionDep,
    category_id: uuid.UUID,
    category_in: CategoryUpdate,
) -> Any:
    """
    Update a category. (Superuser only)
    """
    db_cat = category.get_category(session=session, category_id=category_id)
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")

    return category.update_category(
        session=session, db_category=db_cat, category_in=category_in
    )


@router.delete(
    "/{category_id}",
    response_model=Message,
    dependencies=[Depends(get_current_active_superuser)],
)
def delete_category(
    *,
    session: SessionDep,
    category_id: uuid.UUID,
) -> Message:
    """
    Delete a category. (Superuser only)
    """
    db_cat = category.get_category(session=session, category_id=category_id)
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")

    try:
        category.delete_category(session=session, db_category=db_cat)
        return Message(message="Category deleted successfully")
    except Exception as e:
        # Catch potential integrity errors if category is in use
        # Log the error e
        raise HTTPException(
            status_code=409, # Conflict
            detail="Cannot delete Category. It might be in use by transactions.",
        ) 