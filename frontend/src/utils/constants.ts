/**
 * Constantes para la aplicación SpendMila
 */

/**
 * Colores para las categorías de presupuesto
 */
export const BUDGET_CATEGORY_COLORS: Record<string, string> = {
  housing: '#4A6FA5', // Azul
  food: '#FF6B6B', // Rojo
  transportation: '#4ECDC4', // Turquesa
  utilities: '#45B7D1', // Azul claro
  entertainment: '#FFE66D', // Amarillo
  health: '#FF8484', // Rosa
  education: '#6A0572', // Púrpura
  shopping: '#D741A7', // Rosa fuerte
  personal: '#3A506B', // Azul oscuro
  debt: '#F5A742', // Naranja
  savings: '#50CB86', // Verde
  income: '#4CAF50', // Verde
  expense: '#F44336', // Rojo
  transfer: '#2196F3', // Azul
  investment: '#9C27B0', // Púrpura
  subscription: '#FF9800', // Naranja
  other: '#607D8B', // Gris azulado
};

/**
 * Paleta de colores extendida para garantizar que cada presupuesto tenga un color único
 * Estos colores están seleccionados para ser accesibles y visualmente distinguibles
 */
export const BUDGET_COLOR_PALETTE = [
  // Colores principales
  '#4A6FA5', // Azul
  '#FF6B6B', // Rojo
  '#4ECDC4', // Turquesa
  '#FFE66D', // Amarillo
  '#50CB86', // Verde
  '#D741A7', // Rosa fuerte
  '#F5A742', // Naranja
  '#6A0572', // Púrpura
  '#45B7D1', // Azul claro
  '#FF8484', // Rosa
  '#3A506B', // Azul oscuro
  '#607D8B', // Gris azulado
  
  // Colores adicionales para garantizar suficiente variedad
  '#5D8233', // Verde oliva
  '#F26419', // Naranja quemado
  '#086788', // Azul petróleo
  '#7D70BA', // Lavanda
  '#2EC4B6', // Turquesa brillante
  '#E63946', // Rojo brillante
  '#F4A261', // Naranja claro
  '#2A9D8F', // Verde azulado
  '#E76F51', // Terracota
  '#264653', // Azul marino oscuro
  '#9E2A2B', // Borgoña
  '#540B0E', // Rojo oscuro
  '#335C67', // Azul grisáceo
  '#9B5DE5', // Púrpura claro
  '#F15BB5', // Rosa brillante
  '#00BBF9', // Azul brillante
  '#00F5D4', // Turquesa brillante
];

/**
 * Valores por defecto de la aplicación
 */
export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_LOCALE = 'es-ES';
export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';
export const DEFAULT_PAGINATION_LIMIT = 10;

/**
 * Estilos Tailwind para componentes comunes
 */
export const TAILWIND_STYLES = {
  // Estilos para botones
  button: {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
  },
  // Estilos para tarjetas
  card: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5',
};
