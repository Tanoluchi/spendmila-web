"""
Script to update the payment_method table by adding missing columns.
"""
import logging
from sqlalchemy import text
from sqlmodel import Session
from app.core.db import engine
from app.models.enums import PaymentMethodType

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def update_payment_method_table():
    """Add missing columns to payment_method table."""
    with Session(engine) as session:
        try:
            # Check if columns already exist
            try:
                session.execute(text("SELECT payment_method_type FROM payment_method LIMIT 1"))
                logger.info("Column 'payment_method_type' already exists")
                payment_method_type_exists = True
            except Exception:
                payment_method_type_exists = False
                
            try:
                session.execute(text("SELECT is_active FROM payment_method LIMIT 1"))
                logger.info("Column 'is_active' already exists")
                is_active_exists = True
            except Exception:
                is_active_exists = False
                
            # Add missing columns
            if not payment_method_type_exists:
                logger.info("Adding 'payment_method_type' column to payment_method table")
                session.execute(text(
                    "ALTER TABLE payment_method ADD COLUMN payment_method_type VARCHAR NOT NULL DEFAULT 'cash'"
                ))
                logger.info("Column 'payment_method_type' added successfully")
                
            if not is_active_exists:
                logger.info("Adding 'is_active' column to payment_method table")
                session.execute(text(
                    "ALTER TABLE payment_method ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE"
                ))
                logger.info("Column 'is_active' added successfully")
                
            # Commit changes
            session.commit()
            logger.info("Successfully updated payment_method table structure")
            
        except Exception as e:
            logger.error(f"Error updating payment_method table: {e}")
            session.rollback()
            raise

if __name__ == "__main__":
    logger.info("Updating payment_method table...")
    update_payment_method_table()
    logger.info("Update completed!")
