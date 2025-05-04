import { useQuery } from '@tanstack/react-query';
import { AccountService } from '@/client/services/AccountService';

/**
 * Hook para obtener los tipos de cuenta disponibles desde el backend
 * Estos se definen en el enum AccountType del backend
 */
export function useAccountTypes() {
  const {
    data: accountTypes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['account-types'],
    queryFn: async () => {
      try {
        // Usar AccountService.getAccountTypes que maneja la autenticación correctamente
        return await AccountService.getAccountTypes();
      } catch (error) {
        console.error('Error obteniendo tipos de cuenta:', error);
        throw new Error('Error al obtener los tipos de cuenta');
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 horas - los tipos de cuenta cambian raramente
    refetchOnWindowFocus: false
  });

  return {
    accountTypes,
    isLoading,
    error,
    refetch
  };
}

export default useAccountTypes;
