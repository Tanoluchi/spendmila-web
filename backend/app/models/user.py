import uuid
from typing import TYPE_CHECKING, List, Optional, ForwardRef

from pydantic import EmailStr, ConfigDict
from sqlmodel import Field, Relationship, SQLModel

from .enums import SubscriptionType

# Cyclic imports
if TYPE_CHECKING:
    from .currency import Currency, CurrencyRead
    from .transaction import Transaction, TransactionRead
    from .financial_goal import FinancialGoal, FinancialGoalRead
    from .subscription import Subscription, SubscriptionRead
    from .debt import Debt, DebtRead
    from .item import Item, ItemRead

# Forward references for runtime
Currency = ForwardRef("Currency")
CurrencyRead = ForwardRef("CurrencyRead")
Transaction = ForwardRef("Transaction")
TransactionRead = ForwardRef("TransactionRead")
FinancialGoal = ForwardRef("FinancialGoal")
FinancialGoalRead = ForwardRef("FinancialGoalRead")
Subscription = ForwardRef("Subscription")
SubscriptionRead = ForwardRef("SubscriptionRead")
Debt = ForwardRef("Debt")
DebtRead = ForwardRef("DebtRead")
Item = ForwardRef("Item")
ItemRead = ForwardRef("ItemRead")

# Base model with shared properties
class UserBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    full_name: Optional[str] = Field(default=None, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    subscription_type: SubscriptionType = Field(default=SubscriptionType.FREE)
    # Foreign key for default currency
    default_currency_id: Optional[uuid.UUID] = Field(default=None, foreign_key="currency.id")


# Properties to return via API
class UserRead(UserBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID
    default_currency: Optional[dict] = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    password: str = Field(min_length=8, max_length=40)


# Properties to receive via API on registration
class UserRegister(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: Optional[str] = Field(default=None, max_length=255)


# Properties to receive via API on update
class UserUpdate(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)
    full_name: Optional[str] = Field(default=None, max_length=255)
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    default_currency_id: Optional[uuid.UUID] = None


class UserUpdateMe(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    full_name: Optional[str] = Field(default=None, max_length=255)
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)
    default_currency_id: Optional[uuid.UUID] = None


class UpdatePassword(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Main database model
class User(UserBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )
    hashed_password: str = Field(nullable=False)

    # Relationships
    default_currency: Optional[Currency] = Relationship(back_populates="users")
    transactions: List[Transaction] = Relationship(back_populates="user")
    financial_goals: List[FinancialGoal] = Relationship(back_populates="user")
    subscriptions: List[Subscription] = Relationship(back_populates="user")
    debts: List[Debt] = Relationship(back_populates="user")
    items: List[Item] = Relationship(back_populates="owner")


# Simplified public representation
class UserPublic(UserBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    id: uuid.UUID


# Schema for returning lists of users
class UsersPublic(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    data: list[UserPublic]
    count: int


# Extended UserRead with details
class UserReadWithDetails(UserRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    transactions: List[dict] = []
    financial_goals: List[dict] = []
    subscriptions: List[dict] = []
    debts: List[dict] = []


# Other schemas
class Message(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    message: str


class Token(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    sub: Optional[str] = None


class NewPassword(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# Update forward references at the end of the file
User.model_rebuild()
UserRead.model_rebuild()
UserCreate.model_rebuild()
UserRegister.model_rebuild()
UserUpdate.model_rebuild()
UserUpdateMe.model_rebuild()
UserPublic.model_rebuild()
UsersPublic.model_rebuild()
UserReadWithDetails.model_rebuild()
Message.model_rebuild()
Token.model_rebuild()
TokenPayload.model_rebuild()
NewPassword.model_rebuild()