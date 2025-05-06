import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { 
  BudgetService, 
  type CreateBudgetRequest, 
  type BudgetSummary, 
  type PaginatedBudgetResponse 
} from "@/client/services/BudgetService";
import { TransactionService } from "@/client/services/TransactionService";
import { type TransactionFilter } from "@/types/transaction";

export const useBudgets = (year?: number, month?: number) => {
  // State for tracking currently selected budget
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch budgets query with budget summary included
  const {
    data: budgetsResponse,
    isLoading,
    error,
    refetch
  } = useQuery<PaginatedBudgetResponse, Error>({
    queryKey: ["budgets", { year, month }],
    queryFn: async () => {
      try {
        return await BudgetService.getBudgets(year, month);
      } catch (error) {
        console.error("Error fetching budgets:", error);
        throw error;
      }
    },
    retry: 1
  });
  
  // Extract the actual budget items and summary from the paginated response
  const budgets = budgetsResponse?.items || [];
  const budgetSummary = budgetsResponse?.summary;

  // Fetch budget progress data
  const {
    data: budgetProgressData,
    isLoading: isLoadingProgress,
    error: progressError
  } = useQuery<{ budgets: any[], summary: BudgetSummary }, Error>({
    queryKey: ["budget-progress", { year, month }],
    queryFn: async () => {
      try {
        return await BudgetService.getBudgetProgress(year, month);
      } catch (error) {
        console.error("Error fetching budget progress:", error);
        throw error;
      }
    },
    retry: 1
  });

  // Create budget mutation
  const createBudgetMutation = useMutation({
    mutationFn: (data: CreateBudgetRequest) => 
      BudgetService.createBudget(data),
    onSuccess: () => {
      toast.success("Budget created successfully");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget-totals"] });
    },
    onError: (error) => {
      console.error("Error creating budget:", error);
      toast.error("Failed to create budget. Please try again.");
    }
  });

  // Update budget mutation
  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateBudgetRequest }) => 
      BudgetService.updateBudget(id, data),
    onSuccess: () => {
      toast.success("Budget updated successfully");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget-totals"] });
    },
    onError: (error) => {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget. Please try again.");
    }
  });

  // Delete budget mutation
  const deleteBudgetMutation = useMutation({
    mutationFn: (id: string) => BudgetService.deleteBudget(id),
    onSuccess: () => {
      toast.success("Budget deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget-totals"] });
    },
    onError: (error) => {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget. Please try again.");
    }
  });

  // We don't need to calculate the budget status anymore as it comes directly from the API
  // But we'll keep a simple getter for compatibility
  const getBudgetStatus = () => {
    if (!budgetSummary) {
      return {
        status: "on-track",
        percentage: 0,
        total_budgeted: 0,
        total_spent: 0,
        remaining: 0,
        currency_symbol: "$",
        currency_code: "USD"
      };
    }

    return {
      status: budgetSummary.status,
      percentage: budgetSummary.percentage,
      total_budgeted: budgetSummary.total_budgeted,
      total_spent: budgetSummary.total_spent,
      remaining: budgetSummary.remaining,
      currency_symbol: budgetSummary.currency_symbol,
      currency_code: budgetSummary.currency_code
    };
  };

  // Extract pagination metadata
  const pagination = budgetsResponse ? {
    total: budgetsResponse.total,
    page: budgetsResponse.page,
    pageSize: budgetsResponse.page_size,
    totalPages: budgetsResponse.total_pages
  } : {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  };

  return { 
    budgets,
    pagination,
    budgetSummary,
    progressData: budgetProgressData?.budgets || [],
    isLoading: isLoading || isLoadingProgress,
    error: error || progressError,
    refetch,
    createBudget: createBudgetMutation.mutate,
    updateBudget: updateBudgetMutation.mutate,
    deleteBudget: deleteBudgetMutation.mutate,
    getBudgetStatus,
    
    // Get transactions for a specific budget's category within the selected month/year
    getTransactionsByBudget: (categoryId: string) => {
      // Ensure year and month are defined before creating dates
      if (year === undefined || month === undefined) {
        // Optionally, return a rejected promise or an empty array, or throw an error
        // For now, let's log an error and return a promise that resolves to empty results
        // to prevent crashes if this function is somehow called with undefined year/month.
        console.error("Year or month is undefined in getTransactionsByBudget");
        return Promise.resolve({ items: [], total: 0, page: 1, page_size: 0, total_pages: 0 }); 
      }

      // Calculate start_date and end_date from the hook's year and month state
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Day 0 of next month is last day of current month

      const formatDate = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      const filter: TransactionFilter = {
        category_id: categoryId,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        limit: 100 // Or some other appropriate limit
      };
      return TransactionService.getTransactions(filter);
    },
    
    // Set the selected budget ID
    selectedBudgetId,
    setSelectedBudgetId
  };
};
