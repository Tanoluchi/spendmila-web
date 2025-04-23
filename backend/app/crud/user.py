import uuid
from typing import Any

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def create_user(*, session: Session, user_create: UserCreate) -> User:
    # Create a dictionary for model validation, excluding the plain password
    user_data = user_create.model_dump(exclude={"password"})
    hashed_password = get_password_hash(user_create.password)
    
    # Create the user instance directly
    db_obj = User(
        **user_data,
        hashed_password=hashed_password,
        transactions=[],
        financial_goals=[],
        subscriptions=[],
        debts=[],
        items=[]
    )
    
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    # Get the fields to update, excluding None values
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    # Handle password update separately
    if "password" in user_data and user_data["password"]:
        password = user_data.pop("password") # Remove plain password from update data
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password # Add hashed password to extra_data

    # Update the user model
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

# authenticate function remains largely the same
def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user

# Add other common user CRUD functions if needed:
# def get_user(session: Session, user_id: uuid.UUID) -> User | None: ...
# def get_users(session: Session, skip: int = 0, limit: int = 100) -> list[User]: ...
# def delete_user(session: Session, db_user: User) -> None: ... 