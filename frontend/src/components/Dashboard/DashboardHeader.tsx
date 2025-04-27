import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import CatMascot from "@/components/Landing/CatMascot"
import { ThemeToggle } from '@/components/ThemeToggle';
import type { UserPublic } from "@/client";

const DashboardHeader = ({ currentUser }: { currentUser: UserPublic | null }) => {
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
        <Button className="bg-purple hover:bg-purple-dark">Add Transaction</Button>
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