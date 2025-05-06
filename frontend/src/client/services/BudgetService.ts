import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Define budget types
export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent_amount: number;
  remaining_amount: number;
  progress_percentage: number;
  color: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  currency_symbol: string;
  currency_code: string;
  category_id?: string;
  category_name?: string;
}

export interface CreateBudgetRequest {
  name: string;
  amount: number;
  color?: string;
}

export interface BudgetSummary {
  total_budgeted: number;
  total_spent: number;
  remaining: number;
  percentage: number;
  status: string; // on-track, warning, over-budget
  currency_symbol: string;
  currency_code: string;
}

export interface PaginatedBudgetResponse {
  items: Budget[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  summary: BudgetSummary;
}

export class BudgetService {
  /**
   * Get all budgets for the current user
   * @param year Optional year filter
   * @param month Optional month filter
   * @returns PaginatedBudgetResponse Successful Response
   * @throws ApiError
   */
  public static getBudgets(
    year?: number,
    month?: number
  ): CancelablePromise<PaginatedBudgetResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/budgets/",
      query: {
        year,
        month,
      },
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

  /**
   * Get budget progress and summary for the current user
   * @param timeframe Optional timeframe filter (monthly, quarterly, annual)
   * @returns Budget progress data with summary
   * @throws ApiError
   */
  public static getBudgetProgress(
    year?: number,
    month?: number
  ): CancelablePromise<{ budgets: any[], summary: BudgetSummary }> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/budgets/progress",
      query: {
        year,
        month,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get available budget categories
   * @returns Array of category options with name and value
   * @throws ApiError
   */
  public static getBudgetCategories(): CancelablePromise<Array<{ name: string; value: string }>> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v1/budgets/categories`,
      errors: {
        422: "Validation Error",
      },
    });
  }
}
