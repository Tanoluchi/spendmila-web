import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

// Define currency types
export interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
}

export class CurrencyService {
  /**
   * Get all available currencies
   * @returns Currency[] Successful Response
   * @throws ApiError
   */
  public static getCurrencies(): CancelablePromise<Currency[]> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/currencies/",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get a specific currency by ID
   * @param id The currency ID
   * @returns Currency Successful Response
   * @throws ApiError
   */
  public static getCurrency(id: string): CancelablePromise<Currency> {
    return __request(OpenAPI, {
      method: "GET",
      url: `/api/v1/currencies/${id}`,
      errors: {
        404: "Currency not found",
        422: "Validation Error",
      },
    });
  }
}
