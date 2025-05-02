import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  BudgetService, 
  type Budget, 
  type CreateBudgetRequest 
} from "@/client/services/BudgetService";

export const useBudgets = () => {
  const queryClient = useQueryClient();

  // Fetch all budgets for the logged-in user
  const {
    data: budgets,
    isLoading,
    error,
    refetch
  } = useQuery<Budget[], Error>({
    queryKey: ["budgets"],
    queryFn: async () => {
      try {
        return await BudgetService.getBudgets();
      } catch (error) {
        console.error("Error fetching budgets:", error);
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
    },
    onError: (error) => {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget. Please try again.");
    }
  });

  // Calculate budget summary
  const calculateBudgetSummary = (budgetList: Budget[]) => {
    if (!budgetList || budgetList.length === 0) {
      return {
        totalBudgeted: 0,
        totalSpent: 0,
        totalRemaining: 0,
        categoryBreakdown: {}
      };
    }

    const totalBudgeted = budgetList.reduce((total, budget) => total + budget.amount, 0);
    const totalSpent = budgetList.reduce((total, budget) => total + (budget.spent || 0), 0);
    const totalRemaining = totalBudgeted - totalSpent;

    // Group budgets by category
    const categoryBreakdown = budgetList.reduce((acc, budget) => {
      const category = budget.category;
      if (!acc[category]) {
        acc[category] = {
          budgeted: 0,
          spent: 0,
          remaining: 0
        };
      }
      
      acc[category].budgeted += budget.amount;
      acc[category].spent += (budget.spent || 0);
      acc[category].remaining = acc[category].budgeted - acc[category].spent;
      
      return acc;
    }, {} as Record<string, { budgeted: number; spent: number; remaining: number }>);

    return {
      totalBudgeted,
      totalSpent,
      totalRemaining,
      categoryBreakdown
    };
  };

  return {
    budgets: budgets || [],
    totalBudgets: budgets?.length || 0,
    isLoading,
    error,
    refetch,
    createBudget: createBudgetMutation.mutate,
    updateBudget: updateBudgetMutation.mutate,
    deleteBudget: deleteBudgetMutation.mutate,
    calculateBudgetSummary
  };
};
