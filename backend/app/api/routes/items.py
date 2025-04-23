import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.crud import item
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemRead, ItemsPublic, ItemUpdate
from app.schemas.user import Message

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=ItemsPublic)
def read_items(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve items.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Item)
        count = session.exec(count_statement).one()
        statement = select(Item).offset(skip).limit(limit)
        items = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Item)
            .where(Item.owner_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Item)
            .where(Item.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        items = session.exec(statement).all()

    return ItemsPublic(data=items, count=count)


@router.get("/{id}", response_model=ItemRead)
def read_item(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get item by ID.
    """
    db_item = item.get_item(session=session, item_id=id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (db_item.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return db_item


@router.post("/", response_model=ItemRead)
def create_item(
    *, session: SessionDep, current_user: CurrentUser, item_in: ItemCreate
) -> Any:
    """
    Create new item.
    """
    db_item = item.create_item(session=session, item_in=item_in, owner_id=current_user.id)
    return db_item


@router.put("/{id}", response_model=ItemRead)
def update_item(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    item_in: ItemUpdate,
) -> Any:
    """
    Update an item.
    """
    db_item = item.get_item(session=session, item_id=id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (db_item.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    db_item = item.update_item(session=session, db_item=db_item, item_in=item_in)
    return db_item


@router.delete("/{id}")
def delete_item(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete an item.
    """
    db_item = item.get_item(session=session, item_id=id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    if not current_user.is_superuser and (db_item.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    item.delete_item(session=session, db_item=db_item)
    return Message(message="Item deleted successfully")
