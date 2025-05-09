import { BudgetService } from "./BudgetService";
import { 
  Budget, 
  BudgetCategory, 
  BudgetCategoryType, 
  BudgetCreateUpdateRequest, 
  BudgetSummary,
  BUDGET_CATEGORY_COLORS
} from '@/types/budget';
import { formatCurrency } from '@/utils/formatters';

/**
 * Servicio extendido para manejar la lógica de negocio relacionada con presupuestos.
 * Combina la funcionalidad de la API base con métodos de utilidad adicionales.
 */
export class BudgetServiceExtended {
  /**
   * Mapea un nombre de categoría a un tipo de categoría
   * @param categoryName Nombre de la categoría
   * @returns Tipo de categoría como string
   */
  static mapCategoryNameToType(categoryName: string): string {
    // Convertir a minúsculas y eliminar espacios para hacer la comparación más robusta
    const normalizedName = categoryName.toLowerCase().trim();
    
    // Mapear categorías comunes a sus tipos
    if (normalizedName.includes('hous') || normalizedName.includes('rent') || normalizedName.includes('mortgage')) {
      return BudgetCategoryType.HOUSING;
    }
    if (normalizedName.includes('food') || normalizedName.includes('grocer') || normalizedName.includes('restaurant')) {
      return BudgetCategoryType.FOOD;
    }
    if (normalizedName.includes('transport') || normalizedName.includes('gas') || normalizedName.includes('car') || normalizedName.includes('bus')) {
      return BudgetCategoryType.TRANSPORTATION;
    }
    if (normalizedName.includes('entertain') || normalizedName.includes('movie') || normalizedName.includes('leisure')) {
      return BudgetCategoryType.ENTERTAINMENT;
    }
    if (normalizedName.includes('util') || normalizedName.includes('electric') || normalizedName.includes('water') || normalizedName.includes('gas')) {
      return BudgetCategoryType.UTILITIES;
    }
    if (normalizedName.includes('shop') || normalizedName.includes('cloth') || normalizedName.includes('retail')) {
      return BudgetCategoryType.SHOPPING;
    }
    if (normalizedName.includes('health') || normalizedName.includes('medical') || normalizedName.includes('doctor')) {
      return BudgetCategoryType.HEALTHCARE;
    }
    
    // Si no hay coincidencia, devolver 'other'
    return BudgetCategoryType.OTHER;
  }

  /**
   * Obtiene datos de presupuesto para la UI
   * @param monthYear string opcional en formato "MM-YYYY"
   * @returns Promise con el presupuesto procesado para la UI
   */
  static async getBudget(monthYear?: string): Promise<Budget> {
    try {
      // Llamar a la API para obtener presupuestos
      const apiResponse = await BudgetService.getBudgets({
        month_year: monthYear
      });
      
      if (!apiResponse || apiResponse.length === 0) {
        return {
          id: '',
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
          categories: [],
          totalAmount: 0,
          totalSpent: 0,
          currency: {
            id: '',
            code: 'USD',
            symbol: '$',
            name: 'US Dollar'
          }
        };
      }
      
      // Transformar respuesta de la API a formato para UI
      const budget: Budget = {
        id: apiResponse[0].id || '',
        month: parseInt(monthYear?.split('-')[0] || String(new Date().getMonth() + 1)) - 1,
        year: parseInt(monthYear?.split('-')[1] || String(new Date().getFullYear())),
        categories: [],
        totalAmount: 0,
        totalSpent: 0,
        currency: apiResponse[0].currency || {
          id: '',
          code: 'USD',
          symbol: '$',
          name: 'US Dollar'
        }
      };
      
      // Procesar las categorías
      budget.categories = apiResponse.map(b => {
        const category: BudgetCategory = {
          id: b.id,
          name: b.category,
          type: this.mapCategoryNameToType(b.category),
          amount: b.amount,
          spent: b.spent || 0,
          color: b.color || BUDGET_CATEGORY_COLORS[this.mapCategoryNameToType(b.category).toLowerCase() as keyof typeof BUDGET_CATEGORY_COLORS] || '#cccccc'
        };
        
        // Actualizar totales
        budget.totalAmount += category.amount;
        budget.totalSpent += category.spent;
        
        return category;
      });
      
      return budget;
    } catch (error) {
      console.error('Error fetching budget:', error);
      
      // Devolver un presupuesto vacío en caso de error
      return {
        id: '',
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        categories: [],
        totalAmount: 0,
        totalSpent: 0,
        currency: {
          id: '',
          code: 'USD',
          symbol: '$',
          name: 'US Dollar'
        }
      };
    }
  }

