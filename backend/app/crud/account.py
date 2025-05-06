import uuid
import datetime

from typing import List, Optional, Dict, Any
from sqlmodel import select, Session

from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate


def get_account(db: Session, account_id: uuid.UUID) -> Optional[Account]:
    """Get a single account by ID"""
    return db.exec(select(Account).where(Account.id == account_id)).first()


def get_account_by_name(db: Session, user_id: uuid.UUID, name: str) -> Optional[Account]:
    """Get a single account by name for a specific user"""
    return db.exec(
        select(Account).where(Account.user_id == user_id, Account.name == name)
    ).first()


def get_accounts(
    db: Session, user_id: uuid.UUID
) -> List[Account]:
    """Get all accounts for a user"""
    return db.exec(
        select(Account)
        .where(Account.user_id == user_id)
    ).all()


def calculate_account_balance(db: Session, account_id: uuid.UUID) -> float:
    """Calcular el balance de una cuenta sumando todas sus transacciones"""
    from app.models.transaction import Transaction
    from sqlalchemy import func, select
    
    # Obtener todas las transacciones de ingreso (income)
    income_query = select(func.sum(Transaction.amount)).where(
        Transaction.account_id == account_id,
        Transaction.transaction_type == "income",
        Transaction.is_active == True
    )
    income = db.scalar(income_query) or 0
    
    # Obtener todas las transacciones de gasto (expense)
    expense_query = select(func.sum(Transaction.amount)).where(
        Transaction.account_id == account_id,
        Transaction.transaction_type == "expense",
        Transaction.is_active == True
    )
    expense = db.scalar(expense_query) or 0
    
    # Calcular balance (ingresos - gastos)
    return income - expense


def update_account_balance(db: Session, account_id: uuid.UUID) -> None:
    """Actualizar el balance de una cuenta basado en sus transacciones"""
    account = get_account(db, account_id)
    if account:
        balance = calculate_account_balance(db, account_id)
        account.balance = balance
        db.add(account)
        db.commit()
        db.refresh(account)


def create_account(db: Session, account: AccountCreate, user_id: uuid.UUID) -> Account:
    """Create a new account for a user"""
    # Crear un diccionario con los datos de la cuenta y añadir user_id
    account_data = account.model_dump()
    account_data["user_id"] = user_id
    # Inicializar el balance en 0, se actualizará con las transacciones
    account_data["balance"] = 0.0
    
    # Crear la instancia de Account
    db_account = Account(**account_data)
    
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


def update_account(
    db: Session, account_id: uuid.UUID, account_update: AccountUpdate
) -> Optional[Account]:
    """Update an existing account"""
    db_account = get_account(db, account_id)
    if not db_account:
        return None
    
    # Obtener los datos de actualización, excluyendo campos no establecidos
    account_data = account_update.model_dump(exclude_unset=True)
    
    # Asegurar que no se intente actualizar el balance manualmente
    if "balance" in account_data:
        del account_data["balance"]
    
    # Actualizar los atributos de la cuenta
    for key, value in account_data.items():
        setattr(db_account, key, value)
    
    # Actualizar el balance basado en las transacciones
    current_balance = calculate_account_balance(db, account_id)
    db_account.balance = current_balance
    
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


def delete_account(db: Session, account_id: uuid.UUID) -> bool:
    """Delete an account and all its associated entities: transactions, debts, and subscriptions"""
    from app.models.transaction import Transaction
    from app.models.debt import Debt
    from app.models.subscription import Subscription
    from sqlalchemy import delete
    
    db_account = get_account(db, account_id)
    if not db_account:
        return False
    
    # Eliminar todas las transacciones asociadas a la cuenta
    delete_transactions_stmt = delete(Transaction).where(Transaction.account_id == account_id)
    db.execute(delete_transactions_stmt)
    
    # Eliminar todas las deudas asociadas a la cuenta
    delete_debts_stmt = delete(Debt).where(Debt.account_id == account_id)
    db.execute(delete_debts_stmt)
    
    # Eliminar todas las suscripciones asociadas a la cuenta
    delete_subscriptions_stmt = delete(Subscription).where(Subscription.account_id == account_id)
    db.execute(delete_subscriptions_stmt)
    
    # Finalmente, eliminar la cuenta
    db.delete(db_account)
    db.commit()
    return True


