
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart, LineChart, PieChart, ComposedChart, Area, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Cell, Pie
} from 'recharts';
import { Button } from "@/components/ui/button";
import { 
  ChartPie, ChartBar, ChartLine, BarChartHorizontal, TrendingUp
} from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';

// Mock data for income vs expenses by month
const monthlyFinancialData = [
  { name: 'Jan', income: 4500, expenses: 3200, netWorth: 10000 },
  { name: 'Feb', income: 4700, expenses: 3400, netWorth: 11300 },
  { name: 'Mar', income: 4800, expenses: 3300, netWorth: 12800 },
  { name: 'Apr', income: 4600, expenses: 3700, netWorth: 13700 },
  { name: 'May', income: 5000, expenses: 3800, netWorth: 14900 },
  { name: 'Jun', income: 5200, expenses: 3900, netWorth: 16200 },
  { name: 'Jul', income: 5400, expenses: 4100, netWorth: 17500 },
  { name: 'Aug', income: 5300, expenses: 4200, netWorth: 18600 },
  { name: 'Sep', income: 5500, expenses: 4000, netWorth: 20100 },
  { name: 'Oct', income: 5700, expenses: 4100, netWorth: 21700 },
  { name: 'Nov', income: 5800, expenses: 4300, netWorth: 23200 },
  { name: 'Dec', income: 6000, expenses: 4500, netWorth: 24700 },
];

// Mock data for spending by category
const categorySpendingData = [
  { name: 'Housing', value: 1200, color: '#8B5CF6' },
  { name: 'Food', value: 600, color: '#F97316' },
  { name: 'Transportation', value: 300, color: '#0EA5E9' },
  { name: 'Entertainment', value: 200, color: '#D946EF' },
  { name: 'Utilities', value: 250, color: '#6E59A5' },
  { name: 'Shopping', value: 350, color: '#22C55E' },
  { name: 'Health', value: 180, color: '#EF4444' },
  { name: 'Other', value: 220, color: '#64748B' },
];

// Mock data for income sources
const incomeSourcesData = [
  { name: 'Salary', value: 4500, color: '#8B5CF6' },
  { name: 'Freelance', value: 800, color: '#F97316' },
  { name: 'Investments', value: 400, color: '#0EA5E9' },
  { name: 'Rental', value: 600, color: '#D946EF' },
  { name: 'Other', value: 200, color: '#6E59A5' },
];

