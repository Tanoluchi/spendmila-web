import React from 'react';

// Define Category interface locally to avoid import issues
interface Category {
  id: string;
  name: string;
  description?: string;
  category_type: string;
  icon?: string;
  color?: string;
  is_active: boolean;
}

// Define Account interface locally
interface Account {
  id: string;
  name: string;
  account_type: string;
  balance: number;
  institution?: string;
  is_default: boolean;
}

interface TransactionFiltersProps {
  categoryFilter: string;
  timeFilter: string;
  accountFilter: string;
  categories: Category[];
  accounts: Account[];
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTimeFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAccountFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isLoading: boolean;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  categoryFilter,
  timeFilter,
  accountFilter,
  categories,
  accounts,
  onCategoryChange,
  onTimeFilterChange,
  onAccountFilterChange,
  isLoading
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
      <h3 className="text-lg font-medium dark:text-gray-200">Transaction History</h3>
      <div className="flex flex-wrap gap-3">
        <select 
          className="bg-background dark:text-gray-200 border border-input rounded-md px-3 py-2 text-sm shadow-sm"
          value={accountFilter}
          onChange={onAccountFilterChange}
          disabled={isLoading}
        >
          <option value="ALL">All Accounts</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
        <select 
          className="bg-background dark:text-gray-200 border border-input rounded-md px-3 py-2 text-sm shadow-sm"
          value={categoryFilter}
          onChange={onCategoryChange}
          disabled={isLoading}
        >
          <option value="ALL">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
        <select 
          className="bg-background dark:text-gray-200 border border-input rounded-md px-3 py-2 text-sm shadow-sm"
          value={timeFilter}
          onChange={onTimeFilterChange}
        >
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
          <option value="last-3-months">Last 3 Months</option>
          <option value="all-time">All Time</option>
        </select>
      </div>
    </div>
  );
};

export default TransactionFilters;