def get_account_with_details(
    db: Session, account_id: uuid.UUID
) -> Optional[Dict[str, Any]]:
    """Get account with related details (user, currency, transaction count, last transaction date)"""
    db_account = get_account(db, account_id)
    if not db_account:
        return None
    
    account_dict = db_account.model_dump()
    
    # Add user details
    if db_account.user:
        account_dict["user"] = {
            "id": db_account.user.id,
            "email": db_account.user.email,
            "full_name": db_account.user.full_name,
        }
    
    # Add currency details
    if db_account.currency:
        account_dict["currency"] = {
            "id": db_account.currency.id,
            "code": db_account.currency.code,
            "name": db_account.currency.name,
            "symbol": db_account.currency.symbol,
        }
    
    # Add transaction count
    transaction_count = get_transaction_count(db, account_id)
    account_dict["transaction_count"] = transaction_count
    
    # Add last transaction date
    last_transaction_date = get_last_transaction_date(db, account_id)
    account_dict["last_transaction_date"] = last_transaction_date or account_dict.get("created_at")
    
    return account_dict


def unset_default_accounts(db: Session, user_id: uuid.UUID) -> None:
    """Unset any existing default accounts for a user"""
    from sqlalchemy import update
    db.exec(
        update(Account)
        .where(Account.user_id == user_id, Account.is_default == True)
        .values(is_default=False)
    )
    db.commit()


def has_related_entities(db: Session, account_id: uuid.UUID) -> bool:
    """Check if an account has any associated debts or subscriptions
    
    Note: Transactions are now handled automatically and deleted in cascade when
    an account is deleted, so they are no longer considered a restriction for deletion.
    """
    account = get_account(db, account_id)
    if not account:
        return False
    
    # Solo verificamos deudas y suscripciones, ya que las transacciones se eliminan automáticamente
    return (len(account.debts) > 0 or 
            len(account.subscriptions) > 0)


def get_transaction_count(db: Session, account_id: uuid.UUID) -> int:
    """Obtener el número exacto de transacciones asociadas a una cuenta
    
    Args:
        db: Session de base de datos
        account_id: UUID de la cuenta para la que se quiere contar transacciones
        
    Returns:
        int: Número de transacciones activas para la cuenta específica
    """
    from app.models.transaction import Transaction
    from sqlalchemy import func, select
    
    # Asegurarse de que el account_id es válido
    if not account_id:
        return 0
        
    # Verificar que la cuenta existe
    account = get_account(db, account_id)
    if not account:
        return 0
    
    # Consultar solo las transacciones activas para esta cuenta específica
    count_query = select(func.count()).where(
        Transaction.account_id == account_id,
        Transaction.is_active == True
    )
    
    result = db.scalar(count_query)
    return result or 0


def get_last_transaction_date(db: Session, account_id: uuid.UUID) -> Optional[datetime.datetime]:
    """Obtener la fecha de la última transacción asociada a una cuenta
    
    Args:
        db: Session de base de datos
        account_id: UUID de la cuenta para la que se quiere obtener la última fecha
        
    Returns:
        datetime.datetime: Fecha de la última transacción o None si no hay transacciones
    """
    from app.models.transaction import Transaction
    from sqlalchemy import select, desc
    
    # Asegurarse de que el account_id es válido
    if not account_id:
        return None
        
    # Verificar que la cuenta existe
    account = get_account(db, account_id)
    if not account:
        return None
    
    try:
        # Obtener la transacción más reciente por fecha
        query = select(Transaction).where(
            Transaction.account_id == account_id,
            Transaction.is_active == True
        ).order_by(desc(Transaction.date)).limit(1)
        
        last_transaction = db.exec(query).first()
        
        # Si no hay transacciones, devolver None
        if not last_transaction:
            return None
        
        # Verificar que last_transaction tiene el atributo date
        if not hasattr(last_transaction, 'date'):
            return None
            
        # Convertir la fecha (date) a datetime
        return datetime.datetime.combine(last_transaction.date, datetime.time())
    except Exception as e:
        # Log the error and return None in case of any exception
        print(f"Error getting last transaction date: {e}")
        return None
