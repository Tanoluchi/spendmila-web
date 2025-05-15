from typing import Optional, List
import uuid

from pydantic import EmailStr, ConfigDict
from sqlmodel import Field, SQLModel

from app.models.enums import SubscriptionType
from app.schemas.currency import CurrencyRead
from app.schemas.transaction import TransactionRead
from app.schemas.financial_goal import FinancialGoalRead
from app.schemas.subscription import SubscriptionRead
from app.schemas.debt import DebtRead
from app.schemas.account import AccountRead


class UserBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    email: EmailStr = Field(max_length=255)
    first_name: str = Field(max_length=255)
    last_name: str = Field(max_length=255)
    profile_picture: Optional[str] = Field(default=None)
    is_active: bool = True
    is_superuser: bool = False
    subscription_type: SubscriptionType = Field(default=SubscriptionType.FREE)
    default_currency_id: uuid.UUID = Field(default=None)


class UserRead(UserBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    default_currency: CurrencyRead


class UserCreate(UserBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    first_name: str = Field(max_length=255)
    last_name: str = Field(max_length=255)


class UserUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    email: EmailStr = Field(max_length=255)
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)
    first_name: Optional[str] = Field(default=None, max_length=255)
    last_name: Optional[str] = Field(default=None, max_length=255)
    profile_picture: Optional[str] = Field(default=None)
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    default_currency_id: Optional[uuid.UUID] = None


class UserUpdateMe(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    email: EmailStr = Field(max_length=255)
    first_name: Optional[str] = Field(default=None, max_length=255)
    last_name: Optional[str] = Field(default=None, max_length=255)
    profile_picture: Optional[str] = Field(default=None)
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)
    default_currency_id: Optional[uuid.UUID] = None


class UserFinancialSummaryResponse(SQLModel):
    cumulative_income: float
    income_change_percentage: float
    cumulative_expenses: float
    expense_change_percentage: float
    currency_code: str


class UserPublic(UserBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


class UsersPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: List[UserPublic]
    count: int


class UserReadWithDetails(UserRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    transactions: List[TransactionRead] = []
    financial_goals: List[FinancialGoalRead] = []
    subscriptions: List[SubscriptionRead] = []
    debts: List[DebtRead] = []
    accounts: List[AccountRead] = []


class Message(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    message: str
    data: Optional[dict] = None


class Token(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    sub: Optional[str] = None


class UpdatePassword(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class NewPassword(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    token: str
    new_password: str = Field(min_length=8, max_length=40)