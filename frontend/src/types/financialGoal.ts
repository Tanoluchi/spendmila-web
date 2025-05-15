// frontend/src/types/financialGoal.ts
import type { FinancialGoalStatus, FinancialGoalType } from './enums';

export interface FinancialGoal {
  id: string; // uuid.UUID
  user_id: string; // uuid.UUID
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string | null; // datetime.date
  status: FinancialGoalStatus;
  goal_type: FinancialGoalType;
  description?: string | null;
  icon?: string | null;
  progress_percentage?: number; // Backend might add this
}

export interface PaginatedFinancialGoals {
  data: FinancialGoal[];
  count: number;
}
