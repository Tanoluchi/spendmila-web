import React from 'react';

function Transactions() {
  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-gray-200">Transactions</h2>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium dark:text-gray-200">Transaction History</h3>
          <div className="flex gap-2">
            <select className="bg-background dark:text-gray-200 border border-input rounded-md px-2 py-1 text-sm">
              <option>All Categories</option>
              <option>Food</option>
              <option>Transportation</option>
              <option>Entertainment</option>
              <option>Utilities</option>
            </select>
            <select className="bg-background dark:text-gray-200 border border-input rounded-md px-2 py-1 text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Custom</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto dark:text-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Date</th>
                <th className="text-left py-2 px-4">Description</th>
                <th className="text-left py-2 px-4">Category</th>
                <th className="text-left py-2 px-4">Account</th>
                <th className="text-right py-2 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data - would be replaced with actual data */}
              <tr className="border-b hover:bg-muted/50">
                <td className="py-2 px-4">2025-04-25</td>
                <td className="py-2 px-4">Grocery Shopping</td>
                <td className="py-2 px-4">Food</td>
                <td className="py-2 px-4">Main Account</td>
                <td className="py-2 px-4 text-right text-red-500">-$85.42</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-2 px-4">2025-04-24</td>
                <td className="py-2 px-4">Salary Deposit</td>
                <td className="py-2 px-4">Income</td>
                <td className="py-2 px-4">Main Account</td>
                <td className="py-2 px-4 text-right text-green-500">$2,450.00</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-2 px-4">2025-04-23</td>
                <td className="py-2 px-4">Restaurant</td>
                <td className="py-2 px-4">Food</td>
                <td className="py-2 px-4">Credit Card</td>
                <td className="py-2 px-4 text-right text-red-500">-$42.75</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">Showing 3 of 24 transactions</div>
          <div className="flex gap-2">
            <button className="bg-background dark:text-gray-200 border border-input rounded-md px-3 py-1 text-sm">Previous</button>
            <button className="bg-background dark:text-gray-200 border border-input rounded-md px-3 py-1 text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
