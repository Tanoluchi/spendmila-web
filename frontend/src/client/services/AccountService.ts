import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Define account types
export interface Account {
  id: string;
  name: string;
  account_type: string;
  balance: number;
  institution?: string;
  icon?: string;
  is_default: boolean;
  user_id: string;
  currency_id: string;
  created_at?: string;
  last_transaction_date?: string;
  transaction_count?: number;
}

export interface CreateAccountRequest {
  name: string;
  account_type: string;
  balance: number;
  institution?: string;
  is_default?: boolean;
  currency_id: string;
}

export class AccountService {
  /**
   * Get all accounts for the current user
   * @returns Accounts[] Successful Response
   * @throws ApiError
   */
  public static getAccounts(): CancelablePromise<Account[]> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/accounts/",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get a specific account by ID
   * @param id The account ID
   * @returns Account Successful Response
   * @throws ApiError
   */
  public static getAccount(id: string): CancelablePromise<Account> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v1/accounts/${id}`,
      errors: {
        404: "Account not found",
        422: "Validation Error",
      },
    });
  }

  /**
   * Create a new account
   * @param data The account data
   * @returns Account Successful Response
   * @throws ApiError
   */
  public static createAccount(
    data: CreateAccountRequest
  ): CancelablePromise<Account> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/accounts/",
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update an account
   * @param id The account ID
   * @param data The account data
   * @returns Account Successful Response
   * @throws ApiError
   */
  public static updateAccount(
    id: string,
    data: CreateAccountRequest
  ): CancelablePromise<Account> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: `/api/v1/accounts/${id}`,
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete an account
   * @param id The account ID
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteAccount(
    id: string
  ): CancelablePromise<{ message: string }> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: `/api/v1/accounts/${id}`,
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get all available account types
   * @returns List of account types with name and value
   * @throws ApiError
   */
  public static getAccountTypes(): CancelablePromise<Array<{ name: string; value: string }>> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v1/accounts/types`,
      errors: {
        422: "Validation Error",
      },
    });
  }
}
