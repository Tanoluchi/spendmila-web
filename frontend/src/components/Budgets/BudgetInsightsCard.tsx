import React from 'react';
import { Budget } from '@/types/budget';
import { BudgetService } from '@/client';

interface BudgetInsightsCardProps {
  budget: Budget;
}

/**
 * Componente para mostrar insights y recomendaciones sobre el presupuesto
 */
const BudgetInsightsCard: React.FC<BudgetInsightsCardProps> = ({ budget }) => {
  const insights = BudgetService.getBudgetInsights(budget);
  
  // Mapear tipos de insight a clases de Tailwind
  const insightClasses = {
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800',
    success: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Budget Insights</h3>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className={`${insightClasses[insight.type]} rounded-md p-4`}>
            <p className="text-sm text-gray-700 dark:text-gray-200">{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetInsightsCard;