const Graphs = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('6months');
  const [activeSection, setActiveSection] = useState("Graphs");

  // Chart configuration
  const chartConfig = {
    incomeExpense: { 
      expenses: { label: "Expenses", theme: { light: "#F97316", dark: "#F97316" } }, 
      income: { label: "Income", theme: { light: "#8B5CF6", dark: "#8B5CF6" } },
    },
    netWorth: { 
      netWorth: { label: "Net Worth", theme: { light: "#22C55E", dark: "#22C55E" } },
    },
    categorySpending: {
      value: { label: "Amount", theme: { light: "#8B5CF6", dark: "#8B5CF6" } },
    },
    incomeSources: {
      value: { label: "Amount", theme: { light: "#8B5CF6", dark: "#8B5CF6" } },
    },
  };

  // Filter data based on selected time range
  const getFilteredData = (data, timeRange) => {
    if (timeRange === '1month') {
      return data.slice(-1);
    } else if (timeRange === '3months') {
      return data.slice(-3);
    } else if (timeRange === '6months') {
      return data.slice(-6);
    } else if (timeRange === '1year') {
      return data;
    }
    return data;
  };

  const filteredMonthlyData = getFilteredData(monthlyFinancialData, timeRange);

  // Calculate summary statistics
  const getTotalIncome = () => filteredMonthlyData.reduce((total, month) => total + month.income, 0);
  const getTotalExpenses = () => filteredMonthlyData.reduce((total, month) => total + month.expenses, 0);
  const getAverageIncome = () => Math.round(getTotalIncome() / filteredMonthlyData.length);
  const getAverageExpenses = () => Math.round(getTotalExpenses() / filteredMonthlyData.length);
  const getSavingsRate = () => {
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    return Math.round(((totalIncome - totalExpenses) / totalIncome) * 100);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background dark:text-gray-200">
        {/* Main Content */}
        <SidebarInset className="p-4 md:p-6 overflow-y-auto">
          
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h1 className="text-2xl font-bold mb-4">Financial Overview</h1>
              
              <div className="flex items-center gap-2">
                <Button variant={timeRange === '1month' ? 'default' : 'outline'} 
                  onClick={() => setTimeRange('1month')} size="sm">
                  1 Month
                </Button>
                <Button variant={timeRange === '3months' ? 'default' : 'outline'} 
                  onClick={() => setTimeRange('3months')} size="sm">
                  3 Months
                </Button>
                <Button variant={timeRange === '6months' ? 'default' : 'outline'} 
                  onClick={() => setTimeRange('6months')} size="sm">
                  6 Months
                </Button>
                <Button variant={timeRange === '1year' ? 'default' : 'outline'} 
                  onClick={() => setTimeRange('1year')} size="sm">
                  1 Year
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="income-expense">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-4">
                <TabsTrigger value="income-expense">
                  <ChartBar className="h-4 w-4 mr-2" />
                  Income vs Expenses
                </TabsTrigger>
                <TabsTrigger value="categories">
                  <ChartPie className="h-4 w-4 mr-2" />
                  Expense Categories
                </TabsTrigger>
                <TabsTrigger value="income">
                  <BarChartHorizontal className="h-4 w-4 mr-2" />
                  Income Sources
                </TabsTrigger>
                <TabsTrigger value="networth">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Net Worth
                </TabsTrigger>
              </TabsList>

              {/* Improved Income vs Expenses Tab */}
              <TabsContent value="income-expense" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Income vs Expenses</CardTitle>
                    <CardDescription>Monthly comparison of income and expenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Financial Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 p-4 rounded-lg border border-purple-100 dark:border-purple-900">
                        <div className="text-sm font-medium text-muted-foreground">Total Income</div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">${getTotalIncome().toLocaleString()}</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30 p-4 rounded-lg border border-orange-100 dark:border-orange-900">
                        <div className="text-sm font-medium text-muted-foreground">Total Expenses</div>
                        <div className="text-2xl font-bold text-orange-500 dark:text-orange-400">${getTotalExpenses().toLocaleString()}</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/30 p-4 rounded-lg border border-green-100 dark:border-green-900">
                        <div className="text-sm font-medium text-muted-foreground">Savings Rate</div>
                        <div className="text-2xl font-bold text-green-500 dark:text-green-400">{getSavingsRate()}%</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/40 dark:to-sky-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                        <div className="text-sm font-medium text-muted-foreground">Net Savings</div>
                        <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">${(getTotalIncome() - getTotalExpenses()).toLocaleString()}</div>
                      </div>
                    </div>
                    
                    {/* Main Chart */}
                    <div className="space-y-6">
                      <ChartContainer className="h-72" config={chartConfig.incomeExpense}>
                        <ComposedChart data={filteredMonthlyData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="income" name="Income" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="expenses" name="Expenses" fill="#F97316" radius={[4, 4, 0, 0]} />
                          <Line type="monotone" dataKey="income" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          <Line type="monotone" dataKey="expenses" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        </ComposedChart>
                      </ChartContainer>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Income Metrics */}
                        <Card className="border-l-4 border-l-purple-500">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                              Income Insights
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Average Monthly</span>
                                <span className="font-medium">${getAverageIncome().toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Highest Month</span>
                                <span className="font-medium">${Math.max(
                                  ...filteredMonthlyData.map(item => item.income)
                                ).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Income Growth</span>
                                <span className={`font-medium ${
                                  filteredMonthlyData.length > 1 && 
                                  filteredMonthlyData[filteredMonthlyData.length - 1].income > filteredMonthlyData[0].income
                                    ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  {filteredMonthlyData.length > 1 ? 
                                    `${(((filteredMonthlyData[filteredMonthlyData.length - 1].income / 
                                      filteredMonthlyData[0].income) - 1) * 100).toFixed(1)}%` : 
                                    'N/A'}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Expense Metrics */}
                        <Card className="border-l-4 border-l-orange-500">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center">
                              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                              Expense Insights
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Average Monthly</span>
                                <span className="font-medium">${getAverageExpenses().toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Highest Month</span>
                                <span className="font-medium">${Math.max(
                                  ...filteredMonthlyData.map(item => item.expenses)
                                ).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Monthly Savings</span>
                                <span className="font-medium text-green-500">
                                  ${Math.round(
                                    filteredMonthlyData.reduce((sum, item) => sum + (item.income - item.expenses), 0) / 
                                    filteredMonthlyData.length
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Categories</CardTitle>
                    <CardDescription>Breakdown of spending by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ChartContainer className="h-80" config={chartConfig.categorySpending}>
                        <PieChart>
                          <Pie
                            data={categorySpendingData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categorySpendingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                          <Legend />
                        </PieChart>
                      </ChartContainer>

                      <div>
                        <div className="rounded-md border">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr className="text-left">
                                <th className="p-3">Category</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">%</th>
                              </tr>
                            </thead>
                            <tbody>
                              {categorySpendingData.map((category, i) => {
                                const totalSpending = categorySpendingData.reduce((sum, item) => sum + item.value, 0);
                                const percentage = (category.value / totalSpending) * 100;
                                
                                return (
                                  <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                                    <td className="p-3 flex items-center">
                                      <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                                      {category.name}
                                    </td>
                                    <td className="p-3">${category.value.toLocaleString()}</td>
                                    <td className="p-3">{percentage.toFixed(1)}%</td>
                                  </tr>
                                );
                              })}
                              <tr className="font-bold bg-muted/30">
                                <td className="p-3">Total</td>
                                <td className="p-3">
                                  ${categorySpendingData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                                </td>
                                <td className="p-3">100%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Income Sources Tab */}
              <TabsContent value="income" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Income Sources</CardTitle>
                    <CardDescription>Breakdown of income by source</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ChartContainer className="h-80" config={chartConfig.incomeSources}>
                        <PieChart>
                          <Pie
                            data={incomeSourcesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {incomeSourcesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                          <Legend />
                        </PieChart>
                      </ChartContainer>

                      <div>
                        <div className="rounded-md border">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr className="text-left">
                                <th className="p-3">Source</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">%</th>
                              </tr>
                            </thead>
                            <tbody>
                              {incomeSourcesData.map((source, i) => {
                                const totalIncome = incomeSourcesData.reduce((sum, item) => sum + item.value, 0);
                                const percentage = (source.value / totalIncome) * 100;
                                
                                return (
                                  <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                                    <td className="p-3 flex items-center">
                                      <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: source.color }}></div>
                                      {source.name}
                                    </td>
                                    <td className="p-3">${source.value.toLocaleString()}</td>
                                    <td className="p-3">{percentage.toFixed(1)}%</td>
                                  </tr>
                                );
                              })}
                              <tr className="font-bold bg-muted/30">
                                <td className="p-3">Total</td>
                                <td className="p-3">
                                  ${incomeSourcesData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                                </td>
                                <td className="p-3">100%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Net Worth Tab */}
              <TabsContent value="networth" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Net Worth Trend</CardTitle>
                    <CardDescription>Growth of your net worth over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer className="h-80" config={chartConfig.netWorth}>
                      <ComposedChart data={filteredMonthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area type="monotone" dataKey="netWorth" fill="#22C55E" stroke="#22C55E" fillOpacity={0.2} />
                        <Line type="monotone" dataKey="netWorth" stroke="#22C55E" dot={{ r: 4 }} />
                      </ComposedChart>
                    </ChartContainer>
                    
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground">Initial Net Worth</div>
                        <div className="text-2xl font-bold">
                          ${filteredMonthlyData[0]?.netWorth.toLocaleString() || 0}
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground">Current Net Worth</div>
                        <div className="text-2xl font-bold">
                          ${filteredMonthlyData[filteredMonthlyData.length - 1]?.netWorth.toLocaleString() || 0}
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground">Growth ($)</div>
                        <div className="text-2xl font-bold">
                          ${filteredMonthlyData.length > 1 ? 
                            (filteredMonthlyData[filteredMonthlyData.length - 1].netWorth - 
                            filteredMonthlyData[0].netWorth).toLocaleString() : 0}
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground">Growth (%)</div>
                        <div className="text-2xl font-bold">
                          {filteredMonthlyData.length > 1 && filteredMonthlyData[0].netWorth > 0 ? 
                            `${(((filteredMonthlyData[filteredMonthlyData.length - 1].netWorth / 
                              filteredMonthlyData[0].netWorth) - 1) * 100).toFixed(1)}%` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Graphs;