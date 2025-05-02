import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  GoalService, 
  type Goal, 
  type CreateGoalRequest 
} from "@/client/services/GoalService";

export const useGoals = () => {
  const queryClient = useQueryClient();

  // Fetch all goals for the logged-in user
  const {
    data: goals,
    isLoading,
    error,
    refetch
  } = useQuery<Goal[], Error>({
    queryKey: ["goals"],
    queryFn: async () => {
      try {
        return await GoalService.getGoals();
      } catch (error) {
        console.error("Error fetching goals:", error);
        throw error;
      }
    },
    retry: 1
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: (data: CreateGoalRequest) => 
      GoalService.createGoal(data),
    onSuccess: () => {
      toast.success("Goal created successfully");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (error) => {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal. Please try again.");
    }
  });

  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateGoalRequest }) => 
      GoalService.updateGoal(id, data),
    onSuccess: () => {
      toast.success("Goal updated successfully");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (error) => {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal. Please try again.");
    }
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: (id: string) => GoalService.deleteGoal(id),
    onSuccess: () => {
      toast.success("Goal deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (error) => {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal. Please try again.");
    }
  });

  // Calculate goal progress
  const calculateGoalProgress = (goal: Goal) => {
    if (!goal) return 0;
    const progress = (goal.current_amount / goal.target_amount) * 100;
    return Math.min(Math.max(progress, 0), 100); // Ensure between 0-100
  };

  return {
    goals: goals || [],
    totalGoals: goals?.length || 0,
    isLoading,
    error,
    refetch,
    createGoal: createGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    deleteGoal: deleteGoalMutation.mutate,
    calculateGoalProgress
  };
};
