/**
 * Currency type definitions
 */

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string | null;
}

export interface CurrencyUpdate {
  code?: string;
  name?: string;
  symbol?: string | null;
}

export interface CurrencyCreate {
  code: string;
  name: string;
  symbol?: string | null;
}
