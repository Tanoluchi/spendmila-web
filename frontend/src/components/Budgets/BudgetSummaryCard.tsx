import React from 'react';
import { BudgetSummaryCardProps } from '@/types/budget';
import { formatCurrency } from '@/utils/formatters';

/**
 * Componente para mostrar el resumen general del presupuesto
 */
const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({ 
  summary, 
  month, 
  onMonthChange, 
  availableMonths 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Summary</h3>
        <select 
          className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
        >
          {availableMonths.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget:</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(summary.totalBudget)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent:</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(summary.totalSpent)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Remaining:</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(summary.remaining)}
          </p>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-4">
        <div 
          className="bg-purple-600 h-2.5 rounded-full" 
          style={{ width: `${summary.progressPercentage}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Overall Budget: {summary.progressPercentage}%
      </p>
    </div>
  );
};

export default BudgetSummaryCard;
