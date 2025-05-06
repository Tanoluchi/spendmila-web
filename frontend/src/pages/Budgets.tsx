import React, { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarSeparator, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { BarChart2, FileText, Landmark, CreditCard, PieChart, BarChart, ArrowDownToLine, ArrowUpFromLine, Settings, HelpCircle, Menu } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart as ReChartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useNavigate } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useBudgetData } from "@/hooks/useBudgetData";
import { type Transaction } from "@/types/transaction";
import { type Budget } from "@/client/services/BudgetService";

const Budgets = () => {
  const [activeSection, setActiveSection] = useState("Budgets");
  const navigate = useNavigate();
  
  // Use the budget data hook to fetch data dynamically
  const { 
    budgets, 
    chartData, 
    budgetStatus,
    userData,
    isLoading, 
    isEmpty,
    year,
    month,
    availableMonths,
    availableYears,
    handleMonthChange,
    handleYearChange,
    error,
    formatMoney,
    getTransactionsByBudget, 
    selectedBudgetId: activeBudgetIdForTransactions, 
    setSelectedBudgetId: setActiveBudgetIdForTransactions 
  } = useBudgetData();
  
  // State for transactions of the active budget
  const [transactionsForActiveBudget, setTransactionsForActiveBudget] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  
  // Handler to fetch and display transactions for a clicked budget
  const handleBudgetClick = async (budget: Budget) => { 
    if (!budget.category_id) {
      toast.error("This budget does not have an assigned category or category_id is missing.");
      setTransactionsForActiveBudget([]);
      if (setActiveBudgetIdForTransactions) setActiveBudgetIdForTransactions(null);
      return;
    }

    // If clicking the already active budget, toggle off or refresh
    if (activeBudgetIdForTransactions === budget.id) {
      setActiveBudgetIdForTransactions?.(null); 
      setTransactionsForActiveBudget([]);
      return;
    }

    setActiveBudgetIdForTransactions?.(budget.id);
    setIsLoadingTransactions(true);
    setTransactionsForActiveBudget([]); 

    try {
      if (getTransactionsByBudget) {
        // Use the category_id from the budget for filtering
        const response = await getTransactionsByBudget(budget.category_id);
        
        // Sort transactions by date (most recent first)
        const sortedTransactions = [...response.items].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        // Filter to ensure only transactions matching this category are shown
        const categoryFilteredTransactions = sortedTransactions.filter(tx => 
          tx.category?.id === budget.category_id
        );
        
        setTransactionsForActiveBudget(categoryFilteredTransactions);
        
        if (categoryFilteredTransactions.length === 0 && sortedTransactions.length > 0) {
          toast.info(`No transactions found specifically for the ${budget.category_name || 'selected'} category in this period.`);
        }
      } else {
        toast.error("Transaction fetching function is not available.");
      }
    } catch (error) {
      console.error("Error fetching transactions for budget:", error);
      toast.error("Could not load transactions for this budget.");
      setTransactionsForActiveBudget([]); 
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background dark:text-gray-200">
        
        {/* Main Content */}
        <SidebarInset className="p-4 md:p-6 overflow-y-auto">
          
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold">Budget Overview</h1>
                <p className="text-muted-foreground">Track and manage your spending categories</p>
              </div>
              <div className="flex items-center gap-4 mt-2 md:mt-0">
                <div className="flex space-x-2">
                  <div className="w-36">
                    <Select 
                      value={month.toString()} 
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMonths.map((m: { value: number; label: string }) => (
                          <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-28">
                    <Select 
                      value={year.toString()} 
                      onValueChange={handleYearChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYears.map((y: { value: number; label: string }) => (
                          <SelectItem key={y.value} value={y.value.toString()}>{y.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  className="bg-purple hover:bg-purple-dark"
                  onClick={() => toast.info('Create budget feature coming soon')}
                >
                  Create Budget
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Budget Summary</CardTitle>
                    <CardDescription>Overall budget performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-64 flex items-center justify-center">
                        <Spinner size="lg" />
                      </div>
                    ) : isEmpty ? (
                      <div className="h-64 flex items-center justify-center flex-col gap-4">
                        <p className="text-muted-foreground text-center">No budget data available</p>
                        <Button 
                          size="sm"
                          onClick={() => toast.info('Create budget feature coming soon')}
                        >
                          Create Budget
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="h-64 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <ReChartsPieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                dataKey="value"
                              >
                                {chartData.map((entry, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </ReChartsPieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Total Budget</span>
                            <span className="text-lg font-bold">
                              {budgetStatus?.currency_symbol}{budgetStatus && typeof budgetStatus.total_budgeted === 'number' ? budgetStatus.total_budgeted.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Total Spent</span>
                            <span className="text-gray-500">
                              {budgetStatus?.currency_symbol}{budgetStatus && typeof budgetStatus.total_spent === 'number' ? budgetStatus.total_spent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Remaining</span>
                            <span className={`${budgetStatus && budgetStatus.status === 'over-budget' ? 'text-rose-600' : 'text-green-600'} font-medium`}>
                              {budgetStatus?.currency_symbol}{budgetStatus && typeof budgetStatus.remaining === 'number' ? budgetStatus.remaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Overall Budget</span>
                            <span className="text-sm">
                              {budgetStatus && typeof budgetStatus.percentage === 'number' ? budgetStatus.percentage : 0}%
                            </span>
                          </div>
                          <Progress 
                            value={budgetStatus && typeof budgetStatus.percentage === 'number' ? budgetStatus.percentage : 0} 
                            className={budgetStatus && budgetStatus.status === 'over-budget' ? "bg-rose-100" : ""} 
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Budgets Details</CardTitle>
                    <CardDescription>Spending by budgets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-64 flex items-center justify-center">
                        <Spinner size="lg" />
                      </div>
                    ) : isEmpty ? (
                      <div className="h-64 flex items-center justify-center">
                        <p className="text-muted-foreground text-center">No budget data available</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {budgets.map((budget) => (
                          <div key={budget.id}>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: budget.color }}></div>
                                  <span className="font-medium">{budget.name}</span>
                                </div>
                                {budget.category_id && (
                                  <span className="text-xs text-muted-foreground ml-5">
                                    Category: {budget.category_name || "Loading..."}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm flex gap-2">
                                <span>{budget.currency_symbol}{Number(budget.spent_amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} spent</span>
                                <span className="text-muted-foreground">of {budget.currency_symbol}{Number(budget.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-2"> 
                              <div className="flex-1">
                                <Progress 
                                  value={Number(budget.progress_percentage)} 
                                  className={Number(budget.spent_amount) > Number(budget.amount) ? "bg-rose-100" : ""}
                                />
                              </div>
                              <span className={`text-sm font-medium ${
                                Number(budget.spent_amount) > Number(budget.amount) ? 'text-rose-600' : 'text-green-600'
                              }`}>
                                {Number(budget.progress_percentage)}%
                              </span>
                            </div>
                            {/* Button to view/hide transactions */}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleBudgetClick(budget)}
                              className="mb-2 text-xs"
                            >
                              {activeBudgetIdForTransactions === budget.id ? "Hide Transactions" : "View Transactions"}
                            </Button>

                            {/* Conditional rendering for transactions */}
                            {activeBudgetIdForTransactions === budget.id && (
                              <div className="mt-2 p-2 border rounded-md bg-slate-50 dark:bg-slate-800">
                                <div className="mb-2 text-xs text-muted-foreground border-b pb-1">
                                  Transactions for {availableMonths.find(m => m.value === month)?.label} {year}
                                </div>
                                {isLoadingTransactions ? (
                                  <div className="flex justify-center items-center p-4">
                                    <Spinner size="sm" />
                                  </div>
                                ) : transactionsForActiveBudget.length > 0 ? (
                                  <div>
                                    <ul className="space-y-1 text-xs">
                                      {transactionsForActiveBudget.map(tx => (
                                        <li key={tx.id} className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                          <div className="flex flex-col">
                                            <span className="font-medium">{tx.description || "N/A"}</span>
                                            <span className="text-[10px] text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</span>
                                          </div>
                                          <span className="font-medium">{budget.currency_symbol}{Number(tx.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground text-center p-2">No transactions found for this budget in {availableMonths.find(m => m.value === month)?.label} {year}.</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Budgets;