import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  TransactionService, 
  type Transaction, 
  type CreateTransactionRequest,
  type PaginatedTransactionsResponse
} from "@/client/services/TransactionService";

export const useTransactions = (
  categoryFilter?: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const queryClient = useQueryClient();

  // Fetch transactions with pagination for the logged-in user
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery<PaginatedTransactionsResponse, Error>({
    queryKey: ["transactions", categoryFilter, page, pageSize],
    queryFn: async () => {
      try {
        return await TransactionService.getTransactions(page, pageSize, categoryFilter);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
      }
    },
    retry: 1
  });

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateTransactionRequest) => 
      TransactionService.createTransaction(data),
    onSuccess: () => {
      toast.success("Transaction created successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction. Please try again.");
    }
  });

  // Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateTransactionRequest }) => 
      TransactionService.updateTransaction(id, data),
    onSuccess: () => {
      toast.success("Transaction updated successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction. Please try again.");
    }
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: (id: string) => TransactionService.deleteTransaction(id),
    onSuccess: () => {
      toast.success("Transaction deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction. Please try again.");
    }
  });

  // Calculate transaction summary
  const calculateTransactionSummary = (trans: Transaction[]) => {
    if (!trans || trans.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netCashflow: 0,
        categoryBreakdown: {}
      };
    }

    const income = trans.reduce((total, transaction) => {
      if (transaction.transaction_type === 'income') {
        return total + transaction.amount;
      }
      return total;
    }, 0);

    const expenses = trans.reduce((total, transaction) => {
      if (transaction.transaction_type === 'expense') {
        return total + transaction.amount;
      }
      return total;
    }, 0);

    // Group transactions by category
    const categoryBreakdown = trans.reduce((acc, transaction) => {
      const categoryName = transaction.category?.name || 'Uncategorized';
      
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      
      if (transaction.transaction_type === 'income') {
        acc[categoryName] += transaction.amount;
      } else {
        acc[categoryName] -= transaction.amount;
      }
      
      return acc;
    }, {} as Record<string, number>);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netCashflow: income - expenses,
      categoryBreakdown
    };
  };

  // Extract data from the paginated response
  const transactions = data?.items || [];
  const totalTransactions = data?.total || 0;
  const totalPages = data?.total_pages || 1;
  const currentPage = data?.page || 1;

  // Calculate summary for current page
  const summary = calculateTransactionSummary(transactions);

  return {
    transactions,
    totalTransactions,
    currentPage,
    totalPages,
    pageSize,
    isLoading,
    error,
    refetch,
    createTransaction: createTransactionMutation.mutate,
    updateTransaction: updateTransactionMutation.mutate,
    deleteTransaction: deleteTransactionMutation.mutate,
    calculateTransactionSummary,
    summary
  };
};

// Add default export
export default useTransactions;
