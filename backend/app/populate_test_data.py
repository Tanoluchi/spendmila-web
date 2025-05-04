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
from app.models.payment_method import PaymentMethod
from app.models.category import Category
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
    
    # Delete all test users and their related data
    for user in users:
        logger.info(f"Deleting data for user: {user.email}")
        
        # Delete transactions
        transactions = transaction_crud.get_transactions(session=session, user_id=user.id)
        for transaction in transactions:
            logger.info(f"Deleting transaction: {transaction.id}")
            transaction_crud.delete_transaction(session=session, db_transaction=transaction)
        
        # Delete accounts
        accounts = account_crud.get_accounts(db=session, user_id=user.id)
        for account in accounts:
            logger.info(f"Deleting account: {account.id}")
            account_crud.delete_account(db=session, account_id=account.id)
        
        # Delete debts
        statement = select(Debt).where(Debt.user_id == user.id)
        debts = session.exec(statement).all()
        for debt in debts:
            logger.info(f"Deleting debt: {debt.id}")
            session.delete(debt)
        
        # Delete financial goals
        statement = select(FinancialGoal).where(FinancialGoal.user_id == user.id)
        goals = session.exec(statement).all()
        for goal in goals:
            logger.info(f"Deleting financial goal: {goal.id}")
            session.delete(goal)
        
        # Delete subscriptions
        statement = select(Subscription).where(Subscription.user_id == user.id)
        subscriptions = session.exec(statement).all()
        for subscription in subscriptions:
            logger.info(f"Deleting subscription: {subscription.id}")
            session.delete(subscription)
        
        # Delete payment methods
        statement = select(PaymentMethod).where(PaymentMethod.id != None)
        payment_methods = session.exec(statement).all()
        for payment_method in payment_methods:
            logger.info(f"Deleting payment method: {payment_method.id}")
            session.delete(payment_method)
        
        # Finally delete the user
        logger.info(f"Deleting user: {user.id}")
        session.delete(user)
    
    # Delete all categories
    logger.info("Deleting all categories...")
    statement = select(Category).where(Category.id != None)
    categories = session.exec(statement).all()
    for category in categories:
        logger.info(f"Deleting category: {category.id} - {category.name}")
        session.delete(category)
    
    # Commit all deletions
    session.commit()
    
    # Reset the created_ids dictionary to ensure we don't reference stale data
    for key in created_ids:
        if isinstance(created_ids[key], dict):
            created_ids[key] = {}
        elif isinstance(created_ids[key], list):
            created_ids[key] = []
    
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
    
    # Ensure USD currency exists
    usd_currency_id = created_ids["currencies"].get("USD")
    if not usd_currency_id:
        logger.error("USD currency not found. Make sure to run create_test_currencies first.")
        return
    
    users = [
        {
            "email": "john.doe@example.com", 
            "password": "password123", 
            "full_name": "John Doe",
            "default_currency_id": created_ids["currencies"]["USD"]
        },
        {
            "email": "jane.smith@example.com", 
            "password": "password123", 
            "full_name": "Jane Smith",
            "default_currency_id": created_ids["currencies"]["EUR"]
        },
    ]
    
    for user_data in users:
        # Check if user already exists
        existing = crud.get_user_by_email(session=session, email=user_data["email"])
        if existing:
            created_ids["users"][user_data["email"]] = existing.id
            # Update default currency if it's not set
            if not existing.default_currency_id:
                existing.default_currency_id = user_data["default_currency_id"]
                session.add(existing)
                session.commit()
            continue
            
        user = UserCreate(**user_data)
        db_user = crud.create_user(session=session, user_create=user)
        created_ids["users"][user_data["email"]] = db_user.id
        
    logger.info(f"Created {len(users)} users")


def create_test_payment_methods(session: Session) -> None:
    """Create test payment methods.
    
    Payment methods are global entities created by administrators.
    Users can only select from existing payment methods.
    """
    logger.info("Creating global payment methods...")
    
    payment_methods = [
        {"name": "Credit Card", "description": "Visa, Mastercard, etc.", "payment_method_type": PaymentMethodType.CARD},
        {"name": "Debit Card", "description": "Direct from bank account", "payment_method_type": PaymentMethodType.CARD},
        {"name": "Cash", "description": "Physical currency", "payment_method_type": PaymentMethodType.CASH},
        {"name": "Bank Transfer", "description": "ACH, wire transfer", "payment_method_type": PaymentMethodType.TRANSFER},
        {"name": "Digital Wallet", "description": "PayPal, Venmo, etc.", "payment_method_type": PaymentMethodType.OTHER},
    ]
    
    # Create global payment methods (not associated with specific users)
    for method_data in payment_methods:
        # Check if payment method already exists
        method_name = method_data['name']
        if method_name in created_ids["payment_methods"]:
            logger.info(f"Payment method {method_name} already exists")
            continue
            
        # Create payment method schema
        payment_method = PaymentMethodCreate(**method_data)
        
        # Create global payment method
        db_payment_method = payment_method_crud.create_payment_method(
            session=session, 
            payment_method_in=payment_method
        )
            
        # Store with name as key for reference
        created_ids["payment_methods"][method_name] = db_payment_method.id
    
    logger.info(f"Created {len(created_ids['payment_methods'])} global payment methods")


