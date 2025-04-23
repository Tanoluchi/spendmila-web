import uuid
import datetime
from typing import TYPE_CHECKING, Optional, ForwardRef

from sqlmodel import Field, Relationship, SQLModel
from pydantic import ConfigDict

if TYPE_CHECKING:
    from .user import User
    from .currency import Currency

# Forward references for runtime
User = ForwardRef("User")
Currency = ForwardRef("Currency")


class FinancialGoalBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    name: str = Field(index=True, max_length=150)
    target_amount: float = Field(gt=0)
    current_amount: float = Field(default=0, ge=0)
    deadline: Optional[datetime.date] = Field(default=None, index=True)

    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    currency_id: uuid.UUID = Field(foreign_key="currency.id", index=True)


class FinancialGoal(FinancialGoalBase, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    user: User = Relationship(back_populates="financial_goals")
    currency: Currency = Relationship(back_populates="financial_goals")


# Update forward references at the end of the file
FinancialGoal.model_rebuild() 