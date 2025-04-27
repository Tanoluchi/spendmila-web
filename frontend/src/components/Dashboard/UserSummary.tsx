import React from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
 
 const UserSummary = () => {
   return (
     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
       <Card>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">
             Cumulative Income
           </CardTitle>
           <ArrowUpFromLine className="h-4 w-4 text-green-500" />
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold text-green-500">$32,459.00</div>
           <p className="text-xs text-muted-foreground">
             +2.1% from last month
           </p>
         </CardContent>
       </Card>
       
       <Card>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">
             Cumulative Expenses
           </CardTitle>
           <ArrowDownToLine className="h-4 w-4 text-red-500" />
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold text-red-500">$24,780.00</div>
           <p className="text-xs text-muted-foreground">
             -1.5% from last month
           </p>
         </CardContent>
       </Card>
     </div>
   );
 };
 
 export default UserSummary;