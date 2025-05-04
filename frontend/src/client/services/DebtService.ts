import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Define debt types
export interface Debt {
  id: string;
  creditor_name: string;
  debt_type: string;
  amount: number;
  remaining_amount: number;
  interest_rate: number;
  minimum_payment?: number;
  due_date: string;
  user_id: string;
  currency_id: string;
  account_id?: string;
  description?: string;
  is_installment: boolean;
  total_installments?: number;
  paid_installments?: number;
  remaining_installments?: number;
  payment_progress: number; // Percentage of debt paid (0-100)
  start_date?: string;
}

export interface DebtPayment {
  id: string;
  amount: number;
  date: string;
  transaction_id: string;
}

export interface DebtWithDetails extends Debt {
  payments: DebtPayment[];
  paid_amount: number;
}

export interface CreateDebtRequest {
  creditor_name: string;
  debt_type: string;
  amount: number;
  interest_rate?: number;
  minimum_payment?: number;
  due_date: string;
  account_id?: string;
  description?: string;
  is_installment: boolean;
  total_installments?: number;
  start_date?: string;
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
