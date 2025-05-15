// frontend/src/types/summary.ts
export interface MonthlyExpenseSummaryItem {
  month_name: string; // e.g., "January", "February" (matching backend schema)
  year: number;
  total_expenses: number;
}

export interface DailyExpenseSummaryItem {
  date_str: string; // YYYY-MM-DD (matching backend schema)
  day_name: string; // e.g., "Monday", "Tuesday" (matching backend schema)
  total_expenses: number;
}

// This will be the structure recharts expects after transformation
export interface ChartDataItem {
  name: string; // Mapped from month_name or day_name/date_str
  expenses: number; // Mapped from total_expenses
}

// This is the overall response structure from the backend API
export interface UserExpenseSummaryResponse {
  monthly_summary: MonthlyExpenseSummaryItem[];
  daily_summary: DailyExpenseSummaryItem[];
}
