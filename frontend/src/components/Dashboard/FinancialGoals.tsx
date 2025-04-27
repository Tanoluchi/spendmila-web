import React from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Progress } from "@/components/ui/progress";
 
 const goals = [
   {
     name: "Emergency Fund",
     current: 4500,
     target: 6000,
     getProgress: () => (4500 / 6000) * 100
   },
   {
     name: "Vacation",
     current: 1800,
     target: 3000,
     getProgress: () => (1800 / 3000) * 100
   },
   {
     name: "New Car",
     current: 7500,
     target: 25000,
     getProgress: () => (7500 / 25000) * 100
   },
   {
     name: "Home Down Payment",
     current: 15000,
     target: 60000,
     getProgress: () => (15000 / 60000) * 100
   }
 ];
 
 const FinancialGoals = () => {
   return (
     <Card className="col-span-1">
       <CardHeader>
         <CardTitle>Financial Goals</CardTitle>
       </CardHeader>
       <CardContent className="space-y-6">
         {goals.map((goal) => (
           <div key={goal.name} className="space-y-2">
             <div className="flex items-center justify-between">
               <span className="font-medium text-sm">{goal.name}</span>
               <span className="text-sm text-muted-foreground">
                 ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
               </span>
             </div>
             <Progress value={goal.getProgress()} className="h-2" />
             <p className="text-xs text-muted-foreground text-right">
               {Math.round(goal.getProgress())}% Complete
             </p>
           </div>
         ))}
       </CardContent>
     </Card>
   );
 };
 
 export default FinancialGoals;