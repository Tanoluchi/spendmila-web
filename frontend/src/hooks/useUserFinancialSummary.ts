import { useQuery } from '@tanstack/react-query';
import { UsersServiceExtended } from '@/client/services/UsersServiceExtended';
import type { UserFinancialSummary } from '@/types/financials';

// Define a query key for caching and refetching
const userFinancialSummaryQueryKey = ['userFinancialSummary'];

/**
 * Custom hook to fetch the user's financial summary.
 * Leverages React Query for data fetching, caching, and state management.
 */
export const useUserFinancialSummary = () => {
  return useQuery<UserFinancialSummary, Error>({
    queryKey: userFinancialSummaryQueryKey,
    queryFn: () => UsersServiceExtended.readUserFinancialSummary(),
    // Optional: Configure staleTime, cacheTime, refetchOnWindowFocus, etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
