import React from 'react';
import { CreditCard, ArrowUpDown, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import type { AccountCardProps } from '@/types/account';
import TransactionCount from './TransactionCount';
import AccountService from '@/services/accountService';

/**
 * Componente para mostrar una tarjeta de cuenta individual
 * Separa la lógica de presentación para mejorar mantenibilidad
 */
const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onEdit,
  onDelete,
  onViewTransactions,
  getLastUpdated,
  getTransactionCount
}) => {
  /**
   * Devuelve el icono apropiado según el tipo de cuenta
   */
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="text-blue-500" size={20} />;
      case 'savings':
        return <CreditCard className="text-green-500" size={20} />;
      case 'credit':
        return <CreditCard className="text-red-500" size={20} />;
      case 'investment':
        return <ArrowUpDown className="text-yellow-500" size={20} />;
      default:
        return <CreditCard className="text-gray-500" size={20} />;
    }
  };

  // Verificar si la cuenta tiene deudas activas
  const hasActiveDebt = AccountService.hasActiveDebt(account);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td 
        className="px-6 py-4 whitespace-nowrap cursor-pointer"
        onClick={() => onViewTransactions(account.id)}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            {getAccountIcon(account.account_type as string)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium">{account.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{account.account_type}</div>
          </div>
          {hasActiveDebt && (
            <div className="ml-2">
              <AlertCircle className="text-amber-500" size={16} />
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">{account.institution || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className={`text-sm font-medium ${account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {formatCurrency(account.balance)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">{getLastUpdated(account.id)}</div>
      </td>
      <td 
        className="px-6 py-4 whitespace-nowrap text-center cursor-pointer"
        onClick={() => onViewTransactions(account.id)}
      >
        <TransactionCount 
          accountId={account.id} 
          getTransactionCount={getTransactionCount} 
          options={{ limit: 20, showCountOverLimit: false }}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(account.id);
          }}
          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(account.id);
          }}
          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};

export default AccountCard;
