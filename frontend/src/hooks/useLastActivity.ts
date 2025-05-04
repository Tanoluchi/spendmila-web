import { useQuery } from '@tanstack/react-query';
import { TransactionService } from '@/client/services/TransactionService';

/**
 * Hook personalizado para obtener la última actividad (transacción) de una cuenta
 */
export const useLastActivity = (accountId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['lastTransaction', accountId],
    queryFn: async () => {
      try {
        // Obtener todas las transacciones de la cuenta (primera página con tamaño 1)
        // Ordenado por fecha descendente para obtener la más reciente
        const response = await TransactionService.getTransactions(1, 1, undefined, accountId);
        // Si hay transacciones, devolver la primera (la más reciente)
        return response.items.length > 0 ? response.items[0] : null;
      } catch (error) {
        console.error('Error al obtener la última transacción:', error);
        return null;
      }
    },
    // Solo ejecutar la consulta si se proporciona un accountId
    enabled: !!accountId,
  });

  // Formatear la fecha de la última transacción
  const formatLastUpdated = () => {
    if (!data) return 'No activity';
    
    // Convertir la fecha en formato ISO a objeto Date
    const date = new Date(data.date);
    
    // Formatear la fecha
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    lastTransaction: data,
    isLoading,
    formatLastUpdated
  };
};

export default useLastActivity;
