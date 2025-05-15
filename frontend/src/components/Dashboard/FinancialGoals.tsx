import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FinancialGoalService } from '@/client/services/FinancialGoalService';
import type { FinancialGoal } from '@/types/financialGoal';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react'; // For error icon

const FinancialGoals = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch active goals, limiting to a few for the dashboard
        const fetchedGoals = await FinancialGoalService.readFinancialGoals({ limit: 5, status: 'active' });
        // Defensive check: Ensure fetchedGoals is an array
        if (Array.isArray(fetchedGoals)) {
          setGoals(fetchedGoals);
        } else {
          // Log a warning and default to an empty array if data is not as expected
          console.warn('Financial goals data is not an array:', fetchedGoals);
          setGoals([]); // Ensure 'goals' is always an array
        }
      } catch (err: any) {
        console.error("Failed to fetch financial goals:", err);
        setError(err.message || "An unknown error occurred while fetching financial goals.");
        setGoals([]); // Also set to empty array on error to be safe
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const getProgress = (current: number, target: number): number => {
    if (target <= 0) return 0; // Avoid division by zero or negative targets
    const progress = (current / target) * 100;
    return Math.min(Math.max(progress, 0), 100); // Cap progress between 0 and 100
  };

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Financial Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading financial goals...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Financial Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (goals.length === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Financial Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No active financial goals found.</p>
          {/* Optional: Add a link/button to create a new goal */}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Financial Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal) => {
          const progress = goal.progress_percentage !== undefined 
                           ? Math.min(Math.max(goal.progress_percentage, 0), 100) 
                           : getProgress(goal.current_amount, goal.target_amount);
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm truncate" title={goal.name}>{goal.name}</span>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  ${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {Math.round(progress)}% Complete
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FinancialGoals;