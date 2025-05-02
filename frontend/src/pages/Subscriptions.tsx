import { useState } from 'react';
import { Plus, Bookmark } from 'lucide-react';
import { type Subscription } from '@/client/services/SubscriptionService';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import AddSubscriptionModal from '@/components/Subscriptions/AddSubscriptionModal';
import SubscriptionList from '@/components/Subscriptions/SubscriptionList';
import SubscriptionSummary from '@/components/Subscriptions/SubscriptionSummary';

function Subscriptions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | undefined>(undefined);
  
  const {
    subscriptions,
    isLoading,
    error,
    createSubscription,
    updateSubscription,
    deleteSubscription
  } = useSubscriptions();
  
  // Show error message if there was an error fetching subscriptions
  if (error) {
    console.error('Error fetching subscriptions:', error);
  }

  // Handle subscription editing
  const handleEditSubscription = (subscription: Subscription) => {
    setCurrentSubscription(subscription);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle subscription deletion
  const handleDeleteSubscription = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      deleteSubscription(id);
    }
  };

  // Handle form submission
  const handleSubmit = (data: any) => {
    try {
      if (isEditing && data.id) {
        // When editing, extract the ID and send the rest as update data
        const { id, ...updateData } = data;
        updateSubscription({ id, data: updateData });
        console.log('Updating subscription:', id, updateData);
      } else {
        // When creating, just send the data without ID
        const { id, ...createData } = data; // Remove any potential id field
        createSubscription(createData);
        console.log('Creating subscription:', createData);
      }
      
      // Reset state
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentSubscription(undefined);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentSubscription(undefined);
  };

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-gray-200">Subscriptions</h2>
        <button 
          className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
          onClick={() => {
            setIsEditing(false);
            setCurrentSubscription(undefined);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} />
          Add Subscription
        </button>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center dark:text-gray-200">
          <p>Loading subscriptions...</p>
        </div>
      ) : subscriptions.length > 0 ? (
        <>
          <SubscriptionList 
            subscriptions={subscriptions} 
            onEdit={handleEditSubscription} 
            onDelete={handleDeleteSubscription} 
          />
          <SubscriptionSummary subscriptions={subscriptions} />
        </>
      ) : (
        <div className="bg-card rounded-lg shadow-sm p-8 text-center dark:text-gray-200">
          <Bookmark size={48} className="mx-auto mb-4 text-purple opacity-50" />
          <h3 className="text-lg font-medium mb-2">No subscriptions yet</h3>
          <p className="text-muted-foreground mb-4">Add your first subscription to start tracking your expenses</p>
          <button 
            className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
            onClick={() => {
              setIsEditing(false);
              setCurrentSubscription(undefined);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} />
            Add Subscription
          </button>
        </div>
      )}

      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        currentSubscription={currentSubscription}
      />
    </div>
  );
}

export default Subscriptions;
