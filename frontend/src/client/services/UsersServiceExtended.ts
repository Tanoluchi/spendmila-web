// Importaciones necesarias
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { UsersService } from "../sdk.gen";
import type { UserPublic, UserUpdateMe } from "../types.gen";
import type { UserFinancialSummary } from "../../types/financials";

/**
 * Servicio extendido para manejar la lógica de negocio relacionada con usuarios.
 * Extiende la funcionalidad base para incluir campos adicionales como default_currency_id.
 */
export class UsersServiceExtended {
  /**
   * Obtiene los datos del usuario actual.
   * @returns Promise con los datos del usuario
   */
  static async readUserMe(): Promise<UserPublic> {
    try {
      return await UsersService.readUserMe();
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  /**
   * Obtiene el resumen financiero del usuario actual (ingresos/gastos acumulados).
   * @returns Promise con el resumen financiero del usuario
   */
  static async readUserFinancialSummary(): Promise<UserFinancialSummary> {
    try {
      return await __request(OpenAPI, {
        method: 'GET',
        url: '/api/v1/users/me/summary',
        // No body or mediaType needed for a GET request unless API requires it
      });
    } catch (error) {
      console.error('Error fetching user financial summary:', error);
      // Consider re-throwing a more specific error or handling it as per project standards
      throw error;
    }
  }

  /**
   * Actualiza los datos del usuario actual, incluyendo default_currency_id.
   * @param requestBody Datos a actualizar
   * @returns Promise con los datos actualizados del usuario
   */
  static async updateUserMe({ requestBody }: { requestBody: UserUpdateMe & { default_currency_id?: string | null } }): Promise<UserPublic> {
    try {
      console.log('UsersServiceExtended - Actualizando usuario con:', requestBody);
      
      return await __request(OpenAPI, {
        method: 'PATCH',
        url: '/api/v1/users/me',
        body: requestBody,
        mediaType: 'application/json',
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }

  /**
   * Elimina la cuenta del usuario actual.
   * @returns Promise con mensaje de confirmación
   */
  static async deleteUserMe(): Promise<{ message: string }> {
    try {
      return await UsersService.deleteUserMe();
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  }
}
