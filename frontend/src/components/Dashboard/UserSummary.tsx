import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, ArrowUpFromLine, AlertCircle, Loader2 } from "lucide-react";
import { useUserFinancialSummary } from "@/hooks/useUserFinancialSummary";

// Helper function to format currency
const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat(undefined, { // Use browser's default locale
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};

// Helper function to format percentage change
const formatPercentage = (percentage: number | undefined | null) => {
  const numPercentage = typeof percentage === 'number' ? percentage : 0;
  const sign = numPercentage > 0 ? "+" : "";
  return `${sign}${numPercentage.toFixed(1)}%`;
};

const UserSummary = () => {
  const { data: summaryData, isLoading, error } = useUserFinancialSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium animate-pulse bg-gray-300 dark:bg-gray-700 rounded w-3/4 h-5"></CardTitle>
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-pulse bg-gray-300 dark:bg-gray-700 rounded w-1/2 h-8 mb-2"></div>
              <p className="text-xs text-muted-foreground animate-pulse bg-gray-300 dark:bg-gray-700 rounded w-1/3 h-4"></p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-sm font-medium text-red-500">
              Error Fetching Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              There was an issue loading the financial summary. Please try again later.
              {error.message && <span className="block mt-1 text-xs">Details: {error.message}</span>}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!summaryData) {
    // Should ideally not happen if not loading and no error, but good for type safety
    // and to satisfy TypeScript's strict null checks if summaryData could be null/undefined.
    return <p>No summary data available.</p>;
  }

  // summaryData is already defined and typed from the useUserFinancialSummary hook, 
  // assuming the hook correctly types its return 'data' field.
  // The alias 'summaryData' is from: const { data: summaryData, ... } = useUserFinancialSummary();
  // If UserFinancialSummaryType is a more specific type or an assertion is truly needed,
  // it should be handled where 'summaryData' is destructured or by the hook itself.

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Cumulative Income
          </CardTitle>
          <ArrowUpFromLine className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {formatCurrency(summaryData.cumulative_income, summaryData.currency_code || 'USD')}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(summaryData.income_change_percentage)} from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Cumulative Expenses
          </CardTitle>
          <ArrowDownToLine className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {formatCurrency(summaryData.cumulative_expenses, summaryData.currency_code || 'USD')}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(summaryData.expense_change_percentage)} from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSummary;