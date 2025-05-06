
import React, { useState, useMemo } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarSeparator, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { BarChart2, FileText, Landmark, CreditCard, PieChart, BarChart, ArrowDownToLine, ArrowUpFromLine, Settings, HelpCircle, Menu } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { useGoals } from "@/hooks/useGoals";
import { type Goal } from "@/client/services/GoalService";

// Get the proper goal type from the backend field
const getGoalType = (goal: Goal): string => {
  return goal.goal_type || 'other';
};

// Format goal date with fallback
const formatGoalDate = (goal: Goal): string => {
  // Check deadline first (new field), then target_date (legacy field)
  const dateString = goal.deadline || goal.target_date;
  if (!dateString) return 'No deadline set';
  
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return 'Invalid date';
  }
};

const Goals = () => {
  const [activeSection, setActiveSection] = useState("Goals");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  
  // Fetch goals data from API
  const { goals, isLoading, error, calculateGoalProgress } = useGoals();
  
  // Get unique goal types from user's goals for dynamic filtering
  const uniqueGoalTypes = useMemo(() => {
    if (!goals || goals.length === 0) return [];
    
    // Get all unique goal types from user's goals
    const types = [...new Set(goals.map(goal => getGoalType(goal)))];
    return types;
  }, [goals]);
  
  // Filter goals based on active tab
  const filteredGoals = activeTab === "all" 
    ? goals 
    : goals.filter(goal => getGoalType(goal) === activeTab.toLowerCase());

  // Calculate metrics
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalGoals = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  
  // Sort goals by progress percentage (descending)
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    const aProgress = (a.current_amount / a.target_amount) * 100;
    const bProgress = (b.current_amount / b.target_amount) * 100;
    return bProgress - aProgress;
  });
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background dark:text-gray-200">
        {/* Main Content */}
        <SidebarInset className="p-4 md:p-6 overflow-y-auto">
          
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold">Financial Goals</h1>
                <p className="text-muted-foreground">Track progress towards your financial objectives</p>
              </div>
              <Button className="mt-2 md:mt-0 bg-purple hover:bg-purple-dark" onClick={() => navigate({ to: '/goals/new' })}>Create New Goal</Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Progress to Goals</CardTitle>
                  <CardDescription>Total savings accumulated</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <p className="text-2xl font-bold text-blue-600">${totalSaved.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">of ${totalGoals.toLocaleString()} total</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>{Math.round((totalSaved / totalGoals) * 100) || 0}%</span>
                    </div>
                    <Progress value={Math.round((totalSaved / totalGoals) * 100) || 0} />
                  </div>
                </CardFooter>
              </Card>
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Goals</CardTitle>
                  <CardDescription>Goals currently being tracked</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <p className="text-2xl font-bold text-green-600">{goals.length}</p>
                    <p className="text-sm text-muted-foreground">financial goals</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("all")}>View All</Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All Goals</TabsTrigger>
                    {uniqueGoalTypes.map((type) => (
                      <TabsTrigger key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isLoading ? (
                    <div className="text-center py-10">
                      <p className="text-lg text-muted-foreground">Loading goals...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-10">
                      <p className="text-lg text-red-500">Error loading goals. Please try again.</p>
                      <Button onClick={() => window.location.reload()} className="mt-4">Refresh</Button>
                    </div>
                  ) : sortedGoals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold">{goal.name}</h3>
                            {/* Priority tag based on progress */}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              calculateGoalProgress(goal) >= 80
                                ? "bg-green-100 text-green-600" 
                                : calculateGoalProgress(goal) >= 50
                                ? "bg-amber-100 text-amber-600"
                                : "bg-rose-100 text-rose-600"
                            }`}>
                              {calculateGoalProgress(goal) >= 80 ? 'Almost There' : calculateGoalProgress(goal) >= 50 ? 'On Track' : 'In Progress'}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mt-1">{getGoalType(goal)}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              ${goal.current_amount.toLocaleString()} <span className="text-muted-foreground text-sm font-normal">of ${goal.target_amount.toLocaleString()}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">Target date: {formatGoalDate(goal)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{Math.round(calculateGoalProgress(goal))}% Complete</span>
                          <span>${(goal.target_amount - goal.current_amount).toLocaleString()} to go</span>
                        </div>
                        <Progress value={Math.round(calculateGoalProgress(goal))} />
                      </div>
                      
                      <div className="flex justify-between items-start mt-3">
                        {goal.description ? (
                          <div className="text-sm text-muted-foreground flex-1 pr-4">
                            <p className="font-medium">Notes:</p>
                            <p>{goal.description}</p>
                          </div>
                        ) : (
                          <div className="flex-1"></div>
                        )}
                        
                        <div className="flex gap-2 ml-auto">
                          <Button variant="outline" size="sm">Contribute</Button>
                          <Button variant="outline" size="sm" onClick={() => navigate({ to: `/goals/${goal.id}` })}>Edit</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!isLoading && !error && filteredGoals.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-lg text-muted-foreground">No goals found in this category</p>
                    <Button className="mt-4">Add New Goal</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Goals;