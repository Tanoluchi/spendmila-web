import uuid
import datetime
from typing import TYPE_CHECKING, Optional, ForwardRef, List

from sqlmodel import Field, Relationship, SQLModel
from pydantic import ConfigDict

from .enums import FinancialGoalStatus, FinancialGoalType

if TYPE_CHECKING:
    from .user import User
    from .currency import Currency
    from .transaction import Transaction

# Forward references for runtime
User = ForwardRef("User")
Currency = ForwardRef("Currency")
Transaction = ForwardRef("Transaction")


class FinancialGoalBase(SQLModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    name: str = Field(index=True, max_length=150)
    target_amount: float = Field(gt=0)
    current_amount: float = Field(default=0, ge=0)
    deadline: Optional[datetime.date] = Field(default=None, index=True)
    status: FinancialGoalStatus = Field(default=FinancialGoalStatus.ACTIVE, index=True)
    goal_type: FinancialGoalType = Field(default=FinancialGoalType.SAVINGS, index=True)
    description: Optional[str] = Field(default=None, max_length=255)
    icon: Optional[str] = Field(default=None, max_length=255)  # Icon for the goal
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)

    # Foreign Keys
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)


class FinancialGoal(FinancialGoalBase, table=True):
    __tablename__ = "financial_goal"
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False
    )

    # Relationships
    user: User = Relationship(back_populates="financial_goals")
    transactions: List["Transaction"] = Relationship(back_populates="financial_goal")


# Update forward references at the end of the file
FinancialGoal.model_rebuild()