import uuid
from typing import Sequence

from sqlmodel import Session, select

from app.models.category import Category, CategoryCreate, CategoryUpdate
# Optional: Import CategoryType for filtering
# from app.models.enums import CategoryType

def get_category(*, session: Session, category_id: uuid.UUID) -> Category | None:
    """Get a category by ID."""
    return session.get(Category, category_id)

def get_categories(
    *, session: Session, skip: int = 0, limit: int = 100
    # Optional: Add filter by type: type: CategoryType | None = None
) -> Sequence[Category]:
    """Get multiple categories, optionally filtered."""
    statement = select(Category).offset(skip).limit(limit)
    # if type:
    #     statement = statement.where(Category.type == type)
    return session.exec(statement).all()

def create_category(*, session: Session, category_in: CategoryCreate) -> Category:
    """Create a new category."""
    # Consider checking for duplicate names within the same type?
    db_category = Category.model_validate(category_in)
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    return db_category

def update_category(*, session: Session, db_category: Category, category_in: CategoryUpdate) -> Category:
    """Update an existing category."""
    category_data = category_in.model_dump(exclude_unset=True)
    db_category.sqlmodel_update(category_data)
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    return db_category

def delete_category(*, session: Session, db_category: Category) -> None:
    """Delete a category."""
    # Add checks: prevent deletion if used by transactions?
    session.delete(db_category)
    session.commit() 