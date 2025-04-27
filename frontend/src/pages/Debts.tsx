import React from 'react';

function Debts() {
  return (
    <div className="grid gap-6 dark:text-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Debts</h2>
        <button className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md">
          Add Debt
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">Debt Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Total Debt</p>
            <p className="text-xl font-bold text-red-500">$24,842.67</p>
          </div>
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Monthly Payments</p>
            <p className="text-xl font-bold">$875.00</p>
          </div>
          <div className="p-3 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Average Interest Rate</p>
            <p className="text-xl font-bold">4.8%</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Debt Name</th>
                <th className="text-left py-2 px-4">Type</th>
                <th className="text-right py-2 px-4">Balance</th>
                <th className="text-right py-2 px-4">Interest Rate</th>
                <th className="text-right py-2 px-4">Min. Payment</th>
                <th className="text-right py-2 px-4">Due Date</th>
                <th className="text-right py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data - would be replaced with actual data */}
              <tr className="border-b hover:bg-muted/50">
                <td className="py-2 px-4">Student Loan</td>
                <td className="py-2 px-4">Student Loan</td>
                <td className="py-2 px-4 text-right text-red-500">$18,500.00</td>
                <td className="py-2 px-4 text-right">4.5%</td>
                <td className="py-2 px-4 text-right">$350.00</td>
                <td className="py-2 px-4 text-right">15th</td>
                <td className="py-2 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-2 px-4">Credit Card</td>
                <td className="py-2 px-4">Credit Card</td>
                <td className="py-2 px-4 text-right text-red-500">$1,842.67</td>
                <td className="py-2 px-4 text-right">18.99%</td>
                <td className="py-2 px-4 text-right">$75.00</td>
                <td className="py-2 px-4 text-right">20th</td>
                <td className="py-2 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-2 px-4">Car Loan</td>
                <td className="py-2 px-4">Auto Loan</td>
                <td className="py-2 px-4 text-right text-red-500">$4,500.00</td>
                <td className="py-2 px-4 text-right">3.9%</td>
                <td className="py-2 px-4 text-right">$450.00</td>
                <td className="py-2 px-4 text-right">1st</td>
                <td className="py-2 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium mb-4">Debt Payoff Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-background rounded-md">
            <h4 className="font-medium mb-2">Avalanche Method</h4>
            <p className="text-sm text-muted-foreground mb-2">Pay off highest interest rate debts first to minimize interest payments.</p>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>Credit Card (18.99%)</li>
              <li>Student Loan (4.5%)</li>
              <li>Car Loan (3.9%)</li>
            </ol>
            <button className="mt-3 text-sm text-purple hover:underline">Apply This Strategy</button>
          </div>
          <div className="p-4 bg-background rounded-md">
            <h4 className="font-medium mb-2">Snowball Method</h4>
            <p className="text-sm text-muted-foreground mb-2">Pay off smallest balances first for psychological wins.</p>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>Credit Card ($1,842.67)</li>
              <li>Car Loan ($4,500.00)</li>
              <li>Student Loan ($18,500.00)</li>
            </ol>
            <button className="mt-3 text-sm text-purple hover:underline">Apply This Strategy</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debts;
