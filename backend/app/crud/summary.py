# backend/app/crud/summary.py
import uuid
from datetime import datetime, timedelta, date # Added date explicitly for type hints
from typing import List, Dict
from sqlalchemy import extract, func # Retained sqlalchemy for extract, func
from sqlmodel import Session, select, col # Retained sqlmodel for Session, select, col

from app.models import Transaction, User, Category, Currency # Added Currency, User, Category just in case, can be removed if not used by Transaction relationships indirectly
from app.schemas.transaction import TransactionType
from app.schemas.summary import MonthlyExpenseItem, DailyExpenseItem

def get_monthly_expense_summary(db: Session, user_id: uuid.UUID, year: int) -> List[MonthlyExpenseItem]:
    """
    Calculates total expenses for each month of a given year for a specific user.
    """

    monthly_expenses_stmt = (
        select(
            extract('month', Transaction.date).label('month_num'),
            func.sum(Transaction.amount).label('total_amount')
        )
        .where(
            Transaction.user_id == user_id,
            Transaction.transaction_type == TransactionType.EXPENSE,
            extract('year', Transaction.date) == year
        )
        .group_by(extract('month', Transaction.date))
        .order_by(extract('month', Transaction.date))
    )
    
    results = db.exec(monthly_expenses_stmt).all()
    
    monthly_summary: List[MonthlyExpenseItem] = []
    month_map: Dict[int, float] = {int(res.month_num): float(res.total_amount) for res in results}

    for month_num in range(1, 13):
        # Use datetime from datetime module, not the 'date' type alias for current_date
        month_name = datetime(year, month_num, 1).strftime('%b') # Short month name e.g., Jan, Feb
        total = month_map.get(month_num, 0.0)
        monthly_summary.append(
            MonthlyExpenseItem(
                month=month_num,
                month_name=month_name,
                year=year,
                total_expenses=float(total)
            )
        )
    return monthly_summary

def get_daily_expense_summary_for_period(
    db: Session, user_id: uuid.UUID, start_date: date, end_date: date # Explicitly use 'date' for type hints
) -> List[DailyExpenseItem]:
    """
    Calculates total expenses for each day within a given date range for a specific user.
    """

    daily_expenses_stmt = (
        select(
            Transaction.date.label('transaction_date'),
            func.sum(Transaction.amount).label('total_amount')
        )
        .where(
            Transaction.user_id == user_id,
            Transaction.transaction_type == TransactionType.EXPENSE,
            Transaction.date >= start_date,
            Transaction.date <= end_date
        )
        .group_by(Transaction.date)
        .order_by(Transaction.date)
    )
    
    results = db.exec(daily_expenses_stmt).all()
    
    daily_summary_dict: Dict[date, float] = {res.transaction_date: float(res.total_amount) for res in results}
    
    daily_summary_list: List[DailyExpenseItem] = []
    current_date = start_date
    while current_date <= end_date:
        total = daily_summary_dict.get(current_date, 0.0)
        daily_summary_list.append(
            DailyExpenseItem(
                date_str=current_date.isoformat(), # YYYY-MM-DD
                day_name=current_date.strftime('%a'), # Short day name e.g., Mon, Tue
                total_expenses=float(total)
            )
        )
        current_date += timedelta(days=1)
        
    return daily_summary_list
