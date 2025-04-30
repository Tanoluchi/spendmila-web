from app.models.debt import Debt
from app.models.enums import DebtStatus


def mark_as_paid(debt: Debt) -> None:
    """
    Mark a debt as paid.
    
    Args:
        debt: The debt to mark as paid
    """
    debt.is_paid = True
    debt.status = DebtStatus.PAID


def calculate_total_debt(debts: list[Debt]) -> float:
    """
    Calculate the total amount of unpaid debts.
    
    Args:
        debts: List of debts to calculate total for
        
    Returns:
        The total amount of unpaid debts
    """
    return sum(debt.amount for debt in debts if not debt.is_paid)


def calculate_monthly_payment(debt: Debt, months: int) -> float:
    """
    Calculate the monthly payment amount for a debt over a specified number of months.
    
    Args:
        debt: The debt to calculate for
        months: Number of months to pay off the debt
        
    Returns:
        The monthly payment amount
        
    Raises:
        ValueError: If months is not positive
    """
    if months <= 0:
        raise ValueError("Number of months must be positive")
        
    if debt.interest_rate is not None and debt.interest_rate > 0:
        # Simple interest calculation for monthly payments
        monthly_rate = debt.interest_rate / 100 / 12
        total_amount = debt.amount * (1 + monthly_rate * months)
        return total_amount / months
    else:
        # No interest
        return debt.amount / months
