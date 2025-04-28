import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddGoal from '@/components/Modals/AddGoal';

function Goals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="grid gap-6 dark:text-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Goals</h2>
        <button 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 z-10"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Add New Goal
        </button>
      </div>
      
      <AddGoal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sample goal cards - would be replaced with actual data */}
        <div className="bg-card rounded-lg shadow-sm p-4 border-t-4 border-blue-500">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">Emergency Fund</h3>
            <div className="flex gap-2">
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Save 6 months of expenses</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>$6,000 / $15,000</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">40% complete</span>
              <span className="text-muted-foreground">Target: Dec 2025</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-background border border-input hover:bg-muted/50 rounded-md py-1.5 text-sm">Add Funds</button>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-4 border-t-4 border-green-500">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">Vacation Fund</h3>
            <div className="flex gap-2">
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Trip to Europe</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>$2,500 / $5,000</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">50% complete</span>
              <span className="text-muted-foreground">Target: Jul 2025</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-background border border-input hover:bg-muted/50 rounded-md py-1.5 text-sm">Add Funds</button>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-4 border-t-4 border-purple-500">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">New Car</h3>
            <div className="flex gap-2">
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Down payment for new vehicle</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>$3,000 / $10,000</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-muted-foreground">30% complete</span>
              <span className="text-muted-foreground">Target: Oct 2026</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-background border border-input hover:bg-muted/50 rounded-md py-1.5 text-sm">Add Funds</button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">Goal Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Total Goals Amount</p>
            <p className="text-xl font-bold">$30,000.00</p>
          </div>
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Current Savings</p>
            <p className="text-xl font-bold">$11,500.00</p>
          </div>
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Monthly Contribution</p>
            <p className="text-xl font-bold">$850.00</p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">Goal Recommendations</h3>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm">Based on your income and expenses, you could increase your monthly goal contributions by $150 to reach your targets sooner.</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm">Your Emergency Fund is your highest priority goal. Consider allocating more funds to reach this goal faster.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Goals;
