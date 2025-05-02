import logging
import datetime
import uuid
from decimal import Decimal
from typing import Dict, List, Optional

from sqlmodel import Session, select

from app import crud
from app.core.config import settings
from app.core.db import engine
from app.models.enums import TransactionType, PaymentMethodType
from app.models.user import User
from app.models.debt import Debt
from app.models.financial_goal import FinancialGoal
from app.models.subscription import Subscription
from app.schemas.user import UserCreate
from app.schemas.currency import CurrencyCreate
from app.schemas.category import CategoryCreate
from app.schemas.payment_method import PaymentMethodCreate
from app.schemas.account import AccountCreate
from app.schemas.transaction import TransactionCreate
from app.schemas.debt import DebtCreate
from app.schemas.financial_goal import FinancialGoalCreate
from app.schemas.subscription import SubscriptionCreate
from app.crud import account as account_crud
from app.crud import transaction as transaction_crud
from app.crud import payment_method as payment_method_crud
from app.crud import debt as debt_crud
from app.crud import financial_goal as financial_goal_crud
from app.crud import subscription as subscription_crud

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Store created IDs for reference when creating related entities
created_ids = {
    "users": {},
    "currencies": {},
    "categories": {},
    "payment_methods": {},
    "accounts": {},
    "debts": {},
    "financial_goals": {},
    "subscriptions": {},
}


def is_development_environment() -> bool:
    """Check if the application is running in a development environment."""
    return settings.ENVIRONMENT.lower() in ["local", "staging"]


def clear_existing_data(session: Session) -> None:
    """Clear existing data using CRUD functions."""
    logger.info("Clearing existing data...")
    
    # Get all users except the superuser
    statement = select(User).where(User.email != settings.FIRST_SUPERUSER)
    users = session.exec(statement).all()
    
    for user in users:
        logger.info(f"Deleting data for user: {user.email}")
        
        # Delete transactions
        transactions = transaction_crud.get_transactions(session=session, user_id=user.id, limit=1000)
        for transaction in transactions:
            transaction_crud.delete_transaction(session=session, db_transaction=transaction)
        
        # Delete accounts
        accounts = account_crud.get_accounts(db=session, user_id=user.id, limit=1000)
        for account in accounts:
            account_crud.delete_account(db=session, account_id=account.id)
        
        # Delete debts
        statement = select(Debt).where(Debt.user_id == user.id)
        debts = session.exec(statement).all()
        for debt in debts:
            session.delete(debt)
        
        # Delete financial goals
        statement = select(FinancialGoal).where(FinancialGoal.user_id == user.id)
        goals = session.exec(statement).all()
        for goal in goals:
            session.delete(goal)
        
        # Delete subscriptions
        statement = select(Subscription).where(Subscription.user_id == user.id)
        subscriptions = session.exec(statement).all()
        for subscription in subscriptions:
            session.delete(subscription)
    
    # Commit all deletions
    session.commit()
    logger.info("Existing data cleared successfully")


def create_test_currencies(session: Session) -> None:
    """Create test currencies."""
    logger.info("Creating test currencies...")
    
    currencies = [
        {"code": "USD", "name": "US Dollar", "symbol": "$"},
        {"code": "EUR", "name": "Euro", "symbol": "€"},
        {"code": "ARS", "name": "Argentine Peso", "symbol": "$"},
    ]
    
    for currency_data in currencies:
        # Check if currency already exists
        existing = crud.get_currency_by_code(session=session, code=currency_data["code"])
        if existing:
            created_ids["currencies"][currency_data["code"]] = existing.id
            continue
            
        currency = CurrencyCreate(**currency_data)
        db_currency = crud.create_currency(session=session, currency_in=currency)
        created_ids["currencies"][currency_data["code"]] = db_currency.id
        
    logger.info(f"Created {len(currencies)} currencies")


