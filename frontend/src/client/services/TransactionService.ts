import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { TransactionFilter, Transaction, PaginatedTransactionsResponse, Category, Account, Currency, TransactionCreate, TransactionUpdate } from "@/types/transaction";

export class TransactionService {
  /**
   * Get all transactions for the current user with pagination
   * @param filter Optional filter parameters
   * @returns PaginatedTransactionsResponse Successful Response
   * @throws ApiError
   */
  public static getTransactions(
    filter?: TransactionFilter | number
  ): CancelablePromise<PaginatedTransactionsResponse> {
    // Build query parameters
    const params: Record<string, any> = {};
    
    // Handle backward compatibility - if filter is a number, treat it as page
    if (typeof filter === 'number') {
      params.page = filter;
      params.page_size = 10; // Default page size
    } else if (filter) {
      // It's a filter object, map all properties
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          params[key] = value;
        }
      });
      
      // Ensure defaults if not provided
      if (!params.page) params.page = 1;
      if (!params.page_size && !params.limit) params.page_size = 10;
    } else {
      // No filter provided, use defaults
      params.page = 1;
      params.page_size = 10;
    }

    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/me/transactions/",
      query: params,
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get a specific transaction by ID
   * @param id The transaction ID
   * @returns Transaction Successful Response
   * @throws ApiError
   */
  public static getTransaction(id: string): CancelablePromise<Transaction> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v1/transactions/${id}`,
      errors: {
        404: "Transaction not found",
        422: "Validation Error",
      },
    });
  }

  /**
   * Create a new transaction
   * @param data The transaction data
   * @returns Transaction Successful Response
   * @throws ApiError
   */
  public static createTransaction(
    data: TransactionCreate
  ): CancelablePromise<Transaction> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/transactions/",
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update a transaction
   * @param id The transaction ID
   * @param data The transaction data
   * @returns Transaction Successful Response
   * @throws ApiError
   */
  public static updateTransaction(
    id: string,
    data: TransactionUpdate
  ): CancelablePromise<Transaction> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: `/api/v1/transactions/${id}`,
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete a transaction
   * @param id The transaction ID
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteTransaction(
    id: string
  ): CancelablePromise<{ message: string }> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: `/api/v1/transactions/${id}`,
      errors: {
        422: "Validation Error",
      },
    });
  }
}
