from sqlmodel import SQLModel

# First import enums as they have no dependencies
from .enums import (
    CategoryType,
    CurrencyCode,
    PaymentMethodType,
    SubscriptionFrequency,
    SubscriptionType,
    FinancialGoalStatus,
    FinancialGoalType,
    DebtStatus,
    DebtType,
    SubscriptionStatus,
    TransactionType,
)

# Import base models (these should not have schemas imported)
from .currency import Currency
from .user import User
from .category import Category
from .payment_method import PaymentMethod
from .transaction import Transaction
from .financial_goal import FinancialGoal
from .subscription import Subscription
from .debt import Debt
from .account import Account
from .budget import Budget

# Rebuild the base models
Currency.model_rebuild()
User.model_rebuild()
Category.model_rebuild()
PaymentMethod.model_rebuild()
Transaction.model_rebuild()
FinancialGoal.model_rebuild()
Subscription.model_rebuild()
Debt.model_rebuild()
Account.model_rebuild()
Budget.model_rebuild()

# Export commonly used models and types
__all__ = [
    # SQLModel base
    "SQLModel",
    
    # Enums
    "CategoryType",
    "CurrencyCode",
    "PaymentMethodType",
    "SubscriptionFrequency",
    "SubscriptionType",
    "FinancialGoalStatus",
    "FinancialGoalType",
    "DebtStatus",
    "DebtType",
    "SubscriptionStatus",
    "TransactionType",
    
    # Database Models
    "Currency",
    "User",
    "Category",
    "PaymentMethod",
    "Transaction",
    "FinancialGoal",
    "Subscription",
    "Debt",
    "Account",
    "Budget",
] 