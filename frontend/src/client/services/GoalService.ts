import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Define goal types
export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string; // Changed from target_date to match backend
  target_date?: string; // Keep for backward compatibility
  status?: string; // Added to match backend
  goal_type?: string; // Added to match backend
  user_id: string;
  currency_id: string;
  account_id?: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface CreateGoalRequest {
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  currency_id: string;
  account_id?: string;
  icon?: string;
  color?: string;
  description?: string;
}

export class GoalService {
  /**
   * Get all goals for the current user
   * @returns Goal[] Successful Response
   * @throws ApiError
   */
  public static getGoals(): CancelablePromise<Goal[]> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/financial-goals/",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get a specific goal by ID
   * @param id The goal ID
   * @returns Goal Successful Response
   * @throws ApiError
   */
  public static getGoal(id: string): CancelablePromise<Goal> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v1/financial-goals/${id}`,
      errors: {
        404: "Goal not found",
        422: "Validation Error",
      },
    });
  }

  /**
   * Create a new goal
   * @param data The goal data
   * @returns Goal Successful Response
   * @throws ApiError
   */
  public static createGoal(
    data: CreateGoalRequest
  ): CancelablePromise<Goal> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/financial-goals/",
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update a goal
   * @param id The goal ID
   * @param data The goal data
   * @returns Goal Successful Response
   * @throws ApiError
   */
  public static updateGoal(
    id: string,
    data: CreateGoalRequest
  ): CancelablePromise<Goal> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: `/api/v1/financial-goals/${id}`,
      body: data,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete a goal
   * @param id The goal ID
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteGoal(
    id: string
  ): CancelablePromise<{ message: string }> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: `/api/v1/financial-goals/${id}`,
      errors: {
        422: "Validation Error",
      },
    });
  }
}
