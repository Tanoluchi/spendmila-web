import { useState, useMemo, useCallback } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { AccountService } from '@/client/services/AccountService';

// Cache para datos de cuentas y transacciones
type AccountDetailsCache = {
  [accountId: string]: {
    transactionCount: number;
    lastUpdated: string;
    data: any;
  }
};

/**
 * Custom hook para manejar datos de cuentas y operaciones relacionadas
 */
export const useAccountsData = () => {
  // Estado local para UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Para navegación a otras páginas
  const navigate = useNavigate();
  
  // Datos principales de cuentas
  const { 
    accounts, 
    isLoading, 
    error, 
    calculateAccountSummary, 
    deleteAccount 
  } = useAccounts();

  // Cliente de React Query para manejo de cache
  const queryClient = useQueryClient();
  
  // Calcular estadísticas de resumen
  const summary = calculateAccountSummary(accounts);

  // Filtrar cuentas según la pestaña activa
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      if (activeTab === 'all') return true;
      return account.account_type === activeTab;
    });
  }, [accounts, activeTab]);

  // Obtener tipos únicos de cuenta para generación dinámica de pestañas
  const accountTypes = useMemo(() => {
    const types = new Set<string>();
    accounts.forEach(account => {
      if (account.account_type) {
        types.add(account.account_type);
      }
    });
    return Array.from(types);
  }, [accounts]);

  // Prefetch y caché de detalles de cuentas
  useMemo(() => {
    // Este useMemo reemplaza al useEffect para evitar problemas con las reglas de hooks
    // Prefetching datos de todas las cuentas para tenerlos disponibles
    accounts.forEach(account => {
      // Verificar si ya tenemos esta cuenta en cache
      const cachedData = queryClient.getQueryData(['account-details', account.id]);
      if (!cachedData) {
        // Prefetch en segundo plano sin bloquear
        queryClient.prefetchQuery({
          queryKey: ['account-details', account.id],
          queryFn: () => AccountService.getAccount(account.id),
          staleTime: 60 * 1000, // 1 minuto
        });
      }
    });
  }, [accounts, queryClient]);

  // Gestionar cambio de pestaña
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Gestionar eliminación de cuenta
  const handleDeleteAccount = useCallback((id: string) => {
    setSelectedAccount(id);
    setDeleteDialogOpen(true);
  }, []);

  // Gestionar edición de cuenta
  const handleEditAccount = useCallback((id: string) => {
    setSelectedAccount(id);
    setIsModalOpen(true);
  }, []);

  // Gestionar visualización de transacciones
  const handleViewTransactions = useCallback((accountId: string) => {
    navigate({ to: '/dashboard/transactions', search: { accountId } });
  }, [navigate]);

  // Obtener fecha de última actualización
  const getLastUpdated = useCallback((accountId: string) => {
    try {
      // Intentar obtener desde la cache
      const cachedData = queryClient.getQueryData(['account-details', accountId]);
      
      if (cachedData) {
        if ((cachedData as any).last_transaction_date) {
          return new Date((cachedData as any).last_transaction_date).toLocaleString();
        } 
        if ((cachedData as any).created_at) {
          return new Date((cachedData as any).created_at).toLocaleString();
        }
      }
      
      // Si no hay datos en cache
      const account = accounts.find(a => a.id === accountId);
      if (account?.created_at) {
        return new Date(account.created_at).toLocaleString();
      }
      
      return 'Recently created';
    } catch (error) {
      console.error('Error getting last updated date:', error);
      return 'Unknown';
    }
  }, [accounts, queryClient]);

  // Obtener conteo de transacciones
  const getTransactionCount = useCallback((accountId: string) => {
    try {
      // Intentar obtener desde la cache
      const cachedData = queryClient.getQueryData(['account-details', accountId]);
      
      if (cachedData && typeof (cachedData as any).transaction_count === 'number') {
        return (cachedData as any).transaction_count;
      }
      
      return 0; // Valor predeterminado si no hay datos
    } catch (error) {
      console.error('Error getting transaction count:', error);
      return 0;
    }
  }, [queryClient]);

  // Invalidar cache cuando sea necesario
  const invalidateAccountCache = useCallback(() => {
    queryClient.invalidateQueries({queryKey: ['account-details']});
  }, [queryClient]);
  
  // Confirmar eliminación de cuenta con invalidación de cache
  const confirmDeleteAccountWithInvalidation = useCallback(async () => {
    if (selectedAccount) {
      try {
        await deleteAccount(selectedAccount);
        // Invalidar la cache después de eliminar
        invalidateAccountCache();
        setDeleteDialogOpen(false);
        setSelectedAccount(null);
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  }, [selectedAccount, deleteAccount, invalidateAccountCache]);

  return {
    accounts,
    filteredAccounts,
    isLoading,
    error,
    summary,
    activeTab,
    isModalOpen,
    deleteDialogOpen,
    selectedAccount,
    accountTypes,
    setIsModalOpen,
    setDeleteDialogOpen,
    handleTabChange,
    handleDeleteAccount,
    confirmDeleteAccount: confirmDeleteAccountWithInvalidation,
    handleEditAccount,
    handleViewTransactions,
    getLastUpdated,
    getTransactionCount,
    invalidateAccountCache
  };
};

export default useAccountsData;
