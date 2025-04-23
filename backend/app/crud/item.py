import uuid
from typing import Any

from sqlmodel import Session, select

from app.models.item import Item
from app.schemas.item import ItemCreate, ItemUpdate


def get_item(*, session: Session, item_id: uuid.UUID) -> Item | None:
    """Get an item by ID."""
    statement = select(Item).where(Item.id == item_id)
    db_item = session.exec(statement).first()
    return db_item

def get_items_by_owner(
    *, session: Session, owner_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> list[Item]:
    """Get all items for a specific owner."""
    statement = (
        select(Item)
        .where(Item.owner_id == owner_id)
        .offset(skip)
        .limit(limit)
    )
    items = session.exec(statement).all()
    return items


def create_item(*, session: Session, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
    """Create a new item associated with an owner."""
    # Prepare data, ensuring owner_id is included
    item_data = item_in.model_dump()
    item_data["owner_id"] = owner_id
    db_item = Item.model_validate(item_data)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


def update_item(*, session: Session, db_item: Item, item_in: ItemUpdate) -> Any:
    """Update an existing item."""
    item_data = item_in.model_dump(exclude_unset=True)
    db_item.sqlmodel_update(item_data)
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


def delete_item(*, session: Session, db_item: Item) -> None:
    """Delete an item."""
    session.delete(db_item)
    session.commit()
    # No refresh needed after delete 