/**
 * Account related types and interfaces
 */

/**
 * Account types as defined in the backend
 */
export enum AccountType {
  BANK = "bank",
  DIGITAL = "digital",
  CASH = "cash",
  CREDIT = "credit",
  INVESTMENT = "investment",
  SAVINGS = "savings",
  OTHER = "other"
}

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
 * Interface for account summary calculations
 */
export interface AccountSummary {
  totalAssets: number;
  totalDebts: number;
  netWorth: number;
}
