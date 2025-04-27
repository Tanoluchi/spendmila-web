import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, BarChart2, TrendingUp } from 'lucide-react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

// Mock data for charts
const pieChartData = {
  labels: ['Food & Dining', 'Housing', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Other'],
  datasets: [
    {
      data: [25, 35, 15, 8, 10, 12, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const barChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Income',
      data: [4500, 4500, 4800, 4500, 4500, 5000],
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    {
      label: 'Expenses',
      data: [3200, 3800, 3500, 3900, 3600, 3400],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Savings',
      data: [1300, 700, 1300, 600, 900, 1600],
      fill: false,
      borderColor: 'rgba(54, 162, 235, 1)',
      tension: 0.1,
    },
  ],
};

const Charts = () => {
  const [timeRange, setTimeRange] = useState('6-months');

  return (
    <div className="space-y-6 dark:text-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Charts & Analytics</h1>
          <p className="text-muted-foreground">
            Visualize your spending patterns and financial trends.
          </p>
        </div>
        <Select 
          value={timeRange}
          onValueChange={setTimeRange}
          className="w-full sm:w-[180px]"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-month">Last Month</SelectItem>
            <SelectItem value="3-months">Last 3 Months</SelectItem>
            <SelectItem value="6-months">Last 6 Months</SelectItem>
            <SelectItem value="1-year">Last Year</SelectItem>
            <SelectItem value="all-time">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="spending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spending" className="flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            <span>Spending</span>
          </TabsTrigger>
          <TabsTrigger value="income-expense" className="flex items-center">
            <BarChart2 className="w-4 h-4 mr-2" />
            <span>Income vs Expense</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>Trends</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="spending" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>
                How your expenses are distributed across different categories
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full max-w-md">
                <Pie data={pieChartData} options={{ responsive: true }} />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
                <CardDescription>
                  Categories where you spend the most
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pieChartData.labels.slice(0, 5).map((label, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: pieChartData.datasets[0].backgroundColor[index] as string }}
                        />
                        <span>{label}</span>
                      </div>
                      <span className="font-medium">${(pieChartData.datasets[0].data[index] / 100 * 5000).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Spending Insights</CardTitle>
                <CardDescription>
                  Analysis of your spending habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-medium text-blue-700 dark:text-blue-300">Housing is your biggest expense</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">35% of your total spending</p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <h3 className="font-medium text-amber-700 dark:text-amber-300">Food spending is above average</h3>
                    <p className="text-sm text-amber-600 dark:text-amber-400">25% compared to 20% average</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-medium text-green-700 dark:text-green-300">Transportation costs are optimized</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">15% compared to 18% average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="income-expense" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>
                Compare your monthly income and expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Bar 
                  data={barChartData} 
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} 
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-green-500">$4,633</span>
                  <span className="text-sm text-muted-foreground">per month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-red-500">$3,566</span>
                  <span className="text-sm text-muted-foreground">per month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Savings Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-blue-500">23%</span>
                  <span className="text-sm text-muted-foreground">of income</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Savings Trend</CardTitle>
              <CardDescription>
                Track your savings progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Line 
                  data={lineChartData} 
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} 
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Growth</CardTitle>
                <CardDescription>
                  Your financial growth month over month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Net Worth</span>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>+4.2%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Savings</span>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>+7.8%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Income</span>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>+2.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Spending Forecast</CardTitle>
                <CardDescription>
                  Projected spending for next month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-medium">Projected Expenses</h3>
                    <p className="text-2xl font-bold mt-1">$3,450</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on your 6-month average
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-medium text-green-700 dark:text-green-300">Potential Savings</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">$1,183</p>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
                      If you maintain your current income
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Charts;
