import { Plus, Edit, Trash2, CreditCard, ArrowUpDown, AlertCircle, ExternalLink } from 'lucide-react';
import AddAccount from '@/components/Modals/AddAccount';
import useAccountsData from '@/hooks/useAccountsData';
import { formatCurrency } from '@/utils/formatters';
import AccountSummary from '@/components/Accounts/AccountSummary';
import DeleteAccountDialog from '@/components/Accounts/DeleteAccountDialog';

function Accounts() {
  const { 
    filteredAccounts, 
    isLoading, 
    summary, 
    activeTab, 
    isModalOpen, 
    deleteDialogOpen, 
    selectedAccount,
    accountTypes,
    setIsModalOpen, 
    setDeleteDialogOpen, 
    handleTabChange, 
    handleDeleteAccount, 
    confirmDeleteAccount, 
    handleEditAccount, 
    handleViewTransactions, 
    getLastUpdated, 
    getTransactionCount 
  } = useAccountsData();

  // Helper function to get account icon based on type
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="text-blue-500" size={20} />;
      case 'savings':
        return <CreditCard className="text-green-500" size={20} />;
      case 'credit':
        return <CreditCard className="text-red-500" size={20} />;
      case 'investment':
        return <ArrowUpDown className="text-yellow-500" size={20} />;
      default:
        return <CreditCard className="text-gray-500" size={20} />;
    }
  };

  // Check if account has active debts
  const hasActiveDebt = (account: any) => {
    // This would check if the account has any associated debts
    // For demo purposes, we'll consider credit accounts or negative balances as having debt
    return account.account_type === 'credit' || account.balance < 0;
  };
  
  // Helper function to get display name for account type
  const getAccountTypeDisplayName = (type: string) => {
    switch (type) {
      case 'checking':
        return 'Checking';
      case 'savings':
        return 'Savings';
      case 'credit':
        return 'Credit Cards';
      case 'investment':
        return 'Investments';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold dark:text-gray-200">Financial Accounts</h1>
        <p className="text-muted-foreground dark:text-gray-400">Manage your bank accounts, credit cards, and investments</p>
      </div>
      
      <AccountSummary summary={summary} />
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
            onClick={() => handleTabChange('all')}
          >
            All Accounts
          </button>
          
          {/* Dynamically generate account type filter buttons */}
          {accountTypes.map(type => (
            <button
              key={type}
              className={`px-4 py-2 rounded-md ${activeTab === type ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
              onClick={() => handleTabChange(type)}
            >
              {getAccountTypeDisplayName(type)}
            </button>
          ))}
        </div>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 z-10"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Add Account
        </button>
      </div>
      
      <AddAccount isOpen={isModalOpen} onOpenChange={setIsModalOpen} accountId={selectedAccount} />
      <DeleteAccountDialog 
        isOpen={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteAccount}
      />
      
      {isLoading ? (
        <div className="flex justify-center py-8 dark:text-gray-200">
          <p>Loading accounts...</p>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 dark:text-gray-200">
          <p className="mb-4">No accounts found in this category.</p>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            Add Account
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Account
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Institution
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Balance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Transactions
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700 dark:text-gray-200">
              {filteredAccounts.map((account) => (
                <tr 
                  key={account.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td 
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    onClick={() => handleViewTransactions(account.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        {getAccountIcon(account.account_type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{account.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{account.account_type}</div>
                      </div>
                      {hasActiveDebt(account) && (
                        <div className="ml-2">
                          <AlertCircle className="text-amber-500" size={16} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{account.institution || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(account.balance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{getLastUpdated(account.id)}</div>
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-center cursor-pointer"
                    onClick={() => handleViewTransactions(account.id)}
                  >
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {getTransactionCount(account.id)} transactions
                      <ExternalLink size={12} className="ml-1" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAccount(account.id);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAccount(account.id);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Accounts;
