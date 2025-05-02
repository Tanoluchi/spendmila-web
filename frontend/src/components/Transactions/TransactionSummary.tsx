import React from 'react';
import { ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react';

interface TransactionSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  netCashflow: number;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  totalIncome,
  totalExpenses,
  netCashflow
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all hover:shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</h4>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(totalIncome)}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all hover:shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</h4>
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(totalExpenses)}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all hover:shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Balance</h4>
          <div className={`p-2 ${netCashflow >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded-full`}>
            <DollarSign className={`h-5 w-5 ${netCashflow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
          </div>
        </div>
        <p className={`text-2xl font-bold ${netCashflow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(netCashflow)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {netCashflow >= 0 ? 'You\'re saving money!' : 'You\'re spending more than earning'}
        </p>
      </div>
    </div>
  );
};

export default TransactionSummary;
