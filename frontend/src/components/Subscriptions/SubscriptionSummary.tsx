import React from 'react';
import { type Subscription } from '@/client/services/SubscriptionService';

interface SubscriptionSummaryProps {
  subscriptions: Subscription[];
}

const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({ subscriptions }) => {
  // Calculate monthly equivalent for all subscriptions
  const calculateMonthlyTotal = () => {
    return subscriptions.reduce((total, sub) => {
      let amount = sub.amount;
      if (sub.frequency === "yearly") {
        amount = amount / 12;
      } else if (sub.frequency === "quarterly") {
        amount = amount / 3;
      }
      return total + amount;
    }, 0);
  };

  // Count subscriptions by frequency
  const getFrequencyBreakdown = () => {
    return subscriptions.reduce(
      (acc, sub) => {
        const frequency = sub.frequency as keyof typeof acc;
        if (acc[frequency] !== undefined) {
          acc[frequency]++;
        }
        return acc;
      },
      { monthly: 0, quarterly: 0, yearly: 0 }
    );
  };

  const frequencyBreakdown = getFrequencyBreakdown();
  const monthlyTotal = calculateMonthlyTotal();

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 dark:text-gray-200">
      <h3 className="text-lg font-medium mb-4">Subscription Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-background rounded-md">
          <p className="text-sm text-muted-foreground">Total Subscriptions</p>
          <p className="text-xl font-bold">{subscriptions.length}</p>
        </div>
        <div className="p-3 bg-background rounded-md">
          <p className="text-sm text-muted-foreground">Monthly Cost</p>
          <p className="text-xl font-bold">USD {monthlyTotal.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-background rounded-md">
          <p className="text-sm text-muted-foreground">Yearly Cost</p>
          <p className="text-xl font-bold">USD {(monthlyTotal * 12).toFixed(2)}</p>
        </div>
      </div>
      
      <h4 className="text-md font-medium mb-2">Frequency Breakdown</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-background rounded-md">
          <p className="text-sm text-muted-foreground">Monthly</p>
          <p className="text-xl font-bold">{frequencyBreakdown.monthly}</p>
        </div>
        <div className="p-3 bg-background rounded-md">
          <p className="text-sm text-muted-foreground">Quarterly</p>
          <p className="text-xl font-bold">{frequencyBreakdown.quarterly}</p>
        </div>
        <div className="p-3 bg-background rounded-md">
          <p className="text-sm text-muted-foreground">Yearly</p>
          <p className="text-xl font-bold">{frequencyBreakdown.yearly}</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSummary;
