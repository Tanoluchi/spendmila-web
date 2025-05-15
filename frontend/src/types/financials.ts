export interface UserFinancialSummary {
  cumulative_income: number;
  income_change_percentage?: number | null;
  cumulative_expenses: number;
  expense_change_percentage?: number | null;
  currency_code?: string | null; // To help with formatting display values
}
