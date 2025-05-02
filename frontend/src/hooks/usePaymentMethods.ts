import { useQuery } from "@tanstack/react-query";
import { PaymentMethod, PaymentMethodService } from "../client/services/PaymentMethodService";

export type { PaymentMethod } from "../client/services/PaymentMethodService";

export const usePaymentMethods = () => {
  const {
    data: paymentMethods,
    isLoading,
    error,
    refetch
  } = useQuery<PaymentMethod[], Error>({
    queryKey: ["paymentMethods"],
    queryFn: async () => {
      try {
        return await PaymentMethodService.getPaymentMethods();
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        throw error;
      }
    },
    retry: 1
  });

  return {
    paymentMethods: paymentMethods || [],
    isLoading,
    error,
    refetch
  };
};
