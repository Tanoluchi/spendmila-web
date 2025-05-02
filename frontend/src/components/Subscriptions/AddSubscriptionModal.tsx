import React, { useState, useEffect } from 'react';
import { type Subscription } from '@/client/services/SubscriptionService';
import { useCurrencies } from '@/hooks/useCurrencies';
import { useAccounts } from '@/hooks/useAccounts';

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

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isEditing: boolean;
  currentSubscription?: Subscription;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  currentSubscription
}) => {
  // Always call hooks at the top level in the same order
  const { currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const { accounts, isLoading: isLoadingAccounts } = useAccounts();

  // Initialize form data with default values
  const [formData, setFormData] = useState({
    id: '',
    service_name: '',
    custom_service_name: '',
    amount: 0,
    frequency: 'monthly',
    description: '',
    next_payment_date: new Date().toISOString().split('T')[0],
    currency_id: '',
    account_id: ''
  });

  // Update form data when currentSubscription changes or when editing mode is activated
  useEffect(() => {
    if (isEditing && currentSubscription) {
      // Check if the service name is in our predefined list
      const isCustomService = !SUBSCRIPTION_SERVICES.includes(currentSubscription.service_name);
      
      setFormData({
        id: currentSubscription.id,
        service_name: isCustomService ? 'Other' : currentSubscription.service_name,
        custom_service_name: isCustomService ? currentSubscription.service_name : '',
        amount: currentSubscription.amount,
        frequency: currentSubscription.frequency,
        description: currentSubscription.description || '',
        next_payment_date: currentSubscription.next_payment_date,
        currency_id: currentSubscription.currency_id,
        account_id: currentSubscription.account_id || ''
      });
    } else {
      // Reset form when not editing
      setFormData({
        id: '',
        service_name: '',
        custom_service_name: '',
        amount: 0,
        frequency: 'monthly',
        description: '',
        next_payment_date: new Date().toISOString().split('T')[0],
        currency_id: '',
        account_id: ''
      });
    }
  }, [isEditing, currentSubscription]);

  // Set default currency if available and not already set
  useEffect(() => {
    if (currencies?.length > 0 && !formData.currency_id) {
      // Find USD or first currency
      const usdCurrency = currencies.find(c => c.code === 'USD');
      setFormData(prev => ({
        ...prev,
        currency_id: usdCurrency ? usdCurrency.id : currencies[0].id
      }));
    }
  }, [currencies, formData.currency_id]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'service_name' && value === 'Other') {
      setFormData(prev => ({ ...prev, [name]: value, custom_service_name: '' }));
    } else if (name === 'service_name' && value !== 'Other') {
      setFormData(prev => ({ ...prev, [name]: value, custom_service_name: '' }));
    } else if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      // Use custom service name if "Other" is selected
      service_name: formData.service_name === 'Other' ? formData.custom_service_name : formData.service_name
    };
    
    // Remove custom_service_name as it's not needed in the API
    const { custom_service_name, ...dataToSubmit } = submissionData;
    
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 dark:text-gray-200">
          {isEditing ? 'Edit Subscription' : 'Add New Subscription'}
        </h2>
        
        {(isLoadingCurrencies || isLoadingAccounts) ? (
          <div className="p-4 text-center">
            <p className="dark:text-gray-200">Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Service
              </label>
              <select
                name="service_name"
                value={formData.service_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background dark:text-gray-200"
                required
              >
                <option value="">Select a service</option>
                {SUBSCRIPTION_SERVICES.map(service => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
            
            {formData.service_name === 'Other' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Custom Service Name
                </label>
                <input
                  type="text"
                  name="custom_service_name"
                  value={formData.custom_service_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-background dark:text-gray-200"
                  required
                />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full p-2 border rounded-md bg-background dark:text-gray-200"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Currency
              </label>
              <select
                name="currency_id"
                value={formData.currency_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background dark:text-gray-200"
                required
              >
                <option value="">Select a currency</option>
                {currencies?.map(currency => (
                  <option key={currency.id} value={currency.id}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Frequency
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background dark:text-gray-200"
                required
              >
                {SUBSCRIPTION_FREQUENCIES.map(freq => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Next Payment Date
              </label>
              <input
                type="date"
                name="next_payment_date"
                value={formData.next_payment_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background dark:text-gray-200"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Account (Optional)
              </label>
              <select
                name="account_id"
                value={formData.account_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background dark:text-gray-200"
              >
                <option value="">Select an account</option>
                {accounts?.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.account_type})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background dark:text-gray-200"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple hover:bg-purple-700 text-white rounded-md"
              >
                {isEditing ? 'Update' : 'Add'} Subscription
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
