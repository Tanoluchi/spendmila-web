import React from 'react';
import { AccountType } from '@/types/account';

interface AccountTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AccountTabs: React.FC<AccountTabsProps> = ({ activeTab, onTabChange }) => {
  // Define tabs based on account types from backend
  const tabs = [
    { id: 'all', label: 'All Accounts' },
    { id: AccountType.BANK, label: 'Bank Accounts' },
    { id: AccountType.SAVINGS, label: 'Savings' },
    { id: AccountType.CREDIT, label: 'Credit Cards' },
    { id: AccountType.INVESTMENT, label: 'Investments' },
    { id: AccountType.DIGITAL, label: 'Digital Wallets' },
    { id: AccountType.CASH, label: 'Cash' },
  ];

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`px-4 py-2 rounded-md ${
            activeTab === tab.id 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default AccountTabs;
