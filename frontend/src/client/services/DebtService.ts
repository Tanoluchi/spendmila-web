import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Define debt types
export interface Debt {
  id: string;
  name: string;
  debt_type: string;
  balance: number;
  interest_rate: number;
  minimum_payment: number;
  due_date: number;
  user_id: string;
  currency_id: string;
  account_id?: string;
  notes?: string;
}

export interface CreateDebtRequest {
  name: string;
  debt_type: string;
  balance: number;
  interest_rate: number;
  minimum_payment: number;
  due_date: number;
  currency_id: string;
  account_id?: string;
  notes?: string;
}

export class DebtService {
  /**
   * Get all debts for the current user
   * @returns Debt[] Successful Response
   * @throws ApiError
   */
  public static getDebts(): CancelablePromise<Debt[]> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/debts/",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get a specific debt by ID
   * @param id The debt ID
   * @returns Debt Successful Response
   * @throws ApiError
   */
  public static getDebt(id: string): CancelablePromise<Debt> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v1/debts/${id}`,
      errors: {
        404: "Debt not found",
        422: "Validation Error",
      },
    });
  }

  /**
   * Create a new debt
   * @param data The debt data
   * @returns Debt Successful Response
   * @throws ApiError
   */
  public static createDebt(
    data: CreateDebtRequest
  ): CancelablePromise<Debt> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/debts/",
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update a debt
   * @param id The debt ID
   * @param data The debt data
   * @returns Debt Successful Response
   * @throws ApiError
   */
  public static updateDebt(
    id: string,
    data: CreateDebtRequest
  ): CancelablePromise<Debt> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: `/api/v1/debts/${id}`,
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete a debt
   * @param id The debt ID
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteDebt(
    id: string
  ): CancelablePromise<{ message: string }> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: `/api/v1/debts/${id}`,
      errors: {
        422: "Validation Error",
      },
    });
  }
}
