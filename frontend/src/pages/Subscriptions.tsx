import { useState } from 'react';
import { Edit, Trash, Plus, Bookmark } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { SubscriptionService, type Subscription } from '@/client/services/SubscriptionService';

// Predefined subscription services
const SUBSCRIPTION_SERVICES = [
  "Netflix",
  "Spotify",
  "Amazon Prime",
  "Disney+",
  "HBO Max",
  "YouTube Premium",
  "Apple TV+",
  "Hulu",
  "Paramount+",
  "Twitch",
  "Adobe Creative Cloud",
  "Microsoft 365",
  "iCloud",
  "Google One",
  "PlayStation Plus",
  "Xbox Game Pass",
  "Nintendo Switch Online",
  "Dropbox",
  "Other"
];

// Subscription frequencies
const SUBSCRIPTION_FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "quarterly", label: "Quarterly" },
];

// Using the Subscription interface from SubscriptionService

function Subscriptions() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    service_name: '',
    custom_service_name: '',
    amount: 0,
    frequency: 'monthly',
    next_payment_date: new Date().toISOString().split('T')[0],
    currency_code: 'USD'
  });
  
  // Fetch subscriptions from API using SubscriptionService
  const { data: subscriptionsData, isLoading, error } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      try {
        const data = await SubscriptionService.getSubscriptions();
        return { data: data.items || [], count: data.total || 0 };
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
      }
    },
    retry: 1
  });
  
  const subscriptions = subscriptionsData?.data || [];
  
  // Show error message if there was an error fetching subscriptions
  if (error) {
    console.error('Error fetching subscriptions:', error);
  }

  // Calculate total monthly cost
  const calculateMonthlyTotal = () => {
    return subscriptions.reduce((total: number, sub: Subscription) => {
      let amount = sub.amount;
      if (sub.frequency === "yearly") {
        amount = amount / 12;
      } else if (sub.frequency === "quarterly") {
        amount = amount / 3;
      }
      return total + amount;
    }, 0);
  };

  // Handle subscription editing
  const handleEditSubscription = (subscription: any) => {
    console.log('Edit subscription:', subscription);
    setFormData({
      service_name: subscription.service_name,
      custom_service_name: '',
      amount: subscription.amount,
      frequency: subscription.frequency,
      next_payment_date: subscription.next_payment_date,
      currency_code: subscription.currency_code
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle subscription deletion
  const deleteSubscriptionMutation = useMutation({
    mutationFn: (id: string) => SubscriptionService.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (error) => {
      console.error('Error deleting subscription:', error);
      alert('Failed to delete subscription. Please try again.');
    }
  });

  const handleDeleteSubscription = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      deleteSubscriptionMutation.mutate(id);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get frequency label
  const getFrequencyLabel = (frequency: string) => {
    return SUBSCRIPTION_FREQUENCIES.find(f => f.value === frequency)?.label || 
      frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  // Handle input changes in the modal form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  // Create/Update subscription mutation
  const saveSubscriptionMutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing && data.id) {
        return SubscriptionService.updateSubscription(data.id, {
          service_name: data.service_name,
          amount: data.amount,
          frequency: data.frequency,
          next_payment_date: data.next_payment_date,
          currency_code: data.currency_code
        });
      } else {
        return SubscriptionService.createSubscription({
          service_name: data.service_name,
          amount: data.amount,
          frequency: data.frequency,
          next_payment_date: data.next_payment_date,
          currency_code: data.currency_code
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      setIsModalOpen(false);
      setIsEditing(false);
      setFormData({
        service_name: '',
        custom_service_name: '',
        amount: 0,
        frequency: 'monthly',
        next_payment_date: new Date().toISOString().split('T')[0],
        currency_code: 'USD'
      });
    },
    onError: (error) => {
      console.error('Error saving subscription:', error);
      alert(`Error: Failed to ${isEditing ? 'update' : 'create'} subscription. Please try again.`);
    }
  });

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form data
      if (!formData.service_name) {
        alert('Please select a service');
        return;
      }
      
      if (formData.service_name === 'Other' && !formData.custom_service_name) {
        alert('Please enter a custom service name');
        return;
      }
      
      if (!formData.amount || formData.amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      
      // Prepare data for API
      const subscriptionData = {
        ...formData,
        service_name: formData.service_name === 'Other' ? formData.custom_service_name : formData.service_name
      };
      
      // Submit using mutation
      saveSubscriptionMutation.mutate(subscriptionData);
    } catch (error) {
      console.error('Error in form submission:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to process subscription'}`);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-gray-200">Subscriptions</h2>
        <button 
          className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Add Subscription
        </button>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center">
          <p>Loading subscriptions...</p>
        </div>
      ) : subscriptions.length > 0 ? (
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
                {subscriptions.map((subscription: Subscription) => (
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
                          onClick={() => handleEditSubscription(subscription)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="text-muted-foreground hover:text-red-500"
                          onClick={() => handleDeleteSubscription(subscription.id)}
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
      ) : (
        <div className="bg-card rounded-lg shadow-sm p-8 text-center dark:text-gray-200">
          <Bookmark size={48} className="mx-auto mb-4 text-purple opacity-50" />
          <h3 className="text-lg font-medium mb-2">No subscriptions yet</h3>
          <p className="text-muted-foreground mb-4">Add your first subscription to start tracking your expenses</p>
          <button 
            className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            Add Subscription
          </button>
        </div>
      )}
      
      <div className="bg-card rounded-lg shadow-sm p-4 dark:text-gray-200">
        <h3 className="text-lg font-medium mb-4">Subscription Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Total Subscriptions</p>
            <p className="text-xl font-bold">{subscriptions.length}</p>
          </div>
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Monthly Cost</p>
            <p className="text-xl font-bold">USD {calculateMonthlyTotal().toFixed(2)}</p>
          </div>
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Yearly Cost</p>
            <p className="text-xl font-bold">USD {(calculateMonthlyTotal() * 12).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md mx-4 dark:text-gray-200">
            <div className="p-4 border-b border-border">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{isEditing ? "Edit Subscription" : "Add New Subscription"}</h3>
                <button 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Service</label>
                  <select 
                    name="service_name" 
                    value={formData.service_name} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    <option value="">Select a service</option>
                    {SUBSCRIPTION_SERVICES.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.service_name === "Other" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Custom Service Name</label>
                    <input
                      name="custom_service_name"
                      value={formData.custom_service_name}
                      onChange={handleInputChange}
                      placeholder="Enter service name"
                      className="w-full p-2 border border-border rounded-md bg-background"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min={0}
                    step={0.01}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select 
                    name="currency_code" 
                    value={formData.currency_code} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="ARS">ARS - Argentine Peso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Frequency</label>
                  <select 
                    name="frequency" 
                    value={formData.frequency} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    {SUBSCRIPTION_FREQUENCIES.map((frequency) => (
                      <option key={frequency.value} value={frequency.value}>
                        {frequency.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Next Payment Date</label>
                  <input
                    name="next_payment_date"
                    type="date"
                    value={formData.next_payment_date}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border flex justify-end gap-2">
              <button 
                className="px-4 py-2 border border-border rounded-md hover:bg-muted"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-purple hover:bg-purple-700 text-white rounded-md"
                onClick={handleSubmit}
              >
                {isEditing ? "Update" : "Add"} Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscriptions;
