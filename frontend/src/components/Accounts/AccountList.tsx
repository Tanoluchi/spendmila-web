import React, { useState } from 'react';
import { Edit, Trash2, ExternalLink, AlertCircle } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";

// Importar tipos y utilidades
import type { Account } from '@/types/account';
import { formatCurrency } from '@/utils/formatters';
import { getAccountIcon, hasActiveDebt, getAccountTypeName } from '@/utils/accountUtils';
import useLastActivity from '@/hooks/useLastActivity';

// Componente para mostrar la última actividad de una cuenta
const LastUpdatedCell: React.FC<{ accountId: string }> = ({ accountId }) => {
  const { formatLastUpdated, isLoading } = useLastActivity(accountId);
  
  if (isLoading) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">Cargando...</div>;
  }

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">{formatLastUpdated()}</div>
  );
};

// Componente para mostrar el conteo de transacciones con un máximo
const TransactionCountCell: React.FC<{ accountId: string }> = ({ accountId }) => {
  const MAX_DISPLAY = 10;
  
  // Usar React Query v5 con sintaxis de objeto
  const { data: count = 0, isLoading } = useQuery({
    queryKey: ["transaction-count", accountId],
    queryFn: async () => {
      // Obtener la cuenta con detalles, que ahora incluye transaction_count
      const response = await fetch(`/api/v1/accounts/${accountId}`);
      if (!response.ok) {
        throw new Error("Error al obtener el conteo de transacciones");
      }
      const accountDetails = await response.json();
      return accountDetails.transaction_count || 0;
    },
    // Opciones para optimizar rendimiento y UX
    staleTime: 30000, // 30 segundos antes de considerar los datos obsoletos
    retry: 1,         // Solo reintentar una vez si falla
    refetchOnWindowFocus: false // No actualizar al enfocar la ventana
  });
  
  if (isLoading) {
    return <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Cargando...</div>;
  }
  
  // Formateamos el conteo para mostrar "10+" si excede el máximo
  const formattedCount = count > MAX_DISPLAY 
    ? `${MAX_DISPLAY}+` 
    : count.toString();
  
  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
      {formattedCount} transacciones
    </div>
  );
};

interface AccountListProps {
  accounts: Account[];
  isLoading: boolean;
  onViewTransactions: (accountId: string) => void;
  onEditAccount: (accountId: string) => void;
  onDeleteAccount: (accountId: string) => void;
  getLastUpdated: (accountId: string) => string;
  getTransactionCount: (accountId: string) => number;
}

const AccountList: React.FC<AccountListProps> = ({
  accounts,
  isLoading,
  onViewTransactions,
  onEditAccount,
  onDeleteAccount,
  getLastUpdated,
  getTransactionCount
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8 dark:text-gray-200">
        <p>Loading accounts...</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 dark:text-gray-200">
        <p className="mb-4">No accounts found in this category.</p>
      </div>
    );
  }

  return (
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
          {accounts.map((account) => (
            <tr 
              key={account.id} 
              className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => onViewTransactions(account.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                    {getAccountIcon(account.account_type)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium">
                      {account.name}
                      {hasActiveDebt(account) && (
                        <span className="ml-2 inline-flex" title="Has active debt">
                          <AlertCircle size={16} className="text-red-500" />
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getAccountTypeName(account.account_type)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-200">{account.institution || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className={`text-sm font-medium ${account.balance > 0 ? 'text-green-500' : account.balance < 0 ? 'text-red-500' : 'text-gray-900 dark:text-gray-200'}`}>
                  {formatCurrency(account.balance)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <LastUpdatedCell accountId={account.id} />
              </td>
              <td 
                className="px-6 py-4 whitespace-nowrap text-center cursor-pointer"
                onClick={() => onViewTransactions(account.id)}
              >
                <TransactionCountCell accountId={account.id} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAccount(account.id);
                    }}
                    aria-label="Edit account"
                    title="Edit account"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAccount(account.id);
                    }}
                    aria-label="Delete account"
                    title="Delete account"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewTransactions(account.id);
                    }}
                    aria-label="View transactions"
                    title="View transactions"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountList;