  /**
   * Calcula un resumen del presupuesto
   * @param budget El presupuesto a resumir
   * @returns Objeto con el resumen del presupuesto
   */
  static calculateBudgetSummary(budget: Budget): BudgetSummary {
    const totalRemaining = budget.totalAmount - budget.totalSpent;
    const percentUsed = budget.totalAmount > 0 
      ? Math.round((budget.totalSpent / budget.totalAmount) * 100) 
      : 0;
    
    return {
      totalBudget: budget.totalAmount,
      totalSpent: budget.totalSpent,
      totalRemaining: totalRemaining,
      percentUsed: percentUsed,
      formattedTotalBudget: formatCurrency(budget.totalAmount, budget.currency?.code || 'USD'),
      formattedTotalSpent: formatCurrency(budget.totalSpent, budget.currency?.code || 'USD'),
      formattedTotalRemaining: formatCurrency(totalRemaining, budget.currency?.code || 'USD')
    };
  }

  /**
   * Calcula el porcentaje de progreso de una categoría
   * @param category La categoría a evaluar
   * @returns Porcentaje de uso (limitado a 100% para visualización)
   */
  static calculateCategoryProgress(category: BudgetCategory): number {
    if (category.amount <= 0) return 0;
    const progress = (category.spent / category.amount) * 100;
    // Para visualización, limitar a 100%
    return Math.min(100, progress);
  }

  /**
   * Formatea el progreso de una categoría para mostrar
   * @param category La categoría a evaluar
   * @returns String con el porcentaje formateado
   */
  static formatCategoryProgress(category: BudgetCategory): string {
    if (category.amount <= 0) return '0%';
    const progress = (category.spent / category.amount) * 100;
    return `${Math.round(progress)}%`;
  }

  /**
   * Determina si una categoría se ha excedido
   * @param category La categoría a evaluar
   * @returns Boolean indicando si se excedió el presupuesto
   */
  static isCategoryOverBudget(category: BudgetCategory): boolean {
    if (category.amount <= 0) return false;
    return category.spent > category.amount;
  }

  /**
   * Obtiene análisis e insights sobre el presupuesto
   * @param budget El presupuesto a analizar
   * @returns Array de mensajes con insights
   */
  static getBudgetInsights(budget: Budget): Array<{type: 'warning' | 'success' | 'info', message: string}> {
    const insights: Array<{type: 'warning' | 'success' | 'info', message: string}> = [];
    
    // Verificar si hay categorías sobre el límite
    const overBudgetCategories = budget.categories.filter(cat => this.isCategoryOverBudget(cat));
    if (overBudgetCategories.length > 0) {
      insights.push({
        type: 'warning',
        message: `You've gone over budget in ${overBudgetCategories.length} categories.`
      });
      
      // Agregar detalle por cada categoría excedida
      overBudgetCategories.forEach(cat => {
        const overage = cat.spent - cat.amount;
        insights.push({
          type: 'warning',
          message: `${cat.name}: over by ${formatCurrency(overage)}`
        });
      });
    }
    
    // Verificar si el presupuesto total está excedido
    if (budget.totalSpent > budget.totalAmount) {
      insights.push({
        type: 'warning',
        message: `Overall, you've spent ${formatCurrency(budget.totalSpent - budget.totalAmount)} more than budgeted.`
      });
    } else {
      insights.push({
        type: 'success',
        message: `You're doing well! Still ${formatCurrency(budget.totalAmount - budget.totalSpent)} under budget.`
      });
      
      // Si está muy por debajo del presupuesto, considerar ajustar
      if (budget.totalSpent < budget.totalAmount * 0.7 && budget.totalAmount > 0) {
        insights.push({
          type: 'info',
          message: `You're significantly under budget. Consider adjusting your budget or saving the extra money.`
        });
      }
    }
    
    return insights;
  }

  /**
   * Obtiene los meses disponibles para seleccionar
   * @returns Array de strings de meses en formato "Month YYYY"
   */
  static getAvailableMonths(): string[] {
    const today = new Date();
    const months = [];
    
    // Generar lista de meses para el año actual y el anterior
    for (let year = today.getFullYear(); year >= today.getFullYear() - 1; year--) {
      const endMonth = year === today.getFullYear() ? today.getMonth() + 1 : 12;
      for (let month = endMonth; month >= 1; month--) {
        const date = new Date(year, month - 1, 1);
        months.push(date.toLocaleString('default', { month: 'long', year: 'numeric' }));
      }
    }
    
    return months;
  }

