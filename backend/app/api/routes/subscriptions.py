import uuid
from typing import Any, Sequence

from fastapi import APIRouter, Depends, HTTPException

from app.crud import subscription as crud_subscription
from app.api.deps import SessionDep, CurrentUser
from app.models.subscription import Subscription
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionRead,
    SubscriptionUpdate,
)
from app.schemas.user import Message

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.post("/", response_model=SubscriptionRead)
def create_subscription(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    subscription_in: SubscriptionCreate,
) -> Subscription:
    """
    Create a new subscription for the current user.
    """
    subscription = crud_subscription.create_subscription(
        session=session, subscription_in=subscription_in, user_id=current_user.id
    )
    return subscription


@router.get("/", response_model=Sequence[SubscriptionRead])
def read_subscriptions(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve subscriptions for the current user.
    """
    subscriptions = crud_subscription.get_subscriptions_by_user(
        session=session, user_id=current_user.id, skip=skip, limit=limit
    )
    return subscriptions


@router.get("/{subscription_id}", response_model=SubscriptionRead)
def read_subscription_by_id(
    session: SessionDep, current_user: CurrentUser, subscription_id: uuid.UUID
) -> Any:
    """
    Get a specific subscription by ID for the current user.
    """
    subscription = crud_subscription.get_subscription(
        session=session, subscription_id=subscription_id, user_id=current_user.id
    )
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return subscription


@router.patch("/{subscription_id}", response_model=SubscriptionRead)
def update_subscription(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    subscription_id: uuid.UUID,
    subscription_in: SubscriptionUpdate,
) -> Any:
    """
    Update a subscription for the current user.
    Can be used to activate/deactivate, change amount, next payment date, etc.
    """
    db_subscription = crud_subscription.get_subscription(
        session=session, subscription_id=subscription_id, user_id=current_user.id
    )
    if not db_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")

    updated_subscription = crud_subscription.update_subscription(
        session=session, db_subscription=db_subscription, subscription_in=subscription_in
    )
    return updated_subscription


@router.delete("/{subscription_id}", response_model=Message)
def delete_subscription(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    subscription_id: uuid.UUID,
) -> Message:
    """
    Delete a subscription for the current user.
    """
    db_subscription = crud_subscription.get_subscription(
        session=session, subscription_id=subscription_id, user_id=current_user.id
    )
    if not db_subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")

    crud_subscription.delete_subscription(session=session, db_subscription=db_subscription)
    return Message(message="Subscription deleted successfully") 