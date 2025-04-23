from typing import Optional, List
import uuid

from pydantic import ConfigDict
from sqlmodel import Field, SQLModel


class CurrencyBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    code: str = Field(max_length=3)
    name: str = Field(max_length=255)
    symbol: str = Field(max_length=10)
    is_active: bool = True


class CurrencyRead(CurrencyBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class CurrencyCreate(CurrencyBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    pass


class CurrencyUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    code: Optional[str] = Field(default=None, max_length=3)
    name: Optional[str] = Field(default=None, max_length=255)
    symbol: Optional[str] = Field(default=None, max_length=10)
    is_active: Optional[bool] = None


class CurrencyPublic(CurrencyBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class CurrenciesPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[CurrencyPublic]
    count: int


class CurrencyReadWithDetails(CurrencyRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    users: List[dict] = []
    transactions: List[dict] = []
    financial_goals: List[dict] = []
    debts: List[dict] = []
    subscriptions: List[dict] = [] 