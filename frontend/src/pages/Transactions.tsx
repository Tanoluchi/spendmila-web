import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddTransaction from '@/components/Modals/AddTransaction';
import useTransactions from '@/hooks/useTransactions';
import useCategories from '@/hooks/useCategories';
import { useAccounts } from '@/hooks/useAccounts';
import { applyTimeFilter, calculateTransactionSummary } from '@/utils/transactionUtils';

// Import separated components
import TransactionSummary from '@/components/Transactions/TransactionSummary';
import TransactionTable from '@/components/Transactions/TransactionTable';
import TransactionFilters from '@/components/Transactions/TransactionFilters';
import TransactionPagination from '@/components/Transactions/TransactionPagination';

function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [timeFilter, setTimeFilter] = useState<string>('this-month');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  // Fetch transactions data with pagination and category filter
  const { 
    transactions, 
    totalTransactions, 
    totalPages,
    isLoading, 
    error 
  } = useTransactions(categoryFilter, currentPage, pageSize);
  
  const { accounts } = useAccounts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  
  // Apply time filter to transactions
  const filteredTransactions = applyTimeFilter(transactions, timeFilter);

  // Calculate summary based on filtered transactions
  const filteredSummary = calculateTransactionSummary(filteredTransactions);

  // Handle category filter change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  // Handle time filter change
  const handleTimeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFilter(e.target.value);
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-gray-200">Transactions</h2>
        <button 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 shadow-md"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Add Transaction
        </button>
      </div>
      
      <AddTransaction isOpen={isModalOpen} onOpenChange={setIsModalOpen} />

      {/* Transaction Summary */}
      <TransactionSummary 
        totalIncome={filteredSummary.totalIncome}
        totalExpenses={filteredSummary.totalExpenses}
        netCashflow={filteredSummary.netCashflow}
      />

      <div className="bg-card rounded-lg shadow-md p-6">
        {/* Transaction Filters */}
        <TransactionFilters 
          categoryFilter={categoryFilter}
          timeFilter={timeFilter}
          categories={categories}
          onCategoryChange={handleCategoryChange}
          onTimeFilterChange={handleTimeFilterChange}
          isLoading={categoriesLoading}
        />
        
        {/* Transaction Table */}
        <TransactionTable 
          transactions={filteredTransactions}
          isLoading={isLoading || categoriesLoading}
          error={error}
          accounts={accounts}
        />
        
        {/* Transaction Pagination */}
        <TransactionPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalTransactions={totalTransactions}
          visibleTransactions={filteredTransactions.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}

export default Transactions;
