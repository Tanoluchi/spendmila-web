import { AccountService as ApiAccountService } from '@/client/services/AccountService';
import { 
  Account, 
  AccountWithDetails, 
  AccountSummary,
  TransactionCountOptions
} from '@/types/account';
import { QueryClient } from '@tanstack/react-query';

/**
 * Servicio para manejar la lógica de negocio relacionada con cuentas.
 * Separa la lógica de datos de los componentes de UI.
 */
export class AccountService {
  /**
   * Obtiene todas las cuentas del usuario actual.
   * @returns Promise con el array de cuentas
   */
  static async getAccounts(): Promise<Account[]> {
    try {
      return await ApiAccountService.getAccounts();
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  /**
   * Obtiene los detalles de una cuenta específica.
   * @param accountId ID de la cuenta
   * @returns Promise con los detalles de la cuenta
   */
  static async getAccountDetails(accountId: string): Promise<AccountWithDetails> {
    try {
      return await ApiAccountService.getAccount(accountId) as AccountWithDetails;
    } catch (error) {
      console.error(`Error fetching account details for ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene el número de transacciones para una cuenta.
   * Optimizado para controlar límites de consulta.
   * @param accountId ID de la cuenta
   * @param options Opciones para controlar el comportamiento
   * @param queryClient Cliente de React Query para gestión de caché
   * @returns Promise con el número de transacciones
   */
  static async getTransactionCount(
    accountId: string, 
    options: TransactionCountOptions = { limit: 20, showCountOverLimit: true },
    queryClient?: QueryClient
  ): Promise<number> {
    try {
      // Primero intentamos obtener desde la caché si existe un cliente
      if (queryClient) {
        const cachedData = queryClient.getQueryData(['account-details', accountId]);
        if (cachedData && typeof (cachedData as any).transaction_count === 'number') {
          const count = (cachedData as any).transaction_count;
          return count;
        }
      }

      // Si no hay datos en caché, consultamos al backend
      const accountDetails = await this.getAccountDetails(accountId);
      
      // Actualizamos la caché si existe un cliente
      if (queryClient && accountDetails) {
        queryClient.setQueryData(['account-details', accountId], accountDetails);
      }

      // Devolvemos el conteo con respeto al límite configurado
      const { limit, showCountOverLimit } = options;
      if (limit && accountDetails.transaction_count > limit) {
        return showCountOverLimit ? accountDetails.transaction_count : limit;
      }
      
      return accountDetails.transaction_count;
    } catch (error) {
      console.error(`Error getting transaction count for ${accountId}:`, error);
      return 0;
    }
  }

  /**
   * Obtiene la fecha de última actualización formateada para una cuenta.
   * @param accountId ID de la cuenta
   * @param accounts Array de cuentas como fallback
   * @param queryClient Cliente de React Query para gestión de caché
   * @returns Fecha formateada como string
   */
  static getLastUpdated(
    accountId: string, 
    accounts: Account[] = [],
    queryClient?: QueryClient
  ): string {
    try {
      // Intentar obtener desde la cache
      if (queryClient) {
        const cachedData = queryClient.getQueryData(['account-details', accountId]);
        
        if (cachedData) {
          if ((cachedData as any).last_transaction_date) {
            return new Date((cachedData as any).last_transaction_date).toLocaleString();
          } 
          if ((cachedData as any).created_at) {
            return new Date((cachedData as any).created_at).toLocaleString();
          }
        }
      }
      
      // Si no hay datos en cache, usar los datos de accounts
      const account = accounts.find(a => a.id === accountId);
      if (account?.created_at) {
        return new Date(account.created_at).toLocaleString();
      }
      
      return 'Recently created';
    } catch (error) {
      console.error('Error getting last updated date:', error);
      return 'Unknown';
    }
  }

  /**
   * Calcula un resumen financiero basado en todas las cuentas.
   * @param accounts Array de cuentas
   * @returns Objeto con resumen financiero
   */
  static calculateAccountSummary(accounts: Account[]): AccountSummary {
    if (!accounts || accounts.length === 0) {
      return {
        totalAssets: 0,
        totalDebts: 0,
        netWorth: 0
      };
    }

    const assets = accounts.reduce((total, account) => {
      if (account.balance >= 0) {
        return total + account.balance;
      }
      return total;
    }, 0);

    const debts = accounts.reduce((total, account) => {
      if (account.balance < 0) {
        return total + Math.abs(account.balance);
      }
      return total;
    }, 0);

    return {
      totalAssets: assets,
      totalDebts: debts,
      netWorth: assets - debts
    };
  }

  /**
   * Determina si una cuenta tiene deudas activas.
   * @param account Objeto de cuenta
   * @returns true si la cuenta tiene deudas activas
   */
  static hasActiveDebt(account: Account): boolean {
    // Considera cuentas de crédito o con balance negativo como teniendo deuda
    return account.account_type === 'credit' || account.balance < 0;
  }
}

export default AccountService;
