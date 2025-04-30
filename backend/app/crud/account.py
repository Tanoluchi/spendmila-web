from typing import List, Optional, Dict, Any
import uuid
from sqlmodel import select, Session

from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate


def get_account(db: Session, account_id: uuid.UUID) -> Optional[Account]:
    """Get a single account by ID"""
    return db.exec(select(Account).where(Account.id == account_id)).first()


def get_account_by_name(db: Session, user_id: uuid.UUID, name: str) -> Optional[Account]:
    """Get a single account by name for a specific user"""
    return db.exec(
        select(Account).where(Account.user_id == user_id, Account.name == name)
    ).first()


def get_accounts(
    db: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> List[Account]:
    """Get all accounts for a user with pagination"""
    return db.exec(
        select(Account)
        .where(Account.user_id == user_id)
        .offset(skip)
        .limit(limit)
    ).all()


def count_accounts(db: Session, user_id: uuid.UUID) -> int:
    """Count total accounts for a user"""
    return db.exec(
        select(Account).where(Account.user_id == user_id)
    ).all().count()


def create_account(db: Session, account: AccountCreate, user_id: uuid.UUID) -> Account:
    """Create a new account for a user"""
    db_account = Account.model_validate(account.model_dump())
    db_account.user_id = user_id
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


def update_account(
    db: Session, account_id: uuid.UUID, account_update: AccountUpdate
) -> Optional[Account]:
    """Update an existing account"""
    db_account = get_account(db, account_id)
    if not db_account:
        return None
    
    account_data = account_update.model_dump(exclude_unset=True)
    for key, value in account_data.items():
        setattr(db_account, key, value)
    
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


def delete_account(db: Session, account_id: uuid.UUID) -> bool:
    """Delete an account"""
    db_account = get_account(db, account_id)
    if not db_account:
        return False
    
    db.delete(db_account)
    db.commit()
    return True


def get_account_with_details(
    db: Session, account_id: uuid.UUID
) -> Optional[Dict[str, Any]]:
    """Get account with related details (user, currency)"""
    db_account = get_account(db, account_id)
    if not db_account:
        return None
    
    account_dict = db_account.model_dump()
    
    # Add user details
    if db_account.user:
        account_dict["user"] = {
            "id": db_account.user.id,
            "email": db_account.user.email,
            "full_name": db_account.user.full_name,
        }
    
    # Add currency details
    if db_account.currency:
        account_dict["currency"] = {
            "id": db_account.currency.id,
            "code": db_account.currency.code,
            "name": db_account.currency.name,
            "symbol": db_account.currency.symbol,
        }
    
    return account_dict
