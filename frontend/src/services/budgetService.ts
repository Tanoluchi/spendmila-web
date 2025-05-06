import { 
  Budget, 
  BudgetCategory, 
  BudgetCategoryType, 
  BudgetCreateUpdateRequest, 
  BudgetSummary,
  BUDGET_CATEGORY_COLORS
} from '@/types/budget';
import { BudgetService as ApiBudgetService, CreateBudgetRequest } from '@/client/services/BudgetService';
import { formatCurrency } from '@/utils/formatters';

// Los datos mockeados ya no son necesarios con la integración de la API real

/**
 * Servicio para manejar la lógica de negocio relacionada con presupuestos.
 * Separa la lógica de datos de los componentes de UI.
 */
export class BudgetService {
  /**
   * Obtiene los presupuestos del usuario desde la API
   * @param monthYear string opcional en formato "MM-YYYY"
   * @returns Promise con el presupuesto procesado para la UI
   */
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
   * Datos de prueba para desarrollo mientras se implementa la API
   */
  private static MOCK_CATEGORIES: BudgetCategory[] = [
    {
      id: '1',
      name: 'Housing',
      type: BudgetCategoryType.HOUSING,
      amount: 1200,
      spent: 1150,
      color: BUDGET_CATEGORY_COLORS.housing
    },
    {
      id: '2',
      name: 'Food',
      type: BudgetCategoryType.FOOD,
      amount: 500,
      spent: 472,
      color: BUDGET_CATEGORY_COLORS.food
    },
    {
      id: '3',
      name: 'Transportation',
      type: BudgetCategoryType.TRANSPORTATION,
      amount: 400,
      spent: 385,
      color: BUDGET_CATEGORY_COLORS.transportation
    },
    {
      id: '4',
      name: 'Entertainment',
      type: BudgetCategoryType.ENTERTAINMENT,
      amount: 200,
      spent: 255,
      color: BUDGET_CATEGORY_COLORS.entertainment
    },
    {
      id: '5',
      name: 'Utilities',
      type: BudgetCategoryType.UTILITIES,
      amount: 300,
      spent: 290,
      color: BUDGET_CATEGORY_COLORS.utilities
    },
    {
      id: '6',
      name: 'Shopping',
      type: BudgetCategoryType.SHOPPING,
      amount: 150,
      spent: 210,
      color: BUDGET_CATEGORY_COLORS.shopping
    },
    {
      id: '7',
      name: 'Healthcare',
      type: BudgetCategoryType.HEALTHCARE,
      amount: 200,
      spent: 75,
      color: BUDGET_CATEGORY_COLORS.healthcare
    }
  ];

