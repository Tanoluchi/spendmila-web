/**
 * Account related types and interfaces
 */

/**
 * Account types as defined in the backend
 * Mantiene los valores exactos del enum del backend
 */
export enum AccountType {
  BANK = "bank",
  DIGITAL = "digital",
  CASH = "cash",
  CREDIT = "credit",
  INVESTMENT = "investment",
  SAVINGS = "savings",
  CHECKING = "checking",
  OTHER = "other"
}

/**
 * Mapa de nombres para visualización de tipos de cuenta
 */
export const AccountTypeDisplayNames: Record<string, string> = {
  'checking': 'Checking',
  'savings': 'Savings',
  'credit': 'Credit Cards',
  'investment': 'Investments',
  'bank': 'Bank',
  'digital': 'Digital',
  'cash': 'Cash',
  'other': 'Other'
};

/**
 * Interface for Account objects
 */
export interface Account {
  id: string;
  name: string;
  account_type: AccountType | string;
  balance: number;
  institution?: string;
  icon?: string;
  color?: string;
  is_default: boolean;
  user_id: string;
  currency_id: string;
  created_at?: string;
  transaction_count?: number;
  last_transaction_date?: string;
}

/**
 * Interface for Account details (extended version con datos completos)
 */
export interface AccountWithDetails extends Account {
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
  currency?: {
    id: string;
    code: string;
    name: string;
    symbol: string;
  };
  transaction_count: number;
  last_transaction_date?: string;
}

/**
 * Interface for creating a new account
 */
export interface CreateAccountRequest {
  name: string;
  account_type: AccountType | string;
  balance: number;
  institution?: string;
  icon?: string;
  color?: string;
  is_default?: boolean;
  currency_id: string;
}

/**
 * Interface for transaction count response
 */
export interface TransactionCountOptions {
  limit?: number;
  showCountOverLimit?: boolean;
}

/**
 * Props for el componente TransactionCount
 */
export interface TransactionCountProps {
  accountId: string;
  getTransactionCount: (accountId: string) => Promise<number>;
  options?: TransactionCountOptions;
}

/**
 * Props for el componente AccountCard
 */
export interface AccountCardProps {
  account: Account;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewTransactions: (id: string) => void;
  getLastUpdated: (id: string) => string;
  getTransactionCount: (id: string) => Promise<number>;
}

/**
 * Interface for account summary calculations
 */
export interface AccountSummary {
  totalAssets: number;
  totalDebts: number;
  netWorth: number;
}
