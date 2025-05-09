import { useState } from 'react';
import { Avatar } from "@/components/ui/avatar";
import CatMascot from "@/components/Landing/CatMascot"
import { ThemeToggle } from '@/components/ThemeToggle';
import AddTransaction from '@/components/Modals/AddTransaction';
import type { UserPublic } from "@/client";
import { Plus, ArrowLeft } from 'lucide-react';
import { useMatchRoute, useNavigate } from '@tanstack/react-router';

const DashboardHeader = ({ currentUser }: { currentUser: UserPublic | null }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  
  // Check if the current route is the Transactions page
  const isDashboardPage = matchRoute({ to: "/dashboard" });
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center gap-3">
        <CatMascot size="sm" />
        <div>
          <h1 className="text-2xl font-bold dark:text-gray-200">Hello, {currentUser?.full_name || "Mila"}!</h1>
          <p className="text-muted-foreground dark:text-gray-200">Welcome back to your financial overview</p>
        </div>
      </div>
      <div className="flex mt-4 md:mt-0 gap-4 items-center">
        <ThemeToggle />
        {!isDashboardPage && (
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2 shadow-md"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        )}
        <AddTransaction isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        <Avatar className="h-10 w-10 border border-border">
          <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-medium">
            {currentUser?.full_name?.charAt(0) || currentUser?.email?.charAt(0)}
          </div>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHeader;