import uuid
from typing import List, Dict, Any, Optional, Sequence
from sqlmodel import Session

from app.models.account import Account
from app.models.enums import AccountType
from app.schemas.account import (
    AccountCreate, 
    AccountUpdate, 
    AccountRead,
    AccountReadWithDetails,
    AccountTypeResponse
)
from app.crud import account as account_crud
from app.crud.transaction import get_transaction_count as get_transaction_count_from_db

class AccountService:
    """
    Servicio para la gestión de cuentas bancarias.
    Implementa lógica de negocio y coordina las operaciones CRUD.
    """
    
    @staticmethod
    def get_accounts(db: Session, user_id: uuid.UUID) -> Sequence[Account]:
        """
        Obtiene todas las cuentas de un usuario.
        
        Args:
            db: Sesión de base de datos
            user_id: ID del usuario
            
        Returns:
            Lista de cuentas del usuario
        """
        return account_crud.get_accounts(db=db, user_id=user_id)
    
    @staticmethod
    def create_account(
        db: Session, 
        account_in: AccountCreate, 
        user_id: uuid.UUID
    ) -> Account:
        """
        Crea una nueva cuenta para un usuario.
        
        Args:
            db: Sesión de base de datos
            account_in: Datos de la cuenta a crear
            user_id: ID del usuario
            
        Returns:
            La cuenta creada
        """
        # Verificar si ya existe una cuenta con el mismo nombre
        existing_account = account_crud.get_account_by_name(
            db=db, user_id=user_id, name=account_in.name
        )
        if existing_account:
            raise ValueError("Account with this name already exists.")
        
        # Si es cuenta predeterminada, desmarcar cualquier otra
        if account_in.is_default:
            account_crud.unset_default_accounts(db=db, user_id=user_id)
        
        # Crear la cuenta
        return account_crud.create_account(db=db, account=account_in, user_id=user_id)
    
    @staticmethod
    def get_account(
        db: Session, 
        account_id: uuid.UUID, 
        user_id: uuid.UUID
    ) -> Optional[AccountReadWithDetails]:
        """
        Obtiene una cuenta específica con detalles adicionales.
        
        Args:
            db: Sesión de base de datos
            account_id: ID de la cuenta
            user_id: ID del usuario
            
        Returns:
            Cuenta con detalles adicionales o None si no existe
        """
        # Verificar que la cuenta existe y pertenece al usuario
        account = account_crud.get_account(db=db, account_id=account_id)
        if not account or account.user_id != user_id:
            return None
        
        # Actualizar balance basado en transacciones
        account_crud.update_account_balance(db=db, account_id=account_id)
        
        # Obtener cuenta con detalles completos
        return account_crud.get_account_with_details(db=db, account_id=account_id)
    
    @staticmethod
    def update_account(
        db: Session, 
        account_id: uuid.UUID, 
        account_update: AccountUpdate, 
        user_id: uuid.UUID
    ) -> Optional[Account]:
        """
        Actualiza una cuenta existente.
        
        Args:
            db: Sesión de base de datos
            account_id: ID de la cuenta
            account_update: Datos para actualizar
            user_id: ID del usuario
            
        Returns:
            La cuenta actualizada o None si no existe
        """
        # Verificar que la cuenta existe y pertenece al usuario
        account = account_crud.get_account(db=db, account_id=account_id)
        if not account or account.user_id != user_id:
            return None
            
        # Si se está cambiando el nombre, verificar que no exista otra cuenta con ese nombre
        if account_update.name and account_update.name != account.name:
            existing_account = account_crud.get_account_by_name(
                db=db, user_id=user_id, name=account_update.name
            )
            if existing_account and existing_account.id != account_id:
                raise ValueError("Account with this name already exists.")
        
        # Si se establece como cuenta predeterminada, desmarcar cualquier otra
        if account_update.is_default is True:
            account_crud.unset_default_accounts(db=db, user_id=user_id)
        
        # Actualizar la cuenta
        return account_crud.update_account(
            db=db, account_id=account_id, account_update=account_update
        )
    
    @staticmethod
    def delete_account(db: Session, account_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """
        Elimina una cuenta y sus entidades asociadas.
        
        Args:
            db: Sesión de base de datos
            account_id: ID de la cuenta
            user_id: ID del usuario
            
        Returns:
            True si se eliminó correctamente, False en caso contrario
        """
        # Verificar que la cuenta existe y pertenece al usuario
        account = account_crud.get_account(db=db, account_id=account_id)
        if not account or account.user_id != user_id:
            return False
        
        # Eliminar la cuenta y sus entidades asociadas
        return account_crud.delete_account(db=db, account_id=account_id)
    
    @staticmethod
    def get_account_types() -> List[AccountTypeResponse]:
        """
        Obtiene todos los tipos de cuenta disponibles.
        
        Returns:
            Lista de tipos de cuenta con sus nombres y valores
        """
        return [
            AccountTypeResponse(name=account_type.name, value=account_type.value)
            for account_type in AccountType
        ]
    
    @staticmethod
    def get_transaction_count(db: Session, account_id: uuid.UUID) -> int:
        """
        Obtiene el número de transacciones asociadas a una cuenta.
        
        Args:
            db: Sesión de base de datos
            account_id: ID de la cuenta
            
        Returns:
            Número de transacciones activas
        """
        if not account_id:
            return 0
            
        # Verificar que la cuenta existe
        account = account_crud.get_account(db=db, account_id=account_id)
        if not account:
            return 0
        
        # Consultar transacciones activas para esta cuenta
        from app.models.transaction import Transaction
        from sqlalchemy import func, select
        
        # Consultar transacciones activas especificando claramente los criterios
        count_query = select(func.count(Transaction.id)).where(
            Transaction.account_id == account_id,
            Transaction.is_active == True
        )
        
        result = db.scalar(count_query)
        return result or 0
