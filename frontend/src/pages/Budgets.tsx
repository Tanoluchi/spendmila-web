import React from 'react';

function Budgets() {
  return (
    <div className="grid gap-6 dark:text-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <button className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md">
          Create Budget
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Monthly Budget Overview</h3>
          <select className="bg-background border border-input rounded-md px-2 py-1 text-sm">
            <option>April 2025</option>
            <option>March 2025</option>
            <option>February 2025</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-xl font-bold">$3,500.00</p>
          </div>
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Spent So Far</p>
            <p className="text-xl font-bold">$2,125.75</p>
          </div>
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-xl font-bold">$1,374.25</p>
          </div>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2.5 mb-6">
          <div className="bg-purple h-2.5 rounded-full" style={{ width: '60%' }}></div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">You've spent 60% of your monthly budget with 12 days remaining.</p>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">Budget Categories</h3>
        
        <div className="space-y-4">
          {/* Sample budget categories - would be replaced with actual data */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h4 className="font-medium">Housing</h4>
              </div>
              <div className="text-right">
                <p className="font-medium">$950 / $1,000</p>
                <p className="text-sm text-muted-foreground">95% used</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h4 className="font-medium">Food & Groceries</h4>
              </div>
              <div className="text-right">
                <p className="font-medium">$425.75 / $600</p>
                <p className="text-sm text-muted-foreground">71% used</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '71%' }}></div>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <h4 className="font-medium">Transportation</h4>
              </div>
              <div className="text-right">
                <p className="font-medium">$250 / $400</p>
                <p className="text-sm text-muted-foreground">62.5% used</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '62.5%' }}></div>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <h4 className="font-medium">Entertainment</h4>
              </div>
              <div className="text-right">
                <p className="font-medium">$300 / $250</p>
                <p className="text-sm text-muted-foreground text-red-500">120% used</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <h4 className="font-medium">Utilities</h4>
              </div>
              <div className="text-right">
                <p className="font-medium">$200 / $250</p>
                <p className="text-sm text-muted-foreground">80% used</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="text-sm text-purple hover:underline">Edit Categories</button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">Budget Insights</h3>
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-sm">You've exceeded your Entertainment budget by $50. Consider adjusting your spending or increasing this category's budget.</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm">You're on track with your Transportation budget. You've spent 62.5% with 12 days remaining.</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm">Your spending pattern shows you could save about $200 more each month by reducing restaurant expenses.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budgets;
