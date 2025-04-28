import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Define subscription types
export interface Subscription {
  id: string;
  service_name: string;
  amount: number;
  frequency: string;
  next_payment_date: string;
  currency_code: string;
}

export interface SubscriptionsResponse {
  items: Subscription[];
  total: number;
}

export interface CreateSubscriptionRequest {
  service_name: string;
  amount: number;
  frequency: string;
  next_payment_date: string;
  currency_code: string;
}

export class SubscriptionService {
  /**
   * Get all subscriptions
   * @returns SubscriptionsResponse Successful Response
   * @throws ApiError
   */
  public static getSubscriptions(): CancelablePromise<SubscriptionsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/subscriptions/",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Create a new subscription
   * @param data The subscription data
   * @returns Subscription Successful Response
   * @throws ApiError
   */
  public static createSubscription(
    data: CreateSubscriptionRequest
  ): CancelablePromise<Subscription> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/subscriptions/",
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update a subscription
   * @param id The subscription ID
   * @param data The subscription data
   * @returns Subscription Successful Response
   * @throws ApiError
   */
  public static updateSubscription(
    id: string,
    data: CreateSubscriptionRequest
  ): CancelablePromise<Subscription> {
    return __request(OpenAPI, {
      method: "PUT",
      url: `/api/v1/subscriptions/${id}`,
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete a subscription
   * @param id The subscription ID
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteSubscription(
    id: string
  ): CancelablePromise<{ message: string }> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: `/api/v1/subscriptions/${id}`,
      errors: {
        422: "Validation Error",
      },
    });
  }
}
