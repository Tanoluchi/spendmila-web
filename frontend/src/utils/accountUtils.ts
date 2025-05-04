import { Account, AccountType, AccountSummary } from "@/types/account";
import { CreditCard, ArrowUpDown, Wallet, Building, Smartphone, PiggyBank } from "lucide-react";

/**
 * Calculate account summary statistics
 * @param accounts List of accounts
 * @returns Object containing totalAssets, totalDebts, and netWorth
 */
export const calculateAccountSummary = (accounts: Account[]): AccountSummary => {
  if (!accounts || accounts.length === 0) {
    return {
      totalAssets: 0,
      totalDebts: 0,
      netWorth: 0
    };
  }

  const assets = accounts.reduce((total, account) => {
    if (account.balance >= 0) {
      return total + account.balance;
    }
    return total;
  }, 0);

  const debts = accounts.reduce((total, account) => {
    if (account.balance < 0) {
      return total + Math.abs(account.balance);
    }
    return total;
  }, 0);

  return {
    totalAssets: assets,
    totalDebts: debts,
    netWorth: assets - debts
  };
};

/**
 * Get icon component for account type
 * @param type Account type
 * @param size Icon size
 * @returns JSX element with appropriate icon
 */
export const getAccountIcon = (type: string, size: number = 20) => {
  switch (type) {
    case AccountType.BANK:
      return <Building className="text-blue-500" size={size} />;
    case AccountType.DIGITAL:
      return <Smartphone className="text-purple-500" size={size} />;
    case AccountType.CASH:
      return <Wallet className="text-green-500" size={size} />;
    case AccountType.CREDIT:
      return <CreditCard className="text-red-500" size={size} />;
    case AccountType.INVESTMENT:
      return <ArrowUpDown className="text-yellow-500" size={size} />;
    case AccountType.SAVINGS:
      return <PiggyBank className="text-emerald-500" size={size} />;
    default:
      return <CreditCard className="text-gray-500" size={size} />;
  }
};

/**
 * Check if account has active debts
 * @param account Account object
 * @returns Boolean indicating if account has debt
 */
export const hasActiveDebt = (account: Account): boolean => {
  // This would check if the account has any associated debts
  // For now, we'll consider credit accounts or negative balances as having debt
  return account.account_type === AccountType.CREDIT || account.balance < 0;
};

/**
 * Get display name for account type
 * @param type Account type
 * @returns Formatted account type name
 */
export const getAccountTypeName = (type: string): string => {
  switch (type) {
    case AccountType.BANK:
      return "Bank Account";
    case AccountType.DIGITAL:
      return "Digital Wallet";
    case AccountType.CASH:
      return "Cash";
    case AccountType.CREDIT:
      return "Credit Card";
    case AccountType.INVESTMENT:
      return "Investment";
    case AccountType.SAVINGS:
      return "Savings";
    case AccountType.OTHER:
      return "Other";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

/**
 * Get color for account type
 * @param type Account type
 * @returns CSS color class
 */
export const getAccountTypeColor = (type: string): string => {
  switch (type) {
    case AccountType.BANK:
      return "border-blue-500";
    case AccountType.DIGITAL:
      return "border-purple-500";
    case AccountType.CASH:
      return "border-green-500";
    case AccountType.CREDIT:
      return "border-red-500";
    case AccountType.INVESTMENT:
      return "border-yellow-500";
    case AccountType.SAVINGS:
      return "border-emerald-500";
    default:
      return "border-gray-500";
  }
};
