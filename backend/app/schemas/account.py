from typing import Dict, Any, List, Optional
import uuid
import datetime
from pydantic import ConfigDict, BaseModel
from sqlmodel import SQLModel

from app.models.account import AccountBase


class AccountTypeResponse(BaseModel):
    """
    Esquema para respuestas de tipos de cuenta.
    Utilizado por el endpoint /api/v1/accounts/types.
    """
    name: str  # Nombre del tipo de cuenta (por ejemplo, CHECKING, SAVINGS)
    value: str  # Valor del tipo de cuenta en minúsculas (por ejemplo, checking, savings)


class AccountCreate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    # Campos requeridos
    name: str
    account_type: str
    currency_id: uuid.UUID
    
    # Campos opcionales
    institution: Optional[str] = None
    is_default: bool = False
    
    # El balance ahora se calcula automáticamente a partir de las transacciones


class AccountRead(AccountBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class AccountReadWithDetails(AccountRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    user: Optional[Dict[str, Any]] = None
    currency: Optional[Dict[str, Any]] = None
    transaction_count: Optional[int] = None
    created_at: Optional[datetime.datetime] = None
    last_transaction_date: Optional[datetime.datetime] = None


class AccountUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    name: Optional[str] = None
    account_type: Optional[str] = None
    institution: Optional[str] = None
    currency_id: Optional[uuid.UUID] = None
    # Balance removido, ahora se calcula automáticamente


class AccountsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[AccountRead]
