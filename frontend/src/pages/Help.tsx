import React, { useState } from 'react';

function Help() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  
  return (
    <div className="grid gap-6 dark:text-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Help Center</h2>
        <button className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md">
          Contact Support
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-card rounded-lg shadow-sm p-4 sticky top-6">
            <h3 className="text-lg font-medium mb-4">Help Categories</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'getting-started' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('getting-started')}
                >
                  Getting Started
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'accounts' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('accounts')}
                >
                  Accounts & Transactions
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'budgeting' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('budgeting')}
                >
                  Budgeting
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'goals' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('goals')}
                >
                  Financial Goals
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'debts' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('debts')}
                >
                  Debt Management
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'security' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('security')}
                >
                  Security & Privacy
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-3 py-2 rounded-md ${activeCategory === 'faq' ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}`}
                  onClick={() => setActiveCategory('faq')}
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="col-span-2">
          <div className="bg-card rounded-lg shadow-sm p-4">
            {activeCategory === 'getting-started' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Getting Started with SpendMila</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Welcome to SpendMila</h4>
                    <p className="text-sm text-muted-foreground">
                      SpendMila is your personal finance management tool designed to help you track expenses, 
                      manage budgets, set financial goals, and take control of your financial life.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Quick Start Guide</h4>
                    <ol className="list-decimal list-inside text-sm space-y-2">
                      <li>
                        <span className="font-medium">Set up your accounts:</span> Add your bank accounts, 
                        credit cards, and other financial accounts to get a complete picture of your finances.
                      </li>
                      <li>
                        <span className="font-medium">Import transactions:</span> Connect your accounts or 
                        manually import transactions to start tracking your spending.
                      </li>
                      <li>
                        <span className="font-medium">Create a budget:</span> Set up budget categories and 
                        allocate monthly spending limits to stay on track.
                      </li>
                      <li>
                        <span className="font-medium">Set financial goals:</span> Define your short and 
                        long-term financial goals to work towards.
                      </li>
                      <li>
                        <span className="font-medium">Track your debts:</span> Add your loans, credit cards, 
                        and other debts to monitor your progress in paying them off.
                      </li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Video Tutorials</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-background rounded-md p-3">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                        <p className="text-sm font-medium">Getting Started with SpendMila</p>
                        <p className="text-xs text-muted-foreground">3:45</p>
                      </div>
                      <div className="bg-background rounded-md p-3">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                        <p className="text-sm font-medium">Setting Up Your First Budget</p>
                        <p className="text-xs text-muted-foreground">5:12</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeCategory === 'faq' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
                
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <h4 className="font-medium mb-1">How secure is my financial data?</h4>
                    <p className="text-sm text-muted-foreground">
                      SpendMila uses bank-level encryption to protect your data. We never store your bank 
                      credentials, and all connections to financial institutions are secured with 256-bit 
                      encryption. Your privacy and security are our top priorities.
                    </p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <h4 className="font-medium mb-1">Can I import transactions from my bank?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, SpendMila supports direct connections to thousands of financial institutions. 
                      You can also manually import transactions from CSV files if you prefer.
                    </p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <h4 className="font-medium mb-1">Is there a mobile app available?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, SpendMila is available on iOS and Android devices. You can download the app from 
                      the App Store or Google Play Store.
                    </p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <h4 className="font-medium mb-1">How do I cancel my subscription?</h4>
                    <p className="text-sm text-muted-foreground">
                      You can cancel your subscription at any time from the Settings > Billing section. 
                      Your subscription will remain active until the end of the current billing period.
                    </p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <h4 className="font-medium mb-1">Can I export my data?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can export your transaction data, budget reports, and other information to 
                      CSV or PDF formats from the Export section in the dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other category content would be conditionally rendered here */}
            
            <div className="mt-6 p-4 bg-muted/30 rounded-md">
              <h4 className="font-medium mb-2">Still need help?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Our support team is available to assist you with any questions or issues you may have.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-background border border-input hover:bg-muted/50 rounded-md px-3 py-1.5 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  Live Chat
                </button>
                <button className="bg-background border border-input hover:bg-muted/50 rounded-md px-3 py-1.5 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Email Support
                </button>
                <button className="bg-background border border-input hover:bg-muted/50 rounded-md px-3 py-1.5 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  Knowledge Base
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
