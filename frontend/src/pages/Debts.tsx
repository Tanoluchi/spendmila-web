import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, DollarSign, CreditCard, GraduationCap, Car, Briefcase } from 'lucide-react';
import AddDebt from '@/components/Modals/AddDebt';
import { useDebts } from '@/hooks/useDebts';

function Debts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All Debts');
  
  // Use the debts hook to fetch and manage debt data
  const { 
    debts, 
    isLoading, 
    calculateDebtSummary,
    getUniqueDebtTypes,
    deleteDebt
  } = useDebts();
  
  // Calculate summary data
  const { totalDebt, monthlyPayments, highestInterestDebt } = calculateDebtSummary(debts);
  
  // Get unique debt types from user's debts
  const uniqueDebtTypes = useMemo(() => {
    const types = getUniqueDebtTypes(debts);
    return ['All Debts', ...types.map(type => {
      // Format the debt type for display
      const formattedType = type.replace('_', ' ');
      return formattedType.charAt(0).toUpperCase() + formattedType.slice(1) + (formattedType.endsWith('loan') ? 's' : '');
    })];
  }, [debts, getUniqueDebtTypes]);
  
  // Filter debts based on active tab
  const filteredDebts = useMemo(() => {
    if (activeTab === 'All Debts') return debts;
    
    return debts.filter(debt => {
      const formattedType = debt.debt_type.replace('_', ' ');
      const tabType = activeTab.toLowerCase().replace('s', ''); // Remove plural 's'
      return formattedType.toLowerCase() === tabType;
    });
  }, [debts, activeTab]);
  
  const handleDeleteDebt = (id: string) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      deleteDebt(id);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const getDebtTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'credit_card':
        return <CreditCard size={16} className="mr-1" />;
      case 'student':
      case 'student_loan':
        return <GraduationCap size={16} className="mr-1" />;
      case 'auto':
      case 'auto_loan':
        return <Car size={16} className="mr-1" />;
      case 'business':
      case 'business_loan':
        return <Briefcase size={16} className="mr-1" />;
      default:
        return <DollarSign size={16} className="mr-1" />;
    }
  };
  
  return (
    <div className="grid gap-6 dark:text-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Debt Management</h2>
        <button 
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 shadow-md transition-all duration-200 ease-in-out"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Add New Debt
        </button>
      </div>
      
      <AddDebt isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Debt</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">All outstanding balances</span>
            <span className="text-2xl font-bold text-red-500 mt-2">{formatCurrency(totalDebt)}</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Monthly Minimum</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">Total minimum payments</span>
            <span className="text-2xl font-bold text-amber-500 mt-2">{formatCurrency(monthlyPayments)}</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Highest Interest</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">Debt to focus on first</span>
            <span className="text-2xl font-bold text-purple-500 mt-2">
              {highestInterestDebt ? highestInterestDebt.name : 'None'}
            </span>
            <span className="text-sm text-gray-500">
              {highestInterestDebt ? `${highestInterestDebt.interest_rate}% interest` : ''}
            </span>
          </div>
        </div>
      </div>
      
      {/* Debt List Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Tabs - Only show tabs for debt types that the user has */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {uniqueDebtTypes.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading your debts...</p>
          </div>
        ) : filteredDebts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No debts found in this category.</p>
            <button 
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md inline-flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={16} />
              Add Your First Debt
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Debt Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Original Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Remaining</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Interest Rate</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Min. Payment</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Due Date</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Payment Progress</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDebts.map((debt) => {
                  // Get payment progress from debt data
                  const progress = debt.payment_progress || 0;
                  const remainingAmount = debt.remaining_amount || debt.amount;
                  
                  return (
                    <tr key={debt.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 font-medium">{debt.creditor_name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getDebtTypeIcon(debt.debt_type)}
                          <span>{debt.debt_type.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-red-500">{formatCurrency(debt.amount)}</td>
                      <td className="py-3 px-4 text-right font-medium text-amber-600">{formatCurrency(remainingAmount)}</td>
                      <td className="py-3 px-4 text-right">{debt.interest_rate}%</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(debt.minimum_payment)}</td>
                      <td className="py-3 px-4 text-right">{debt.due_date}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-purple-500 h-2.5 rounded-full" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between w-full text-xs">
                            <span className="text-gray-500">${(debt.amount - remainingAmount).toFixed(2)} paid</span>
                            <span className="text-gray-500 font-medium">{progress}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <button 
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            aria-label="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => handleDeleteDebt(debt.id)}
                            aria-label="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Debts;
