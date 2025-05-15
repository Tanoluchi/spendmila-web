/**
 * Transaction types for the SpendMila application
 */

// Import for local use AND for re-exporting
import type { Category } from "./category";
import type { Currency } from "./currency";
import type { Account } from "./account";

// Re-export the imported types
export type { Category };
export type { Currency };
export type { Account };
import { Budget } from "./budget"; // Assuming budget.ts exists in types

// Filter interface for transaction queries
export interface TransactionFilter {
  page?: number;
  page_size?: number;
  limit?: number;
  category_name?: string;
  account_id?: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  service_name: string;
  amount: number;
  billing_cycle: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
}

export interface Debt {
  id: string;
  creditor_name: string;
  amount: number;
  remaining_amount: number;
  interest_rate: number;
  minimum_payment?: number;
  payment_progress: number;
}

export interface TransactionCreate {
  description: string; // Required, matches backend TransactionBase
  amount: number;
  transaction_type: "income" | "expense"; // Backend enum might be richer (e.g., includes 'transfer')
  date: string; // Should be formatted as YYYY-MM-DD for backend
  currency_id: string;
  category_id?: string; // Optional in backend
  payment_method_id?: string; // Optional in backend
  account_id?: string; // Optional in backend
  subscription_id?: string; // Optional in backend
  financial_goal_id?: string; // Optional in backend
  debt_id?: string; // Optional in backend
  // Frontend-specific or for other purposes, not in backend TransactionCreate directly:
  budget_id?: string; 
  notes?: string;
}

export interface Transaction {
  id: string;
  description?: string;
  amount: number;
  transaction_type: "income" | "expense";
  date: string;
  currency_id?: string;
  category_id?: string;
  payment_method_id?: string;
  budget_id?: string;
  subscription_id?: string;
  financial_goal_id?: string;
  debt_id?: string;
  account_id?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  
  // Related entities
  category?: Category;
  currency?: Currency;
  account?: Account;
  payment_method?: PaymentMethod;
  budget?: Budget;
  subscription?: Subscription;
  financial_goal?: FinancialGoal;
  debt?: Debt;
}

export interface PaginatedTransactionsResponse {
  items: Transaction[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// TransactionUpdate type for updating transactions
export type TransactionUpdate = Partial<TransactionCreate> & {
  is_active?: boolean;
};
