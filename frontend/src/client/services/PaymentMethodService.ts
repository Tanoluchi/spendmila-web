import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  is_default: boolean;
  user_id: string;
}

export interface CreatePaymentMethodRequest {
  name: string;
  type: string;
  is_default?: boolean;
}

export class PaymentMethodService {
  /**
   * Get all payment methods
   * @returns PaymentMethod[] Successful Response
   * @throws ApiError
   */
  public static getPaymentMethods(): CancelablePromise<PaymentMethod[]> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/payment-methods/",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get a specific payment method by ID
   * @param id The payment method ID
   * @returns PaymentMethod Successful Response
   * @throws ApiError
   */
  public static getPaymentMethod(id: string): CancelablePromise<PaymentMethod> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v1/payment-methods/${id}`,
      errors: {
        404: "Payment Method not found",
        422: "Validation Error",
      },
    });
  }

  /**
   * Create a new payment method
   * @param data The payment method data
   * @returns PaymentMethod Successful Response
   * @throws ApiError
   */
  public static createPaymentMethod(
    data: CreatePaymentMethodRequest
  ): CancelablePromise<PaymentMethod> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/payment-methods/",
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update a payment method
   * @param id The payment method ID
   * @param data The payment method data
   * @returns PaymentMethod Successful Response
   * @throws ApiError
   */
  public static updatePaymentMethod(
    id: string,
    data: Partial<CreatePaymentMethodRequest>
  ): CancelablePromise<PaymentMethod> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: `/api/v1/payment-methods/${id}`,
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete a payment method
   * @param id The payment method ID
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deletePaymentMethod(
    id: string
  ): CancelablePromise<{ message: string }> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: `/api/v1/payment-methods/${id}`,
      errors: {
        422: "Validation Error",
      },
    });
  }
}
