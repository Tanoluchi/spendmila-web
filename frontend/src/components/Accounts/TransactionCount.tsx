import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import type { TransactionCountProps } from '@/types/account';

/**
 * Componente para mostrar el conteo de transacciones con carga asíncrona y límites configurables
 */
const TransactionCount: React.FC<TransactionCountProps> = ({ 
  accountId, 
  getTransactionCount,
  options = { limit: 20, showCountOverLimit: true }
}) => {
  // Valores por defecto para las opciones
  const { limit = 20, showCountOverLimit = true } = options;
  
  // Estado local para gestionar la carga asíncrona
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchCount = async () => {
      try {
        setLoading(true);
        const transactionCount = await getTransactionCount(accountId);
        if (isMounted) {
          setCount(transactionCount);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching transaction count:', error);
        if (isMounted) {
          setCount(0);
          setLoading(false);
        }
      }
    };
    
    fetchCount();
    
    return () => {
      isMounted = false;
    };
  }, [accountId, getTransactionCount]);
  
  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        Loading...
      </div>
    );
  }
  
  // Formatear el resultado según las opciones configuradas
  const displayCount = count !== null ? (
    count > limit && !showCountOverLimit ? `${limit}+` : count
  ) : 0;
  
  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
      {displayCount} transactions
      <ExternalLink size={12} className="ml-1" />
    </div>
  );
};

export default TransactionCount;
