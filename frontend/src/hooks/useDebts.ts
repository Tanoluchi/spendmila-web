import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  DebtService, 
  type Debt, 
  type CreateDebtRequest 
} from "@/client/services/DebtService";

export const useDebts = () => {
  const queryClient = useQueryClient();

  // Fetch all debts for the logged-in user
  const {
    data: debts,
    isLoading,
    error,
    refetch
  } = useQuery<Debt[], Error>({
    queryKey: ["debts"],
    queryFn: async () => {
      try {
        return await DebtService.getDebts();
      } catch (error) {
        console.error("Error fetching debts:", error);
        throw error;
      }
    },
    retry: 1
  });

  // Create debt mutation
  const createDebtMutation = useMutation({
    mutationFn: (data: CreateDebtRequest) => 
      DebtService.createDebt(data),
    onSuccess: () => {
      toast.success("Debt created successfully");
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
    onError: (error) => {
      console.error("Error creating debt:", error);
      toast.error("Failed to create debt. Please try again.");
    }
  });

  // Update debt mutation
  const updateDebtMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateDebtRequest }) => 
      DebtService.updateDebt(id, data),
    onSuccess: () => {
      toast.success("Debt updated successfully");
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
    onError: (error) => {
      console.error("Error updating debt:", error);
      toast.error("Failed to update debt. Please try again.");
    }
  });

  // Delete debt mutation
  const deleteDebtMutation = useMutation({
    mutationFn: (id: string) => DebtService.deleteDebt(id),
    onSuccess: () => {
      toast.success("Debt deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
    onError: (error) => {
      console.error("Error deleting debt:", error);
      toast.error("Failed to delete debt. Please try again.");
    }
  });

  // Calculate debt summary
  const calculateDebtSummary = (debtList: Debt[]) => {
    if (!debtList || debtList.length === 0) {
      return {
        totalDebt: 0,
        monthlyPayments: 0,
        averageInterestRate: 0,
        debtTypeBreakdown: {}
      };
    }

    const totalDebt = debtList.reduce((total, debt) => total + debt.balance, 0);
    const monthlyPayments = debtList.reduce((total, debt) => total + debt.minimum_payment, 0);
    
    // Calculate weighted average interest rate
    const weightedInterestSum = debtList.reduce(
      (sum, debt) => sum + (debt.interest_rate * debt.balance), 
      0
    );
    const averageInterestRate = weightedInterestSum / totalDebt;

    // Group debts by type
    const debtTypeBreakdown = debtList.reduce((acc, debt) => {
      const type = debt.debt_type;
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += debt.balance;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDebt,
      monthlyPayments,
      averageInterestRate,
      debtTypeBreakdown
    };
  };

  // Calculate debt payoff strategies
  const calculatePayoffStrategies = (debtList: Debt[]) => {
    if (!debtList || debtList.length === 0) {
      return {
        avalanche: [],
        snowball: []
      };
    }

    // Avalanche method - sort by highest interest rate first
    const avalanche = [...debtList].sort((a, b) => b.interest_rate - a.interest_rate);
    
    // Snowball method - sort by lowest balance first
    const snowball = [...debtList].sort((a, b) => a.balance - b.balance);

    return {
      avalanche,
      snowball
    };
  };

  return {
    debts: debts || [],
    totalDebts: debts?.length || 0,
    isLoading,
    error,
    refetch,
    createDebt: createDebtMutation.mutate,
    updateDebt: updateDebtMutation.mutate,
    deleteDebt: deleteDebtMutation.mutate,
    calculateDebtSummary,
    calculatePayoffStrategies
  };
};
