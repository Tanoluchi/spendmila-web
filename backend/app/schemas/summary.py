# backend/app/schemas/summary.py
from pydantic import BaseModel
from typing import List
import datetime

class BaseSummaryItem(BaseModel):
    total_expenses: float

class MonthlyExpenseItem(BaseSummaryItem):
    month: int # 1 for January, 2 for February, etc.
    month_name: str # e.g., "January", "February"
    year: int

class DailyExpenseItem(BaseSummaryItem):
    date_str: str # YYYY-MM-DD
    day_name: str # e.g., "Monday", "Tuesday"

class UserExpenseSummaryResponse(BaseModel):
    monthly_summary: List[MonthlyExpenseItem]
    daily_summary: List[DailyExpenseItem] # For weekly, if we decide to do daily for past 7 days
