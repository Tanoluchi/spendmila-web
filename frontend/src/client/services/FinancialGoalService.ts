// frontend/src/client/services/FinancialGoalService.ts
import { OpenAPI } from '@/client/core/OpenAPI';
import { request as __request } from '@/client/core/request';
import type { FinancialGoal } from '@/types/financialGoal';

export class FinancialGoalService {
  /**
   * Retrieve financial goals for the current user.
   * The backend endpoint likely handles user context via the auth token.
   * @param limit Number of items to return. Fetches active goals primarily for dashboard.
   * @param offset Number of items to skip.
   * @param status Filter by status - e.g., fetch only 'active' goals for the dashboard.
   * @returns PaginatedFinancialGoals
   * @throws ApiError
   */
  public static async readFinancialGoals({
    limit = 10, // Default limit for dashboard display, can be adjusted
    offset = 0,
    status = 'active', // Default to active goals for the dashboard
  }: {
    limit?: number;
    offset?: number;
    status?: string; // Allow filtering by status, e.g., 'active', 'completed'
  }): Promise<FinancialGoal[]> { // API returns a direct array for this query
    const queryParams: Record<string, string | number> = {
      limit,
      offset,
    };
    if (status) {
      queryParams.status = status;
    }

    // Ensure __request can handle query parameters correctly.
    // The `query` property in __request typically takes an object.
    const response = await __request(OpenAPI, {
      method: 'GET',
      url: `/api/v1/financial-goals/`, 
      query: queryParams, 
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not found`,
      },
    });
    return response as FinancialGoal[]; 
  }
}
