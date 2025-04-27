import React, { useState } from 'react';
import { Bookmark, Edit, Trash, Plus } from 'lucide-react';

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

// Sample subscription data (would be replaced with actual API data)
const SAMPLE_SUBSCRIPTIONS = [
  {
    id: "1",
    service_name: "Netflix",
    amount: 15.99,
    frequency: "monthly",
    next_payment_date: "2025-05-15",
    currency_code: "USD",
  },
  {
    id: "2",
    service_name: "Spotify",
    amount: 9.99,
    frequency: "monthly",
    next_payment_date: "2025-05-10",
    currency_code: "USD",
  },
  {
    id: "3",
    service_name: "Amazon Prime",
    amount: 139.00,
    frequency: "yearly",
    next_payment_date: "2025-11-23",
    currency_code: "USD",
  }
];

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(SAMPLE_SUBSCRIPTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [formData, setFormData] = useState({
    service_name: "",
    custom_service_name: "",
    amount: 0,
    frequency: "monthly",
    next_payment_date: new Date().toISOString().split('T')[0],
    currency_code: "USD",
  });

  // Calculate total monthly cost
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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for creating a new subscription
  const handleAddSubscription = () => {
    setIsEditing(false);
    setCurrentSubscription(null);
    setFormData({
      service_name: "",
      custom_service_name: "",
      amount: 0,
      frequency: "monthly",
      next_payment_date: new Date().toISOString().split('T')[0],
      currency_code: "USD",
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing subscription
  const handleEditSubscription = (subscription: any) => {
    setIsEditing(true);
    setCurrentSubscription(subscription);
    setFormData({
      service_name: subscription.service_name,
      custom_service_name: SUBSCRIPTION_SERVICES.includes(subscription.service_name) ? "" : subscription.service_name,
      amount: subscription.amount,
      frequency: subscription.frequency,
      next_payment_date: subscription.next_payment_date,
      currency_code: subscription.currency_code,
    });
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Determine the final service name (either from predefined list or custom input)
    const finalServiceName = formData.service_name === "Other" ? formData.custom_service_name : formData.service_name;

    if (!finalServiceName) {
      alert("Service name is required");
      return;
    }

    const subscriptionData = {
      id: isEditing ? currentSubscription.id : Date.now().toString(),
      service_name: finalServiceName,
      amount: Number(formData.amount),
      frequency: formData.frequency,
      next_payment_date: formData.next_payment_date,
      currency_code: formData.currency_code,
    };

    if (isEditing) {
      setSubscriptions(subscriptions.map(sub => 
        sub.id === currentSubscription.id ? subscriptionData : sub
      ));
    } else {
      setSubscriptions([...subscriptions, subscriptionData]);
    }

    setIsModalOpen(false);
  };

  // Handle subscription deletion
  const handleDeleteSubscription = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
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

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-gray-200">Subscriptions</h2>
        <button 
          className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={handleAddSubscription}
        >
          <Plus size={16} />
          Add Subscription
        </button>
      </div>
      
      {subscriptions.length > 0 ? (
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
            onClick={handleAddSubscription}
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
