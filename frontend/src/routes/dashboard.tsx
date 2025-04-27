import React, { useState } from 'react';
import { createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarSeparator, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { BarChart2, FileText, Landmark, CreditCard, PieChart, BarChart, ArrowDownToLine, ArrowUpFromLine, Settings, HelpCircle, Menu } from "lucide-react";
import UserSummary from "@/components/Dashboard/UserSummary";
import ExpensesChart from "@/components/Dashboard/ExpensesChart";
import FinancialGoals from "@/components/Dashboard/FinancialGoals";
import RecentTransactions from "@/components/Dashboard/RecentTransactions";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";

export const Route = createFileRoute("/dashboard")({
    component: Dashboard,
    beforeLoad: async () => {
      // Redirigir a login si el usuario no está autenticado
      if (!isLoggedIn()) {
        throw redirect({
          to: "/login",
        });
      }
    },
  });

function Dashboard () {
    const [activeSection, setActiveSection] = useState("Overview");
    const { user: currentUser } = useAuth();

    return (
        <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background">
            {/* Sidebar */}
            <Sidebar>
            <SidebarHeader className="flex items-center px-4 py-2">
                <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center">
                    <span className="text-white font-bold">{currentUser?.full_name?.charAt(0) || currentUser?.email?.charAt(0)}</span>
                </div>
                <span className="text-lg font-bold dark:text-gray-200">SpendMila</span>
                </div>
                <SidebarTrigger className="ml-auto md:hidden" />
            </SidebarHeader>
            
            <SidebarSeparator />
            
            <SidebarContent>
                <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                        isActive={activeSection === "Overview"}
                        onClick={() => setActiveSection("Overview")}
                        >
                        <BarChart2 className="dark:text-gray-200" size={18} />
                        <span className='dark:text-gray-200'>Overview</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        isActive={activeSection === "Transactions"}
                        onClick={() => setActiveSection("Transactions")}
                        >
                        <FileText className="dark:text-gray-200" size={18} />
                        <span className='dark:text-gray-200'>Transactions</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        isActive={activeSection === "Accounts"}
                        onClick={() => setActiveSection("Accounts")}
                        >
                        <Landmark className="dark:text-gray-200" size={18} />
                        <span className='dark:text-gray-200'>Accounts</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        isActive={activeSection === "Debts"}
                        onClick={() => setActiveSection("Debts")}
                        >
                        <CreditCard className="dark:text-gray-200" size={18} />
                        <span className='dark:text-gray-200'>Debts</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        isActive={activeSection === "Budgets"}
                        onClick={() => setActiveSection("Budgets")}
                        >
                        <PieChart className="dark:text-gray-200" size={18} />
                        <span className='dark:text-gray-200'>Budgets</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        isActive={activeSection === "Goals"}
                        onClick={() => setActiveSection("Goals")}
                        >
                        <BarChart className="dark:text-gray-200" size={18} />
                        <span className='dark:text-gray-200'>Goals</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarSeparator />
                
                <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        isActive={activeSection === "Import"}
                        onClick={() => setActiveSection("Import")}
                        >
                        <ArrowDownToLine className="dark:text-gray-200" size={18} />
                        <span className='dark:text-gray-200'>Import</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        isActive={activeSection === "Export"}
                        onClick={() => setActiveSection("Export")}
                        >
                        <ArrowUpFromLine className="dark:text-gray-200" size={18} />
                        <span className='dark:text-gray-200'>Export</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarSeparator />
                
                <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        isActive={activeSection === "Settings"}
                        onClick={() => setActiveSection("Settings")}
                        >
                        <Settings className="dark:text-gray-200" size={18} />
                        <span className='dark:text-gray-200'>Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        isActive={activeSection === "Help"}
                        onClick={() => setActiveSection("Help")}
                        >
                        <HelpCircle className="dark:text-gray-200" size={18} />
                        <span className='dark:text-gray-200'>Help</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            </Sidebar>
            
            {/* Main Content */}
            <SidebarInset className="p-4 md:p-6 overflow-y-auto">
            <DashboardHeader currentUser={currentUser} />
            
            <div className="grid gap-6">
                {/* User Summary */}
                <UserSummary />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expenses Chart */}
                <ExpensesChart />
                
                {/* Financial Goals */}
                <FinancialGoals />
                </div>
                
                {/* Recent Transactions */}
                <RecentTransactions />
            </div>
            </SidebarInset>
        </div>
        </SidebarProvider>
    );
};

export default Dashboard;