/**
 * Category type definitions
 */

export interface Category {
  id: string;
  name: string;
  description?: string;
  category_type: string; // Corresponds to e.g., 'income', 'expense', 'transfer'
  icon?: string;
  color?: string;
  is_active: boolean;
  user_id?: string; // If categories are user-specific
  created_at?: string;
  updated_at?: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  category_type: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
  category_type?: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
}
