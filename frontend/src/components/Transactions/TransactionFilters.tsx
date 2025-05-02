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

interface TransactionFiltersProps {
  categoryFilter: string;
  timeFilter: string;
  categories: Category[];
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTimeFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isLoading: boolean;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  categoryFilter,
  timeFilter,
  categories,
  onCategoryChange,
  onTimeFilterChange,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-medium dark:text-gray-200">Transaction History</h3>
      <div className="flex gap-3">
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
