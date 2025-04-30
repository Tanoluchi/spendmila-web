import uuid
from typing import Sequence

from sqlmodel import Session, select

from app.models.subscription import Subscription
from app.schemas.subscription import SubscriptionCreate, SubscriptionUpdate


def get_subscription(
    *, session: Session, subscription_id: uuid.UUID, user_id: uuid.UUID
) -> Subscription | None:
    """Get a subscription by ID, ensuring it belongs to the user."""
    statement = select(Subscription).where(
        Subscription.id == subscription_id, Subscription.user_id == user_id
    )
    return session.exec(statement).first()


def get_subscriptions_by_user(
    *, session: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> Sequence[Subscription]:
    """Get multiple subscriptions for a specific user."""
    statement = (
        select(Subscription)
        .where(Subscription.user_id == user_id)
        .offset(skip)
        .limit(limit)
    )
    return session.exec(statement).all()


def create_subscription(
    *, session: Session, subscription_in: SubscriptionCreate, user_id: uuid.UUID
) -> Subscription:
    """Create a new subscription for a user."""
    subscription_data = subscription_in.model_dump()
    subscription_data["user_id"] = user_id

    db_subscription = Subscription.model_validate(subscription_data)
    session.add(db_subscription)
    session.commit()
    session.refresh(db_subscription)
    return db_subscription


def update_subscription(
    *, session: Session, db_subscription: Subscription, subscription_in: SubscriptionUpdate
) -> Subscription:
    """Update an existing subscription."""
    update_data = subscription_in.model_dump(exclude_unset=True)
    db_subscription.sqlmodel_update(update_data)
    session.add(db_subscription)
    session.commit()
    session.refresh(db_subscription)
    return db_subscription


def delete_subscription(*, session: Session, db_subscription: Subscription) -> None:
    """Delete a subscription."""
    session.delete(db_subscription)
    session.commit() 