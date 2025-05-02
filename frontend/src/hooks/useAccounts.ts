import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AccountService, type Account, type CreateAccountRequest } from "@/client/services/AccountService";

export const useAccounts = () => {
  const queryClient = useQueryClient();

  // Fetch accounts query
  const {
    data: accounts,
    isLoading,
    error,
    refetch
  } = useQuery<Account[], Error>({
    queryKey: ["accounts"],
    queryFn: async () => {
      try {
        return await AccountService.getAccounts();
      } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
      }
    },
    retry: 1
  });

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: (data: CreateAccountRequest) => 
      AccountService.createAccount(data),
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error creating account:", error);
      toast.error("Failed to create account. Please try again.");
    }
  });

  // Update account mutation
  const updateAccountMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAccountRequest }) => 
      AccountService.updateAccount(id, data),
    onSuccess: () => {
      toast.success("Account updated successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error updating account:", error);
      toast.error("Failed to update account. Please try again.");
    }
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: (id: string) => AccountService.deleteAccount(id),
    onSuccess: () => {
      toast.success("Account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    }
  });

  // Calculate account summary
  const calculateAccountSummary = (accts: Account[]) => {
    if (!accts || accts.length === 0) {
      return {
        totalAssets: 0,
        totalDebts: 0,
        netWorth: 0
      };
    }

    const assets = accts.reduce((total, account) => {
      if (account.balance >= 0) {
        return total + account.balance;
      }
      return total;
    }, 0);

    const debts = accts.reduce((total, account) => {
      if (account.balance < 0) {
        return total + Math.abs(account.balance);
      }
      return total;
    }, 0);

    return {
      totalAssets: assets,
      totalDebts: debts,
      netWorth: assets - debts
    };
  };

  return { 
    accounts: accounts || [],
    isLoading,
    error,
    refetch,
    createAccount: createAccountMutation.mutate,
    updateAccount: updateAccountMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,
    calculateAccountSummary
  };
};
