import React from 'react';

interface SettingsSidebarProps {
  onDeleteAccount: () => void;
  onLogout: () => void;
  isDeleteDisabled?: boolean;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  onLogout
}) => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-4 sticky top-6">
      <h3 className="text-lg font-medium mb-4">Settings Menu</h3>
      <ul className="space-y-2">
        <li>
          <button className="w-full text-left px-3 py-2 rounded-md bg-muted/50 font-medium">
            Account
          </button>
        </li>
        <li>
          <button 
            type="button" 
            className="w-full text-left px-3 py-2 rounded-md hover:bg-red-700 bg-red-600 text-white"
            onClick={onLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};
