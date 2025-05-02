import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Define category type
export interface Category {
  id: string;
  name: string;
  description?: string;
  category_type: string;
  icon?: string;
  color?: string;
  is_active: boolean;
}

export class CategoryService {
  /**
   * Get all categories
   * @returns Category[] Successful Response
   * @throws ApiError
   */
  public static getCategories(): CancelablePromise<Category[]> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/categories/",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get a specific category by ID
   * @param id The category ID
   * @returns Category Successful Response
   * @throws ApiError
   */
  public static getCategory(id: string): CancelablePromise<Category> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v1/categories/${id}`,
      errors: {
        404: "Category not found",
        422: "Validation Error",
      },
    });
  }
}