def create_test_accounts(session: Session) -> None:
    """Create test accounts."""
    logger.info("Creating test accounts...")
    
    accounts = [
        {"name": "Checking Account", "description": "Primary checking", "balance": 2500.00, "currency_code": "USD", "account_type": "bank"},
        {"name": "Savings Account", "description": "Emergency fund", "balance": 10000.00, "currency_code": "USD", "account_type": "bank"},
        {"name": "Investment Account", "description": "Stocks and bonds", "balance": 15000.00, "currency_code": "USD", "account_type": "other"},
        {"name": "Euro Account", "description": "Euro savings", "balance": 5000.00, "currency_code": "EUR", "account_type": "bank"},
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
            "creditor_name": "Auto Finance Bank",
            "description": "Auto loan for Honda",
            "amount": 15000.00,
            "interest_rate": 4.5,
            "minimum_payment": 450.00,
            "due_date": datetime.date.today().replace(day=15),
            "currency_code": "USD",
            "debt_type": "auto",
            "is_installment": True,
            "total_installments": 36,
            "start_date": datetime.date.today() - datetime.timedelta(days=180)
        },
        {
            "creditor_name": "Federal Student Aid",
            "description": "Federal student loan",
            "amount": 25000.00,
            "interest_rate": 5.0,
            "minimum_payment": 350.00,
            "due_date": datetime.date.today().replace(day=1),
            "currency_code": "USD",
            "debt_type": "student",
            "is_installment": True,
            "total_installments": 60,
            "start_date": datetime.date.today() - datetime.timedelta(days=365)
        },
        {
            "creditor_name": "Credit Card Company",
            "description": "Credit card debt",
            "amount": 3500.00,
            "interest_rate": 18.99,
            "minimum_payment": 100.00,
            "due_date": datetime.date.today().replace(day=20),
            "currency_code": "USD",
            "debt_type": "credit_card",
            "is_installment": False
        },
    ]
    
    for debt_data in debts:
        currency_code = debt_data.pop("currency_code")
        
        # Create debt for each user
        for email, user_id in created_ids["users"].items():
            # Get an account for this user
            account_key = f"{email}:Checking Account"
            account_id = created_ids["accounts"].get(account_key)
            
            # Create a copy of the debt data to avoid modifying the original
            debt_copy = debt_data.copy()
            
            debt = DebtCreate(
                **debt_copy,
                account_id=account_id
            )
            
            db_debt = debt_crud.create_debt(
                session=session, 
                debt_in=debt,
                user_id=user_id
            )
            
            # Store with composite key for reference
            key = f"{email}:{debt_data['creditor_name']}"
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
        # Get user's accounts 
        user_accounts = [key for key in created_ids["accounts"] if key.startswith(f"{email}:")]
        # Payment methods are now global, not user-specific
        
        # Generate transactions for the past 3 months
        current_date = start_date
        transaction_count = 0
        
        while current_date <= today:
            # Monthly income (salary) - first day of month
            if current_date.day == 1:
                income_template = transaction_templates[0]  # Salary
                account_key = f"{email}:Checking Account"
                payment_method_key = "Bank Transfer"
                
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
                payment_method_key = "Bank Transfer"
                
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
                payment_method_key = "Debit Card"
                
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
                    payment_method_key = "Credit Card"
                    
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
                payment_method_keys = list(created_ids["payment_methods"].keys())
                payment_method_key = random.choice(payment_method_keys)
                
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


def populate_test_data(force: bool = False) -> None:
    """Main function to populate test data.
    
    Args:
        force: If True, will populate test data even in non-development environments.
    """
    # Only run in development environment unless forced
    if not force and not is_development_environment():
        logger.warning("Not in development environment. Skipping test data population.")
        return
    
    logger.info("Starting test data population...")
    
    with Session(engine) as session:
        # Always clear existing data first
        clear_existing_data(session)
        
        # Create new test data
        create_test_currencies(session)
        create_test_categories(session)
        create_test_users(session)
        create_test_payment_methods(session)
        create_test_accounts(session)
        create_test_debts(session)
        create_test_financial_goals(session)
        create_test_subscriptions(session)
        create_test_transactions(session)
    
    logger.info("Test data population completed successfully.")


def main() -> None:
    """Main entry point."""
    import sys
    
    logger.info("Checking environment and populating test data if needed")
    
    # Check if --force flag is provided
    force = "--force" in sys.argv
    
    # Always populate test data, clearing existing data first
    populate_test_data(force=force)


if __name__ == "__main__":
    main()
