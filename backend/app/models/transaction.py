import uuid
import datetime
from typing import TYPE_CHECKING, ClassVar, List, Optional, Union, Any, ForwardRef, Dict

from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel, Column, String
from sqlalchemy.orm import relationship, RelationshipProperty

if TYPE_CHECKING:
    from .user import User, UserRead
    from .category import Category, CategoryRead
    from .payment_method import PaymentMethod, PaymentMethodRead
    from .currency import Currency, CurrencyRead

# Forward references for runtime
User = ForwardRef("User")
UserRead = ForwardRef("UserRead")
Category = ForwardRef("Category")
CategoryRead = ForwardRef("CategoryRead")
PaymentMethod = ForwardRef("PaymentMethod")
PaymentMethodRead = ForwardRef("PaymentMethodRead")
Currency = ForwardRef("Currency")
CurrencyRead = ForwardRef("CurrencyRead")

# Use a type alias for clarity if needed elsewhere, though SQLModel handles the union well
# TransactionType = Literal["income", "expense"]

class TransactionBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    date: datetime.date = Field(index=True)
    amount: float = Field(gt=0) # Ensure amount is positive
    description: Optional[str] = Field(default=None, max_length=255)

    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    category_id: uuid.UUID = Field(foreign_key="category.id", index=True)
    payment_method_id: Optional[uuid.UUID] = Field(default=None, foreign_key="payment_method.id", index=True)
    currency_id: uuid.UUID = Field(foreign_key="currency.id", index=True)

    # For Single Table Inheritance (STI)
    transaction_type: str = Field(sa_column=Column(String(50), index=True))

# Main Transaction model representing the table
# We use __mapper_args__ for STI
class Transaction(TransactionBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Define discriminator for STI
    __mapper_args__ = {
        "polymorphic_on": "transaction_type",
        "polymorphic_identity": "transaction"
    }

    # Use SQLAlchemy relationships with type annotations
    user: ClassVar[RelationshipProperty] = relationship("User", back_populates="transactions")
    category: ClassVar[RelationshipProperty] = relationship("Category", back_populates="transactions")
    payment_method: ClassVar[RelationshipProperty] = relationship("PaymentMethod", back_populates="transactions")
    currency: ClassVar[RelationshipProperty] = relationship("Currency", back_populates="transactions")

# Specific model for Income
class Income(Transaction):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    __mapper_args__ = {
        "polymorphic_identity": "income"
    }

# Specific model for Expense
class Expense(Transaction):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    __mapper_args__ = {
        "polymorphic_identity": "expense"
    }
    installments: bool = Field(default=False)
    installment_count: Optional[int] = Field(default=None)

# Intermediate models for related entities to avoid circular references
class UserBase(SQLModel):
    id: uuid.UUID
    email: str
    full_name: str

class CategoryBase(SQLModel):
    id: uuid.UUID
    name: str
    type: str

class PaymentMethodBase(SQLModel):
    id: uuid.UUID
    name: str
    type: Optional[str] = None

class CurrencyBase(SQLModel):
    id: uuid.UUID
    code: str
    name: str

# Base schema for reading, includes relationships
class TransactionRead(TransactionBase):
    id: uuid.UUID
    transaction_type: str

# Schema including relational data for richer API responses
class TransactionReadWithDetails(TransactionRead):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    user: Optional[Dict[str, Any]] = None
    category: Optional[Dict[str, Any]] = None
    payment_method: Optional[Dict[str, Any]] = None
    currency: Optional[Dict[str, Any]] = None

# Specific Read schemas can include specific fields if they differed more
class IncomeRead(TransactionReadWithDetails):
    # If Income had specific fields not in TransactionBase, add them here
    pass

class ExpenseRead(TransactionReadWithDetails):
    installments: bool
    installment_count: Optional[int] = None

# Schema for creating Transactions (base, common fields)
class TransactionCreateBase(TransactionBase):
    # Remove user_id if it's set automatically based on logged-in user
    # Keep category_id, payment_method_id, currency_id as they need to be specified
    pass

class IncomeCreate(TransactionCreateBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    # user_id will be set by the endpoint/service based on current user
    transaction_type: str = Field(default="income", const=True)  # Use const=True instead of frozen

class ExpenseCreate(TransactionCreateBase):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    # user_id will be set by the endpoint/service based on current user
    transaction_type: str = Field(default="expense", const=True)  # Use const=True instead of frozen
    installments: bool = Field(default=False)
    installment_count: Optional[int] = Field(default=None)

# Schema for updating (base, common fields)
class TransactionUpdateBase(SQLModel):
    date: datetime.date | None = None
    amount: float | None = None
    description: str | None = None
    category_id: uuid.UUID | None = None
    payment_method_id: uuid.UUID | None = None # Allow changing PM
    currency_id: uuid.UUID | None = None # Allow changing currency? Maybe not typical.
    # transaction_type should generally not be updated

class IncomeUpdate(TransactionUpdateBase):
   pass # No specific fields to update beyond base

class ExpenseUpdate(TransactionUpdateBase):
    installments: bool | None = None
    installment_count: int | None = None

# Update forward references at the end of the file
Transaction.model_rebuild()
TransactionRead.model_rebuild()
TransactionReadWithDetails.model_rebuild()
IncomeRead.model_rebuild()
ExpenseRead.model_rebuild() 