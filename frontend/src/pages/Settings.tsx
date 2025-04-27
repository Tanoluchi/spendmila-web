import React from 'react';
import useAuth from '@/hooks/useAuth';

function Settings() {
  const { logout } = useAuth();
  return (
    <div className="grid gap-6 dark:text-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Settings</h2>
        <button className="bg-purple hover:bg-purple-700 text-white px-4 py-2 rounded-md">
          Save Changes
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-card rounded-lg shadow-sm p-4 sticky top-6">
            <h3 className="text-lg font-medium mb-4">Settings Menu</h3>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md bg-muted/50 font-medium">
                  Account
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50">
                  Preferences
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50">
                  Notifications
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50">
                  Security
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50">
                  Integrations
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50">
                  Data Management
                </button>
              </li>
              <li>
                <button 
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50 text-red-600 dark:text-red-400"
                  onClick={() => logout()}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="col-span-2">
          <div className="bg-card rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-4">Account Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  defaultValue="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  defaultValue="john.doe@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  defaultValue="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="currency">
                  Default Currency
                </label>
                <select
                  id="currency"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="dateFormat">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="language">
                  Language
                </label>
                <select
                  id="language"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Profile Picture</h4>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-purple flex items-center justify-center">
                    <span className="text-white text-xl font-bold">JD</span>
                  </div>
                  <div>
                    <button className="bg-background border border-input hover:bg-muted/50 rounded-md px-3 py-1.5 text-sm">
                      Upload New
                    </button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, GIF or PNG. Max size 2MB.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Danger Zone</h4>
                <button className="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-md px-3 py-1.5 text-sm">
                  Delete Account
                </button>
                <p className="text-xs text-muted-foreground mt-1">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
