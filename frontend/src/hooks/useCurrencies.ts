import { useQuery } from "@tanstack/react-query";
import { CurrencyService, type Currency } from "@/client/services/CurrencyService";

export const useCurrencies = () => {
  const {
    data: currencies,
    isLoading,
    error,
    refetch
  } = useQuery<Currency[], Error>({
    queryKey: ["currencies"],
    queryFn: async () => {
      try {
        return await CurrencyService.getCurrencies();
      } catch (error) {
        console.error("Error fetching currencies:", error);
        throw error;
      }
    },
    retry: 1
  });

  return {
    currencies: currencies || [],
    isLoading,
    error,
    refetch
  };
};