def create_test_categories(session: Session) -> None:
    """Create test categories."""
    logger.info("Creating test categories...")
    
    categories = [
        {"name": "Housing", "description": "Rent, mortgage, repairs", "color": "#4A90E2", "category_type": "expense"},
        {"name": "Transportation", "description": "Car, public transit, ride sharing", "color": "#50E3C2", "category_type": "expense"},
        {"name": "Food", "description": "Groceries, restaurants", "color": "#F5A623", "category_type": "expense"},
        {"name": "Utilities", "description": "Electricity, water, internet", "color": "#D0021B", "category_type": "expense"},
        {"name": "Entertainment", "description": "Movies, games, hobbies", "color": "#9013FE", "category_type": "expense"},
        {"name": "Healthcare", "description": "Doctor visits, medications", "color": "#7ED321", "category_type": "expense"},
        {"name": "Personal", "description": "Clothing, haircuts", "color": "#BD10E0", "category_type": "expense"},
        {"name": "Education", "description": "Tuition, books, courses", "color": "#4A4A4A", "category_type": "expense"},
        {"name": "Savings", "description": "Emergency fund, investments", "color": "#417505", "category_type": "expense"},
        {"name": "Income", "description": "Salary, freelance, gifts", "color": "#8B572A", "category_type": "income"},
    ]
    
    for category_data in categories:
        category = CategoryCreate(**category_data)
        db_category = crud.create_category(session=session, category_in=category)
        created_ids["categories"][category_data["name"]] = db_category.id
        
    logger.info(f"Created {len(categories)} categories")


def create_test_users(session: Session) -> None:
    """Create test users."""
    logger.info("Creating test users...")
    
    users = [
        {"email": "john.doe@example.com", "password": "password123", "full_name": "John Doe"},
        {"email": "jane.smith@example.com", "password": "password123", "full_name": "Jane Smith"},
    ]
    
    for user_data in users:
        # Check if user already exists
        existing = crud.get_user_by_email(session=session, email=user_data["email"])
        if existing:
            created_ids["users"][user_data["email"]] = existing.id
            continue
            
        user = UserCreate(**user_data)
        db_user = crud.create_user(session=session, user_create=user)
        created_ids["users"][user_data["email"]] = db_user.id
        
    logger.info(f"Created {len(users)} users")


def create_test_payment_methods(session: Session) -> None:
    """Create test payment methods."""
    logger.info("Creating test payment methods...")
    
    payment_methods = [
        {"name": "Credit Card", "description": "Visa, Mastercard, etc.", "payment_method_type": PaymentMethodType.CARD},
        {"name": "Debit Card", "description": "Direct from bank account", "payment_method_type": PaymentMethodType.CARD},
        {"name": "Cash", "description": "Physical currency", "payment_method_type": PaymentMethodType.CASH},
        {"name": "Bank Transfer", "description": "ACH, wire transfer", "payment_method_type": PaymentMethodType.TRANSFER},
        {"name": "Digital Wallet", "description": "PayPal, Venmo, etc.", "payment_method_type": PaymentMethodType.OTHER},
    ]
    
    for method_data in payment_methods:
        # Create payment method schema
        payment_method = PaymentMethodCreate(**method_data)
        
        # Create payment method for each user
        for email, user_id in created_ids["users"].items():
            db_payment_method = payment_method_crud.create_payment_method(
                session=session, 
                payment_method_in=payment_method,
                user_id=user_id
            )
            
            # Store with composite key for reference
            key = f"{email}:{method_data['name']}"
            created_ids["payment_methods"][key] = db_payment_method.id
        
    logger.info(f"Created payment methods for {len(created_ids['users'])} users")


def create_test_accounts(session: Session) -> None:
    """Create test accounts."""
    logger.info("Creating test accounts...")
    
    accounts = [
        {"name": "Checking Account", "description": "Primary checking", "balance": 2500.00, "currency_code": "USD", "type": "bank"},
        {"name": "Savings Account", "description": "Emergency fund", "balance": 10000.00, "currency_code": "USD", "type": "bank"},
        {"name": "Investment Account", "description": "Stocks and bonds", "balance": 15000.00, "currency_code": "USD", "type": "other"},
        {"name": "Euro Account", "description": "Euro savings", "balance": 5000.00, "currency_code": "EUR", "type": "bank"},
    ]
    
    for account_data in accounts:
        currency_code = account_data.pop("currency_code")
        currency_id = created_ids["currencies"][currency_code]
        
        # Create account for each user
        for email, user_id in created_ids["users"].items():
            account = AccountCreate(
                **account_data,
                currency_id=currency_id,
                user_id=user_id
            )
            
            db_account = account_crud.create_account(
                db=session, 
                account=account,
                user_id=user_id
            )
            
            # Store with composite key for reference
            key = f"{email}:{account_data['name']}"
            created_ids["accounts"][key] = db_account.id
        
    logger.info(f"Created accounts for {len(created_ids['users'])} users")


