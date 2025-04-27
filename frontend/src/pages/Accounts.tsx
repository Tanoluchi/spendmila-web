import React from 'react';

function Accounts() {
  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-gray-200">Accounts</h2>
        <button className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md">
          Add Account
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 dark:text-gray-200">
        {/* Sample account cards - would be replaced with actual data */}
        <div className="bg-card rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Main Checking</h3>
              <p className="text-sm text-muted-foreground">Bank of America</p>
            </div>
            <div className="flex gap-2">
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">$4,285.42</p>
            <p className="text-sm text-muted-foreground">Last updated: Today</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Savings</h3>
              <p className="text-sm text-muted-foreground">Bank of America</p>
            </div>
            <div className="flex gap-2">
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">$12,750.00</p>
            <p className="text-sm text-muted-foreground">Last updated: Yesterday</p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">Credit Card</h3>
              <p className="text-sm text-muted-foreground">Chase</p>
            </div>
            <div className="flex gap-2">
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-red-500">-$1,842.67</p>
            <p className="text-sm text-muted-foreground">Last updated: 2 days ago</p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm p-4 dark:text-gray-200">
        <h3 className="text-lg font-medium mb-4">Account Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Total Assets</p>
            <p className="text-xl font-bold">$17,035.42</p>
          </div>
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Total Debts</p>
            <p className="text-xl font-bold text-red-500">-$1,842.67</p>
          </div>
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Net Worth</p>
            <p className="text-xl font-bold">$15,192.75</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accounts;
