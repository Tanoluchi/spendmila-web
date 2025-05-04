/**
 * Transaction types for the SpendMila application
 */

// Import related entity types
import { Category } from "@/client/services/TransactionService";
import { Currency } from "@/client/services/TransactionService";
import { Account } from "@/client/services/TransactionService";

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
  subscription?: Subscription;
  financial_goal?: FinancialGoal;
  debt?: Debt;
}
