/**
 * Transaction types for the SpendMila application
 */

export interface TransactionCreate {
  description?: string;
  amount: number;
  transaction_type: "income" | "expense";
  date: string;
  currency_id: string;
  category_id: string;
  payment_method_id: string;
  subscription_id?: string;
  financial_goal_id?: string;
  debt_id?: string;
  account_id?: string;
}

export interface Transaction {
  id: string;
  description?: string;
  amount: number;
  transaction_type: "income" | "expense";
  date: string;
  currency_id: string;
  category_id: string;
  payment_method_id: string;
  subscription_id?: string;
  financial_goal_id?: string;
  debt_id?: string;
  account_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
