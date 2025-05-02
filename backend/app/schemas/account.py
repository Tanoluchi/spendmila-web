from typing import Dict, Any, List, Optional
import uuid
from pydantic import ConfigDict
from sqlmodel import SQLModel

from app.models.account import AccountBase


class AccountCreate(AccountBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    # user_id will be set based on logged-in user
    pass


class AccountRead(AccountBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class AccountReadWithDetails(AccountRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    user: Optional[Dict[str, Any]] = None
    currency: Optional[Dict[str, Any]] = None


class AccountUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    name: Optional[str] = None
    account_type: Optional[str] = None
    balance: Optional[float] = None
    institution: Optional[str] = None
    currency_id: Optional[uuid.UUID] = None


class AccountsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[AccountRead]
