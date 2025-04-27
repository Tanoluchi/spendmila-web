import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import UserSummary from '@/components/Dashboard/UserSummary';
import ExpensesChart from '@/components/Dashboard/ExpensesChart';
import FinancialGoals from '@/components/Dashboard/FinancialGoals';
import RecentTransactions from '@/components/Dashboard/RecentTransactions';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndex,
});

function DashboardIndex() {
  return (
    <div className="grid gap-6">
      {/* User Summary */}
      <UserSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses Chart */}
        <ExpensesChart />
        
        {/* Financial Goals */}
        <FinancialGoals />
      </div>
      
      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}

export default DashboardIndex;
