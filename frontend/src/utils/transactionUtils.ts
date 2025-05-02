import { Transaction } from '@/client/services/TransactionService';

/**
 * Format currency display with proper sign based on transaction type
 */
export const formatCurrency = (amount: number, transactionType: string): string => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount));
  
  const isIncome = transactionType === 'income';
  return isIncome ? formattedAmount : `-${formattedAmount}`;
};

/**
 * Get category name from category object or string
 */
export const getCategoryName = (category: any): string => {
  if (!category) return 'Uncategorized';
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && category.name) return category.name;
  return 'Uncategorized';
};

/**
 * Find account name by ID or object
 */
export const getAccountName = (account: any, accounts: any[]): string => {
  if (!account) return 'Unknown Account';
  if (typeof account === 'string') {
    const foundAccount = accounts.find(a => a.id === account);
    return foundAccount ? foundAccount.name : 'Unknown Account';
  }
  if (typeof account === 'object' && account.name) return account.name;
  return 'Unknown Account';
};

/**
 * Apply time filter to transactions
 */
export const applyTimeFilter = (transactions: Transaction[], timeFilter: string): Transaction[] => {
  return transactions.filter((transaction) => {
    // Apply time filter
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    
    if (timeFilter === 'this-month' && transactionDate < firstDayOfMonth) {
      return false;
    } else if (timeFilter === 'last-month' && (transactionDate < firstDayOfLastMonth || transactionDate >= firstDayOfMonth)) {
      return false;
    } else if (timeFilter === 'last-3-months' && transactionDate < threeMonthsAgo) {
      return false;
    }
    
    return true;
  });
};

/**
 * Calculate transaction summary (income, expenses, net)
 */
export const calculateTransactionSummary = (transactions: Transaction[]) => {
  if (!transactions || transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netCashflow: 0,
      categoryBreakdown: {}
    };
  }

  const income = transactions.reduce((total, transaction) => {
    if (transaction.transaction_type === 'income') {
      return total + transaction.amount;
    }
    return total;
  }, 0);

  const expenses = transactions.reduce((total, transaction) => {
    if (transaction.transaction_type === 'expense') {
      return total + transaction.amount;
    }
    return total;
  }, 0);

  // Group transactions by category
  const categoryBreakdown = transactions.reduce((acc, transaction) => {
    const categoryName = getCategoryName(transaction.category);
    
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    
    if (transaction.transaction_type === 'income') {
      acc[categoryName] += transaction.amount;
    } else {
      acc[categoryName] -= transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, number>);

  return {
    totalIncome: income,
    totalExpenses: expenses,
    netCashflow: income - expenses,
    categoryBreakdown
  };
};
