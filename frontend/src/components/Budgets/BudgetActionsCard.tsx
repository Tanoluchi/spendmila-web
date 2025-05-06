import React from 'react';
import { BudgetActionsProps } from '@/types/budget';
import { PlusCircle, Download, Settings } from 'lucide-react';

/**
 * Componente para mostrar acciones disponibles para el presupuesto
 */
const BudgetActionsCard: React.FC<BudgetActionsProps> = ({ 
  onCreateNew, 
  onExportData, 
  onSettings 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Budget Actions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onCreateNew}
          className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <PlusCircle size={20} className="text-purple-600" />
          <span className="text-gray-800 dark:text-white">Create New Budget</span>
        </button>
        
        <button
          onClick={onExportData}
          className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <Download size={20} className="text-purple-600" />
          <span className="text-gray-800 dark:text-white">Export Budget Data</span>
        </button>
        
        <button
          onClick={onSettings}
          className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <Settings size={20} className="text-purple-600" />
          <span className="text-gray-800 dark:text-white">Budget Settings</span>
        </button>
      </div>
    </div>
  );
};

export default BudgetActionsCard;
