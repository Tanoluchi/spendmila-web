import { Currency } from './currency';

/**
 * Tipos de categorías de presupuesto
 */
export enum BudgetCategoryType {
  HOUSING = 'housing',
  FOOD = 'food',
  TRANSPORTATION = 'transportation',
  ENTERTAINMENT = 'entertainment',
  UTILITIES = 'utilities',
  SHOPPING = 'shopping',
  HEALTHCARE = 'healthcare',
  OTHER = 'other'
}

/**
 * Colores predefinidos para categorías de presupuesto
 */
export const BUDGET_CATEGORY_COLORS = {
  housing: '#4361ee',
  food: '#f72585',
  transportation: '#560bad',
  entertainment: '#7209b7',
  utilities: '#3a0ca3',
  shopping: '#f94144',
  healthcare: '#4cc9f0',
  other: '#4f5d75'
};

/**
 * Categoría de presupuesto
 */
export interface BudgetCategory {
  id: string;
  name: string;
  type: string;
  amount: number;
  spent: number;
  color: string;
}

/**
 * Estructura de un presupuesto
 */
export interface Budget {
  id: string;
  month: number;
  year: number;
  categories: BudgetCategory[];
  totalAmount: number;
  totalSpent: number;
  currency: Currency;
}

/**
 * Resumen de un presupuesto
 */
export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  percentUsed: number;
  formattedTotalBudget: string;
  formattedTotalSpent: string;
  formattedTotalRemaining: string;
}

/**
 * Solicitud para crear o actualizar un presupuesto
 */
export interface BudgetCreateUpdateRequest {
  category: string;
  amount: number;
  currency_id: string;
  period?: string;
  start_date: string;
  end_date?: string;
  color?: string;
  icon?: string;
}

/**
 * Props para la tarjeta de acciones de presupuesto
 */
export interface BudgetActionsProps {
  budget: Budget;
  onExport: () => void;
  onEdit: () => void;
}

/**
 * Props para la tarjeta de resumen de presupuesto
 */
export interface BudgetSummaryCardProps {
  budget: Budget;
}

/**
 * Props para la tarjeta de detalles de categoría
 */
export interface CategoryDetailsProps {
  category: BudgetCategory;
  currency: Currency;
}