def create_test_debts(session: Session) -> None:
    """Create test debts."""
    logger.info("Creating test debts...")
    
    debts = [
        {
            "name": "Car Loan", 
            "description": "Auto loan for Honda", 
            "total_amount": 15000.00,
            "remaining_amount": 10000.00,
            "interest_rate": 4.5,
            "due_date": datetime.date.today().replace(day=15),
            "currency_code": "USD",
            "type": "auto",
            "status": "in_progress",
            "installment_count": 36,
            # Campos adicionales requeridos por el modelo Debt
            "creditor_name": "Auto Finance Bank",
            "amount": 15000.00,
            "is_active": True
        },
        {
            "name": "Student Loan", 
            "description": "Federal student loan", 
            "total_amount": 25000.00,
            "remaining_amount": 18000.00,
            "interest_rate": 5.0,
            "due_date": datetime.date.today().replace(day=1),
            "currency_code": "USD",
            "type": "student",
            "status": "in_progress",
            "installment_count": 60,
            # Campos adicionales requeridos por el modelo Debt
            "creditor_name": "Federal Student Aid",
            "amount": 25000.00,
            "is_active": True
        },
    ]
    
    for debt_data in debts:
        currency_code = debt_data.pop("currency_code")
        currency_id = created_ids["currencies"][currency_code]
        
        # Create debt for each user
        for email, user_id in created_ids["users"].items():
            # Get an account for this user
            account_key = f"{email}:Checking Account"
            account_id = created_ids["accounts"].get(account_key)
            
            debt = DebtCreate(
                **debt_data,
                currency_id=currency_id,
                account_id=account_id
            )
            
            db_debt = debt_crud.create_debt(
                session=session, 
                debt_in=debt,
                user_id=user_id
            )
            
            # Store with composite key for reference
            key = f"{email}:{debt_data['name']}"
            created_ids["debts"][key] = db_debt.id
        
    logger.info(f"Created debts for {len(created_ids['users'])} users")


def create_test_financial_goals(session: Session) -> None:
    """Create test financial goals."""
    logger.info("Creating test financial goals...")
    
    goals = [
        {
            "name": "Vacation Fund", 
            "description": "Trip to Hawaii", 
            "target_amount": 5000.00,
            "current_amount": 2000.00,
            "target_date": datetime.date.today() + datetime.timedelta(days=180),
            "currency_code": "USD"
        },
        {
            "name": "Home Down Payment", 
            "description": "20% down payment for house", 
            "target_amount": 50000.00,
            "current_amount": 15000.00,
            "target_date": datetime.date.today() + datetime.timedelta(days=730),
            "currency_code": "USD"
        },
    ]
    
    for goal_data in goals:
        currency_code = goal_data.pop("currency_code")
        currency_id = created_ids["currencies"][currency_code]
        
        # Create goal for each user
        for email, user_id in created_ids["users"].items():
            goal = FinancialGoalCreate(
                **goal_data,
                currency_id=currency_id
            )
            
            db_goal = financial_goal_crud.create_financial_goal(
                session=session, 
                goal_in=goal,
                user_id=user_id
            )
            
            # Store with composite key for reference
            key = f"{email}:{goal_data['name']}"
            created_ids["financial_goals"][key] = db_goal.id
        
    logger.info(f"Created financial goals for {len(created_ids['users'])} users")


def create_test_subscriptions(session: Session) -> None:
    """Create test subscriptions."""
    logger.info("Creating test subscriptions...")
    
    subscriptions = [
        {
            "name": "Netflix", 
            "service_name": "Netflix",
            "description": "Streaming service", 
            "amount": 15.99,
            "frequency": "monthly",
            "next_payment_date": datetime.date.today() + datetime.timedelta(days=15),
            "currency_code": "USD"
        },
        {
            "name": "Gym Membership", 
            "service_name": "Local Gym",
            "description": "Local fitness center", 
            "amount": 50.00,
            "frequency": "monthly",
            "next_payment_date": datetime.date.today() + datetime.timedelta(days=7),
            "currency_code": "USD"
        },
        {
            "name": "Amazon Prime", 
            "service_name": "Amazon Prime",
            "description": "Annual subscription", 
            "amount": 119.00,
            "frequency": "yearly",
            "next_payment_date": datetime.date.today() + datetime.timedelta(days=90),
            "currency_code": "USD"
        },
    ]
    
    for sub_data in subscriptions:
        currency_code = sub_data.pop("currency_code")
        currency_id = created_ids["currencies"][currency_code]
        
        # Create subscription for each user
        for email, user_id in created_ids["users"].items():
            subscription = SubscriptionCreate(
                **sub_data,
                currency_id=currency_id
            )
            
            db_subscription = subscription_crud.create_subscription(
                session=session, 
                subscription_in=subscription,
                user_id=user_id
            )
            
            # Store with composite key for reference
            key = f"{email}:{sub_data['name']}"
            created_ids["subscriptions"][key] = db_subscription.id
        
    logger.info(f"Created subscriptions for {len(created_ids['users'])} users")


