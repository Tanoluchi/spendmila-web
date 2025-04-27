import React from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Avatar } from "@/components/ui/avatar";
 import { Button } from "@/components/ui/button";
 
 const transactions = [
   {
     id: 1,
     name: "Grocery Store",
     description: "Weekly groceries",
     amount: -125.60,
     date: "Apr 23, 2025",
     category: "Food"
   },
   {
     id: 2,
     name: "Salary Deposit",
     description: "Monthly salary",
     amount: 3500.00,
     date: "Apr 20, 2025",
     category: "Income"
   },
   {
     id: 3,
     name: "Netflix",
     description: "Subscription",
     amount: -15.99,
     date: "Apr 18, 2025",
     category: "Entertainment"
   },
   {
     id: 4,
     name: "Electric Bill",
     description: "Monthly utility",
     amount: -98.45,
     date: "Apr 15, 2025",
     category: "Utilities"
   },
   {
     id: 5,
     name: "Gas Station",
     description: "Fuel",
     amount: -45.30,
     date: "Apr 13, 2025",
     category: "Transportation"
   }
 ];
 
 const getCategoryInitials = (category: string) => {
   return category.substring(0, 1);
 };
 
 const RecentTransactions = () => {
   return (
     <Card>
       <CardHeader className="flex flex-row items-center justify-between">
         <CardTitle>Recent Transactions</CardTitle>
         <Button variant="outline" size="sm">View All</Button>
       </CardHeader>
       <CardContent>
         <div className="space-y-4">
           {transactions.map((transaction) => (
             <div key={transaction.id} className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <Avatar className={`bg-${transaction.amount > 0 ? 'green' : 'purple'}-100 text-${transaction.amount > 0 ? 'green' : 'purple'}-600`}>
                   <div className="w-full h-full flex items-center justify-center">
                     {getCategoryInitials(transaction.category)}
                   </div>
                 </Avatar>
                 <div>
                   <p className="text-sm font-medium">{transaction.name}</p>
                   <p className="text-xs text-muted-foreground">{transaction.description}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                   {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                 </p>
                 <p className="text-xs text-muted-foreground">{transaction.date}</p>
               </div>
             </div>
           ))}
         </div>
       </CardContent>
     </Card>
   );
 };
 
 export default RecentTransactions;