  /**
   * Convierte un mes y año en formato legible a formato de API
   * @param monthYear string en formato "Month YYYY"
   * @returns string en formato "MM-YYYY"
   */
  static formatMonthYearForApi(monthYear: string): string {
    if (!monthYear) {
      const now = new Date();
      return `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    }
    
    const [month, year] = monthYear.split(' ');
    const monthIndex = new Date(Date.parse(`${month} 1, ${year}`)).getMonth() + 1;
    return `${String(monthIndex).padStart(2, '0')}-${year}`;
  }

  /**
   * Crea un nuevo presupuesto a través de la API
   * @param budgetData Datos del nuevo presupuesto
   * @returns Promise con el presupuesto creado
   */
  static async createBudget(budgetData: BudgetCreateUpdateRequest): Promise<Budget> {
    try {
      // Mapear desde nuestro tipo de datos de UI a formato de API
      const apiRequest = {
        category: budgetData.category,
        amount: budgetData.amount,
        currency_id: budgetData.currency_id,
        period: budgetData.period || 'monthly',
        start_date: budgetData.start_date,
        color: budgetData.color,
        icon: budgetData.icon,
      };
      
      // Si se proporciona una fecha de finalización, incluirla
      if (budgetData.end_date) {
        apiRequest.end_date = budgetData.end_date;
      }
      
      // Llamar a la API para crear el presupuesto
      await BudgetService.createBudget(apiRequest);
      
      // Después de crear el presupuesto, obtener todos los presupuestos actualizados
      // para devolver un presupuesto consolidado
      return this.getBudget();
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  /**
   * Actualiza un presupuesto existente a través de la API
   * @param budgetId ID del presupuesto a actualizar
   * @param budgetData Datos actualizados
   * @returns Promise con el presupuesto actualizado
   */
  static async updateBudget(budgetId: string, budgetData: Partial<BudgetCreateUpdateRequest>): Promise<Budget> {
    try {
      // Obtener el presupuesto actual para asegurar que tenemos todos los campos requeridos
      const currentBudget = await BudgetService.getBudget(budgetId);
      
      // Construir objeto con todos los campos requeridos, usando los valores actuales como fallback
      const updateData = {
        category: budgetData.category || currentBudget.category,
        amount: budgetData.amount !== undefined ? budgetData.amount : currentBudget.amount,
        period: budgetData.period || currentBudget.period || 'monthly',
        start_date: budgetData.start_date || currentBudget.start_date,
        currency_id: budgetData.currency_id || currentBudget.currency_id || ''
      };
      
      // Agregar campos opcionales solo si existen en los datos de actualización o en el presupuesto actual
      if (budgetData.end_date || currentBudget.end_date) {
        updateData.end_date = budgetData.end_date || currentBudget.end_date;
      }
      
      if (budgetData.color || currentBudget.color) {
        updateData.color = budgetData.color || currentBudget.color;
      }
      
      if (budgetData.icon || currentBudget.icon) {
        updateData.icon = budgetData.icon || currentBudget.icon;
      }
      
      // Llamar a la API para actualizar el presupuesto
      await BudgetService.updateBudget(budgetId, updateData);
      
      // Después de actualizar, obtener todos los presupuestos actualizados
      return this.getBudget();
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  /**
   * Exporta los datos del presupuesto a CSV
   * @param budget El presupuesto a exportar
   */
  static exportBudgetToCsv(budget: Budget): void {
    // Preparar encabezados
    const headers = ['Category', 'Budget Amount', 'Spent Amount', 'Remaining', 'Usage %'];
    
    // Preparar filas
    const rows = budget.categories.map(cat => {
      const remaining = cat.amount - cat.spent;
      const usage = Math.round((cat.spent / cat.amount) * 100);
      return [
        cat.name,
        cat.amount.toFixed(2),
        cat.spent.toFixed(2),
        remaining.toFixed(2),
        `${usage}%`
      ];
    });
    
    // Agregar fila de totales
    const totalRemaining = budget.totalAmount - budget.totalSpent;
    const totalUsage = Math.round((budget.totalSpent / budget.totalAmount) * 100);
    
    rows.push([
      'TOTAL',
      budget.totalAmount.toFixed(2),
      budget.totalSpent.toFixed(2),
      totalRemaining.toFixed(2),
      `${totalUsage}%`
    ]);
    
    // Convertir a CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Crear archivo descargable
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `budget_${budget.month+1}_${budget.year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
