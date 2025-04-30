from app.models.financial_goal import FinancialGoal
from app.models.enums import FinancialGoalStatus


def add_saving(financial_goal: FinancialGoal, amount: float) -> float:
    """
    Add a saving amount to the current amount of a financial goal and return the new total.
    
    Args:
        financial_goal: The financial goal to update
        amount: The amount to add
        
    Returns:
        The new current amount
        
    Raises:
        ValueError: If amount is not positive
    """
    if amount <= 0:
        raise ValueError("Saving amount must be positive")
        
    financial_goal.current_amount += amount
    
    # Check if goal is completed
    if financial_goal.current_amount >= financial_goal.target_amount:
        financial_goal.status = FinancialGoalStatus.COMPLETED
        
    return financial_goal.current_amount


def calculate_progress_percentage(financial_goal: FinancialGoal) -> float:
    """
    Calculate the progress percentage of a financial goal.
    
    Args:
        financial_goal: The financial goal to calculate for
        
    Returns:
        The progress percentage (0-100)
    """
    if financial_goal.target_amount <= 0:
        return 0
        
    percentage = (financial_goal.current_amount / financial_goal.target_amount) * 100
    return min(percentage, 100)  # Cap at 100%
