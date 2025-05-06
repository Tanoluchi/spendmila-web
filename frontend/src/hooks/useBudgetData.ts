import { useState, useMemo, useCallback } from 'react';
import { useBudgets } from '@/hooks/useBudgets';
import { useUserData } from '@/hooks/useUserData';
import { useQueryClient } from '@tanstack/react-query';

// Define chart data types
type ChartData = { name: string; value: number; color: string }[];

/**
 * Custom hook for managing budget data and related operations
 */
export const useBudgetData = () => {
  // State for UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  
  // Month and year state for filtering
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);

  // Get the user data for currency info
  const { userData } = useUserData();

  // Get budget data from the API with the current month and year
  const { 
    budgets, 
    budgetSummary,
    progressData,
    isLoading, 
    error, 
    createBudget,
    updateBudget,
    deleteBudget,
    getTransactionsByBudget,
    selectedBudgetId: hookSelectedBudgetId,
    setSelectedBudgetId: hookSetSelectedBudgetId
  } = useBudgets(year, month);

  // Client for React Query cache management
  const queryClient = useQueryClient();

  // Available month options for the month selector
  const availableMonths = useMemo(() => [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ], []);
  
  // Available year options (current year and 2 years before)
  const availableYears = useMemo(() => {
    const currentYear = today.getFullYear();
    return [
      { value: currentYear - 2, label: `${currentYear - 2}` },
      { value: currentYear - 1, label: `${currentYear - 1}` },
      { value: currentYear, label: `${currentYear}` },
    ];
  }, [today]);

  // Determine if budgets are empty
  const isEmpty = useMemo(() => {
    return !isLoading && (!budgets || budgets.length === 0);
  }, [isLoading, budgets]);

  // Create chart data for the pie chart
  const chartData: ChartData = useMemo(() => {
    if (!budgets || budgets.length === 0) return [];
    
    return budgets.map(budget => ({
      name: budget.name,
      value: budget.spent_amount,
      color: budget.color || '#CBD5E1' // Default color if none specified
    }));
  }, [budgets]);

  // Get the budget status directly from the API response
  const budgetStatus = useMemo(() => {
    if (!budgetSummary) return { 
      status: 'no-budget', 
      percentage: 0,
      total_budgeted: 0,
      total_spent: 0,
      remaining: 0,
      currency_symbol: '$',
      currency_code: 'USD'
    };
    
    return {
      status: budgetSummary.status,
      percentage: budgetSummary.percentage,
      total_budgeted: budgetSummary.total_budgeted,
      total_spent: budgetSummary.total_spent,
      remaining: budgetSummary.remaining,
      currency_symbol: budgetSummary.currency_symbol,
      currency_code: budgetSummary.currency_code
    };
  }, [budgetSummary]);

  // Handle month change
  const handleMonthChange = useCallback((value: string) => {
    setMonth(parseInt(value, 10));
  }, []);
  
  // Handle year change
  const handleYearChange = useCallback((value: string) => {
    setYear(parseInt(value, 10));
  }, []);

  // Handle budget deletion
  const handleDeleteBudget = useCallback((id: string) => {
    setSelectedBudget(id);
    setDeleteDialogOpen(true);
  }, []);

  // Handle budget editing
  const handleEditBudget = useCallback((id: string) => {
    setSelectedBudget(id);
    setIsModalOpen(true);
  }, []);

  // Confirm budget deletion
  const confirmDeleteBudget = useCallback(async () => {
    if (selectedBudget) {
      try {
        await deleteBudget(selectedBudget);
        setDeleteDialogOpen(false);
        setSelectedBudget(null);
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
        queryClient.invalidateQueries({ queryKey: ['budget-totals'] });
      } catch (error) {
        console.error("Error deleting budget:", error);
      }
    }
  }, [selectedBudget, deleteBudget, queryClient]);

  // Format money based on user currency
  const formatMoney = useCallback((amount: number) => {
    const currencySymbol = budgetSummary?.currency_symbol || '$';
    return `${currencySymbol}${amount.toLocaleString()}`;
  }, [budgetSummary]);

  return {
    budgets,
    budgetSummary,
    progressData,
    chartData,
    budgetStatus,
    userData,
    isLoading,
    isEmpty,
    error,
    year,
    month,
    availableMonths,
    availableYears,
    isModalOpen,
    deleteDialogOpen,
    selectedBudget,
    setIsModalOpen,
    setDeleteDialogOpen,
    handleMonthChange,
    handleYearChange,
    handleDeleteBudget,
    handleEditBudget,
    confirmDeleteBudget,
    createBudget,
    updateBudget,
    formatMoney,
    getTransactionsByBudget,
    selectedBudgetId: hookSelectedBudgetId,
    setSelectedBudgetId: hookSetSelectedBudgetId
  };
};

export default useBudgetData;
