import React from 'react';
import { CategoryDetailsProps, BudgetCategory } from '@/types/budget';
import { formatCurrency } from '@/utils/formatters';
import { BudgetService } from '@/client';

/**
 * Componente para mostrar los detalles de cada categoría de presupuesto
 */
const CategoryDetailsCard: React.FC<CategoryDetailsProps> = ({ 
  categories, 
  onEditCategories,
  onCategoryClick,
  currentPage = 0,
  itemsPerPage = 7
 }) => {
  // Calcular qué categorías mostrar en la página actual
  const startIndex = currentPage * itemsPerPage;
  const visibleCategories = categories.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const showPagination = categories.length > itemsPerPage;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Category Details</h3>
      
      <div className="space-y-4">
        {visibleCategories.map((category) => {
          const percentUsed = BudgetService.calculateCategoryProgress(category);
          const isOverBudget = BudgetService.isCategoryOverBudget(category);
          
          return (
            <div 
              key={category.id} 
              className="border-b border-gray-200 dark:border-gray-700 pb-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors rounded-md"
              onClick={() => onCategoryClick?.(category, undefined)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(category.spent)} of {formatCurrency(category.amount)}
                  </p>
                  <p className={`text-sm ${isOverBudget ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {percentUsed}% used
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-' + category.color.replace('#', '')}`}
                  style={{ 
                    width: `${percentUsed}%`,
                    backgroundColor: category.color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {showPagination && (
        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={() => onEditCategories()}
            className="text-sm text-purple-600 hover:text-purple-800 hover:underline focus:outline-none"
          >
            Edit Categories
          </button>
          <div className="flex space-x-2">
            <button
              disabled={currentPage === 0}
              onClick={() => onCategoryClick?.(undefined, currentPage - 1)}
              className={`p-2 rounded-md ${currentPage === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:bg-purple-100 dark:hover:bg-gray-700'}`}
            >
              &lt;
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300 self-center">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => onCategoryClick?.(undefined, currentPage + 1)}
              className={`p-2 rounded-md ${currentPage >= totalPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:bg-purple-100 dark:hover:bg-gray-700'}`}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetailsCard;