  /**
   * Obtiene datos de presupuesto para la UI
   * NOTA TEMPORAL: Actualmente usando datos de prueba mientras se implementa la API
   * @param monthYear string opcional en formato "MM-YYYY"
   * @returns Promise con el presupuesto procesado para la UI
   */
  static async getBudget(monthYear?: string): Promise<Budget> {
    try {
      // Simular latencia de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Solicitando presupuesto para ${monthYear || 'el mes actual'}`);
      
      // Calcular totales
      const totalAmount = this.MOCK_CATEGORIES.reduce((sum, cat) => sum + cat.amount, 0);
      const totalSpent = this.MOCK_CATEGORIES.reduce((sum, cat) => sum + cat.spent, 0);
      
      // Crear presupuesto consolidado para la UI usando datos de prueba
      const consolidatedBudget: Budget = {
        id: 'mock-budget-' + new Date().getTime(),
        name: 'Monthly Budget',
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        totalAmount: totalAmount,
        totalSpent: totalSpent,
        categories: [...this.MOCK_CATEGORIES], // Crear copia para evitar modificar los originales
        user_id: 'current-user',
        currency_id: 'USD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Datos de presupuesto cargados con éxito');
      return consolidatedBudget;
      
      /* CÓDIGO ORIGINAL - DESCOMENTADO CUANDO LA API ESTÉ LISTA
      // Obtener todos los presupuestos del usuario
      const apiBudgets = await ApiBudgetService.getBudgets();
      
      if (!apiBudgets || apiBudgets.length === 0) {
        throw new Error('No se encontraron presupuestos');
      }
      
      // Filtrar por mes/año si se proporciona
      let filteredBudgets = apiBudgets;
      if (monthYear) {
        const [monthStr, yearStr] = monthYear.split('-');
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        filteredBudgets = apiBudgets.filter(budget => {
          const budgetDate = new Date(budget.start_date);
          return (budgetDate.getMonth() + 1) === month && budgetDate.getFullYear() === year;
        });
      }
      
      // Agrupar presupuestos por categoría
      const categoryMap = new Map<string, BudgetCategory>();
      let totalAmount = 0;
      let totalSpent = 0;
      
      // Procesar cada presupuesto de la API
      filteredBudgets.forEach(budget => {
        const categoryKey = budget.category;
        const amount = budget.amount || 0;
        const spent = budget.spent || 0;
        
        totalAmount += amount;
        totalSpent += spent;
        
        // Determinar el color basado en la categoría
        const categoryType = this.mapCategoryNameToType(budget.category);
        const color = BUDGET_CATEGORY_COLORS[categoryType] || BUDGET_CATEGORY_COLORS.other;
        
        // Si la categoría ya existe, actualizar sus valores
        if (categoryMap.has(categoryKey)) {
          const existingCategory = categoryMap.get(categoryKey)!;
          existingCategory.amount += amount;
          existingCategory.spent += spent;
        } else {
          // Si es una nueva categoría, crear un nuevo objeto
          categoryMap.set(categoryKey, {
            id: budget.id,
            name: budget.category,
            type: categoryType,
            amount: amount,
            spent: spent,
            color: color,
            icon: budget.icon
          });
        }
      });
      
      // Convertir el mapa de categorías a un array
      const categories = Array.from(categoryMap.values());
      
      // Crear y retornar el presupuesto consolidado para la UI
      const consolidatedBudget: Budget = {
        id: 'consolidated-budget',
        name: 'Monthly Budget',
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        totalAmount: totalAmount,
        totalSpent: totalSpent,
        categories: categories,
        user_id: filteredBudgets[0]?.user_id || '',
        currency_id: filteredBudgets[0]?.currency_id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return consolidatedBudget;
      */
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  }

  /**
   * Calcula un resumen del presupuesto
   * @param budget El presupuesto a resumir
   * @returns Objeto con el resumen del presupuesto
   */
  static calculateBudgetSummary(budget: Budget): BudgetSummary {
    const totalBudget = budget.totalAmount;
    const totalSpent = budget.totalSpent;
    const remaining = totalBudget - totalSpent;
    const progressPercentage = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);
    
    // Calcular días restantes en el mes
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = lastDayOfMonth - today.getDate();
    
    return {
      totalBudget,
      totalSpent,
      remaining,
      progressPercentage,
      daysRemaining
    };
  }

  /**
   * Calcula el porcentaje de progreso de una categoría
   * @param category La categoría a evaluar
   * @returns Porcentaje de uso (limitado a 100% para visualización)
   */
  static calculateCategoryProgress(category: BudgetCategory): number {
    return Math.min(Math.round((category.spent / category.amount) * 100), 100);
  }

  /**
   * Formatea el progreso de una categoría para mostrar
   * @param category La categoría a evaluar
   * @returns String con el porcentaje formateado
   */
  static formatCategoryProgress(category: BudgetCategory): string {
    const percentage = Math.round((category.spent / category.amount) * 100);
    return `${percentage}%`;
  }

  /**
   * Determina si una categoría se ha excedido
   * @param category La categoría a evaluar
   * @returns Boolean indicando si se excedió el presupuesto
   */
  static isCategoryOverBudget(category: BudgetCategory): boolean {
    return category.spent > category.amount;
  }

