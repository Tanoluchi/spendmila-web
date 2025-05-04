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
        highestInterestRate: 0,
        highestInterestDebt: null,
        debtTypeBreakdown: {}
      };
    }

    const totalDebt = debtList.reduce((total, debt) => total + debt.amount, 0);
    const monthlyPayments = debtList.reduce((total, debt) => total + debt.minimum_payment, 0);
    
    // Find highest interest rate debt
    const highestInterestDebt = debtList.reduce(
      (highest, debt) => (!highest || debt.interest_rate > highest.interest_rate) ? debt : highest, 
      null as Debt | null
    );

    // Group debts by type
    const debtTypeBreakdown = debtList.reduce((acc, debt) => {
      const type = debt.debt_type;
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += debt.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDebt,
      monthlyPayments,
      highestInterestRate: highestInterestDebt?.interest_rate || 0,
      highestInterestDebt,
      debtTypeBreakdown
    };
  };

  // Get unique debt types from user debts
  const getUniqueDebtTypes = (debtList: Debt[]) => {
    if (!debtList || debtList.length === 0) {
      return [];
    }

    const types = new Set<string>();
    debtList.forEach(debt => {
      if (debt.debt_type) {
        types.add(debt.debt_type);
      }
    });

    return Array.from(types).sort();
  };

  // Calculate progress for each debt
  const calculateDebtProgress = (debt: Debt) => {
    if (!debt || !debt.amount) return 0;
    
    // If we have total_amount and balance, calculate progress
    if (debt.total_amount && debt.total_amount > 0) {
      const paid = debt.total_amount - debt.amount;
      return Math.min(100, Math.round((paid / debt.total_amount) * 100));
    }
    
    // Fallback if we don't have total_amount
    return 0;
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
    getUniqueDebtTypes,
    calculateDebtProgress
  };
};
