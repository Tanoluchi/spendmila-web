import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { AccountSummary as AccountSummaryType } from '@/types/account';

interface AccountSummaryProps {
  summary: AccountSummaryType;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ summary }) => {
  const { totalAssets, totalDebts, netWorth } = summary;

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 dark:text-gray-200">
      <h3 className="text-lg font-medium mb-4">Account Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-background rounded-md">
          <p className="text-sm text-muted-foreground">Total Assets</p>
          <p className="text-xl font-bold text-green-500">{formatCurrency(totalAssets)}</p>
        </div>
        <div className="p-3 bg-background rounded-md">
          <p className="text-sm text-muted-foreground">Total Debts</p>
          <p className="text-xl font-bold text-red-500">
            {totalDebts > 0 ? `-${formatCurrency(totalDebts)}` : formatCurrency(0)}
          </p>
        </div>
        <div className="p-3 bg-background rounded-md">
          <p className="text-sm text-muted-foreground">Net Worth</p>
          <p className={`text-xl font-bold ${netWorth > 0 ? 'text-green-500' : netWorth < 0 ? 'text-red-500' : ''}`}>
            {formatCurrency(netWorth)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
