import React from 'react';
import { Edit, Trash, Bookmark } from 'lucide-react';
import { type Subscription } from '@/client/services/SubscriptionService';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({ 
  subscriptions, 
  onEdit, 
  onDelete 
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get frequency label
  const getFrequencyLabel = (frequency: string) => {
    const SUBSCRIPTION_FREQUENCIES = [
      { value: "monthly", label: "Monthly" },
      { value: "yearly", label: "Yearly" },
      { value: "quarterly", label: "Quarterly" },
    ];
    
    return SUBSCRIPTION_FREQUENCIES.find(f => f.value === frequency)?.label || 
      frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden dark:text-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Service</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Frequency</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Next Payment</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id} className="border-t border-border">
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Bookmark size={16} className="text-purple" />
                    {subscription.service_name}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {subscription.currency_code} {subscription.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {getFrequencyLabel(subscription.frequency)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatDate(subscription.next_payment_date)}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(subscription)}
                      aria-label={`Edit ${subscription.service_name} subscription`}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="text-muted-foreground hover:text-red-500"
                      onClick={() => onDelete(subscription.id)}
                      aria-label={`Delete ${subscription.service_name} subscription`}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionList;
