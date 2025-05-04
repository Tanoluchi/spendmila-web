from enum import Enum


class CategoryType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"


class PaymentMethodType(str, Enum):
    CASH = "cash"
    TRANSFER = "transfer"
    CARD = "card"
    OTHER = "other"


class SubscriptionFrequency(str, Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"
    QUARTERLY = "quarterly"

class CurrencyCode(str, Enum): #! Add more currencies
    USD = "USD"
    EUR = "EUR"
    ARS = "ARS"

class SubscriptionType(str, Enum):
    FREE = "free"
    BASIC = "basic"
    PRO = "pro"

class FinancialGoalStatus(str, Enum):
    """Status of a financial goal."""
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"
    IN_PROGRESS = "in_progress"


class FinancialGoalType(str, Enum):
    """Type of financial goal."""
    SAVINGS = "savings"
    INVESTMENT = "investment"
    DEBT_PAYMENT = "debt_payment"
    EMERGENCY_FUND = "emergency_fund"
    RETIREMENT = "retirement"
    EDUCATION = "education"
    TRAVEL = "travel"
    HOME = "home"
    OTHER = "other"


class DebtStatus(str, Enum):
    """Status of a debt."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    PAID = "paid"
    DEFAULTED = "defaulted"
    RENEGOTIATED = "renegotiated"


class DebtType(str, Enum):
    """Type of debt."""
    PERSONAL = "personal"
    CREDIT_CARD = "credit_card"
    MORTGAGE = "mortgage"
    AUTO = "auto"
    STUDENT = "student"
    BUSINESS = "business"
    MEDICAL = "medical"
    OTHER = "other"

class AccountType(str, Enum):
    """Type of account."""
    BANK = "bank"
    DIGITAL = "digital"
    CASH = "cash"
    CREDIT = "credit"
    INVESTMENT = "investment"
    SAVINGS = "savings"
    CHECKING = "checking"
    OTHER = "other"


class SubscriptionStatus(str, Enum):
    """Status of a subscription."""
    ACTIVE = "active"
    CANCELLED = "cancelled"
    PAUSED = "paused"
    EXPIRED = "expired"
    PENDING_RENEWAL = "pending_renewal"


class TransactionType(str, Enum):
    """Type of transaction."""
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"