def create_test_transactions(session: Session) -> None:
    """Create test transactions."""
    logger.info("Creating test transactions...")
    
    # Create transactions for the past 3 months
    today = datetime.date.today()
    start_date = today.replace(day=1) - datetime.timedelta(days=90)
    
    # Transaction templates
    transaction_templates = [
        # Income transactions
        {
            "description": "Salary",
            "amount": 3500.00,
            "transaction_type": TransactionType.INCOME,
            "category_name": "Income",
        },
        {
            "description": "Freelance Work",
            "amount": 500.00,
            "transaction_type": TransactionType.INCOME,
            "category_name": "Income",
        },
        
        # Expense transactions
        {
            "description": "Rent",
            "amount": 1200.00,
            "transaction_type": TransactionType.EXPENSE,
            "category_name": "Housing",
        },
        {
            "description": "Groceries",
            "amount": 150.00,
            "transaction_type": TransactionType.EXPENSE,
            "category_name": "Food",
        },
        {
            "description": "Electricity Bill",
            "amount": 85.00,
            "transaction_type": TransactionType.EXPENSE,
            "category_name": "Utilities",
        },
        {
            "description": "Internet Bill",
            "amount": 60.00,
            "transaction_type": TransactionType.EXPENSE,
            "category_name": "Utilities",
        },
        {
            "description": "Restaurant",
            "amount": 45.00,
            "transaction_type": TransactionType.EXPENSE,
            "category_name": "Food",
        },
        {
            "description": "Gas",
            "amount": 40.00,
            "transaction_type": TransactionType.EXPENSE,
            "category_name": "Transportation",
        },
        {
            "description": "Movie Tickets",
            "amount": 30.00,
            "transaction_type": TransactionType.EXPENSE,
            "category_name": "Entertainment",
        },
        {
            "description": "Pharmacy",
            "amount": 25.00,
            "transaction_type": TransactionType.EXPENSE,
            "category_name": "Healthcare",
        },
    ]
    
    # Create transactions for each user
    for email, user_id in created_ids["users"].items():
        # Get user's accounts and payment methods
        user_accounts = [key for key in created_ids["accounts"] if key.startswith(f"{email}:")]
        user_payment_methods = [key for key in created_ids["payment_methods"] if key.startswith(f"{email}:")]
        
        # Generate transactions for the past 3 months
        current_date = start_date
        transaction_count = 0
        
        while current_date <= today:
            # Monthly income (salary) - first day of month
            if current_date.day == 1:
                income_template = transaction_templates[0]  # Salary
                account_key = f"{email}:Checking Account"
                payment_method_key = f"{email}:Bank Transfer"
                
                transaction = TransactionCreate(
                    description=income_template["description"],
                    amount=income_template["amount"],
                    transaction_type=income_template["transaction_type"],
                    date=current_date,
                    currency_id=created_ids["currencies"]["USD"],
                    category_id=created_ids["categories"][income_template["category_name"]],
                    account_id=created_ids["accounts"][account_key],
                    payment_method_id=created_ids["payment_methods"][payment_method_key]
                )
                
                transaction_crud.create_transaction(
                    session=session,
                    transaction_in=transaction,
                    user_id=user_id
                )
                transaction_count += 1
            
            # Rent payment - fifth day of month
            if current_date.day == 5:
                rent_template = transaction_templates[2]  # Rent
                account_key = f"{email}:Checking Account"
                payment_method_key = f"{email}:Bank Transfer"
                
                transaction = TransactionCreate(
                    description=rent_template["description"],
                    amount=rent_template["amount"],
                    transaction_type=rent_template["transaction_type"],
                    date=current_date,
                    currency_id=created_ids["currencies"]["USD"],
                    category_id=created_ids["categories"][rent_template["category_name"]],
                    account_id=created_ids["accounts"][account_key],
                    payment_method_id=created_ids["payment_methods"][payment_method_key]
                )
                
                transaction_crud.create_transaction(
                    session=session,
                    transaction_in=transaction,
                    user_id=user_id
                )
                transaction_count += 1
            
            # Weekly groceries (every 7 days)
            if current_date.weekday() == 5:  # Saturday
                grocery_template = transaction_templates[3]  # Groceries
                account_key = f"{email}:Checking Account"
                payment_method_key = f"{email}:Debit Card"
                
                transaction = TransactionCreate(
                    description=grocery_template["description"],
                    amount=grocery_template["amount"],
                    transaction_type=grocery_template["transaction_type"],
                    date=current_date,
                    currency_id=created_ids["currencies"]["USD"],
                    category_id=created_ids["categories"][grocery_template["category_name"]],
                    account_id=created_ids["accounts"][account_key],
                    payment_method_id=created_ids["payment_methods"][payment_method_key]
                )
                
                transaction_crud.create_transaction(
                    session=session,
                    transaction_in=transaction,
                    user_id=user_id
                )
                transaction_count += 1
            
            # Monthly bills (15th of month)
            if current_date.day == 15:
                for bill_template in [transaction_templates[4], transaction_templates[5]]:  # Electricity & Internet
                    account_key = f"{email}:Checking Account"
                    payment_method_key = f"{email}:Credit Card"
                    
                    transaction = TransactionCreate(
                        description=bill_template["description"],
                        amount=bill_template["amount"],
                        transaction_type=bill_template["transaction_type"],
                        date=current_date,
                        currency_id=created_ids["currencies"]["USD"],
                        category_id=created_ids["categories"][bill_template["category_name"]],
                        account_id=created_ids["accounts"][account_key],
                        payment_method_id=created_ids["payment_methods"][payment_method_key]
                    )
                    
                    transaction_crud.create_transaction(
                        session=session,
                        transaction_in=transaction,
                        user_id=user_id
                    )
                    transaction_count += 1
            
            # Random transactions (with some randomness)
            if current_date.day % 3 == 0:
                # Pick a random transaction template from the expense ones (indices 2-9)
                import random
                template_idx = random.randint(6, 9)
                template = transaction_templates[template_idx]
                
                # Randomize amount slightly
                amount = template["amount"] * (0.8 + random.random() * 0.4)  # 80% to 120% of original
                
                # Pick random account and payment method
                account_key = random.choice(user_accounts)
                payment_method_key = random.choice(user_payment_methods)
                
                transaction = TransactionCreate(
                    description=template["description"],
                    amount=round(amount, 2),
                    transaction_type=template["transaction_type"],
                    date=current_date,
                    currency_id=created_ids["currencies"]["USD"],
                    category_id=created_ids["categories"][template["category_name"]],
                    account_id=created_ids["accounts"][account_key],
                    payment_method_id=created_ids["payment_methods"][payment_method_key]
                )
                
                transaction_crud.create_transaction(
                    session=session,
                    transaction_in=transaction,
                    user_id=user_id
                )
                transaction_count += 1
            
            # Move to next day
            current_date += datetime.timedelta(days=1)
        
        logger.info(f"Created {transaction_count} transactions for user {email}")


def populate_test_data() -> None:
    """Main function to populate test data."""
    if not is_development_environment():
        logger.warning("Not a development environment. Skipping test data population.")
        return
    
    logger.info("Starting test data population...")
    
    with Session(engine) as session:
        # Clear existing data first
        clear_existing_data(session)
        
        # Create test data in the correct order to maintain relationships
        create_test_currencies(session)
        create_test_categories(session)
        create_test_users(session)
        create_test_payment_methods(session)
        create_test_accounts(session)
        create_test_debts(session)
        create_test_financial_goals(session)
        create_test_subscriptions(session)
        create_test_transactions(session)
        
    logger.info("Test data population completed successfully!")


def main() -> None:
    """Main entry point."""
    logger.info("Checking environment and populating test data if needed")
    populate_test_data()


if __name__ == "__main__":
    main()
