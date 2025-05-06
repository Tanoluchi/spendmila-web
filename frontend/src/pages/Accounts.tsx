import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

// Componentes
import AddAccount from '@/components/Modals/AddAccount';
import AccountSummary from '@/components/Accounts/AccountSummary';
import DeleteAccountDialog from '@/components/Accounts/DeleteAccountDialog';
import AccountCard from '@/components/Accounts/AccountCard';

// Hooks y Servicios
import { useAccounts } from '@/hooks/useAccounts';
import AccountService from '@/services/accountService';

// Tipos
import { Account, AccountTypeDisplayNames } from '@/types/account';

/**
 * Página principal de cuentas financieras
 * 
 * Responsabilidades:
 * - Gestión de estado de UI (tabs, modales, etc.)
 * - Orquestación de componentes
 * - Delegación de lógica de negocio a servicios
 */

function Accounts() {
  // Estado local para UI
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Hooks para navegación y caché
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Obtener datos de cuentas desde el hook base
  const { 
    accounts, 
    isLoading, 
    deleteAccount
  } = useAccounts();
  
  // Calcular estadísticas de resumen usando el servicio
  const summary = AccountService.calculateAccountSummary(accounts);

  // Filtrar cuentas según la pestaña activa
  const filteredAccounts = accounts.filter((account: Account) => {
    if (activeTab === 'all') return true;
    return account.account_type === activeTab;
  });

  // Obtener tipos únicos de cuenta para las pestañas
  const accountTypes = Array.from(new Set(
    accounts
      .map((account: Account) => account.account_type as string)
      .filter(Boolean)
  ));

  // Funciones para gestión de eventos de UI
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleDeleteAccount = (id: string) => {
    setSelectedAccount(id);
    setDeleteDialogOpen(true);
  };

  const handleEditAccount = (id: string) => {
    setSelectedAccount(id);
    setIsModalOpen(true);
  };

  const handleViewTransactions = (accountId: string) => {
    navigate({ to: '/dashboard/transactions', search: { accountId } });
  };

  const confirmDeleteAccount = async () => {
    if (selectedAccount) {
      try {
        await deleteAccount(selectedAccount);
        // Invalidar la caché
        queryClient.invalidateQueries({queryKey: ['account-details']});
        setDeleteDialogOpen(false);
        setSelectedAccount(null);
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };
  
  // Funciones para obtener información de cuentas, delegadas al servicio
  const getLastUpdated = (accountId: string) => {
    return AccountService.getLastUpdated(accountId, accounts, queryClient);
  };
  
  const getTransactionCount = (accountId: string) => {
    return AccountService.getTransactionCount(
      accountId, 
      { limit: 20, showCountOverLimit: false },
      queryClient
    );
  };
  
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold dark:text-gray-200">Financial Accounts</h1>
        <p className="text-muted-foreground dark:text-gray-400">Manage your bank accounts, credit cards, and investments</p>
      </div>
      
      <AccountSummary summary={summary} />
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
            onClick={() => handleTabChange('all')}
          >
            All Accounts
          </button>
          
          {/* Dynamically generate account type filter buttons */}
          {accountTypes.map((type: string) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-md ${activeTab === type ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
              onClick={() => handleTabChange(type)}
            >
              {AccountTypeDisplayNames[type.toLowerCase()] || type}
            </button>
          ))}
        </div>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 z-10"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Add Account
        </button>
      </div>
      
      {/* Modales */}
      <AddAccount isOpen={isModalOpen} onOpenChange={setIsModalOpen} accountId={selectedAccount} />
      <DeleteAccountDialog 
        isOpen={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteAccount}
      />
      
      {/* Estados de carga y renderizado condicional */}
      {isLoading ? (
        <div className="flex justify-center py-8 dark:text-gray-200">
          <p>Loading accounts...</p>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 dark:text-gray-200">
          <p className="mb-4">No accounts found in this category.</p>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            Add Account
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Account
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Institution
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Balance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Transactions
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700 dark:text-gray-200">
              {/* Renderizar cada cuenta como un componente AccountCard independiente */}
              {filteredAccounts.map((account: Account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onEdit={handleEditAccount}
                  onDelete={handleDeleteAccount}
                  onViewTransactions={handleViewTransactions}
                  getLastUpdated={getLastUpdated}
                  getTransactionCount={getTransactionCount}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Accounts;
