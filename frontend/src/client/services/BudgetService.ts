import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Define budget types
export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string;
  start_date: string;
  end_date?: string;
  user_id: string;
  currency_id: string;
  color?: string;
  icon?: string;
  spent?: number;
  remaining?: number;
}

export interface CreateBudgetRequest {
  category: string;
  amount: number;
  period: string;
  start_date: string;
  end_date?: string;
  currency_id: string;
  color?: string;
  icon?: string;
}

export class BudgetService {
  /**
   * Get all budgets for the current user
   * @returns Budget[] Successful Response
   * @throws ApiError
   */
  public static getBudgets(): CancelablePromise<Budget[]> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/budgets/",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get a specific budget by ID
   * @param id The budget ID
   * @returns Budget Successful Response
   * @throws ApiError
   */
  public static getBudget(id: string): CancelablePromise<Budget> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v1/budgets/${id}`,
      errors: {
        404: "Budget not found",
        422: "Validation Error",
      },
    });
  }

  /**
   * Create a new budget
   * @param data The budget data
   * @returns Budget Successful Response
   * @throws ApiError
   */
  public static createBudget(
    data: CreateBudgetRequest
  ): CancelablePromise<Budget> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/budgets/",
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update a budget
   * @param id The budget ID
   * @param data The budget data
   * @returns Budget Successful Response
   * @throws ApiError
   */
  public static updateBudget(
    id: string,
    data: CreateBudgetRequest
  ): CancelablePromise<Budget> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: `/api/v1/budgets/${id}`,
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete a budget
   * @param id The budget ID
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteBudget(
    id: string
  ): CancelablePromise<{ message: string }> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: `/api/v1/budgets/${id}`,
      errors: {
        422: "Validation Error",
      },
    });
  }
}
