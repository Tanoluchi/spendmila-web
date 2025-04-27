import React, { useState } from 'react';
import { createFileRoute, redirect, Link, useMatchRoute, Outlet } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarSeparator, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { BarChart2, FileText, Landmark, CreditCard, PieChart, BarChart, ArrowDownToLine, ArrowUpFromLine, Settings, HelpCircle, Menu, Bookmark } from "lucide-react";
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
    const matchRoute = useMatchRoute();

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
                        <Link to="/dashboard">
                            <SidebarMenuButton 
                            isActive={matchRoute({ to: "/dashboard" }) && !matchRoute({ to: "/dashboard/*" })}
                            >
                            <BarChart2 className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Overview</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <Link to="/dashboard/transactions">
                            <SidebarMenuButton
                            isActive={matchRoute({ to: "/dashboard/transactions" })}
                            >
                            <FileText className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Transactions</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <Link to="/dashboard/accounts">
                            <SidebarMenuButton
                            isActive={matchRoute({ to: "/dashboard/accounts" })}
                            >
                            <Landmark className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Accounts</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <Link to="/dashboard/debts">
                            <SidebarMenuButton
                            isActive={matchRoute({ to: "/dashboard/debts" })}
                            >
                            <CreditCard className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Debts</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <Link to="/dashboard/budgets">
                            <SidebarMenuButton
                            isActive={matchRoute({ to: "/dashboard/budgets" })}
                            >
                            <PieChart className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Budgets</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <Link to="/dashboard/goals">
                            <SidebarMenuButton
                            isActive={matchRoute({ to: "/dashboard/goals" })}
                            >
                            <BarChart className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Goals</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <Link to="/dashboard/charts">
                            <SidebarMenuButton
                            isActive={matchRoute({ to: "/dashboard/charts" })}
                            >
                            <PieChart className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Charts</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <Link to="/dashboard/subscriptions">
                            <SidebarMenuButton
                            isActive={matchRoute({ to: "/dashboard/subscriptions" })}
                            >
                            <Bookmark className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Subscriptions</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarSeparator />
                
                <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                    <SidebarMenuItem>
                        <Link to="/dashboard/import">
                            <SidebarMenuButton
                            isActive={matchRoute({ to: "/dashboard/import" })}
                            >
                            <ArrowDownToLine className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Import</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <Link to="/dashboard/export">
                            <SidebarMenuButton
                            isActive={matchRoute({ to: "/dashboard/export" })}
                            >
                            <ArrowUpFromLine className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Export</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarSeparator />
                
                <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                    <SidebarMenuItem>
                        <Link to="/dashboard/settings">
                            <SidebarMenuButton
                            isActive={matchRoute({ to: "/dashboard/settings" })}
                            >
                            <Settings className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Settings</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                        <Link to="/dashboard/help">
                            <SidebarMenuButton
                            isActive={matchRoute({ to: "/dashboard/help" })}
                            >
                            <HelpCircle className="dark:text-gray-200" size={18} />
                            <span className='dark:text-gray-200'>Help</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            </Sidebar>
            
            {/* Main Content */}
            <SidebarInset className="p-4 md:p-6 overflow-y-auto">
            <DashboardHeader currentUser={currentUser || null} />
            
            {/* Render the Outlet which will handle both index and child routes */}
            <Outlet />
            </SidebarInset>
        </div>
        </SidebarProvider>
    );
};

export default Dashboard;