import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  SubscriptionService,
  type Subscription,
  type CreateSubscriptionRequest
} from "@/client/services/SubscriptionService";

export const useSubscriptions = () => {
  const queryClient = useQueryClient();

  // Fetch all subscriptions for the logged-in user
  const {
    data: subscriptions,
    isLoading,
    error,
    refetch
  } = useQuery<Subscription[], Error>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      try {
        return await SubscriptionService.getSubscriptions();
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        throw error;
      }
    },
    retry: 1
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: (data: CreateSubscriptionRequest) => 
      SubscriptionService.createSubscription(data),
    onSuccess: () => {
      toast.success("Subscription created successfully");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (error) => {
      console.error("Error creating subscription:", error);
      toast.error("Failed to create subscription. Please try again.");
    }
  });

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateSubscriptionRequest }) => 
      SubscriptionService.updateSubscription(id, data),
    onSuccess: () => {
      toast.success("Subscription updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (error) => {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription. Please try again.");
    }
  });

  // Delete subscription mutation
  const deleteSubscriptionMutation = useMutation({
    mutationFn: (id: string) => SubscriptionService.deleteSubscription(id),
    onSuccess: () => {
      toast.success("Subscription deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (error) => {
      console.error("Error deleting subscription:", error);
      toast.error("Failed to delete subscription. Please try again.");
    }
  });

  // Calculate subscription summary
  const calculateSubscriptionSummary = (subs: Subscription[]) => {
    if (!subs || subs.length === 0) {
      return {
        totalCount: 0,
        monthlyCost: 0,
        yearlyCost: 0,
        frequencyBreakdown: {
          monthly: 0,
          quarterly: 0,
          yearly: 0
        }
      };
    }

    // Calculate monthly equivalent for all subscriptions
    const monthlyTotal = subs.reduce((total, sub) => {
      let amount = sub.amount;
      if (sub.frequency === "yearly") {
        amount = amount / 12;
      } else if (sub.frequency === "quarterly") {
        amount = amount / 3;
      }
      return total + amount;
    }, 0);

    // Count subscriptions by frequency
    const frequencyBreakdown = subs.reduce(
      (acc, sub) => {
        const frequency = sub.frequency as keyof typeof acc;
        if (acc[frequency] !== undefined) {
          acc[frequency]++;
        }
        return acc;
      },
      { monthly: 0, quarterly: 0, yearly: 0 }
    );

    return {
      totalCount: subs.length,
      monthlyCost: monthlyTotal,
      yearlyCost: monthlyTotal * 12,
      frequencyBreakdown
    };
  };

  return {
    subscriptions: subscriptions || [],
    totalSubscriptions: subscriptions?.length || 0,
    isLoading,
    error,
    refetch,
    createSubscription: createSubscriptionMutation.mutate,
    updateSubscription: updateSubscriptionMutation.mutate,
    deleteSubscription: deleteSubscriptionMutation.mutate,
    calculateSubscriptionSummary
  };
};