  /**
   * Obtiene análisis e insights sobre el presupuesto
   * @param budget El presupuesto a analizar
   * @returns Array de mensajes con insights
   */
  static getBudgetInsights(budget: Budget): Array<{type: 'warning' | 'success' | 'info', message: string}> {
    const insights: Array<{type: 'warning' | 'success' | 'info', message: string}> = [];
    const summary = this.calculateBudgetSummary(budget);
    
    // Categorías excedidas
    const overBudgetCategories = budget.categories.filter(cat => cat.spent > cat.amount);
    if (overBudgetCategories.length > 0) {
      for (const category of overBudgetCategories) {
        const overage = category.spent - category.amount;
        insights.push({
          type: 'warning',
          message: `You've exceeded your ${category.name} budget by ${formatCurrency(overage)}. Consider adjusting your spending or increasing this category's budget.`
        });
      }
    }
    
    // Categorías con buen progreso
    const goodProgressCategories = budget.categories.filter(cat => {
      const percentage = (cat.spent / cat.amount) * 100;
      const idealPercentage = ((30 - summary.daysRemaining) / 30) * 100;
      return percentage <= idealPercentage + 5 && cat.spent <= cat.amount;
    });
    
    if (goodProgressCategories.length > 0) {
      const category = goodProgressCategories[0]; // Tomamos la primera para el mensaje
      insights.push({
        type: 'success',
        message: `You're on track with your ${category.name} budget. You've spent ${this.formatCategoryProgress(category)} with ${summary.daysRemaining} days remaining.`
      });
    }
    
    // Mensaje general sobre el presupuesto total
    if (summary.remaining > 0) {
      insights.push({
        type: 'info',
        message: `Your spending pattern shows you could save about ${formatCurrency(summary.remaining)} more each month by optimizing your expenses.`
      });
    } else {
      insights.push({
        type: 'warning',
        message: `You've already spent more than your total budget for this month. Try to limit additional expenses where possible.`
      });
    }
    
    return insights;
  }

  /**
   * Obtiene los meses disponibles para seleccionar
   * @returns Array de strings de meses en formato "Month YYYY"
   */
  static getAvailableMonths(): string[] {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const today = new Date();
    const monthsArray = [];
    
    // Agregar mes actual y 11 meses anteriores
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      monthsArray.push(`${monthName} ${year}`);
    }
    
    return monthsArray;
  }

  /**
   * Convierte un mes y año en formato legible a formato de API
   * @param monthYear string en formato "Month YYYY"
   * @returns string en formato "MM-YYYY"
   */
  static formatMonthYearForApi(monthYear: string): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const [month, year] = monthYear.split(' ');
    const monthNumber = months.indexOf(month) + 1;
    return `${monthNumber.toString().padStart(2, '0')}-${year}`;
  }

  /**
   * Crea un nuevo presupuesto a través de la API
   * @param budgetData Datos del nuevo presupuesto
   * @returns Promise con el presupuesto creado
   */
  static async createBudget(budgetData: BudgetCreateUpdateRequest): Promise<Budget> {
    try {
      // Verificar que tenemos los campos necesarios
      if (!budgetData.category) {
        throw new Error('La categoría es obligatoria');
      }
      
      if (!budgetData.amount || budgetData.amount <= 0) {
        throw new Error('El monto debe ser mayor que cero');
      }
      
      // Construir la petición para la API
      const apiRequest: CreateBudgetRequest = {
        category: budgetData.category,
        amount: budgetData.amount,
        period: budgetData.period || 'monthly',
        start_date: budgetData.start_date || new Date().toISOString().split('T')[0],
        currency_id: budgetData.currency_id || '', // Default value para evitar errores
        color: budgetData.color,
        icon: budgetData.icon
      };
      
      // Si se proporciona una fecha de finalización, incluirla
      if (budgetData.end_date) {
        apiRequest.end_date = budgetData.end_date;
      }
      
      // Llamar a la API para crear el presupuesto
      await ApiBudgetService.createBudget(apiRequest);
      
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
      const currentBudget = await ApiBudgetService.getBudget(budgetId);
      
      // Construir objeto con todos los campos requeridos, usando los valores actuales como fallback
      const updateData: CreateBudgetRequest = {
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
      await ApiBudgetService.updateBudget(budgetId, updateData);
      
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

export default BudgetService;
