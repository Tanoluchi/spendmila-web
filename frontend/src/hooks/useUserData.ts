import { useQuery } from '@tanstack/react-query';
import { UsersService } from '@/client/sdk.gen';
import { toast } from 'sonner';

/**
 * Custom hook to fetch and manage user data
 * @returns User data and loading state
 */
export const useUserData = () => {
  const {
    data: userData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userData'],
    queryFn: () => UsersService.readUserMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false
  });
  
  // Handle errors
  if (error) {
    console.error('Error fetching user data:', error);
    toast.error('Error loading user data. Please try again.');
  }

  return {
    userData,
    isLoading,
    error,
    refetch
  };
};

export default useUserData;
