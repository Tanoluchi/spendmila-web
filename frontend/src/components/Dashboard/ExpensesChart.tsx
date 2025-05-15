// frontend/src/components/Dashboard/ExpensesChart.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // For error display
import { AlertCircle } from 'lucide-react'; // For error icon

import { SummaryService } from '@/client/services/SummaryService';
import type { 
    MonthlyExpenseSummaryItem, 
    DailyExpenseSummaryItem, 
    ChartDataItem,
    UserExpenseSummaryResponse
} from '@/types/summary';

// Helper function to transform monthly data for the chart
const transformMonthlyData = (monthlySummary: MonthlyExpenseSummaryItem[]): ChartDataItem[] => {
    return monthlySummary.map(item => ({
        name: item.month_name, // e.g., "Jan", "Feb"
        expenses: item.total_expenses,
    }));
};

// Helper function to transform daily/weekly data for the chart
const transformDailyData = (dailySummary: DailyExpenseSummaryItem[]): ChartDataItem[] => {
    // Show last 7 days for "weekly"
    // The backend already filters by date range, so we just map it
    return dailySummary.map(item => ({
        name: item.day_name, // e.g., "Mon", "Tue" or could be item.date_str for more detail
        expenses: item.total_expenses,
    }));
};

const ExpensesChart = () => {
    const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // For 'weekly', we'll fetch the last 7 days of daily data.
                // For 'monthly', we'll fetch the current year's monthly data.
                const response: UserExpenseSummaryResponse = await SummaryService.readUserExpenseSummary({
                    year: period === 'monthly' ? new Date().getFullYear() : undefined, // Current year for monthly
                    daysForDaily: period === 'weekly' ? 7 : undefined, // Last 7 days for weekly
                });

                if (period === 'monthly') {
                    setChartData(transformMonthlyData(response.monthly_summary));
                } else { // period === 'weekly'
                    setChartData(transformDailyData(response.daily_summary));
                }
            } catch (err: any) {
                console.error("Failed to fetch expense summary:", err);
                setError(err.message || "Failed to load expense data.");
                setChartData([]); // Clear data on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [period]); // Refetch when period changes

    if (isLoading) {
        return (
            <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Total Expenses</CardTitle>
                    {/* Keep select disabled or visually distinct during load if preferred */}
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                        <p>Loading expenses...</p> {/* Or a spinner component */}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }
    
    // Ensure data is not empty for the chart to render, or Recharts might complain
    const dataToRender = chartData.length > 0 ? chartData : [{name: "No Data", expenses: 0}];


    return (
        <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Expenses</CardTitle>
                <Select value={period} onValueChange={(value) => setPeriod(value as 'monthly' | 'weekly')}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataToRender}> {/* Use dataToRender */}
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip 
                                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Expenses']}
                                labelFormatter={(label: string) => `${label}`}
                                contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "0.5rem", borderWidth: "1px" }}
                                cursor={{ fill: "transparent" }}
                            />
                            <Bar dataKey="expenses" fill="var(--theme-primary, #9b87f5)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExpensesChart;