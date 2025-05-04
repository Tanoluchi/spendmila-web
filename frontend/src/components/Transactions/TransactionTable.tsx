import React, { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import EditTransaction from '@/components/Modals/EditTransaction';
import DeleteTransactionDialog from '@/components/Transactions/DeleteTransactionDialog';

// Define Transaction interface locally to avoid import issues
interface Category {
  id: string;
  name: string;
  description?: string;
  category_type: string;
  icon?: string;
  color?: string;
  is_active: boolean;
}

interface Account {
  id: string;
  name: string;
  account_type: string;
  balance: number;
  institution?: string;
  icon?: string;
  color?: string;
  is_default: boolean;
  user_id: string;
  currency_id: string;
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  transaction_type: 'income' | 'expense';
  category: Category;
  account: Account;
  user_id: string;
  currency: Currency;
  is_active: boolean;
  notes?: string;
}

// Define utility functions locally to avoid import issues
const getCategoryName = (category: any): string => {
  if (!category) return 'Uncategorized';
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && category.name) return category.name;
  return 'Uncategorized';
};

const getAccountName = (account: any, accounts: any[]): string => {
  if (!account) return 'Unknown Account';
  if (typeof account === 'string') {
    const foundAccount = accounts.find(a => a.id === account);
    return foundAccount ? foundAccount.name : 'Unknown Account';
  }
  if (typeof account === 'object' && account.name) return account.name;
  return 'Unknown Account';
};

const formatCurrency = (amount: number, transactionType: string): string => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount));
  
  const isIncome = transactionType === 'income';
  return isIncome ? formattedAmount : `-${formattedAmount}`;
};

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  accounts: any[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
  error,
  accounts
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };
  
  if (isLoading) {
    return <div className="text-center py-8 dark:text-gray-200">Loading transactions...</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading transactions. Please try again.</div>;
  }
  
  if (transactions.length === 0) {
    return <div className="text-center py-8 dark:text-gray-200">No transactions found. Add your first transaction!</div>;
  }
  
  return (
    <>
      <div className="overflow-x-auto dark:text-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold">Date</th>
              <th className="text-left py-3 px-4 font-semibold">Description</th>
              <th className="text-left py-3 px-4 font-semibold">Category</th>
              <th className="text-left py-3 px-4 font-semibold">Account</th>
              <th className="text-right py-3 px-4 font-semibold">Amount</th>
              <th className="text-right py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-muted/50">
                <td className="py-3 px-4">{format(new Date(transaction.date), 'yyyy-MM-dd')}</td>
                <td className="py-3 px-4">{transaction.description}</td>
                <td className="py-3 px-4">{getCategoryName(transaction.category)}</td>
                <td className="py-3 px-4">{getAccountName(transaction.account, accounts)}</td>
                <td className={`py-3 px-4 text-right font-medium ${transaction.transaction_type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(transaction.amount, transaction.transaction_type)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditClick(transaction)}
                      className="p-1 text-gray-600 hover:text-purple-600 transition-colors dark:text-gray-400 dark:hover:text-purple-400"
                      title="Edit transaction"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(transaction)}
                      className="p-1 text-gray-600 hover:text-red-600 transition-colors dark:text-gray-400 dark:hover:text-red-400"
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Edit Transaction Modal */}
      <EditTransaction 
        isOpen={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen} 
        transaction={selectedTransaction} 
      />
      
      {/* Delete Transaction Dialog */}
      {selectedTransaction && (
        <DeleteTransactionDialog 
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          transactionId={selectedTransaction.id}
          transactionDescription={selectedTransaction.description}
        />
      )}
    </>
  );
};

export default TransactionTable;
