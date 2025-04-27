import React, { useState } from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 
 const monthlyData = [
   { name: 'Jan', expenses: 2400 },
   { name: 'Feb', expenses: 1398 },
   { name: 'Mar', expenses: 9800 },
   { name: 'Apr', expenses: 3908 },
   { name: 'May', expenses: 4800 },
   { name: 'Jun', expenses: 3800 },
   { name: 'Jul', expenses: 4300 },
   { name: 'Aug', expenses: 5300 },
   { name: 'Sep', expenses: 4500 },
   { name: 'Oct', expenses: 3900 },
   { name: 'Nov', expenses: 4100 },
   { name: 'Dec', expenses: 8200 },
 ];
 
 const weeklyData = [
   { name: 'Mon', expenses: 240 },
   { name: 'Tue', expenses: 139 },
   { name: 'Wed', expenses: 980 },
   { name: 'Thu', expenses: 390 },
   { name: 'Fri', expenses: 480 },
   { name: 'Sat', expenses: 380 },
   { name: 'Sun', expenses: 430 },
 ];
 
 const ExpensesChart = () => {
   const [period, setPeriod] = useState('monthly');
   const data = period === 'monthly' ? monthlyData : weeklyData;
 
   return (
     <Card className="col-span-1">
       <CardHeader className="flex flex-row items-center justify-between">
         <CardTitle>Total Expenses</CardTitle>
         <Select value={period} onValueChange={setPeriod}>
           <SelectTrigger className="w-[120px]">
             <SelectValue placeholder="Select period" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="monthly">Monthly</SelectItem>
             <SelectItem value="weekly">Weekly</SelectItem>
           </SelectContent>
         </Select>
       </CardHeader>
       <CardContent>
         <div className="h-[300px]">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data}>
               <XAxis dataKey="name" stroke="#888888" fontSize={12} />
               <YAxis stroke="#888888" fontSize={12} />
               <Tooltip 
                 formatter={(value) => [`$${value}`, 'Expenses']}
                 labelFormatter={(label) => `${label}`}
               />
               <Bar dataKey="expenses" fill="#9b87f5" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
         </div>
       </CardContent>
     </Card>
   );
 };
 
 export default ExpensesChart;