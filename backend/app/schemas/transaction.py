from typing import Optional, List
import datetime
import uuid

from pydantic import ConfigDict, Field
from sqlmodel import SQLModel

from app.models.enums import TransactionType
from app.schemas.category import CategoryRead
from app.schemas.currency import CurrencyRead
from app.schemas.payment_method import PaymentMethodRead
from app.schemas.subscription import SubscriptionRead
from app.schemas.financial_goal import FinancialGoalRead
from app.schemas.debt import DebtRead
from app.schemas.account import AccountRead


class TransactionBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    description: str = Field(max_length=255)
    amount: float = Field(gt=0)
    transaction_type: TransactionType
    date: datetime.date
    is_active: bool = True


class TransactionRead(TransactionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    user_id: uuid.UUID
    currency: Optional[CurrencyRead] = None
    category: Optional[CategoryRead] = None
    payment_method: Optional[PaymentMethodRead] = None
    subscription: Optional[SubscriptionRead] = None
    financial_goal: Optional[FinancialGoalRead] = None
    debt: Optional[DebtRead] = None
    account: Optional[AccountRead] = None


class TransactionCreate(TransactionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    currency_id: uuid.UUID
    category_id: Optional[uuid.UUID] = None
    payment_method_id: Optional[uuid.UUID] = None
    subscription_id: Optional[uuid.UUID] = None
    financial_goal_id: Optional[uuid.UUID] = None
    debt_id: Optional[uuid.UUID] = None
    account_id: Optional[uuid.UUID] = None


class TransactionUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    description: Optional[str] = Field(default=None, max_length=255)
    amount: Optional[float] = Field(default=None, gt=0)
    transaction_type: Optional[TransactionType] = None
    date: Optional[datetime.date] = None
    is_active: Optional[bool] = None
    currency_id: Optional[uuid.UUID] = None
    category_id: Optional[uuid.UUID] = None
    payment_method_id: Optional[uuid.UUID] = None
    subscription_id: Optional[uuid.UUID] = None
    financial_goal_id: Optional[uuid.UUID] = None
    debt_id: Optional[uuid.UUID] = None
    account_id: Optional[uuid.UUID] = None


class TransactionPublic(TransactionBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    currency: Optional[CurrencyRead] = None
    category: Optional[CategoryRead] = None
    payment_method: Optional[PaymentMethodRead] = None
    subscription: Optional[SubscriptionRead] = None
    financial_goal: Optional[FinancialGoalRead] = None
    debt: Optional[DebtRead] = None
    account: Optional[AccountRead] = None


class TransactionsPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[TransactionPublic]


class TransactionReadWithDetails(TransactionRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)


class PaginatedTransactionResponse(SQLModel):
    """Response model for paginated transactions"""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    items: List[TransactionReadWithDetails]
    total: int
    page: int
    page_size: int
    total_pages: int